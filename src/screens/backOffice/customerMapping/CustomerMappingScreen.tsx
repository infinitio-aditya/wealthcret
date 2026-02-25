import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Icon from "react-native-vector-icons/Ionicons";
import { CustomerMapping } from "../../../types";
import ThemeDropdown from "../../../components/ui/ThemeDropdown";
import {
  mockMappings,
  mockServiceProviders,
  mockReferralPartners,
} from "../../../utils/mockData";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const availableServiceProviders = mockServiceProviders.map((sp) => ({
  label: sp.name,
  value: sp.name,
}));

const availableReferralPartners = mockReferralPartners.map((rp) => ({
  label: rp.name,
  value: rp.name,
}));

const CustomerMappingScreen = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [mappings, setMappings] = useState<CustomerMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempProvider, setTempProvider] = useState({ label: "", value: "" });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkProvider, setBulkProvider] = useState({ label: "", value: "" });

  const [filters, setFilters] = useState({
    assignedSP: "all",
    referralPartner: "all",
  });
  const [tempFilters, setTempFilters] = useState({
    assignedSP: "all",
    referralPartner: "all",
  });

  useEffect(() => {
    setTimeout(() => {
      setMappings(mockMappings);
      setLoading(false);
    }, 500);
  }, []);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredMappings.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredMappings.map((m) => m.id));
    }
  };

  const handleBulkReassign = () => {
    if (!bulkProvider.value) return;
    setMappings((prev) =>
      prev.map((m) =>
        selectedIds.includes(m.id)
          ? { ...m, serviceProvider: bulkProvider.value }
          : m,
      ),
    );
    setSelectedIds([]);
    setShowBulkModal(false);
    setBulkProvider({ label: "", value: "" });
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setShowFilters(false);
  };

  const handleResetFilters = () => {
    const reset = {
      assignedSP: "all",
      referralPartner: "all",
    };
    setTempFilters(reset);
    setFilters(reset);
    setShowFilters(false);
  };

  const handleAssignProvider = (id: string) => {
    if (!tempProvider.value) return;
    setMappings((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, serviceProvider: tempProvider.value } : m,
      ),
    );
    setEditingId(null);
    setTempProvider({ label: "", value: "" });
  };

  const filteredMappings = mappings.filter((m) => {
    const matchesSearch =
      m.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.externalId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSP =
      filters.assignedSP === "all" || m.serviceProvider === filters.assignedSP;
    const matchesRP =
      filters.referralPartner === "all" ||
      m.referralPartner === filters.referralPartner;

    return matchesSearch && matchesSP && matchesRP;
  });

  const activeCount = mappings.filter((m) => m.status === "active").length;
  const pendingCount = mappings.filter((m) => m.status === "pending").length;

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    header: { padding: 16 },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 16,
    },
    statsRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
    statCard: {
      flex: 1,
      backgroundColor: theme.effects.cardBackground,
      padding: 12,
      borderRadius: 12,
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
    },
    statValue: { fontSize: 20, fontWeight: "bold", marginBottom: 4 },
    statLabel: { fontSize: 12, color: theme.colors.textSecondary },
    searchContainer: { flexDirection: "row", gap: 12, marginBottom: 16 },
    searchBox: {
      flex: 1,
      backgroundColor: theme.effects.glassBackground,
      paddingHorizontal: 12,
      height: 44,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      color: theme.colors.text,
    },
    filterBtn: {
      width: 44,
      height: 44,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.05)",
      borderRadius: 12,
    },
    listContent: { padding: 16, paddingTop: 0 },
    card: {
      marginBottom: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
    },
    selectedCard: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + "05",
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    selectionIndicator: {
      marginRight: 12,
      marginTop: 2,
    },
    customerName: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    idText: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    statusText: {
      fontSize: 10,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    detailsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    label: { fontSize: 12, color: theme.colors.textSecondary },
    value: { fontSize: 12, color: theme.colors.text, fontWeight: "500" },
    actionRow: {
      marginTop: 12,
      flexDirection: "row",
      gap: 8,
      alignItems: "center",
    },
    pickerContainer: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      borderRadius: 8,
      height: 40,
      justifyContent: "center",
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
      paddingBottom: 40,
      maxHeight: SCREEN_HEIGHT * 0.8,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    filterLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
    picker: {
      color: theme.colors.text,
    },
    modalButtons: {
      flexDirection: "row",
      gap: 12,
      marginTop: 32,
      marginBottom: 16,
    },
    pickerWrapper: {
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      borderRadius: 12,
      backgroundColor: theme.colors.background,
      height: 50,
      justifyContent: "center",
      marginTop: 8,
    },
    bulkActionBar: {
      position: "absolute",
      bottom: 24,
      left: 16,
      right: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 20,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
    },
    bulkActionBtn: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 12,
    },
    bulkActionBtnText: {
      color: theme.colors.textOnPrimary,
      fontWeight: "bold",
      fontSize: 14,
    },
    selectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      marginBottom: 8,
    },
  });

  if (loading)
    return (
      <View
        style={[
          styles.container,
          { flex: 1, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Customer Mapping</Text>
        <Text style={styles.subtitle}>Manage external system links</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {mappings.length}
            </Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: theme.colors.success }]}>
              {activeCount}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: theme.colors.warning }]}>
              {pendingCount}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchBox}
            placeholder="Search customers..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setShowFilters(true)}
          >
            <Icon name="filter" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.selectionHeader}>
        <Text style={styles.label}>
          {filteredMappings.length} mappings found
        </Text>
        <TouchableOpacity onPress={handleSelectAll}>
          <Text style={{ color: theme.colors.primary, fontWeight: "600" }}>
            {selectedIds.length === filteredMappings.length &&
            filteredMappings.length > 0
              ? "Deselect All"
              : "Select All"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredMappings}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: selectedIds.length > 0 ? 100 : 16 },
        ]}
        renderItem={({ item }) => {
          const isSelected = selectedIds.includes(item.id);
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => toggleSelection(item.id)}
            >
              <Card style={[styles.card, isSelected && styles.selectedCard]}>
                <View style={styles.cardHeader}>
                  <View style={{ flexDirection: "row", flex: 1 }}>
                    <View style={styles.selectionIndicator}>
                      <Icon
                        name={isSelected ? "checkbox" : "square-outline"}
                        size={22}
                        color={
                          isSelected
                            ? theme.colors.primary
                            : theme.colors.textSecondary
                        }
                      />
                    </View>
                    <View>
                      <Text style={styles.customerName}>
                        {item.customerName}
                      </Text>
                      <Text style={styles.idText}>{item.externalId}</Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          item.status === "active"
                            ? theme.colors.success + "20"
                            : theme.colors.warning + "20",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            item.status === "active"
                              ? theme.colors.success
                              : theme.colors.warning,
                        },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>

                <View style={[styles.detailsRow, { paddingLeft: 34 }]}>
                  <Text style={styles.label}>System</Text>
                  <Text style={styles.value}>{item.system}</Text>
                </View>
                <View style={[styles.detailsRow, { paddingLeft: 34 }]}>
                  <Text style={styles.label}>Last Sync</Text>
                  <Text style={styles.value}>{item.lastSync}</Text>
                </View>
                <View style={[styles.detailsRow, { paddingLeft: 34 }]}>
                  <Text style={styles.label}>Referral Partner</Text>
                  <Text style={styles.value}>
                    {item.referralPartner || "N/A"}
                  </Text>
                </View>

                <View
                  style={{
                    height: 1,
                    backgroundColor: theme.effects.cardBorder,
                    marginVertical: 8,
                    marginLeft: 34,
                  }}
                />

                <View style={{ paddingLeft: 34 }}>
                  <Text style={[styles.label, { marginBottom: 4 }]}>
                    Assigned Service Provider
                  </Text>
                  {editingId === item.id ? (
                    <View style={styles.actionRow}>
                      <View style={{ flex: 1 }}>
                        <ThemeDropdown
                          label=""
                          options={availableServiceProviders}
                          selectedValue={tempProvider.value}
                          onValueChange={(val) => {
                            const selected = availableServiceProviders.find(
                              (opt) => opt.value === val,
                            );
                            setTempProvider(
                              selected || { label: val, value: val },
                            );
                          }}
                          placeholder="Select Provider"
                        />
                      </View>
                      <TouchableOpacity
                        onPress={() => handleAssignProvider(item.id)}
                      >
                        <Icon
                          name="checkmark-circle"
                          size={32}
                          color={theme.colors.success}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setEditingId(null)}>
                        <Icon
                          name="close-circle"
                          size={32}
                          color={theme.colors.error}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={[styles.value, { fontSize: 14 }]}>
                        {item.serviceProvider}
                      </Text>
                      <TouchableOpacity
                        onPress={() => {
                          setEditingId(item.id);
                          setTempProvider({
                            label: item.serviceProvider,
                            value: item.serviceProvider,
                          });
                        }}
                      >
                        <Text
                          style={{
                            color: theme.colors.primary,
                            fontWeight: "600",
                          }}
                        >
                          Change
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </Card>
            </TouchableOpacity>
          );
        }}
      />

      {selectedIds.length > 0 && (
        <View style={styles.bulkActionBar}>
          <View>
            <Text
              style={{
                color: theme.colors.text,
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {selectedIds.length} Selected
            </Text>
            <TouchableOpacity onPress={() => setSelectedIds([])}>
              <Text style={{ color: theme.colors.primary, fontSize: 12 }}>
                Clear Selection
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.bulkActionBtn}
            onPress={() => setShowBulkModal(true)}
          >
            <Text style={styles.bulkActionBtnText}>Bulk Reassign</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={showBulkModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBulkModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bulk Reassign</Text>
              <TouchableOpacity onPress={() => setShowBulkModal(false)}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.subtitle}>
              Reassign {selectedIds.length} selected customers to:
            </Text>

            <ThemeDropdown
              label="Select Service Provider"
              options={availableServiceProviders}
              selectedValue={bulkProvider.value}
              onValueChange={(val) => {
                const selected = availableServiceProviders.find(
                  (opt) => opt.value === val,
                );
                setBulkProvider(selected || { label: val, value: val });
              }}
              placeholder="Select Provider"
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setShowBulkModal(false)}
                style={{ flex: 1 }}
              />
              <Button
                title="Reassign"
                onPress={handleBulkReassign}
                style={{ flex: 1 }}
                disabled={!bulkProvider.value}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showFilters}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Mappings</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <ThemeDropdown
                label="Service Provider"
                options={[
                  { label: "All Providers", value: "all" },
                  ...availableServiceProviders,
                ]}
                selectedValue={tempFilters.assignedSP}
                onValueChange={(itemValue) =>
                  setTempFilters((prev) => ({
                    ...prev,
                    assignedSP: itemValue as string,
                  }))
                }
              />

              <ThemeDropdown
                label="Referral Partner"
                options={[
                  { label: "All Partners", value: "all" },
                  ...availableReferralPartners,
                ]}
                selectedValue={tempFilters.referralPartner}
                onValueChange={(itemValue) =>
                  setTempFilters((prev) => ({
                    ...prev,
                    referralPartner: itemValue as string,
                  }))
                }
              />

              <View style={styles.modalButtons}>
                <Button
                  title="Reset All"
                  variant="outline"
                  onPress={handleResetFilters}
                  style={{ flex: 1 }}
                />
                <Button
                  title="Apply Filters"
                  onPress={handleApplyFilters}
                  style={{ flex: 1 }}
                />
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomerMappingScreen;
