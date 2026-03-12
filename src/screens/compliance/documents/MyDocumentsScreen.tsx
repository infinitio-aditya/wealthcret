import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Modal,
  TextInput,
  Dimensions,
  Linking,
  Platform,
} from "react-native";
import DocumentPicker, {
  DocumentPickerResponse,
} from "react-native-document-picker";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../hooks/useTheme";
import { useAlert } from "../../../context/AlertContext";
import Card from "../../../components/ui/Card";
import Icon from "react-native-vector-icons/Feather";
import IoIcon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import ThemeDropdown from "../../../components/ui/ThemeDropdown";
import ThemeBottomSheet from "../../../components/ui/ThemeBottomSheet";
import Button from "../../../components/ui/Button";
import Icon1 from "react-native-vector-icons/Ionicons";
import {
  useGetUserDocumentsQuery,
  useUploadUserDocumentMutation,
  useLazyGetPresignedUrlQuery,
} from "../../../services/backend/documentsApi";
import { UserDocument } from "../../../types/backend/documents";
import { DOCUMENT_TYPE_LABEL_MAP } from "../../../types/backend/constants";

import { useSelector } from "react-redux";
import { RootState } from "../../../store";
const { width } = Dimensions.get("window");

const MyDocumentsScreen = () => {
  const navigation = useNavigation<any>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { showAlert } = useAlert();
  const theme = useTheme();
  const {
    data: docsData,
    isFetching: loadingDocs,
    refetch,
  } = useGetUserDocumentsQuery();
  const [uploadDocument] = useUploadUserDocumentMutation();
  const [getPresignedUrl] = useLazyGetPresignedUrlQuery();
  const [documents, setDocuments] = useState<any[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Upload State
  const [documentType, setDocumentType] = useState<string>("");
  const [documentNumber, setDocumentNumber] = useState<string>("");
  const [documentNumberError, setDocumentNumberError] = useState<string>("");
  const [file, setFile] = useState<DocumentPickerResponse | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (docsData) {
      const mapped = docsData.map((d: UserDocument) => {
        const typeNum = parseInt(d.document_type as string);
        const label = DOCUMENT_TYPE_LABEL_MAP[typeNum] || d.document_type;
        return {
          id: d.id.toString(),
          name: d.file_name || label || "Document",
          type: d.file_name?.split(".").pop()?.toUpperCase() || "FILE",
          size: "N/A", // API doesn't provide size for user documents directly
          uploadDate: d.created_at?.split("T")[0] || "N/A",
          category: label || "General",
          rawDocType: d.document_type,
          isUploaded: d.is_uploaded,
        };
      });
      setDocuments(mapped);
    }
  }, [docsData]);

  const categories = [
    "all",
    ...Array.from(new Set(documents.map((d) => d.category))),
  ];

  const filteredDocs =
    selectedCategory === "all"
      ? documents
      : documents.filter((d) => d.category === selectedCategory);

  const handleSelectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      if (res && res.length > 0) {
        setFile(res[0]);
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        showAlert("Error", "Failed to select file");
      }
    }
  };

  const handleUpload = async () => {
    setDocumentNumberError("");

    if (!file || !documentType) {
      showAlert(
        "Error",
        "Please select a file and document type before uploading.",
      );
      return;
    }

    if (documentType === "1") {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(documentNumber.toUpperCase())) {
        setDocumentNumberError("Invalid PAN number. Format: ABCDE1234F");
        return;
      }
    }

    if (documentType === "2") {
      const aadhaarRegex = /^\d{12}$/;
      if (!aadhaarRegex.test(documentNumber)) {
        setDocumentNumberError(
          "Invalid Aadhaar number. It should be 12 digits.",
        );
        return;
      }
    }

    try {
      setIsUploading(true);
      const formData = new FormData();

      let fileUri = file.uri;
      if (Platform.OS === "ios" && !fileUri.startsWith("file://")) {
        fileUri = `file://${fileUri}`;
      }

      formData.append("file", {
        uri: fileUri,
        type: file.type || "application/octet-stream",
        name: file.name || `upload_${Date.now()}.jpg`,
      } as any);

      formData.append("document_type", documentType);

      if (documentType !== "3") {
        formData.append("document_number", documentNumber);
      } else {
        formData.append("document_number", "");
      }

      formData.append("file_name", file.name || `upload_${Date.now()}`);

      await uploadDocument(formData).unwrap();

      showAlert("Success", "File uploaded successfully!");
      setShowUpload(false);

      // Reset upload state
      setFile(null);
      setDocumentType("");
      setDocumentNumber("");

      refetch();
    } catch (error) {
      console.error("Upload failed", error);
      showAlert("Error", "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const disableUploadButton =
    isUploading ||
    !file ||
    !documentType ||
    (documentType !== "3" && !documentNumber);

  const handleUploadPress = (item: any) => {
    setDocumentType(item.rawDocType);
    setDocumentNumber("");
    setShowUpload(true);
  };

  const handleViewDocument = (item: any) => {
    navigation.navigate("ViewDocument", {
      uuid: (user as any)?.uuid || (user as any)?.id || "",
      documentType: item.rawDocType,
      fileName: item.name,
    });
  };

  const stats = [
    {
      label: "Total Documents",
      count: documents.length,
      icon: "file-text",
      gradient: ["#6366f1", "#a855f7"],
      color: "#6366f1",
    },
    {
      label: "Categories",
      count: categories.length - 1,
      icon: "folder",
      gradient: ["#3b82f6", "#2dd4bf"],
      color: "#3b82f6",
    },
    // {
    //     label: 'Total Size',
    //     count: '12.9 MB',
    //     icon: 'hard-drive',
    //     gradient: ['#10b981', '#34d399'],
    //     color: '#10b981',
    // },
    // {
    //     label: 'This Month',
    //     count: documents.filter(d => new Date(d.uploadDate).getMonth() === new Date().getMonth()).length,
    //     icon: 'upload-cloud',
    //     gradient: ['#f59e0b', '#fbbf24'],
    //     color: '#f59e0b',
    // },
  ];

  const renderDocumentItem = ({
    item,
    index,
  }: {
    item: any;
    index: number;
  }) => (
    <Card style={styles.docCard}>
      <View style={styles.docHeader}>
        <View
          style={[
            styles.docIcon,
            { backgroundColor: theme.colors.primary + "15" },
          ]}
        >
          <Icon
            name={item.type === "PDF" ? "file-text" : "image"}
            size={20}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.docInfo}>
          <Text style={styles.docName} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.docCategoryBadge,
                { backgroundColor: theme.colors.secondary + "15" },
              ]}
            >
              <Text
                style={[
                  styles.docCategoryText,
                  { color: theme.colors.secondary },
                ]}
              >
                {item.category}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.docMetaRow}>
        <View style={styles.metaItem}>
          <Icon
            name="file-text"
            size={12}
            color={theme.colors.textSecondary}
            style={{ marginRight: 4 }}
          />
          <Text style={styles.docMetaText}>{item.category}</Text>
        </View>
        <View style={styles.metaItem}>
          <Icon
            name="calendar"
            size={12}
            color={theme.colors.textSecondary}
            style={{ marginRight: 4 }}
          />
          <Text style={styles.docMetaText}>{item.uploadDate}</Text>
        </View>
      </View>

      <View style={styles.docActions}>
        {item.isUploaded ? (
          <TouchableOpacity
            style={[
              styles.actionBtn,
              { backgroundColor: theme.colors.primary + "10" },
            ]}
            onPress={() => handleViewDocument(item)}
          >
            <Icon name="eye" size={16} color={theme.colors.primary} />
            <Text
              style={[
                styles.actionBtnText,
                { color: theme.colors.primary },
              ]}
            >
              View
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.actionBtn,
              { backgroundColor: theme.colors.success + "10" },
            ]}
            onPress={() => handleUploadPress(item)}
          >
            <Icon name="upload" size={16} color={theme.colors.success} />
            <Text
              style={[
                styles.actionBtnText,
                { color: theme.colors.success },
              ]}
            >
              Upload
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </Card>
  );

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollContent: { paddingBottom: 20 },
    header: { padding: 20, paddingTop: 10 },
    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    title: { fontSize: 24, fontWeight: "bold", color: theme.colors.text },
    subtitle: { fontSize: 14, color: theme.colors.textSecondary, marginTop: 4 },
    headerBtn: { borderRadius: 12, overflow: "hidden" },
    gradientBtn: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 10,
      gap: 8,
    },
    btnText: { color: "#fff", fontWeight: "bold" },

    statsRow: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 15 },
    statItem: { width: "50%", padding: 5 },
    statCard: {
      borderRadius: 20,
      padding: 16,
      height: 110,
      justifyContent: "space-between",
    },
    statIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    statValue: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
      marginTop: 10,
    },
    statLabel: { fontSize: 11, color: theme.colors.textSecondary },

    filterSection: { marginTop: 10, marginBottom: 15 },
    filterLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginLeft: 20,
      marginBottom: 10,
      fontWeight: "600",
    },
    filterScroll: { paddingLeft: 20, paddingRight: 10 },
    chip: {
      paddingHorizontal: 18,
      paddingVertical: 10,
      borderRadius: 25,
      marginRight: 10,
      borderWidth: 1,
      backgroundColor: theme.colors.surface,
    },
    chipActive: { borderWidth: 0 },
    chipText: { fontSize: 13, fontWeight: "600", color: theme.colors.text },
    chipTextActive: { color: "#fff" },

    listContainer: { paddingHorizontal: 20 },
    docCard: { marginBottom: 15, padding: 16, borderRadius: 20 },
    docHeader: { flexDirection: "row", alignItems: "center" },
    docIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
    },
    docInfo: { flex: 1, marginLeft: 12 },
    docName: { fontSize: 16, fontWeight: "700", color: theme.colors.text },
    badgeRow: { flexDirection: "row", marginTop: 4 },
    docCategoryBadge: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 6,
    },
    docCategoryText: { fontSize: 10, fontWeight: "bold" },
    moreBtn: { padding: 4 },

    docMetaRow: {
      flexDirection: "row",
      marginTop: 15,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.effects.cardBorder,
    },
    metaItem: { flexDirection: "row", alignItems: "center", marginRight: 15 },
    docMetaText: { fontSize: 12, color: theme.colors.textSecondary },

    docActions: { flexDirection: "row", marginTop: 15, gap: 10 },
    actionBtn: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      gap: 6,
    },
    actionBtnText: { fontSize: 12, fontWeight: "bold" },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      padding: 24,
      paddingBottom: 40,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 25,
    },
    modalTitle: { fontSize: 22, fontWeight: "bold", color: theme.colors.text },
    modalClose: { padding: 4 },

    inputGroup: { marginBottom: 20 },
    inputLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
      fontWeight: "600",
    },
    pickerBox: {
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      borderRadius: 16,
      overflow: "hidden",
      backgroundColor: theme.colors.background,
    },

    dropZone: {
      height: 160,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      borderStyle: "dashed",
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary + "05",
      marginBottom: 25,
    },
    dropZoneTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: theme.colors.text,
      marginTop: 12,
    },
    dropZoneSub: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },

    modalFooter: { flexDirection: "row", gap: 12 },
    cancelBtn: {
      flex: 1,
      padding: 15,
      borderRadius: 16,
      alignItems: "center",
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
    },
    cancelBtnText: { color: theme.colors.text, fontWeight: "700" },
    submitBtn: { flex: 2, borderRadius: 16, overflow: "hidden" },
    headerButtons: { flexDirection: "row", gap: 12 },
  });

  if (loadingDocs) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.title}>My Vault</Text>
              <Text style={styles.subtitle}>Secure document storage</Text>
            </View>
            {/* <TouchableOpacity
                            onPress={() => setShowUpload(true)}
                            style={styles.headerBtn}
                        >
                            <LinearGradient
                                colors={theme.effects.buttonGradient as any}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                style={styles.gradientBtn}
                            >
                                <Icon name="plus" size={20} color="#fff" />
                                <Text style={styles.btnText}>Add</Text>
                            </LinearGradient>
                        </TouchableOpacity> */}
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={() => setShowUpload(true)}>
                <Icon1
                  name="add-circle"
                  size={32}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {stats.map((stat, i) => (
            <View key={i} style={styles.statItem}>
              <Card style={styles.statCard}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={[
                      styles.statIconContainer,
                      { backgroundColor: stat.color + "15" },
                    ]}
                  >
                    <Icon name={stat.icon} size={20} color={stat.color} />
                  </View>
                  <IoIcon
                    name="chevron-forward"
                    size={16}
                    color={theme.colors.textSecondary}
                  />
                </View>
                <View>
                  <Text style={styles.statValue}>{stat.count}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              </Card>
            </View>
          ))}
        </View>

        {/* Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.chip,
                    isActive && [
                      styles.chipActive,
                      { borderColor: "transparent" },
                    ],
                    !isActive && { borderColor: theme.effects.cardBorder },
                  ]}
                >
                  {isActive ? (
                    <LinearGradient
                      colors={
                        [
                          theme.colors.primary,
                          theme.colors.primary + "80",
                        ] as any
                      }
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[StyleSheet.absoluteFill, { borderRadius: 25 }]}
                    />
                  ) : null}
                  <Text
                    style={[styles.chipText, isActive && styles.chipTextActive]}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.listContainer}>
          {filteredDocs.map((item, index) =>
            renderDocumentItem({ item, index }),
          )}
        </View>
      </ScrollView>

      <ThemeBottomSheet
        isVisible={showUpload}
        onClose={() => {
          setShowUpload(false);
          setFile(null);
          setDocumentType("");
          setDocumentNumber("");
          setDocumentNumberError("");
        }}
        title="Upload Document"
      >
        <ThemeDropdown
          label="Document Type"
          options={[
            { label: "Select Document Type", value: "" },
            { label: "PAN Card", value: "1" },
            { label: "Aadhaar Card", value: "2" },
            { label: "Cancelled Cheque/Bank Statement/Passbook", value: "3" },
          ]}
          selectedValue={documentType}
          onValueChange={(value) => setDocumentType(value)}
        />

        {documentType !== "3" && documentType !== "" && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Document Number</Text>
            <View style={[styles.pickerBox, { padding: 4 }]}>
              <TextInput
                style={{
                  color: theme.colors.text,
                  paddingHorizontal: 16,
                  height: 48,
                }}
                placeholderTextColor={theme.colors.textSecondary}
                placeholder="Enter document number"
                value={documentNumber}
                onChangeText={(text) => {
                  if (documentType === "1") {
                    setDocumentNumber(text.toUpperCase());
                  } else {
                    setDocumentNumber(text);
                  }
                  setDocumentNumberError("");
                }}
              />
            </View>
            {!!documentNumberError && (
              <Text
                style={{
                  color: theme.colors.error,
                  fontSize: 12,
                  marginTop: 4,
                  marginLeft: 8,
                }}
              >
                {documentNumberError}
              </Text>
            )}
          </View>
        )}

        <TouchableOpacity
          style={styles.dropZone}
          activeOpacity={0.7}
          onPress={handleSelectFile}
        >
          <IoIcon name="cloud-upload" size={44} color={theme.colors.primary} />
          {file ? (
            <View style={{ alignItems: "center" }}>
              <Text style={styles.dropZoneTitle} numberOfLines={1}>
                {file.name}
              </Text>
              <Text style={styles.dropZoneSub}>
                {(file.size ? file.size / 1024 : 0).toFixed(2)} KB
              </Text>
            </View>
          ) : (
            <>
              <Text style={styles.dropZoneTitle}>Select Document</Text>
              <Text style={styles.dropZoneSub}>
                Tap to selectively pick an image
              </Text>
            </>
          )}
        </TouchableOpacity>

        {isUploading && (
          <ActivityIndicator
            size="small"
            color={theme.colors.primary}
            style={{ marginBottom: 15 }}
          />
        )}

        <View style={[styles.modalFooter, { marginBottom: 20 }]}>
          <Button
            title="Cancel"
            onPress={() => {
              setShowUpload(false);
              setFile(null);
              setDocumentType("");
              setDocumentNumber("");
              setDocumentNumberError("");
            }}
            variant="secondary"
            style={{ flex: 1 }}
            disabled={isUploading}
          />
          <Button
            title={isUploading ? "Uploading..." : "Upload Now"}
            onPress={handleUpload}
            variant="primary"
            style={{ flex: 2 }}
            disabled={disableUploadButton}
          />
        </View>
      </ThemeBottomSheet>
    </View>
  );
};

export default MyDocumentsScreen;
