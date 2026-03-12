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
  appendClients,
  setSearchQuery,
  setSelectedClient,
} from "../../../store/slices/clientSlice";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import { ProspectAssociation } from "../../../types/backend/prospect";
import ThemeDropdown from "../../../components/ui/ThemeDropdown";
import ThemeBottomSheet from "../../../components/ui/ThemeBottomSheet";
import CircularProgress from "../../../components/ui/CircularProgress";
import {
  useLazyGetProspectsClientsQuery,
  useCreateProspectMutation,
} from "../../../services/backend/prospectApi";
import { useGetOrgLicenseQuery } from "../../../services/backend/licensingApi";
import {
  useGetServicesQuery,
  useGetOrganizationServicesQuery,
} from "../../../services/backend/userServicesApi";
import ThemeMultiSelect from "../../../components/ui/ThemeMultiSelect";
import {
  ORG_TYPE_AD,
  ORG_TYPE_RP,
  ORG_TYPE_SP,
  ORG_TYPE_CL,
} from "../../../types/backend/constants";

import { useAuth } from "../../../context/AuthContext";

const ClientListScreen = () => {
  const { showAlert } = useAlert();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { clients, searchQuery, loading } = useSelector(
    (state: RootState) => state.client,
  );
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");

  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [getProspects, { data: prospectsData, isFetching: loadingProspects }] =
    useLazyGetProspectsClientsQuery();
  const [createProspect] = useCreateProspectMutation();

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
    licenses: [] as string[],
    services: [] as string[],
    companyName: "",
  });

  const { data: orgLicenses } = useGetOrgLicenseQuery();
  const { data: allServices } = useGetServicesQuery();
  const { data: orgServices } = useGetOrganizationServicesQuery();

  const availableLicenses = (orgLicenses?.feature_licenses || []).map(
    (ol: any) => ({
      label: ol.feature.label,
      value: ol.feature.name,
    }),
  );

  const availableServices = (orgServices || []).map((os: any) => {
    const serviceDetails = (allServices || []).find(
      (s: any) => s.id === os.service,
    );
    return {
      label: serviceDetails?.label || `Service ${os.service}`,
      value: os.id.toString(),
      id: os.id.toString(), // For backward compatibility with filter rendering
      raw: os,
    };
  });

  const uniqueAdvisors = Array.from(
    new Set(
      clients.map((c: ProspectAssociation) => c.owner_name).filter(Boolean),
    ),
  ) as string[];
  const uniqueReferralPartners = Array.from(
    new Set(
      clients
        .map((c: ProspectAssociation) => c.organization?.name)
        .filter(Boolean),
    ),
  ) as string[];

  // Reset and refetch from page 1 when search or user changes
  useEffect(() => {
    dispatch(setClients([]));
    fetchPage(1, true);
  }, [user, searchQuery]);

  const fetchPage = async (currentPage: number, isRefresh: boolean = false) => {
    if (!hasMore && !isRefresh) return;
    setIsFetchingMore(true);

    try {
      const response = await getProspects({
        user_types: "1,2",
        page: currentPage,
        page_size: PAGE_SIZE,
        ...(searchQuery ? { q: searchQuery } : {}),
      }).unwrap();

      if (isRefresh || currentPage === 1) {
        dispatch(setClients(response.results));
        setPage(1);
      } else {
        dispatch(appendClients(response.results));
        setPage(currentPage);
      }

      setHasMore(response.results.length === PAGE_SIZE);
    } catch (error) {
      console.error("Failed to fetch clients", error);
    } finally {
      setIsFetchingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!hasMore || loadingProspects || isFetchingMore) return;
    fetchPage(page + 1);
  };

  const filteredClients = clients.filter((pa) => {
    const u = pa.user;
    const clientName = `${u.first_name} ${u.last_name}`.toLowerCase();
    const clientEmail = u.email.toLowerCase();
    const matchesSearch =
      clientName.includes(searchQuery.toLowerCase()) ||
      clientEmail.includes(searchQuery.toLowerCase());

    const statusMap: Record<string, "active" | "inactive" | "pending"> = {
      "1": "pending",
      "2": "pending",
      "3": "pending",
      "4": "active",
      "5": "active",
      "6": "active",
    };
    const clientStatus = statusMap[u.application_status] || "pending";

    const matchesStatus =
      selectedStatus === "all" || clientStatus === selectedStatus;

    // Apply Advanced Filters
    const matchesAdvisor =
      filters.assignedSP === "all" || pa.owner_name === filters.assignedSP;

    return matchesSearch && matchesStatus && matchesAdvisor;
  });

  const handleRefresh = () => {
    setRefreshing(true);
    dispatch(setClients([]));
    setPage(1);
    setHasMore(true);
    fetchPage(1);
    setRefreshing(false);
  };

  const handleClientPress = (pa: ProspectAssociation) => {
    dispatch(setSelectedClient(pa));
    navigation.navigate("ClientDetails", { clientId: pa.id.toString() });
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

  const handleAddClient = async () => {
    if (
      !newClient.firstName ||
      !newClient.lastName ||
      !newClient.email ||
      newClient.licenses.length === 0
    ) {
      showAlert(
        "Error",
        "Please fill in all required fields and select at least one license",
      );
      return;
    }

    try {
      const selectedServicesObjects = newClient.services
        .map((val) => {
          const os = (orgServices || []).find(
            (s: any) => s.id.toString() === val,
          );
          return os;
        })
        .filter(Boolean);

      await createProspect({
        first_name: newClient.firstName,
        last_name: newClient.lastName,
        email: newClient.email,
        individual: clientType === "individual",
        company: newClient.companyName,
        licenses: newClient.licenses,
        services: selectedServicesObjects,
      }).unwrap();

      showAlert("Success", "Prospect created successfully");
      setShowAddClient(false);
      setNewClient({
        firstName: "",
        lastName: "",
        email: "",
        licenses: [],
        services: [],
        companyName: "",
      });
      setClientType("individual");
      fetchPage(1);
    } catch (error: any) {
      showAlert("Error", error?.data?.detail || "Failed to create prospect");
    }
  };

  // Web uses theme.colors.error for inactive
  const getWebStatusColor = (applicationStatus: string) => {
    const statusMap: Record<string, "active" | "inactive" | "pending"> = {
      "1": "pending",
      "2": "pending",
      "3": "pending",
      "4": "active",
      "5": "active",
      "6": "active",
    };
    const status = statusMap[applicationStatus] || "pending";
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

  const renderClientItem = ({ item }: { item: ProspectAssociation }) => {
    const u = item.user;
    const pipelinePercentage = parseInt(u.pipeline_status || "0");
    const clientName = `${u.first_name} ${u.last_name}`;
    const clientRole = u.user_type === 1 ? "Prospect" : "Client";

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
            <View style={{ marginRight: 16, alignItems: "center" }}>
              <CircularProgress
                size={68}
                strokeWidth={4}
                percentage={pipelinePercentage}
                color={
                  pipelinePercentage === 100
                    ? theme.colors.success
                    : pipelinePercentage < 50
                      ? theme.colors.error
                      : pipelinePercentage < 80
                        ? theme.colors.warning
                        : theme.colors.primary
                }
              >
                <View
                  style={[
                    itemStyles.avatar,
                    {
                      marginRight: 0,
                      width: 52,
                      height: 52,
                      borderRadius: 26,
                    },
                  ]}
                >
                  <Icon
                    name="person"
                    size={24}
                    color={theme.colors.textOnPrimary}
                  />
                </View>
              </CircularProgress>
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "bold",
                  color:
                    pipelinePercentage === 100
                      ? theme.colors.success
                      : pipelinePercentage < 50
                        ? theme.colors.error
                        : pipelinePercentage < 80
                          ? theme.colors.warning
                          : theme.colors.primary,
                  marginTop: 4,
                }}
              >
                {pipelinePercentage}%
              </Text>
            </View>
            <View style={itemStyles.clientInfo}>
              <Text style={itemStyles.clientName}>{clientName}</Text>
              <Text style={itemStyles.clientRole}>{clientRole}</Text>
            </View>
            <View
              style={[
                itemStyles.statusBadge,
                {
                  backgroundColor:
                    getWebStatusColor(u.application_status) + "20",
                },
              ]}
            >
              <Text
                style={[
                  itemStyles.statusText,
                  { color: getWebStatusColor(u.application_status) },
                ]}
              >
                {u.application_status_display || u.application_status}
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
              <Text style={itemStyles.contactText}>{u.email}</Text>
            </View>
            {u.mobile_number && (
              <View style={itemStyles.contactRow}>
                <Icon
                  name="call-outline"
                  size={14}
                  color={theme.colors.textSecondary}
                />
                <Text style={itemStyles.contactText}>{u.mobile_number}</Text>
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
      backgroundColor: theme.colors.surface,
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
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingMore ? (
            <ActivityIndicator
              size="small"
              color={theme.colors.primary}
              style={{ marginVertical: 16 }}
            />
          ) : null
        }
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
            {availableServices.map((service: any) => {
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
                    {service.label}
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

        <ThemeMultiSelect
          label="Licenses"
          options={availableLicenses}
          selectedValues={newClient.licenses}
          onValuesChange={(values) =>
            setNewClient({ ...newClient, licenses: values })
          }
        />

        {user?.feature_licenses?.includes("REFERRAL_PROGRAM") &&
          availableServices.length > 0 && (
            <ThemeMultiSelect
              label="Select Services"
              options={availableServices.map((s: any) => ({
                label: s.label,
                value: s.value,
              }))}
              selectedValues={newClient.services}
              onValuesChange={(values) =>
                setNewClient({ ...newClient, services: values })
              }
            />
          )}

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
