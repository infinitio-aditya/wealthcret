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
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../hooks/useTheme";
import { useAlert } from "../../../context/AlertContext";
import {
  mockClients,
  mockActivities,
  mockDocuments,
} from "../../../utils/mockData";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Icon from "react-native-vector-icons/Ionicons";
import { Client, Activity, Document, FamilyMember } from "../../../types";

type RouteParams = {
  ClientDetails: {
    clientId: string;
  };
};

const ClientDetailsScreen = () => {
  const { showAlert } = useAlert();
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<RouteParams, "ClientDetails">>();
  const [client, setClient] = useState<Client | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "services" | "family" | "activities" | "documents"
  >("overview");

  // Modal States
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showAddFamily, setShowAddFamily] = useState(false);
  const [showAddServices, setShowAddServices] = useState(false);

  // Form States
  const [activityForm, setActivityForm] = useState({
    title: "",
    description: "",
    type: "call",
  });
  const [familyForm, setFamilyForm] = useState({
    name: "",
    relation: "",
    email: "",
  });
  const [tempSelectedServices, setTempSelectedServices] = useState<string[]>(
    [],
  );

  const availableServices = [
    { id: "1", name: "Wealth Management", category: "Advisory" },
    { id: "2", name: "Investment Advisory", category: "Advisory" },
    { id: "3", name: "Portfolio Management", category: "Management" },
    { id: "4", name: "Tax Planning", category: "Planning" },
    { id: "5", name: "Estate Planning", category: "Planning" },
  ];

  useEffect(() => {
    loadClientDetails();
  }, []);

  const loadClientDetails = () => {
    setTimeout(() => {
      const clientData =
        mockClients.find((c) => c.id === route.params?.clientId) ||
        mockClients[0];
      setClient(clientData);
      setActivities(mockActivities.filter((a) => a.clientId === clientData.id));
      setDocuments(mockDocuments.filter((d) => d.clientId === clientData.id));
      setFamilyMembers([
        {
          id: "1",
          clientId: clientData.id,
          name: "Jane Smith",
          relation: "Spouse",
          email: "jane.smith@email.com",
        },
        {
          id: "2",
          clientId: clientData.id,
          name: "Tom Smith",
          relation: "Son",
          email: "tom.smith@email.com",
        },
      ]);
      setServices(["1", "3", "5"]);
      setLoading(false);
    }, 500);
  };

  const handleAddActivity = () => {
    if (!activityForm.title || !activityForm.description) {
      showAlert("Error", "Please fill in all fields");
      return;
    }
    const newActivity: Activity = {
      id: Date.now().toString(),
      clientId: client!.id,
      title: activityForm.title,
      description: activityForm.description,
      date: new Date().toISOString().split("T")[0],
      // createdAt: new Date().toISOString(),
      // type: 'system',
      meetType: activityForm.type as any,
      createdBy: "Admin",
    };
    setActivities([newActivity, ...activities]);
    setShowAddActivity(false);
    setActivityForm({ title: "", description: "", type: "call" });
    showAlert("Success", "Activity added successfully");
  };

  const handleAddFamily = () => {
    if (!familyForm.name || !familyForm.relation) {
      showAlert("Error", "Name and Relation are required");
      return;
    }
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      clientId: client!.id,
      name: familyForm.name,
      relation: familyForm.relation,
      email: familyForm.email,
    };
    setFamilyMembers([...familyMembers, newMember]);
    setShowAddFamily(false);
    setFamilyForm({ name: "", relation: "", email: "" });
    showAlert("Success", "Family member added successfully");
  };

  const handleSaveServices = () => {
    const uniqueServices = Array.from(
      new Set([...services, ...tempSelectedServices]),
    );
    setServices(uniqueServices);
    setShowAddServices(false);
    setTempSelectedServices([]);
    showAlert("Success", "Services updated successfully");
  };

  const toggleServiceSelection = (id: string) => {
    if (tempSelectedServices.includes(id)) {
      setTempSelectedServices(tempSelectedServices.filter((s) => s !== id));
    } else {
      setTempSelectedServices([...tempSelectedServices, id]);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return theme.colors.success;
      case "inactive":
        return theme.colors.textSecondary;
      case "pending":
        return theme.colors.warning;
      default:
        return theme.colors.textSecondary;
    }
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

  if (loading || !client) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.clientName}>{client.name}</Text>
          <View style={styles.clientInfo}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(client.status) + "20" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: getStatusColor(client.status) },
                ]}
              >
                {client.status}
              </Text>
            </View>
            <Text style={styles.clientRole}>{client.role}</Text>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
        >
          {["overview", "services", "family", "activities"].map((tab) => (
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
          ))}
        </ScrollView>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Client Information</Text>
            <Card>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{client.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{client.phone}</Text>
              </View>
              {client.netWorth && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Net Worth</Text>
                  <Text style={styles.infoValue}>
                    {formatCurrency(client.netWorth)}
                  </Text>
                </View>
              )}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Assigned SP</Text>
                <Text style={styles.infoValue}>
                  {client.assignedSP || "None"}
                </Text>
              </View>
            </Card>
            <Button
              title="Edit Client"
              onPress={() => showAlert("Edit", "Edit Client functionality")}
              variant="primary"
            />
          </View>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderBtn}>
              <Text style={styles.sectionTitle}>Assigned Services</Text>
              <TouchableOpacity onPress={() => setShowAddServices(true)}>
                <Icon
                  name="add-circle"
                  size={28}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
            {services.length > 0 ? (
              services.map((serviceId) => {
                const service = availableServices.find(
                  (s) => s.id === serviceId,
                );
                if (!service) return null;
                return (
                  <Card key={serviceId} style={{ marginBottom: 12 }}>
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
                          {service.name}
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: theme.colors.textSecondary,
                          }}
                        >
                          {service.category}
                        </Text>
                      </View>
                    </View>
                  </Card>
                );
              })
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
              <TouchableOpacity onPress={() => setShowAddFamily(true)}>
                <Icon
                  name="add-circle"
                  size={28}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
            {familyMembers.map((member) => (
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
                      {member.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: theme.colors.textSecondary,
                      }}
                    >
                      {member.relation} • {member.email}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Activities Tab */}
        {activeTab === "activities" && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderBtn}>
              <Text style={styles.sectionTitle}>Recent Activities</Text>
              <TouchableOpacity onPress={() => setShowAddActivity(true)}>
                <Icon
                  name="add-circle"
                  size={28}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
            {activities.map((activity) => (
              <Card key={activity.id} style={styles.activityItem}>
                <View style={styles.activityHeader}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDate}>{activity.date}</Text>
                </View>
                <Text style={styles.activityDescription}>
                  {activity.description}
                </Text>
                <View style={{ marginTop: 8 }}>
                  <Text
                    style={{
                      fontSize: 10,
                      color: theme.colors.primary,
                      textTransform: "uppercase",
                    }}
                  >
                    {activity.meetType}
                  </Text>
                </View>
              </Card>
            ))}
          </View>
        )}

        {/* Documents Tab */}
        {activeTab === "documents" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Documents</Text>
            {documents.map((doc) => (
              <Card key={doc.id} style={styles.documentItem}>
                <Text style={styles.documentName}>{doc.name}</Text>
                <Text style={styles.documentType}>{doc.type}</Text>
              </Card>
            ))}
            <Button
              title="View All Documents"
              onPress={() =>
                navigation.navigate("ClientDocuments", { clientId: client.id })
              }
              variant="secondary"
              style={{ marginTop: 12 }}
            />
          </View>
        )}
      </ScrollView>

      {/* Add Activity Modal */}
      <Modal
        visible={showAddActivity}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddActivity(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Activity</Text>
              <TouchableOpacity onPress={() => setShowAddActivity(false)}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={activityForm.title}
              onChangeText={(text) =>
                setActivityForm({ ...activityForm, title: text })
              }
              placeholder="Meeting title"
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              value={activityForm.description}
              onChangeText={(text) =>
                setActivityForm({ ...activityForm, description: text })
              }
              placeholder="Meeting notes..."
              multiline
            />
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeSelector}>
              {["call", "email", "physical"].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor:
                        activityForm.type === type
                          ? theme.colors.primary + "20"
                          : "transparent",
                      borderColor:
                        activityForm.type === type
                          ? theme.colors.primary
                          : theme.effects.cardBorder,
                    },
                  ]}
                  onPress={() => setActivityForm({ ...activityForm, type })}
                >
                  <Text
                    style={{
                      color:
                        activityForm.type === type
                          ? theme.colors.primary
                          : theme.colors.textSecondary,
                      textTransform: "capitalize",
                    }}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Button
              title="Save Activity"
              onPress={handleAddActivity}
              variant="primary"
            />
          </View>
        </View>
      </Modal>

      {/* Add Family Member Modal */}
      <Modal
        visible={showAddFamily}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddFamily(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Family Member</Text>
              <TouchableOpacity onPress={() => setShowAddFamily(false)}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={familyForm.name}
              onChangeText={(text) =>
                setFamilyForm({ ...familyForm, name: text })
              }
              placeholder="Full Name"
            />
            <Text style={styles.label}>Relation</Text>
            <TextInput
              style={styles.input}
              value={familyForm.relation}
              onChangeText={(text) =>
                setFamilyForm({ ...familyForm, relation: text })
              }
              placeholder="Spouse, Child, etc."
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={familyForm.email}
              onChangeText={(text) =>
                setFamilyForm({ ...familyForm, email: text })
              }
              placeholder="email@example.com"
              keyboardType="email-address"
            />
            <Button
              title="Add Member"
              onPress={handleAddFamily}
              variant="primary"
            />
          </View>
        </View>
      </Modal>

      {/* Add Services Modal */}
      <Modal
        visible={showAddServices}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddServices(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Services</Text>
              <TouchableOpacity onPress={() => setShowAddServices(false)}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ marginBottom: 16 }}>
              {availableServices
                .filter((s) => !services.includes(s.id))
                .map((service) => {
                  const isSelected = tempSelectedServices.includes(service.id);
                  return (
                    <TouchableOpacity
                      key={service.id}
                      style={[
                        styles.serviceOption,
                        {
                          borderColor: isSelected
                            ? theme.colors.primary
                            : theme.effects.cardBorder,
                          backgroundColor: isSelected
                            ? theme.colors.primary + "10"
                            : theme.colors.surface,
                        },
                      ]}
                      onPress={() => toggleServiceSelection(service.id)}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          {
                            borderColor: isSelected
                              ? theme.colors.primary
                              : theme.colors.textSecondary,
                            backgroundColor: isSelected
                              ? theme.colors.primary
                              : "transparent",
                          },
                        ]}
                      >
                        {isSelected && (
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
                          {service.category}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              {availableServices.filter((s) => !services.includes(s.id))
                .length === 0 && (
                <Text
                  style={{
                    textAlign: "center",
                    color: theme.colors.textSecondary,
                  }}
                >
                  All available services assigned.
                </Text>
              )}
            </ScrollView>
            <Button
              title="Add Selected"
              onPress={handleSaveServices}
              variant="primary"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ClientDetailsScreen;
