import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../../hooks/useTheme";
import { useAlert } from "../../../context/AlertContext";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { useRetrieveProspectQuery } from "../../../services/backend/prospectApi";
import {
  useGetUserDocumentsByIdQuery,
  useRequestDocumentMutation,
} from "../../../services/backend/documentsApi";
import { UserDocument } from "../../../types/backend/documents";
import { ActivityIndicator, RefreshControl } from "react-native";

type RouteParams = {
  ClientDocuments: { clientId: string };
};

const ClientDocumentsScreen = () => {
  const { showAlert } = useAlert();
  const theme = useTheme();
  const route = useRoute<RouteProp<RouteParams, "ClientDocuments">>();
  const navigation = useNavigation();
  const clientIdString = route.params?.clientId;
  const clientId = clientIdString ? parseInt(clientIdString) : 0;

  const {
    data: prospect,
    isLoading: loadingProspect,
    refetch: refetchProspect,
  } = useRetrieveProspectQuery(clientId, { skip: !clientId });

  const uuid = prospect?.user?.uuid;

  const {
    data: clientDocuments = [],
    isLoading: loadingDocuments,
    refetch: refetchDocuments,
  } = useGetUserDocumentsByIdQuery(uuid!, { skip: !uuid });

  const [requestDocument, { isLoading: isRequesting }] =
    useRequestDocumentMutation();

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [docType, setDocType] = useState("");
  const [description, setDescription] = useState("");

  const loading = loadingProspect || loadingDocuments;
  const client = prospect?.user;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 12,
    },
    statsRow: {
      flexDirection: "row",
      paddingHorizontal: 20,
      gap: 12,
      marginBottom: 20,
    },
    statBox: {
      flex: 1,
      padding: 12,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 1,
    },
    statValue: {
      fontSize: 18,
      fontWeight: "bold",
    },
    statLabel: {
      fontSize: 10,
      color: theme.colors.textSecondary,
    },
    docCard: {
      marginHorizontal: 20,
      marginBottom: 16,
      padding: 16,
    },
    docHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    docIcon: {
      width: 40,
      height: 40,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    statusBadge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 10,
      fontWeight: "bold",
      textTransform: "capitalize",
    },
    docTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 4,
    },
    docInfo: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    actions: {
      flexDirection: "row",
      gap: 8,
      marginTop: 12,
    },
    requestForm: {
      padding: 20,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderColor: theme.effects.cardBorder,
      marginBottom: 20,
    },
  });

  if (loading && !prospect) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!client) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text style={{ color: theme.colors.text }}>Client not found</Text>
      </View>
    );
  }

  const getStatusColor = (isUploaded: boolean) => {
    return isUploaded ? theme.colors.success : theme.colors.warning;
  };

  const getStatusText = (isUploaded: boolean) => {
    return isUploaded ? "Uploaded" : "Pending";
  };

  const handleRequest = async () => {
    if (!docType.trim()) {
      showAlert("Error", "Please specify a document type");
      return;
    }

    try {
      await requestDocument({
        uuid: uuid!,
        document: {
          document_type: docType,
          description: description,
          // Other required fields for UserDocument if any,
          // but based on API it seems to expect a document object
        } as any,
      }).unwrap();

      showAlert("Success", `Requested ${docType} from ${client.first_name}`);
      setShowRequestForm(false);
      setDocType("");
      setDescription("");
    } catch (error: any) {
      showAlert("Error", error?.data?.message || "Failed to request document");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              refetchProspect();
              refetchDocuments();
            }}
            colors={[theme.colors.primary]}
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Documents</Text>
            <Text style={styles.subtitle}>
              {client.first_name} {client.last_name}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setShowRequestForm(!showRequestForm)}
          >
            <Icon name="add-circle" size={32} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {showRequestForm && (
          <View style={styles.requestForm}>
            <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>
              Request Document
            </Text>
            <Input
              label="Document Type"
              value={docType}
              onChangeText={setDocType}
              placeholder="e.g. ID Proof"
            />
            <Input
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Why is this needed?"
              multiline
            />
            <Button
              title={isRequesting ? "Sending..." : "Send Request"}
              onPress={handleRequest}
              style={{ marginTop: 12 }}
              disabled={isRequesting}
            />
          </View>
        )}

        <View style={styles.statsRow}>
          <View
            style={[
              styles.statBox,
              { borderColor: theme.colors.primary + "40" },
            ]}
          >
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {clientDocuments.length}
            </Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View
            style={[
              styles.statBox,
              { borderColor: theme.colors.success + "40" },
            ]}
          >
            <Text style={[styles.statValue, { color: theme.colors.success }]}>
              {clientDocuments.filter((d) => d.is_uploaded).length}
            </Text>
            <Text style={styles.statLabel}>Uploaded</Text>
          </View>
          <View
            style={[
              styles.statBox,
              { borderColor: theme.colors.warning + "40" },
            ]}
          >
            <Text style={[styles.statValue, { color: theme.colors.warning }]}>
              {clientDocuments.filter((d) => !d.is_uploaded).length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        {clientDocuments.map((doc: UserDocument) => (
          <Card key={doc.id} style={styles.docCard}>
            <View style={styles.docHeader}>
              <View
                style={[
                  styles.docIcon,
                  { backgroundColor: getStatusColor(doc.is_uploaded) + "20" },
                ]}
              >
                <Icon
                  name="document-text"
                  size={24}
                  color={getStatusColor(doc.is_uploaded)}
                />
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(doc.is_uploaded) + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(doc.is_uploaded) },
                  ]}
                >
                  {getStatusText(doc.is_uploaded)}
                </Text>
              </View>
            </View>
            <Text style={styles.docTitle}>
              {doc.file_name || doc.document_type}
            </Text>
            <Text style={styles.docInfo}>Type: {doc.document_type}</Text>
            <Text style={styles.docInfo}>
              Uploaded:{" "}
              {doc.created_at
                ? new Date(doc.created_at).toLocaleDateString()
                : "N/A"}
            </Text>

            <View style={styles.actions}>
              <Button
                title="View"
                variant="outline"
                onPress={() => {}}
                style={{ flex: 1 }}
              />
              <Button
                title="Download"
                variant="outline"
                onPress={() => {}}
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

export default ClientDocumentsScreen;
