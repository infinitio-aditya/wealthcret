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
import {
  useRetrieveProspectQuery,
  useCreateActivityMutation,
} from "../../../services/backend/prospectApi";
import { useGetUserDocumentsByIdQuery } from "../../../services/backend/documentsApi";
import { useRetrieveOrganizationUsersQuery } from "../../../services/backend/authApi";
import { useUpdateInviteMutation } from "../../../services/backend/invitationsApi";
import {
  useGetUserServicesQuery,
  useGetServicesQuery,
  useCreateBulkUserServiceMutation,
} from "../../../services/backend/userServicesApi";
import { useAuth } from "../../../context/AuthContext";
import ThemeDropdown from "../../../components/ui/ThemeDropdown";
import ThemeBottomSheet from "../../../components/ui/ThemeBottomSheet";
import { ORG_TYPE_CL } from "../../../types/backend/constants";
import {
  Prospect,
  Activity,
  ProspectAssociation,
} from "../../../types/backend/prospect";
import { UserDocument } from "../../../types/backend/documents";
import { UserService } from "../../../types/backend/userservices";

import {
  RELATION_MAP,
  RELATION_CHOICES,
  ACTIVITY_CHOICES,
  ACTIVITY_MAP,
  ACTIVITY_PHONE,
  ACTIVITY_EMAIL,
  ACTIVITY_F2F,
} from "./constants";

type RouteParams = {
  clientId: string;
};

const ClientDetailsScreen = () => {
  const { showAlert } = useAlert();
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: RouteParams }, "params">>();
  const { user: currentUser } = useAuth();
  const clientIdString = route.params?.clientId;
  const clientId = clientIdString ? parseInt(clientIdString) : 0;

  const {
    data: prospect,
    isLoading: loadingProspect,
    refetch: refetchProspect,
  } = useRetrieveProspectQuery(clientId, { skip: !clientId });

  const userId = prospect?.user?.id;
  const uuid = prospect?.user?.uuid;

  // Derive organization ID and UUID robustly
  const orgId =
    (typeof prospect?.user?.organization === "object"
      ? prospect.user.organization?.id
      : prospect?.user?.organization) ||
    (typeof prospect?.organization === "object"
      ? prospect.organization?.id
      : prospect?.organization);

  const orgUuid =
    (typeof prospect?.user?.organization === "object"
      ? prospect.user.organization?.uuid
      : null) ||
    (typeof prospect?.organization === "object"
      ? prospect.organization?.uuid
      : null);

  const { data: userServices = [], isLoading: loadingServices } =
    useGetUserServicesQuery(userId!, { skip: !userId });

  const { data: userDocuments = [], isLoading: loadingDocuments } =
    useGetUserDocumentsByIdQuery(uuid!, { skip: !uuid });

  const { data: familyMembers = [], isLoading: loadingFamily } =
    useRetrieveOrganizationUsersQuery(orgUuid!, { skip: !orgUuid });

  const [createActivity] = useCreateActivityMutation();
  const [updateInvite] = useUpdateInviteMutation();
  const [createBulkUserService] = useCreateBulkUserServiceMutation();

  const { data: availableServices = [] } = useGetServicesQuery();

  const [activeTab, setActiveTab] = useState<
    "overview" | "services" | "family" | "activities" | "documents"
  >("overview");

  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

  const [selectedServiceIds, setSelectedServiceIds] = useState<number[]>([]);

  const [newActivity, setNewActivity] = useState({
    name: "",
    details: "",
    activity_type: ACTIVITY_PHONE,
  });

  const [newNominee, setNewNominee] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    relation_to_admin: 1, // Default Spouse
  });

  const loading =
    loadingProspect || loadingServices || loadingDocuments || loadingFamily;

  const handleAddActivity = async () => {
    if (!newActivity.name || !newActivity.details) {
      showAlert("Warning", "Please fill in all required fields");
      return;
    }

    try {
      await createActivity({
        id: clientId,
        activity: {
          ...newActivity,
          user: userId,
        } as any,
      }).unwrap();
      setShowActivityModal(false);
      setNewActivity({ name: "", details: "", activity_type: ACTIVITY_PHONE });
      showAlert("Success", "Activity added successfully");
      refetchProspect();
    } catch (error) {
      showAlert("Error", "Failed to add activity");
    }
  };

  const handleAddFamily = async () => {
    if (!newNominee.first_name || !newNominee.last_name || !newNominee.email) {
      showAlert(
        "Warning",
        "Please fill in all required fields (First Name, Last Name, Email)",
      );
      return;
    }

    try {
      if (!prospect || !orgId) return;
      await updateInvite({
        first_name: newNominee.first_name,
        last_name: newNominee.last_name,
        email: newNominee.email,
        relation_to_admin: newNominee.relation_to_admin,
        organization: orgId.toString(),
        org_type: ORG_TYPE_CL,
        referrar: currentUser?.organization?.id.toString(),
        is_admin: false,
      }).unwrap();

      setShowFamilyModal(false);
      setNewNominee({
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        relation_to_admin: 1,
      });
      showAlert("Success", "Family member invitation sent successfully");
      // Note: retrieveOrganizationUsers will need to be refetched to see the new member once they accept
    } catch (error: any) {
      showAlert("Error", error?.data?.detail || "Failed to add family member");
    }
  };

  const handleAddService = async () => {
    if (selectedServiceIds.length === 0) {
      showAlert("Warning", "Please select at least one service");
      return;
    }

    try {
      const servicesToCreate = selectedServiceIds.map((id) => ({
        service: id,
        user: userId,
        status: 1, // Default pending
      }));

      await createBulkUserService({
        user_id: userId!,
        services: servicesToCreate as any,
      }).unwrap();

      setShowServiceModal(false);
      setSelectedServiceIds([]);
      showAlert("Success", "Services assigned successfully");
    } catch (error) {
      showAlert("Error", "Failed to assign services");
    }
  };

  const toggleServiceSelection = (id: number) => {
    setSelectedServiceIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
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
    switch (status.toString()) {
      case "4":
      case "5":
      case "6":
      case "active":
        return theme.colors.success;
      case "inactive":
        return theme.colors.error;
      case "1":
      case "2":
      case "3":
      case "pending":
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
    return statusMap[status.toString()] || status || "pending";
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
      backgroundColor: theme.colors.surface,
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
                <Text style={styles.infoLabel}>Date of Birth</Text>
                <Text style={styles.infoValue}>
                  {clientUser.dob
                    ? new Date(clientUser.dob).toLocaleDateString()
                    : "Not Provided"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Role</Text>
                <Text style={styles.infoValue}>
                  {clientUser.user_type === 1 ? "Prospect" : "Client"}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Organization</Text>
                <Text style={styles.infoValue}>
                  {clientUser.organization?.name || "N/A"}
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
              <TouchableOpacity onPress={() => setShowServiceModal(true)}>
                <Icon
                  name="add-circle"
                  size={24}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
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
              <Text style={styles.sectionTitle}>Family Members</Text>
              <TouchableOpacity onPress={() => setShowFamilyModal(true)}>
                <Icon
                  name="add-circle"
                  size={24}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
            {familyMembers.length > 0 ? (
              familyMembers.map((member: ProspectAssociation) => (
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
                        name={
                          member.user.gender?.toLowerCase() == "female"
                            ? "woman"
                            : "man"
                        }
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
                        {member.user.first_name} {member.user.last_name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: theme.colors.textSecondary,
                        }}
                      >
                        {RELATION_MAP[member.user.relation_to_admin!] ||
                          "Family Member"}{" "}
                        • {member.user.email}
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
              <TouchableOpacity onPress={() => setShowActivityModal(true)}>
                <Icon
                  name="add-circle"
                  size={24}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
            {prospect.activities && prospect.activities.length > 0 ? (
              prospect.activities.map((activity: Activity, index: number) => (
                <Card key={index} style={styles.activityItem}>
                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: theme.colors.primary + "20",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Icon
                        name={
                          parseInt(activity.activity_type.toString()) ===
                          ACTIVITY_PHONE
                            ? "call"
                            : parseInt(activity.activity_type.toString()) ===
                                ACTIVITY_EMAIL
                              ? "mail"
                              : parseInt(activity.activity_type.toString()) ===
                                  ACTIVITY_F2F
                                ? "calendar"
                                : "document-text"
                        }
                        size={16}
                        color={theme.colors.primary}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.activityHeader}>
                        <Text style={styles.activityTitle}>
                          {activity.name}
                        </Text>
                        <Text style={styles.activityDate}>
                          {activity.created
                            ? new Date(activity.created).toLocaleDateString()
                            : ""}
                        </Text>
                      </View>
                      <Text style={styles.activityDescription}>
                        {activity.details}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: theme.colors.textSecondary,
                          marginTop: 4,
                        }}
                      >
                        {ACTIVITY_MAP[
                          parseInt(activity.activity_type.toString())
                        ] || activity.activity_type}
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

      {/* Activity Modal */}
      <ThemeBottomSheet
        isVisible={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        title="Add Activity"
      >
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Activity Title"
          value={newActivity.name}
          onChangeText={(text) =>
            setNewActivity({ ...newActivity, name: text })
          }
        />
        <ThemeDropdown
          label="Activity Type"
          options={ACTIVITY_CHOICES.map((choice) => ({
            label: choice.label,
            value: choice.value.toString(),
          }))}
          selectedValue={newActivity.activity_type.toString()}
          onValueChange={(value) =>
            setNewActivity({ ...newActivity, activity_type: parseInt(value) })
          }
        />
        <Text style={styles.label}>Details</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: "top" }]}
          placeholder="Details"
          multiline
          value={newActivity.details}
          onChangeText={(text) =>
            setNewActivity({ ...newActivity, details: text })
          }
        />
        <Button
          title="Save Activity"
          onPress={handleAddActivity}
          style={{ marginTop: 16 }}
        />
      </ThemeBottomSheet>

      {/* Family Modal */}
      <ThemeBottomSheet
        isVisible={showFamilyModal}
        onClose={() => setShowFamilyModal(false)}
        title="Add Family Member"
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={newNominee.first_name}
            onChangeText={(text) =>
              setNewNominee({ ...newNominee, first_name: text })
            }
          />
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={newNominee.last_name}
            onChangeText={(text) =>
              setNewNominee({ ...newNominee, last_name: text })
            }
          />
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={newNominee.email}
            onChangeText={(text) =>
              setNewNominee({ ...newNominee, email: text })
            }
          />
          <ThemeDropdown
            label="Relationship"
            options={RELATION_CHOICES.map((option) => ({
              label: option.label,
              value: option.value.toString(),
            }))}
            selectedValue={newNominee.relation_to_admin.toString()}
            onValueChange={(value) =>
              setNewNominee({
                ...newNominee,
                relation_to_admin: parseInt(value),
              })
            }
          />
          {/* <Text style={styles.label}>Mobile (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            keyboardType="phone-pad"
            value={newNominee.mobile}
            onChangeText={(text) =>
              setNewNominee({ ...newNominee, mobile: text })
            }
          /> */}
          <Button
            title="Send Invitation"
            onPress={handleAddFamily}
            style={{ marginTop: 16, marginBottom: 24 }}
          />
        </ScrollView>
      </ThemeBottomSheet>

      {/* Service Modal */}
      <ThemeBottomSheet
        isVisible={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        title="Assign Services"
      >
        <ScrollView
          style={{ maxHeight: 400 }}
          showsVerticalScrollIndicator={false}
        >
          {availableServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceOption,
                {
                  borderColor: selectedServiceIds.includes(service.id)
                    ? theme.colors.primary
                    : theme.effects.cardBorder,
                  backgroundColor: selectedServiceIds.includes(service.id)
                    ? theme.colors.primary + "10"
                    : "transparent",
                },
              ]}
              onPress={() => toggleServiceSelection(service.id)}
            >
              <View
                style={[
                  styles.checkbox,
                  {
                    borderColor: selectedServiceIds.includes(service.id)
                      ? theme.colors.primary
                      : theme.colors.textSecondary,
                    backgroundColor: selectedServiceIds.includes(service.id)
                      ? theme.colors.primary
                      : "transparent",
                  },
                ]}
              >
                {selectedServiceIds.includes(service.id) && (
                  <Icon name="checkmark" size={16} color="#FFF" />
                )}
              </View>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "600",
                    color: theme.colors.text,
                  }}
                >
                  {service.name}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: theme.colors.textSecondary,
                  }}
                >
                  {service.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Button
          title={`Assign ${selectedServiceIds.length} Services`}
          onPress={handleAddService}
          style={{ marginTop: 20, marginBottom: 24 }}
        />
      </ThemeBottomSheet>
    </View>
  );
};

export default ClientDetailsScreen;
