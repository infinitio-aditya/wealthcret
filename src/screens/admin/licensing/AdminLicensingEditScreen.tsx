import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  TextInput,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "../../../hooks/useTheme";
import Header from "../../../components/Header";
import Icon from "react-native-vector-icons/Ionicons";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import ThemeDropdown from "../../../components/ui/ThemeDropdown";
import { AdminLicensingStackParamList } from "../../../navigation/NavigationParams";
import {
  mockOrganizations,
  mockFeatures,
  mockServiceProviders,
  mockReferralPartners,
} from "../../../utils/mockData";
import { Feature, Organization } from "../../../types";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type RouteParams = {
  AdminLicensingEdit: { orgId: string };
};

type NavigationProp = StackNavigationProp<
  AdminLicensingStackParamList,
  "AdminLicensingEdit"
>;

const uniqueAdvisors = mockServiceProviders.map((sp) => sp.name);
const uniqueReferralPartners = mockReferralPartners.map((rp) => rp.name);

const AdminLicensingEditScreen = () => {
  const theme = useTheme();
  const route = useRoute<RouteProp<RouteParams, "AdminLicensingEdit">>();
  const navigation = useNavigation<NavigationProp>();

  const [organization, setOrganization] = useState<Organization | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "Enterprise",
    startDate: "",
    endDate: "",
    isActive: true,
    features: [] as Feature[],
    assignedSP: "all",
    referralPartner: "all",
  });

  const [expandedLicense, setExpandedLicense] = useState<string | null>(null);
  const [featureChanges, setFeatureChanges] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    loadOrganization();
  }, []);

  const loadOrganization = () => {
    const org = mockOrganizations.find((o) => o.id === route.params.orgId);
    if (org) {
      setOrganization(org);
      setFormData({
        name: org.name,
        type: org.type,
        startDate: org.startDate,
        endDate: org.endDate,
        isActive: org.isActive,
        features: [...org.features],
        assignedSP: org.assignedSP || "all",
        referralPartner: org.referralPartner || "all",
      });
    }
  };

  const handleSave = () => {
    if (!formData.name) {
      Alert.alert("Error", "Organization name is required");
      return;
    }

    Alert.alert("Success", "Organization updated successfully", [
      {
        text: "OK",
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);
  };

  const toggleFeature = (featureId: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((f) =>
        f.id === featureId ? { ...f, isActive: !f.isActive } : f,
      ),
    }));
    markFeatureChanged(featureId);
  };

  const updateFeatureAllocated = (featureId: string, count: string) => {
    const val = parseInt(count) || 0;
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((f) =>
        f.id === featureId ? { ...f, allocatedLicenses: val } : f,
      ),
    }));
    markFeatureChanged(featureId);
  };

  const updateFeatureAmount = (featureId: string, amount: string) => {
    const val = parseFloat(amount) || 0;
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((f) =>
        f.id === featureId ? { ...f, amount: val } : f,
      ),
    }));
    markFeatureChanged(featureId);
  };

  const updateFeatureBillingType = (featureId: string, billingType: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((f) =>
        f.id === featureId ? { ...f, billingType: billingType as any } : f,
      ),
    }));
    markFeatureChanged(featureId);
  };

  const markFeatureChanged = (featureId: string) => {
    setFeatureChanges((prev) => ({
      ...prev,
      [featureId]: true,
    }));
  };

  const handleSaveFeature = (featureId: string) => {
    Alert.alert("Success", "Feature license updated successfully", [
      {
        text: "OK",
        onPress: () => {
          setFeatureChanges((prev) => ({
            ...prev,
            [featureId]: false,
          }));
        },
      },
    ]);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Enterprise":
        return theme.colors.primary;
      case "Professional":
        return theme.colors.info;
      case "Standard":
        return theme.colors.success;
      default:
        return theme.colors.textSecondary;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: theme.effects.cardBorder,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    headerBack: {
      width: 40,
      height: 40,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
    },
    headerTitle: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    content: {
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 12,
    },
    card: {
      marginBottom: 12,
    },
    formGroup: {
      marginBottom: 16,
      gap: 8,
    },
    label: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
    },
    infoGrid: {
      flexDirection: "row",
      gap: 12,
      marginBottom: 12,
    },
    infoItem: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
    },
    infoLabel: {
      fontSize: 11,
      color: theme.colors.textSecondary,
      fontWeight: "600",
      marginBottom: 4,
      textTransform: "uppercase",
    },
    infoValue: {
      fontSize: 13,
      color: theme.colors.text,
      fontWeight: "600",
    },
    typeBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
      marginTop: 4,
    },
    typeText: {
      fontSize: 11,
      fontWeight: "600",
    },
    featureItem: {
      padding: 14,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
    },
    featureHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    featureName: {
      fontSize: 15,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    featureToggle: {
      width: 48,
      height: 28,
      borderRadius: 14,
      padding: 2,
      justifyContent: "center",
      alignItems: "center",
    },
    featureToggleInner: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "#FFF",
    },
    featureControls: {
      gap: 12,
      borderTopWidth: 1,
      borderTopColor: theme.effects.cardBorder,
      paddingTop: 12,
    },
    featureControlRow: {
      flexDirection: "row",
      gap: 12,
      alignItems: "flex-end",
    },
    featureInput: {
      flex: 1,
      height: 40,
      color: theme.colors.text,
    },
    billingInfo: {
      flex: 1,
      //   backgroundColor: theme.colors.background,
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      height: 40,
      justifyContent: "center",
    },
    billingText: {
      fontSize: 13,
      color: theme.colors.text,
      textTransform: "capitalize",
      fontWeight: "500",
    },
    statusToggle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 12,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
    },
    statusLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
    },
    toggleSwitch: {
      width: 48,
      height: 28,
      borderRadius: 14,
      padding: 2,
      justifyContent: "center",
      alignItems: "center",
    },
    toggleInner: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "#FFF",
    },
    buttonGroup: {
      flexDirection: "row",
      gap: 12,
      marginTop: 24,
      marginBottom: 20,
    },
    expandableContent: {
      maxHeight: SCREEN_HEIGHT,
    },
  });

  if (!organization) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: theme.colors.textSecondary }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Edit Organization" subtitle={organization.name} showBack />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Organization Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Organization Details</Text>

          {/* Type Badge and Status */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Type</Text>
              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: getTypeColor(formData.type) + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.typeText,
                    { color: getTypeColor(formData.type) },
                  ]}
                >
                  {formData.type}
                </Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Status</Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <Icon
                  name={formData.isActive ? "checkmark-circle" : "close-circle"}
                  size={16}
                  color={
                    formData.isActive
                      ? theme.colors.success
                      : theme.colors.error
                  }
                />
                <Text
                  style={[
                    styles.infoValue,
                    {
                      color: formData.isActive
                        ? theme.colors.success
                        : theme.colors.error,
                    },
                  ]}
                >
                  {formData.isActive ? "Active" : "Inactive"}
                </Text>
              </View>
            </View>
          </View>

          {/* Name Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Organization Name</Text>
            <Input
              placeholder="Enter organization name"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          {/* Dates */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Start Date</Text>
              <Input
                placeholder="YYYY-MM-DD"
                value={formData.startDate}
                onChangeText={(text) =>
                  setFormData({ ...formData, startDate: text })
                }
              />
            </View>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>End Date</Text>
              <Input
                placeholder="YYYY-MM-DD"
                value={formData.endDate}
                onChangeText={(text) =>
                  setFormData({ ...formData, endDate: text })
                }
              />
            </View>
          </View>

          {/* Active Status Toggle */}
          <View style={styles.statusToggle}>
            <Text style={styles.statusLabel}>Active Status</Text>
            <TouchableOpacity
              onPress={() =>
                setFormData({ ...formData, isActive: !formData.isActive })
              }
              style={[
                styles.toggleSwitch,
                {
                  backgroundColor: formData.isActive
                    ? theme.colors.success
                    : theme.colors.error,
                },
              ]}
            >
              <View
                style={[
                  styles.toggleInner,
                  {
                    alignSelf: formData.isActive ? "flex-end" : "flex-start",
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Service Provider & Referral Partner */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assignments</Text>

          <Card style={styles.card}>
            <ThemeDropdown
              label="Assigned Service Provider"
              options={[
                { label: "Select Advisor", value: "all" },
                ...uniqueAdvisors.map((ad) => ({ label: ad, value: ad })),
              ]}
              selectedValue={formData.assignedSP}
              onValueChange={(value) =>
                setFormData({ ...formData, assignedSP: value })
              }
            />
          </Card>

          <Card style={styles.card}>
            <ThemeDropdown
              label="Referral Partner"
              options={[
                { label: "Select Partner", value: "all" },
                ...uniqueReferralPartners.map((rp) => ({
                  label: rp,
                  value: rp,
                })),
              ]}
              selectedValue={formData.referralPartner}
              onValueChange={(value) =>
                setFormData({ ...formData, referralPartner: value })
              }
            />
          </Card>
        </View>

        {/* Feature Licenses Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feature Licenses</Text>
          <Text
            style={{
              fontSize: 13,
              color: theme.colors.textSecondary,
              marginBottom: 12,
            }}
          >
            Enable or disable features and set license allocations
          </Text>

          {formData.features.map((feature) => (
            <View key={feature.id} style={styles.featureItem}>
              <View style={styles.featureHeader}>
                <Text style={styles.featureName}>{feature.name}</Text>
                <TouchableOpacity
                  onPress={() => toggleFeature(feature.id)}
                  style={[
                    styles.featureToggle,
                    {
                      backgroundColor: feature.isActive
                        ? theme.colors.success
                        : theme.colors.textSecondary + "40",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.featureToggleInner,
                      {
                        alignSelf: feature.isActive ? "flex-end" : "flex-start",
                      },
                    ]}
                  />
                </TouchableOpacity>
              </View>

              {feature.isActive && (
                <View style={styles.featureControls}>
                  <View style={styles.featureControlRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>Allocated Licenses</Text>
                      <Input
                        keyboardType="numeric"
                        value={feature.allocatedLicenses.toString()}
                        onChangeText={(text) =>
                          updateFeatureAllocated(feature.id, text)
                        }
                        style={styles.featureInput}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>Billing Type</Text>
                      <ThemeDropdown
                        options={[
                          { label: "Monthly", value: "monthly" },
                          { label: "Annually", value: "annually" },
                        ]}
                        selectedValue={feature.billingType}
                        onValueChange={(value) =>
                          updateFeatureBillingType(feature.id, value)
                        }
                      />
                    </View>
                  </View>

                  <View style={styles.featureControlRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>Amount ($)</Text>
                      <Input
                        keyboardType="decimal-pad"
                        value={feature.amount?.toString() || "0.00"}
                        onChangeText={(text) =>
                          updateFeatureAmount(feature.id, text)
                        }
                        style={styles.featureInput}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>Used Licenses</Text>
                      <View style={styles.billingInfo}>
                        <Text style={styles.billingText}>
                          {feature.usedLicenses || 0}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ marginTop: 12, alignItems: "flex-end" }}>
                    <TouchableOpacity
                      disabled={!featureChanges[feature.id]}
                      onPress={() => handleSaveFeature(feature.id)}
                      style={{ opacity: featureChanges[feature.id] ? 1 : 0.5 }}
                    >
                      <View style={{ paddingHorizontal: 12 }}>
                        <Text
                          style={{
                            color: theme.colors.primary,
                            fontWeight: "600",
                            fontSize: 13,
                          }}
                        >
                          Save Changes
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <Button
            title="Cancel"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={{ flex: 1 }}
          />
          <Button
            title="Save Changes"
            onPress={handleSave}
            variant="primary"
            style={{ flex: 1 }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AdminLicensingEditScreen;
