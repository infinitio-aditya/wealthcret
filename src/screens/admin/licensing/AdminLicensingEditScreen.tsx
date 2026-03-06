import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useTheme } from "../../../hooks/useTheme";
import { useAlert } from "../../../context/AlertContext";
import Header from "../../../components/Header";
import Icon from "react-native-vector-icons/Ionicons";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import ThemeDropdown from "../../../components/ui/ThemeDropdown";
import { AdminLicensingStackParamList } from "../../../navigation/NavigationParams";
import { License, OrganizationLicense } from "../../../types/backend/license";
import {
  useGetOrgLicenseByIdQuery,
  useUpdateOrgLicenseMutation,
  useUpdateFeatureLicenseMutation,
  useCreateFeatureLicenseMutation,
} from "../../../services/backend/licensingApi";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

type RouteParams = {
  AdminLicensingEdit: { orgId: string };
};

type NavigationProp = StackNavigationProp<
  AdminLicensingStackParamList,
  "AdminLicensingEdit"
>;

const AdminLicensingEditScreen = () => {
  const { showAlert } = useAlert();
  const theme = useTheme();
  const route = useRoute<RouteProp<RouteParams, "AdminLicensingEdit">>();
  const navigation = useNavigation<NavigationProp>();
  const orgId = Number(route.params.orgId);

  const {
    data: orgLicense,
    isLoading,
    refetch,
  } = useGetOrgLicenseByIdQuery(orgId);
  const [updateOrg] = useUpdateOrgLicenseMutation();
  const [updateFeature] = useUpdateFeatureLicenseMutation();

  const [formData, setFormData] = useState({
    name: "",
    isActive: true,
    startDate: "",
    endDate: "",
  });

  const [featureChanges, setFeatureChanges] = useState<{
    [key: number]: boolean;
  }>({});

  useEffect(() => {
    if (orgLicense) {
      setFormData({
        name: orgLicense.organization_name || "",
        isActive: orgLicense.is_active || false,
        startDate: orgLicense.start_date || "",
        endDate: orgLicense.end_date || "",
      });
    }
  }, [orgLicense]);

  const handleSave = async () => {
    try {
      await updateOrg({
        id: orgId,
        is_active: formData.isActive,
        start_date: formData.startDate,
        end_date: formData.endDate,
      }).unwrap();

      showAlert("Success", "Organization updated successfully", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      showAlert("Error", "Failed to update organization");
    }
  };

  const toggleFeature = async (featureId: number, currentActive: boolean) => {
    try {
      await updateFeature({
        id: featureId,
        organization_license: orgId,
        is_active: !currentActive,
      }).unwrap();
      refetch();
    } catch (error) {
      showAlert("Error", "Failed to toggle feature");
    }
  };

  const markFeatureChanged = (featureId: number) => {
    setFeatureChanges((prev) => ({
      ...prev,
      [featureId]: true,
    }));
  };

  const handleSaveFeature = async (feature: License) => {
    try {
      if (!feature.id) return;
      await updateFeature({
        id: feature.id,
        organization_license: orgId,
        max_licenses: feature.max_licenses,
        billing_type: feature.billing_type,
        lump_sum_amount: feature.lump_sum_amount,
      }).unwrap();

      setFeatureChanges((prev) => ({
        ...prev,
        [feature.id!]: false,
      }));
      showAlert("Success", "Feature license updated successfully");
      refetch();
    } catch (error) {
      showAlert("Error", "Failed to update feature license");
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
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.textSecondary,
      marginBottom: 8,
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
      backgroundColor: theme.colors.background,
      borderRadius: 8,
      paddingHorizontal: 12,
      height: 48,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
    },
    billingInfo: {
      backgroundColor: theme.effects.glassBackground,
      paddingHorizontal: 16,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      height: 46,
      justifyContent: "center",
    },
    billingText: {
      fontSize: 13,
      color: theme.colors.text,
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

  if (isLoading || !orgLicense) {
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
      <Header
        title="Edit Organization"
        subtitle={orgLicense.organization_name}
        showBack
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Organization Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Organization Details</Text>

          {/* Type Badge and Status */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Role</Text>
              <View
                style={[
                  styles.typeBadge,
                  { backgroundColor: theme.colors.info + "20" },
                ]}
              >
                <Text style={[styles.typeText, { color: theme.colors.info }]}>
                  Partner
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
            <TextInput
              style={styles.featureInput}
              placeholder="Enter organization name"
              value={formData.name}
              editable={false}
              selectTextOnFocus={false}
            />
          </View>

          {/* Dates */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>Start Date</Text>
              <TextInput
                style={styles.featureInput}
                placeholder="YYYY-MM-DD"
                value={formData.startDate}
                onChangeText={(text) =>
                  setFormData({ ...formData, startDate: text })
                }
              />
            </View>
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>End Date</Text>
              <TextInput
                style={styles.featureInput}
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
        {/* <View style={styles.section}>
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
        </View> */}

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

          {(orgLicense.feature_licenses || []).map((feature) => (
            <View key={feature.id} style={styles.featureItem}>
              <View style={styles.featureHeader}>
                <Text style={styles.featureName}>
                  {feature.feature?.label || feature.feature?.name}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    feature.id && toggleFeature(feature.id, !!feature.is_active)
                  }
                  style={[
                    styles.featureToggle,
                    {
                      backgroundColor: feature.is_active
                        ? theme.colors.success
                        : theme.colors.textSecondary + "40",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.featureToggleInner,
                      {
                        alignSelf: feature.is_active
                          ? "flex-end"
                          : "flex-start",
                      },
                    ]}
                  />
                </TouchableOpacity>
              </View>

              {feature.is_active && (
                <View style={styles.featureControls}>
                  <View style={styles.featureControlRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>Allocated Licenses</Text>
                      <TextInput
                        keyboardType="numeric"
                        value={feature.max_licenses.toString()}
                        onChangeText={(text) => {
                          if (!feature.id) return;
                          const val = parseInt(text) || 0;
                          feature.max_licenses = val;
                          markFeatureChanged(feature.id);
                        }}
                        style={styles.featureInput}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>Billing Type</Text>
                      <ThemeDropdown
                        options={[
                          { label: "Monthly", value: "1" },
                          { label: "Annually", value: "2" },
                        ]}
                        selectedValue={feature.billing_type?.toString() || "1"}
                        onValueChange={(value) => {
                          if (!feature.id) return;
                          feature.billing_type = parseInt(value);
                          markFeatureChanged(feature.id);
                        }}
                      />
                    </View>
                  </View>

                  <View style={styles.featureControlRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.infoLabel}>Amount ($)</Text>
                      <TextInput
                        keyboardType="decimal-pad"
                        value={feature.lump_sum_amount?.toString() || "0.00"}
                        onChangeText={(text) => {
                          if (!feature.id) return;
                          const val = parseFloat(text) || 0;
                          feature.lump_sum_amount = val;
                          markFeatureChanged(feature.id);
                        }}
                        style={styles.featureInput}
                      />
                    </View>
                    <View style={{ flex: 1, marginBottom: 16 }}>
                      <Text style={styles.infoLabel}>Used Licenses</Text>
                      <View style={styles.billingInfo}>
                        <Text style={[styles.billingText, { fontSize: 16 }]}>
                          {feature.used_licenses || 0}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ marginTop: 12, alignItems: "flex-end" }}>
                    <TouchableOpacity
                      disabled={feature.id ? !featureChanges[feature.id] : true}
                      onPress={() => handleSaveFeature(feature)}
                      style={{
                        opacity:
                          feature.id && featureChanges[feature.id] ? 1 : 0.5,
                      }}
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
