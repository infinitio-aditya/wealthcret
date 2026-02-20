import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  TextInput,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "../../../hooks/useTheme";
import { useAlert } from "../../../context/AlertContext";
import ThemeDropdown from "../../../components/ui/ThemeDropdown";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import { Feature, Organization } from "../../../types";
import {
  mockOrganizations,
  mockFeatures,
  mockServiceProviders,
  mockReferralPartners,
} from "../../../utils/mockData";
import { AdminLicensingStackParamList } from "../../../navigation/NavigationParams";

type NavigationProp = StackNavigationProp<
  AdminLicensingStackParamList,
  "AdminLicensing"
>;

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const uniqueAdvisors = mockServiceProviders.map((sp) => sp.name);
const uniqueReferralPartners = mockReferralPartners.map((rp) => rp.name);

const AdminLicensingScreen = () => {
  const { showAlert } = useAlert();
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const [organizations, setOrganizations] =
    useState<Organization[]>(mockOrganizations);
  const [isModalVisible, setModalVisible] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    status: "active" as const,
    endDate: "",
    assignedSP: "",
    referralPartner: "",
    features: [] as string[],
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "active" | "expired">(
    "all",
  );

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch = org.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      (filterType === "active" ? org.isActive : !org.isActive);
    return matchesSearch && matchesFilter;
  });

  const handleEdit = (org: Organization) => {
    setEditingOrg(org);
    setFormData({
      name: org.name,
      status: org.isActive ? "active" : "expired",
      endDate: org.endDate,
      assignedSP: org.assignedSP || "",
      referralPartner: org.referralPartner || "",
      features: org.features.map((f) => f.id),
    });
    setModalVisible(true);
  };

  const handleCreate = () => {
    setEditingOrg(null);
    setFormData({
      name: "",
      status: "active",
      endDate: "",
      assignedSP: "",
      referralPartner: "",
      features: [],
    });
    setModalVisible(true);
  };

  const handleSave = () => {
    if (!formData.name) {
      showAlert("Error", "Please fill in all required fields.");
      return;
    }

    const orgFeatures = mockFeatures.filter((f) =>
      formData.features.includes(f.id),
    );

    if (editingOrg) {
      setOrganizations((prev) =>
        prev.map((org) =>
          org.id === editingOrg.id
            ? {
                ...org,
                name: formData.name,
                endDate: formData.endDate,
                assignedSP: formData.assignedSP,
                referralPartner: formData.referralPartner,
                isActive: formData.status === "active",
                features: orgFeatures,
              }
            : org,
        ),
      );
      showAlert("Success", "Organization updated successfully.");
    } else {
      const newOrg: Organization = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        type: "Enterprise",
        startDate: new Date().toISOString().split("T")[0],
        endDate: formData.endDate,
        isActive: formData.status === "active",
        assignedSP: formData.assignedSP,
        referralPartner: formData.referralPartner,
        features: orgFeatures,
      };
      setOrganizations((prev) => [...prev, newOrg]);
      showAlert("Success", "Organization created successfully.");
    }
    setModalVisible(false);
  };

  const toggleFeature = (featureId: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter((id) => id !== featureId)
        : [...prev.features, featureId],
    }));
  };

  const renderFilterButton = (
    label: string,
    type: "all" | "active" | "expired",
  ) => (
    <TouchableOpacity
      onPress={() => setFilterType(type)}
      style={[
        styles.filterOption,
        filterType === type && {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        },
      ]}
    >
      <Text
        style={[
          styles.filterOptionText,
          filterType === type && { color: "#fff" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Licensing Management</Text>
            <Text style={styles.headerSubtitle}>
              Manage organizations and their active licenses
            </Text>
          </View>
          <TouchableOpacity style={styles.createButton} onPress={handleCreate}>
            <Icon name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchInputWrapper,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Icon
              name="search-outline"
              size={20}
              color={theme.colors.textSecondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search organizations..."
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery !== "" && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Icon
                  name="close-circle"
                  size={18}
                  color={theme.colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[
              styles.filterButton,
              { backgroundColor: theme.colors.surface },
            ]}
            onPress={() => setIsFilterVisible(!isFilterVisible)}
          >
            <Icon
              name="options-outline"
              size={20}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        {isFilterVisible && (
          <View style={styles.filterOptionsContainer}>
            {renderFilterButton("All", "all")}
            {renderFilterButton("Active", "active")}
            {renderFilterButton("Expired", "expired")}
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.orgList}>
          {filteredOrgs.map((org) => (
            <Card key={org.id} style={styles.orgCard}>
              <View style={styles.orgCardHeader}>
                <View style={styles.orgInfo}>
                  <Text style={styles.orgCardTitle}>{org.name}</Text>
                  <View style={styles.statusBadgeWrapper}>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: org.isActive
                            ? theme.colors.success + "20"
                            : theme.colors.error + "20",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          {
                            color: org.isActive
                              ? theme.colors.success
                              : theme.colors.error,
                          },
                        ]}
                      >
                        {org.isActive ? "ACTIVE" : "EXPIRED"}
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => handleEdit(org)}
                >
                  <Icon
                    name="create-outline"
                    size={20}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.orgDetails}>
                <View style={styles.detailItem}>
                  <Icon
                    name="calendar-outline"
                    size={16}
                    color={theme.colors.textSecondary}
                  />
                  <Text style={styles.detailText}>Expires: {org.endDate}</Text>
                </View>
                {org.assignedSP && (
                  <View style={styles.detailItem}>
                    <Icon
                      name="person-outline"
                      size={16}
                      color={theme.colors.textSecondary}
                    />
                    <Text style={styles.detailText}>SP: {org.assignedSP}</Text>
                  </View>
                )}
                {org.referralPartner && (
                  <View style={styles.detailItem}>
                    <Icon
                      name="people-outline"
                      size={16}
                      color={theme.colors.textSecondary}
                    />
                    <Text style={styles.detailText}>
                      RP: {org.referralPartner}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.featureContainer}>
                <Text style={styles.featureLabel}>Active Features:</Text>
                <View style={styles.featureList}>
                  {org.features.slice(0, 3).map((feature) => (
                    <View
                      key={feature.id}
                      style={[
                        styles.featureChip,
                        { backgroundColor: theme.colors.primary + "15" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.featureChipText,
                          { color: theme.colors.primary },
                        ]}
                      >
                        {feature.name}
                      </Text>
                    </View>
                  ))}
                  {org.features.length > 3 && (
                    <Text style={styles.moreFeaturesText}>
                      +{org.features.length - 3} more
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.cardActions}>
                <Button
                  title="View Details"
                  variant="outline"
                  onPress={() =>
                    navigation.navigate("AdminLicensingEdit", { orgId: org.id })
                  }
                  style={styles.actionBtn}
                />
                <Button
                  title="Update License"
                  variant="primary"
                  onPress={() =>
                    navigation.navigate("AdminLicensingEdit", { orgId: org.id })
                  }
                  style={styles.actionBtn}
                />
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={styles.modal}
        useNativeDriver
        hideModalContentWhileAnimating
      >
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {editingOrg ? "Edit Organization" : "Create Organization"}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Icon name="close" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalForm}>
            <Input
              label="Organization Name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
              placeholder="Enter name"
            />

            <Input
              label="Expiry Date"
              value={formData.endDate}
              onChangeText={(text) =>
                setFormData({ ...formData, endDate: text })
              }
              placeholder="YYYY-MM-DD"
            />

            <View style={{ marginTop: 16 }}>
              <ThemeDropdown
                label="Assigned Service Provider"
                options={uniqueAdvisors.map((name) => ({
                  label: name,
                  value: name,
                }))}
                selectedValue={formData.assignedSP}
                onValueChange={(value) =>
                  setFormData({ ...formData, assignedSP: value })
                }
                placeholder="Select SP"
              />
            </View>

            <View style={{ marginTop: 16 }}>
              <ThemeDropdown
                label="Assigned Referral Partner"
                options={uniqueReferralPartners.map((name) => ({
                  label: name,
                  value: name,
                }))}
                selectedValue={formData.referralPartner}
                onValueChange={(value) =>
                  setFormData({ ...formData, referralPartner: value })
                }
                placeholder="Select Partner"
              />
            </View>

            <View style={styles.featureSelection}>
              <Text style={[styles.formLabel, { color: theme.colors.text }]}>
                Features
              </Text>
              <View style={styles.featureGrid}>
                {mockFeatures.map((feature) => (
                  <TouchableOpacity
                    key={feature.id}
                    style={[
                      styles.featureSelectItem,
                      formData.features.includes(feature.id) && {
                        backgroundColor: theme.colors.primary + "20",
                        borderColor: theme.colors.primary,
                      },
                    ]}
                    onPress={() => toggleFeature(feature.id)}
                  >
                    <Icon
                      name={
                        formData.features.includes(feature.id)
                          ? "checkbox"
                          : "square-outline"
                      }
                      size={20}
                      color={
                        formData.features.includes(feature.id)
                          ? theme.colors.primary
                          : theme.colors.textSecondary
                      }
                    />
                    <Text
                      style={[
                        styles.featureSelectText,
                        { color: theme.colors.text },
                        formData.features.includes(feature.id) && {
                          color: theme.colors.primary,
                          fontWeight: "600",
                        },
                      ]}
                    >
                      {feature.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => setModalVisible(false)}
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button
              title="Save"
              variant="primary"
              onPress={handleSave}
              style={{ flex: 1, marginLeft: 8 }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  createButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#6C63FF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  searchContainer: {
    flexDirection: "row",
    gap: 12,
  },
  searchInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  filterOptionsContainer: {
    flexDirection: "row",
    marginTop: 16,
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  filterOptionText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  scrollContent: {
    padding: 20,
    paddingTop: 10,
  },
  orgList: {
    gap: 16,
  },
  orgCard: {
    padding: 16,
  },
  orgCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  orgInfo: {
    flex: 1,
  },
  orgCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  statusBadgeWrapper: {
    flexDirection: "row",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  editButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F0EFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  orgDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
  },
  featureContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginBottom: 16,
  },
  featureLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#999",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  featureList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  featureChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  featureChipText: {
    fontSize: 12,
    fontWeight: "500",
  },
  moreFeaturesText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
  cardActions: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    flex: 1,
  },
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContent: {
    height: SCREEN_HEIGHT * 0.85,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
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
  },
  modalForm: {
    flex: 1,
  },
  formRow: {
    flexDirection: "row",
  },
  formLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 8,
  },
  featureSelection: {
    marginTop: 8,
    marginBottom: 20,
  },
  featureGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  featureSelectItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  featureSelectText: {
    fontSize: 14,
  },
  modalFooter: {
    flexDirection: "row",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
});

export default AdminLicensingScreen;
