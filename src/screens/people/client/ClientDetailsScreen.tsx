import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Platform,
  RefreshControl,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../hooks/useTheme";
import { useAlert } from "../../../context/AlertContext";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Icon from "react-native-vector-icons/Ionicons";
import { useRetrieveProspectQuery } from "../../../services/backend/prospectApi";
import { useGetUserServicesQuery } from "../../../services/backend/userServicesApi";
import { useGetUserDocumentsByIdQuery } from "../../../services/backend/documentsApi";
import { useGetNomineesQuery } from "../../../services/backend/nomineeApi";
import { Prospect, Activity } from "../../../types/backend/prospect";
import { Nominee } from "../../../types/backend/nominee";
import { UserDocument } from "../../../types/backend/documents";
import { UserService } from "../../../types/backend/userservices";

type RouteParams = {
  clientId: string;
};

const ClientDetailsScreen = () => {
  const { showAlert } = useAlert();
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const clientIdString = route.params?.clientId;
  const clientId = clientIdString ? parseInt(clientIdString) : 0;

  const {
    data: prospect,
    isLoading: loadingProspect,
    refetch: refetchProspect,
  } = useRetrieveProspectQuery(clientId, { skip: !clientId });

  const userId = prospect?.user?.id;
  const uuid = prospect?.user?.uuid;

  const { data: userServices = [], isLoading: loadingServices } =
    useGetUserServicesQuery(userId!, { skip: !userId });

  const { data: userDocuments = [], isLoading: loadingDocuments } =
    useGetUserDocumentsByIdQuery(uuid!, { skip: !uuid });

  const { data: allNominees = [], isLoading: loadingNominees } =
    useGetNomineesQuery(undefined);

  const [activeTab, setActiveTab] = useState<
    "overview" | "services" | "family" | "activities" | "documents"
  >("overview");

  // Placeholder for nominees filtering - since Nominee type in the file doesn't seem to have a user field,
  // we might need to check if there's a different nominee type or rely on a different query.
  // For now, let's assume allNominees returned are for the context if any.
  const clientNominees = allNominees;

  const loading =
    loadingProspect || loadingServices || loadingDocuments || loadingNominees;

  const handleAddActivity = () => {
    showAlert(
      "Info",
      "Add Activity functionality not yet implemented with API",
    );
  };

  const handleAddFamily = () => {
    showAlert(
      "Info",
      "Add Family Member functionality not yet implemented with API",
    );
  };

  const toggleServiceSelection = (id: string) => {
    // Logic for toggling
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    if (!status) return theme.colors.textSecondary;
    switch (status.toLowerCase()) {
      case "active":
      case "4":
      case "5":
      case "6":
        return theme.colors.success;
      case "inactive":
        return theme.colors.error;
      case "pending":
      case "1":
      case "2":
      case "3":
        return theme.colors.warning;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getDisplayStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      "1": "pending",
      "2": "pending",
      "3": "pending",
      "4": "active",
      "5": "active",
      "6": "active",
    };
    return statusMap[status] || status || "pending";
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    scrollView: { flex: 1 },
    content: { padding: 16 },
    header: { marginBottom: 24 },
    clientName: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 8,
    },
    clientInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
      textTransform: "capitalize",
    },
    clientRole: { fontSize: 14, color: theme.colors.textSecondary },
    tabContainer: {
      flexDirection: "row",
      marginBottom: 24,
      paddingRight: 16,
      gap: 8,
    },
    tab: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      marginRight: 8,
      alignItems: "center",
      minWidth: 90,
    },
    tabText: { fontSize: 14, fontWeight: "600" },
    section: { marginBottom: 24 },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 12,
    },
    sectionHeaderBtn: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.effects.cardBorder,
    },
    infoLabel: { fontSize: 14, color: theme.colors.textSecondary },
    infoValue: { fontSize: 14, fontWeight: "600", color: theme.colors.text },
    activityItem: { marginBottom: 12 },
    activityHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    activityTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },
    activityDate: { fontSize: 12, color: theme.colors.textSecondary },
    activityDescription: { fontSize: 14, color: theme.colors.textSecondary },
    documentItem: { marginBottom: 12 },
    documentName: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 4,
    },
    documentType: { fontSize: 14, color: theme.colors.textSecondary },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    actionButtons: { flexDirection: "row", gap: 12, marginTop: 16 },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "flex-end",
    },
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      padding: 24,
      minHeight: 400,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    modalTitle: { fontSize: 20, fontWeight: "bold", color: theme.colors.text },
    input: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
      color: theme.colors.text,
    },
    label: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
      fontWeight: "600",
    },
    typeSelector: { flexDirection: "row", gap: 8, marginBottom: 16 },
    typeButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      alignItems: "center",
    },
    serviceOption: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 1,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      marginRight: 12,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  if (loading || !prospect) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const clientUser = prospect.user;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refetchProspect}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.clientName}>
            {clientUser.first_name} {clientUser.last_name}
          </Text>
          <View style={styles.clientInfo}>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    getStatusColor(clientUser.application_status) + "20",
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(clientUser.application_status) },
                ]}
              >
                {getDisplayStatus(clientUser.application_status)}
              </Text>
            </View>
            <Text style={styles.clientRole}>
              {clientUser.user_type_display || "Client"}
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
        >
          {["overview", "services", "family", "activities", "documents"].map(
            (tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab as any)}
                style={[
                  styles.tab,
                  {
                    borderColor:
                      activeTab === tab
                        ? theme.colors.primary
                        : theme.effects.cardBorder,
                    backgroundColor:
                      activeTab === tab
                        ? theme.colors.primary + "20"
                        : "transparent",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        activeTab === tab
                          ? theme.colors.primary
                          : theme.colors.text,
                    },
                  ]}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ),
          )}
        </ScrollView>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Client Information</Text>
            <Card>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{clientUser.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{clientUser.mobile_number}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Organization</Text>
                <Text style={styles.infoValue}>
                  {clientUser.organization?.name}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Owner</Text>
                <Text style={styles.infoValue}>{prospect.owner || "None"}</Text>
              </View>
            </Card>
          </View>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderBtn}>
              <Text style={styles.sectionTitle}>Assigned Services</Text>
            </View>
            {userServices.length > 0 ? (
              userServices.map((us: UserService) => (
                <Card key={us.id} style={{ marginBottom: 12 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: theme.colors.secondary + "20",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Icon
                        name="briefcase"
                        size={20}
                        color={theme.colors.secondary}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: theme.colors.text,
                        }}
                      >
                        {us.service.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: theme.colors.textSecondary,
                        }}
                      >
                        {us.pipeline_status} • {formatCurrency(us.amount)}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))
            ) : (
              <Text
                style={{
                  textAlign: "center",
                  color: theme.colors.textSecondary,
                }}
              >
                No services assigned
              </Text>
            )}
          </View>
        )}

        {/* Family Tab */}
        {activeTab === "family" && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderBtn}>
              <Text style={styles.sectionTitle}>Family Members (Nominees)</Text>
            </View>
            {clientNominees.length > 0 ? (
              clientNominees.map((member: Nominee) => (
                <Card key={member.id} style={{ marginBottom: 12 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: theme.colors.success + "20",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Icon
                        name="person"
                        size={20}
                        color={theme.colors.success}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: theme.colors.text,
                        }}
                      >
                        {member.first_name} {member.last_name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: theme.colors.textSecondary,
                        }}
                      >
                        {member.relationship} • {member.mobile}
                      </Text>
                    </View>
                  </View>
                </Card>
              ))
            ) : (
              <Text
                style={{
                  textAlign: "center",
                  color: theme.colors.textSecondary,
                }}
              >
                No family members found
              </Text>
            )}
          </View>
        )}

        {/* Activities Tab */}
        {activeTab === "activities" && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderBtn}>
              <Text style={styles.sectionTitle}>Recent Activities</Text>
            </View>
            {prospect.activities && prospect.activities.length > 0 ? (
              prospect.activities.map((activity: Activity, index: number) => (
                <Card key={index} style={styles.activityItem}>
                  <View style={styles.activityHeader}>
                    <Text style={styles.activityTitle}>{activity.name}</Text>
                    <Text style={styles.activityDate}>
                      {activity.created
                        ? new Date(activity.created).toLocaleDateString()
                        : ""}
                    </Text>
                  </View>
                  <Text style={styles.activityDescription}>
                    {activity.details}
                  </Text>
                  <View style={{ marginTop: 8 }}>
                    <Text
                      style={{
                        fontSize: 10,
                        color: theme.colors.primary,
                        textTransform: "uppercase",
                      }}
                    >
                      {activity.activity_type}
                    </Text>
                  </View>
                </Card>
              ))
            ) : (
              <Text
                style={{
                  textAlign: "center",
                  color: theme.colors.textSecondary,
                }}
              >
                No activities found
              </Text>
            )}
          </View>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Documents</Text>
            {userDocuments.length > 0 ? (
              userDocuments.map((doc: UserDocument) => (
                <Card key={doc.id} style={styles.documentItem}>
                  <Text style={styles.documentName}>{doc.file_name}</Text>
                  <Text style={styles.documentType}>{doc.document_type}</Text>
                </Card>
              ))
            ) : (
              <Text
                style={{
                  textAlign: "center",
                  color: theme.colors.textSecondary,
                  marginBottom: 12,
                }}
              >
                No documents found
              </Text>
            )}
            <Button
              title="View All Documents"
              onPress={() =>
                navigation.navigate("ClientDocuments", {
                  clientId: clientIdString,
                })
              }
              variant="secondary"
              style={{ marginTop: 12 }}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ClientDetailsScreen;
