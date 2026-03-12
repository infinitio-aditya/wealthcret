import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import Pdf from "react-native-pdf";
import ReactNativeBlobUtil from "react-native-blob-util";
import { useTheme } from "../../../hooks/useTheme";
import { DocumentStackParamList } from "../../../navigation/NavigationParams";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { BACKEND_BASE_URL } from "../../../environments/env";
import Header from "@components/Header";

type ViewDocumentRouteProp = RouteProp<DocumentStackParamList, "ViewDocument">;

const ViewDocumentScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<ViewDocumentRouteProp>();
  const { uuid, documentType, fileName } = route.params;
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  const [loading, setLoading] = useState(true);
  const [localPath, setLocalPath] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isPDF = fileName.toLowerCase().endsWith(".pdf");

  // Determine the effective UUID/ID for the URL
  // If uuid from params is empty, fallback to current user's uuid or id
  const effectiveUuid = uuid || user?.uuid || user?.id;
  const remoteUrl = `${BACKEND_BASE_URL}/api/documents/user/${effectiveUuid}/${documentType}/view/`;

  useEffect(() => {
    console.log("ViewDocument Params:", { uuid, documentType, fileName });
    console.log("Effective UUID:", effectiveUuid);
    console.log("Constructed URL:", remoteUrl);

    if (token && effectiveUuid) {
      fetchDocument();
    } else if (!effectiveUuid) {
      setError("User identifier not found");
      setLoading(false);
    }
  }, [effectiveUuid, documentType, token]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      setError(null);
      setLocalPath(null);

      console.log("Starting fetchDocument for:", remoteUrl);

      const dirs = ReactNativeBlobUtil.fs.dirs;
      const originalExtension =
        fileName.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${dirs.DocumentDir}/doc_${Date.now()}.${originalExtension}`;

      console.log("Fetching to path:", path);

      const fetchPromise = ReactNativeBlobUtil.config({
        fileCache: true,
        path: path,
      }).fetch("GET", remoteUrl, {
        Authorization: `Bearer ${token}`,
      });

      // Add a 30s timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Request timed out after 30 seconds")), 30000)
      );

      const res = await Promise.race([fetchPromise, timeoutPromise]) as any;

      const status = res.info().status;
      console.log("Fetch Status:", status);
      console.log("Response Type:", res.info().headers['content-type'] || 'unknown');

      if (status === 200) {
        const filePath =
          Platform.OS === "ios" ? res.path() : `file://${res.path()}`;
        console.log("Setting localPath to:", filePath);
        setLocalPath(filePath);
      } else {
        const errorMsg = `Failed to fetch document (Status: ${status})`;
        console.warn(errorMsg);
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error("Fetch document error:", err);
      setError(err?.message || "Failed to fetch document");
    } finally {
      console.log("Fetch cycle completed, loading set to false");
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    pdf: {
      flex: 1,
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height,
      backgroundColor: theme.colors.background,
    },
    imageContainer: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: Dimensions.get("window").width,
      height: Dimensions.get("window").height - 100,
      resizeMode: "contain",
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 16,
      textAlign: "center",
      padding: 20,
    },
    retryButton: {
      marginTop: 10,
      padding: 10,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
    },
    retryText: {
      color: "#fff",
      fontWeight: "bold",
    },
  });

  return (
    <View style={styles.container}>
      <Header title={fileName} showBack={true} />

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        ) : error ? (
          <View style={{ alignItems: "center" }}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchDocument}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : localPath ? (
          isPDF ? (
            <Pdf
              source={{ uri: localPath }}
              trustAllCerts={false}
              style={styles.pdf}
              onError={(error) => {
                console.error("PDF render error:", error);
                setError("Failed to render PDF");
              }}
            />
          ) : (
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              maximumZoomScale={3}
              minimumZoomScale={1}
            >
              <Image source={{ uri: localPath }} style={styles.image} />
            </ScrollView>
          )
        ) : (
          <Text style={{ color: theme.colors.text }}>
            Document not available
          </Text>
        )}
      </View>
    </View>
  );
};

export default ViewDocumentScreen;
