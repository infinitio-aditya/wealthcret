import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Modal,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../../hooks/useTheme";
import { useAlert } from "../../../context/AlertContext";
import { RootState } from "../../../store";
import {
  setClients,
  setSearchQuery,
  setSelectedClient,
} from "../../../store/slices/clientSlice";
import { mockClients } from "../../../utils/mockData";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { Client } from "../../../types";
import ThemeDropdown from "../../../components/ui/ThemeDropdown";
import ThemeBottomSheet from "../../../components/ui/ThemeBottomSheet";

const ClientListScreen = () => {
  const { showAlert } = useAlert();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { clients, searchQuery, loading } = useSelector(
    (state: RootState) => state.client,
  );
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Filter Modal State
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    services: [] as string[],
    assignedSP: "all",
    referralPartner: "all",
  });
  const [tempFilters, setTempFilters] = useState({
    services: [] as string[],
    assignedSP: "all",
    referralPartner: "all",
  });

  // Add Client Modal State
  const [showAddClient, setShowAddClient] = useState(false);
  const [clientType, setClientType] = useState<"individual" | "non-individual">(
    "individual",
  );
  const [newClient, setNewClient] = useState({
    firstName: "",
    lastName: "",
    email: "",
    license: "",
    companyName: "",
  });

  const availableServices = [
    { id: "1", name: "Wealth Management", category: "Advisory" },
    { id: "2", name: "Investment Advisory", category: "Advisory" },
    { id: "3", name: "Portfolio Management", category: "Management" },
    { id: "4", name: "Tax Planning", category: "Planning" },
    { id: "5", name: "Estate Planning", category: "Planning" },
    { id: "6", name: "Retirement Planning", category: "Planning" },
    { id: "7", name: "Risk Assessment", category: "Analysis" },
    { id: "8", name: "Asset Allocation", category: "Management" },
    { id: "9", name: "Financial Planning", category: "Planning" },
    { id: "10", name: "Trust Services", category: "Legal" },
  ];

  const availableLicenses = [
    "Wealth Management",
    "Investment Advisory",
    "Portfolio Management",
    "Financial Planning",
    "Tax Consulting",
  ];

  const uniqueAdvisors = Array.from(
    new Set(mockClients.map((c) => c.assignedSP).filter(Boolean)),
  ) as string[];
  const uniqueReferralPartners = Array.from(
    new Set(mockClients.map((c) => c.referralPartner).filter(Boolean)),
  ) as string[];

  useEffect(() => {
    dispatch(setClients(mockClients));
  }, [dispatch]);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || client.status === selectedStatus;

    // Role visibility
    let isVisible = true;
    if (
      user?.role === "service_provider" ||
      user?.role === "referral_partner"
    ) {
      isVisible =
        client.assignedSP === user.name || client.referralPartner === user.name;
    }

    // Apply Advanced Filters
    const matchesServices =
      filters.services.length === 0 ||
      (client.services &&
        filters.services.some((serviceId) =>
          client.services?.includes(serviceId),
        ));

    const matchesAdvisor =
      filters.assignedSP === "all" || client.assignedSP === filters.assignedSP;
    const matchesReferral =
      filters.referralPartner === "all" ||
      (filters.referralPartner === "none"
        ? !client.referralPartner
        : client.referralPartner === filters.referralPartner);

    return (
      matchesSearch &&
      matchesStatus &&
      isVisible &&
      matchesAdvisor &&
      matchesReferral
    );
  });

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(setClients(mockClients));
      setRefreshing(false);
    }, 1000);
  };

  const handleClientPress = (client: Client) => {
    dispatch(setSelectedClient(client));
    navigation.navigate("ClientDetails", { clientId: client.id });
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    const reset = { services: [], assignedSP: "all", referralPartner: "all" };
    setTempFilters(reset);
    setFilters(reset);
    setShowFilters(false);
  };

  const handleAddClient = () => {
    if (
      !newClient.firstName ||
      !newClient.lastName ||
      !newClient.email ||
      !newClient.license
    ) {
      showAlert("Error", "Please fill in all required fields");
      return;
    }
    if (clientType === "non-individual" && !newClient.companyName) {
      showAlert("Error", "Please enter company name");
      return;
    }

    // Logic to add client would go here (API call of sorts)
    setShowAddClient(false);
    setNewClient({
      firstName: "",
      lastName: "",
      email: "",
      license: "",
      companyName: "",
    });
    setClientType("individual");
  };

  const formatNetWorth = (amount: number) => {
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  // Web uses theme.colors.error for inactive
  const getWebStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return theme.colors.success;
      case "pending":
        return theme.colors.warning;
      case "inactive":
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const renderClientItem = ({ item }: { item: Client }) => {
    const itemStyles = StyleSheet.create({
      clientCard: { marginBottom: 12, padding: 24 },
      clientHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 16,
      },
      avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.primary,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 16,
      },
      clientInfo: { flex: 1 },
      clientName: {
        fontSize: 16,
        fontWeight: "bold",
        color: theme.colors.text,
        marginBottom: 4,
      },
      clientRole: { fontSize: 14, color: theme.colors.textSecondary },
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
      contactRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
        gap: 8,
      },
      contactText: { fontSize: 14, color: theme.colors.textSecondary },
      netWorthRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 8,
        marginTop: 8,
        borderTopWidth: 1,
        borderTopColor: theme.effects.cardBorder,
      },
      label: { fontSize: 14, color: theme.colors.textSecondary },
      value: { fontSize: 14, fontWeight: "600", color: theme.colors.primary },
    });

    return (
      <TouchableOpacity
        onPress={() => handleClientPress(item)}
        activeOpacity={0.8}
      >
        <Card style={itemStyles.clientCard}>
          <View style={itemStyles.clientHeader}>
            <View style={itemStyles.avatar}>
              <Icon
                name="person"
                size={24}
                color={theme.colors.textOnPrimary}
              />
            </View>
            <View style={itemStyles.clientInfo}>
              <Text style={itemStyles.clientName}>{item.name}</Text>
              <Text style={itemStyles.clientRole}>{item.role}</Text>
            </View>
            <View
              style={[
                itemStyles.statusBadge,
                { backgroundColor: getWebStatusColor(item.status) + "20" },
              ]}
            >
              <Text
                style={[
                  itemStyles.statusText,
                  { color: getWebStatusColor(item.status) },
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>

          <View>
            <View style={itemStyles.contactRow}>
              <Icon
                name="mail-outline"
                size={14}
                color={theme.colors.textSecondary}
              />
              <Text style={itemStyles.contactText}>{item.email}</Text>
            </View>
            {item.phone && (
              <View style={itemStyles.contactRow}>
                <Icon
                  name="call-outline"
                  size={14}
                  color={theme.colors.textSecondary}
                />
                <Text style={itemStyles.contactText}>{item.phone}</Text>
              </View>
            )}
            {item.netWorth && (
              <View style={itemStyles.netWorthRow}>
                <Text style={itemStyles.label}>Net Worth</Text>
                <Text style={itemStyles.value}>
                  {formatNetWorth(item.netWorth)}
                </Text>
              </View>
            )}
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { padding: 16, paddingBottom: 8 },
    topRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    title: { fontSize: 24, fontWeight: "bold", color: theme.colors.text },
    headerButtons: { flexDirection: "row", gap: 12 },
    searchContainer: {
      backgroundColor: theme.effects.glassBackground,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.text,
      padding: 0,
      marginLeft: 8,
    },
    listContainer: { padding: 16, paddingTop: 8 },
    tabsContainer: { marginTop: 16 },
    tabsContent: { paddingRight: 16 },
    tab: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1,
      marginRight: 8,
      backgroundColor: theme.effects.glassBackground,
    },
    tabText: { fontSize: 14, fontWeight: "600" },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 60,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
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
      maxHeight: "90%",
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    modalTitle: { fontSize: 20, fontWeight: "bold", color: theme.colors.text },
    inputGroup: { marginBottom: 16 },
    label: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 8,
      fontWeight: "600",
    },
    input: {
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      borderRadius: 12,
      padding: 12,
      color: theme.colors.text,
    },
    filterSection: { marginBottom: 24 },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 12,
    },
    serviceChip: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      marginBottom: 8,
      backgroundColor: theme.effects.glassBackground,
    },
    serviceStatusDot: {
      width: 12,
      height: 12,
      borderRadius: 4,
      marginRight: 8,
      borderWidth: 2,
    },
    serviceText: { fontSize: 14, color: theme.colors.text, flex: 1 },
    pickerContainer: {
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      borderRadius: 12,
      backgroundColor: theme.colors.background,
      overflow: "hidden",
    },
  });

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.title}>Clients & Prospects</Text>
            <Text style={{ fontSize: 14, color: theme.colors.textSecondary }}>
              Manage your client relationships
            </Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => setShowAddClient(true)}>
              <Icon name="add-circle" size={32} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={(text) => dispatch(setSearchQuery(text))}
            placeholder="Search clients..."
            placeholderTextColor={theme.colors.textSecondary}
          />
          <TouchableOpacity
            onPress={() => setShowFilters(true)}
            style={{ marginLeft: 8 }}
          >
            <Icon name="filter" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
          contentContainerStyle={styles.tabsContent}
        >
          {["all", "active", "pending", "inactive"].map((status) => (
            <TouchableOpacity
              key={status}
              onPress={() => setSelectedStatus(status)}
              style={[
                styles.tab,
                selectedStatus === status && {
                  backgroundColor: theme.colors.primary,
                },
                { borderColor: theme.effects.cardBorder },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedStatus === status && {
                    color: theme.colors.textOnPrimary,
                  },
                  {
                    color:
                      selectedStatus === status
                        ? theme.colors.textOnPrimary
                        : theme.colors.text,
                  },
                ]}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredClients}
        renderItem={renderClientItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery
                ? "No clients found matching your search"
                : "No clients available"}
            </Text>
          </View>
        }
      />

      {/* Filters Modal */}
      <ThemeBottomSheet
        isVisible={showFilters}
        onClose={() => setShowFilters(false)}
        title="Advanced Filters"
      >
        <Text
          style={{
            color: theme.colors.textSecondary,
            fontSize: 14,
            marginBottom: 20,
          }}
        >
          Refine your client search with multiple criteria
        </Text>

        <View style={styles.filterSection}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text style={styles.sectionTitle}>Filter by Services</Text>
            <View
              style={{
                backgroundColor: theme.colors.primary + "20",
                borderRadius: 12,
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}
            >
              <Text style={{ color: theme.colors.primary, fontSize: 12 }}>
                {tempFilters.services.length} selected
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {availableServices.map((service) => {
              const isSelected = tempFilters.services.includes(service.id);
              return (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceChip,
                    { width: "48%" },
                    isSelected && { borderColor: theme.colors.primary },
                  ]}
                  onPress={() => {
                    if (isSelected) {
                      setTempFilters({
                        ...tempFilters,
                        services: tempFilters.services.filter(
                          (id) => id !== service.id,
                        ),
                      });
                    } else {
                      setTempFilters({
                        ...tempFilters,
                        services: [...tempFilters.services, service.id],
                      });
                    }
                  }}
                >
                  <View
                    style={[
                      styles.serviceStatusDot,
                      {
                        borderColor: isSelected
                          ? theme.colors.primary
                          : theme.colors.primary,
                        backgroundColor: isSelected
                          ? theme.colors.primary
                          : "transparent",
                      },
                    ]}
                  />
                  <Text
                    style={[
                      styles.serviceText,
                      isSelected && { fontWeight: "600" },
                    ]}
                    numberOfLines={1}
                  >
                    {service.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: theme.effects.cardBorder,
            marginBottom: 24,
          }}
        />

        <ThemeDropdown
          label="Assigned Service Provider"
          options={[
            { label: "All Service Providers", value: "all" },
            ...uniqueAdvisors.map((ad) => ({ label: ad, value: ad })),
          ]}
          selectedValue={tempFilters.assignedSP}
          onValueChange={(value) =>
            setTempFilters({ ...tempFilters, assignedSP: value })
          }
        />

        <ThemeDropdown
          label="Referral Partner"
          options={[
            { label: "All Partners", value: "all" },
            { label: "None", value: "none" },
            ...uniqueReferralPartners.map((rp) => ({ label: rp, value: rp })),
          ]}
          selectedValue={tempFilters.referralPartner}
          onValueChange={(value) =>
            setTempFilters({ ...tempFilters, referralPartner: value })
          }
        />

        <View
          style={{
            flexDirection: "row",
            gap: 12,
            marginTop: 12,
            marginBottom: 20,
          }}
        >
          <Button
            title="Clear All"
            onPress={handleResetFilters}
            variant="secondary"
            style={{ flex: 1 }}
          />
          <Button
            title="Apply Filters"
            onPress={handleApplyFilters}
            variant="primary"
            style={{ flex: 1 }}
          />
        </View>
      </ThemeBottomSheet>

      {/* Add Client Modal */}
      <ThemeBottomSheet
        isVisible={showAddClient}
        onClose={() => setShowAddClient(false)}
        title="Add New Client"
      >
        <View
          style={[
            styles.inputGroup,
            {
              flexDirection: "row",
              backgroundColor: theme.effects.glassBackground,
              borderRadius: 12,
              padding: 4,
              marginBottom: 24,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              {
                flex: 1,
                paddingVertical: 10,
                alignItems: "center",
                borderRadius: 8,
              },
              clientType === "individual" && {
                backgroundColor: theme.colors.surface,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
              },
            ]}
            onPress={() => setClientType("individual")}
          >
            <Text
              style={{
                fontWeight: "600",
                color:
                  clientType === "individual"
                    ? theme.colors.text
                    : theme.colors.textSecondary,
              }}
            >
              Individual
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              {
                flex: 1,
                paddingVertical: 10,
                alignItems: "center",
                borderRadius: 8,
              },
              clientType === "non-individual" && {
                backgroundColor: theme.colors.surface,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
              },
            ]}
            onPress={() => setClientType("non-individual")}
          >
            <Text
              style={{
                fontWeight: "600",
                color:
                  clientType === "non-individual"
                    ? theme.colors.text
                    : theme.colors.textSecondary,
              }}
            >
              Non-Individual
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={newClient.firstName}
            onChangeText={(t) => setNewClient({ ...newClient, firstName: t })}
            placeholder="John"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={newClient.lastName}
            onChangeText={(t) => setNewClient({ ...newClient, lastName: t })}
            placeholder="Doe"
            placeholderTextColor={theme.colors.textSecondary}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={newClient.email}
            onChangeText={(t) => setNewClient({ ...newClient, email: t })}
            placeholder="john@example.com"
            keyboardType="email-address"
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="none"
          />
        </View>

        <ThemeDropdown
          label="License"
          options={availableLicenses.map((l) => ({ label: l, value: l }))}
          selectedValue={newClient.license}
          onValueChange={(value) =>
            setNewClient({ ...newClient, license: value })
          }
        />

        {clientType === "non-individual" && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Company Name</Text>
            <TextInput
              style={styles.input}
              value={newClient.companyName}
              onChangeText={(t) =>
                setNewClient({ ...newClient, companyName: t })
              }
              placeholder="Company Ltd"
              placeholderTextColor={theme.colors.textSecondary}
            />
          </View>
        )}

        <Button
          title="Add Client"
          onPress={handleAddClient}
          variant="primary"
          style={{ marginTop: 8, marginBottom: 20 }}
        />
      </ThemeBottomSheet>
    </View>
  );
};

export default ClientListScreen;
