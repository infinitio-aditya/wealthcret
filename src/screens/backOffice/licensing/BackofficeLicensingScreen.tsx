import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import ThemeDropdown from "../../../components/ui/ThemeDropdown";
import ThemeBottomSheet from "../../../components/ui/ThemeBottomSheet";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Icon from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import { CustomUser } from "../../../types/backend/auth";
import {
  useGetOrgLicenseQuery,
  useCreateUserFeatureLicenseMutation,
  useUpdateUserFeatureLicenseMutation,
} from "../../../services/backend/licensingApi";
import { useGetOrganizationUsersQuery } from "../../../services/backend/authApi";
import { License } from "../../../types/backend/license";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const BackofficeLicensingScreen = () => {
  const theme = useTheme();

  const {
    data: orgLicense,
    isLoading: loadingLicense,
    isFetching: fetchingLicense,
    refetch: refetchLicense,
  } = useGetOrgLicenseQuery();

  const {
    data: teamMembersData,
    isLoading: loadingUsers,
    isFetching: fetchingUsers,
    refetch: refetchUsers,
  } = useGetOrganizationUsersQuery();

  const [createUserSubscription] = useCreateUserFeatureLicenseMutation();
  const [updateUserSubscription] = useUpdateUserFeatureLicenseMutation();

  const [isManageModalVisible, setManageModalVisible] = useState(false);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState<CustomUser | null>(null);

  const [filters, setFilters] = useState({
    licenses: [] as number[], // Using numeric IDs from API
    assignedSP: "all",
    referralPartner: "all",
  });
  const [tempFilters, setTempFilters] = useState({
    licenses: [] as number[],
    assignedSP: "all",
    referralPartner: "all",
  });

  const teamMembers = teamMembersData || [];
  const licenses = orgLicense?.feature_licenses || [];

  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const matchesLicense =
        filters.licenses.length === 0 ||
        filters.licenses.some((licenseId) =>
          member.my_subscriptions?.some(
            (sub) => sub.feature_license === licenseId && sub.is_active,
          ),
        );
      // Wait, CustomUser has mobile_number, email etc. but Advisor/Partner filtering usually depends on roles
      // For now we'll keep it simple as the backend structure for filtering by custom fields isn't clear here
      return matchesLicense;
    });
  }, [teamMembers, filters, licenses]);

  const handleOpenManageModal = (member: CustomUser) => {
    setSelectedMember(member);
    setManageModalVisible(true);
  };

  const handleToggleUserLicense = async (
    license: License,
    isActive: boolean,
  ) => {
    if (!selectedMember || !license.id) return;

    const existingSub = selectedMember.my_subscriptions?.find(
      (sub) => sub.feature_license === license.id,
    );

    try {
      if (existingSub) {
        await updateUserSubscription({
          ufs: { id: existingSub.id!, is_active: isActive },
          uuid: selectedMember.uuid || "",
        }).unwrap();
      } else {
        await createUserSubscription({
          ufs: { feature_license: license.id!, is_active: isActive },
          uuid: selectedMember.uuid || "",
        }).unwrap();
      }
      // Note: Data will be refetched by RTK Query due to tag invalidation if configured,
      // but authApi might not have the tags. In web-ui they reload.
      // We should ideally refetch users.
      refetchUsers();
    } catch (error) {
      console.error("Failed to update user license:", error);
    }
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    setFilterModalVisible(false);
  };

  const handleResetFilters = () => {
    const reset = {
      licenses: [] as number[],
      assignedSP: "all",
      referralPartner: "all",
    };
    setTempFilters(reset);
    setFilters(reset);
    setFilterModalVisible(false);
  };

  const toggleLicenseFilter = (licenseId: number) => {
    setTempFilters((prev) => {
      const licenses = prev.licenses.includes(licenseId)
        ? prev.licenses.filter((id) => id !== licenseId)
        : [...prev.licenses, licenseId];
      return { ...prev, licenses };
    });
  };

  const renderLicenseCard = (license: License) => {
    const percentage =
      license.max_licenses > 0
        ? Math.round((license.used_licenses / license.max_licenses) * 100)
        : 0;

    const usageColor =
      percentage >= 90
        ? theme.colors.error
        : percentage >= 70
          ? theme.colors.warning
          : theme.colors.success;

    return (
      <View key={license.id || 0} style={styles.statCard}>
        <View
          style={[
            styles.statIcon,
            { backgroundColor: theme.colors.primary + "20" },
          ]}
        >
          <Icon name="ribbon-outline" size={20} color={theme.colors.primary} />
        </View>
        <Text style={styles.statName} numberOfLines={1}>
          {license.feature.label}
        </Text>
        <View style={styles.statUsageRow}>
          <Text style={styles.statUsageLabel}>Used</Text>
          <Text style={[styles.statUsageValue, { color: usageColor }]}>
            {license.used_licenses || 0}/{license.max_licenses || 0}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${percentage}%`, backgroundColor: usageColor },
            ]}
          />
        </View>
        <Text style={[styles.percentageText, { color: usageColor }]}>
          {percentage}% utilized
        </Text>
      </View>
    );
  };

  const renderMember = ({ item }: { item: CustomUser }) => {
    const activeSubs = item.my_subscriptions?.filter((s) => s.is_active) || [];

    return (
      <Card style={styles.memberCard}>
        <View style={styles.memberHeader}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: theme.colors.primary + "20" },
            ]}
          >
            <Icon
              name="person-outline"
              size={20}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>
              {item.first_name} {item.last_name}
            </Text>
            <View style={styles.contactRow}>
              <Icon
                name="mail-outline"
                size={12}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.contactText} numberOfLines={1}>
                {item.email}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.manageButton}
            onPress={() => handleOpenManageModal(item)}
          >
            <Text style={styles.manageButtonText}>Manage</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.licensesSection}>
          <Text style={styles.licenseLabel}>
            Assigned Licenses ({activeSubs.length})
          </Text>
          <View style={styles.licenseBadges}>
            {activeSubs.map((sub) => {
              const lic = licenses.find((l) => l.id === sub.feature_license);
              return (
                <View
                  key={sub.id || 0}
                  style={[
                    styles.badge,
                    { backgroundColor: theme.colors.primary + "15" },
                  ]}
                >
                  <Text
                    style={[styles.badgeText, { color: theme.colors.primary }]}
                  >
                    {lic?.feature.label || "Unknown"}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      </Card>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    headerButtons: {
      flexDirection: "row",
      gap: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginHorizontal: 16,
      marginBottom: 12,
      marginTop: 8,
    },
    statsContainer: {
      paddingHorizontal: 16,
      paddingBottom: 20,
      gap: 12,
    },
    statCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      width: 160,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
    },
    statIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    statName: {
      fontSize: 14,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 8,
    },
    statUsageRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    statUsageLabel: {
      fontSize: 11,
      color: theme.colors.textSecondary,
    },
    statUsageValue: {
      fontSize: 11,
      fontWeight: "600",
    },
    progressBarContainer: {
      height: 6,
      backgroundColor: theme.colors.background,
      borderRadius: 3,
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      borderRadius: 3,
    },
    percentageText: {
      fontSize: 10,
      textAlign: "center",
      marginTop: 4,
      fontWeight: "500",
    },
    listContainer: {
      paddingBottom: 40,
    },
    memberCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
    },
    memberHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    memberInfo: {
      flex: 1,
      marginLeft: 12,
    },
    memberName: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },
    contactRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 2,
    },
    contactText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      maxWidth: 150,
    },
    manageButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    manageButtonText: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.primary,
    },
    licensesSection: {
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.effects.cardBorder,
    },
    licenseLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    licenseBadges: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 6,
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
    },
    badgeText: {
      fontSize: 10,
      fontWeight: "600",
    },
    modal: {
      margin: 0,
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
    licenseOption: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderRadius: 12,
      backgroundColor: theme.colors.background,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
    },
    licenseOptionText: {
      fontSize: 15,
      color: theme.colors.text,
      fontWeight: "500",
    },
    filterOption: {
      flexDirection: "row",
      alignItems: "center",
      padding: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      marginBottom: 8,
      gap: 12,
    },
    filterOptionSelected: {
      backgroundColor: theme.colors.primary + "10",
      borderColor: theme.colors.primary,
    },
    saveButton: {
      marginTop: 24,
    },
    pickerContainer: {
      borderWidth: 1,
      borderRadius: 12,
      height: 50,
      justifyContent: "center",
      marginTop: 8,
      marginBottom: 16,
    },
    modalButtons: {
      flexDirection: "row",
      gap: 12,
      marginTop: 24,
      marginBottom: 16,
    },
    filterLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
      marginTop: 16,
      marginBottom: 8,
    },
  });

  const isLoading = loadingLicense || loadingUsers;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={fetchingLicense || fetchingUsers}
            onRefresh={() => {
              refetchLicense();
              refetchUsers();
            }}
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Licensing</Text>
            <Text style={styles.subtitle}>Team member licenses</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
              <Icon name="filter" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {isLoading ? (
          <View style={{ padding: 40 }}>
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        ) : (
          <>
            <View>
              <Text style={styles.sectionTitle}>Available Licenses</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.statsContainer}
              >
                {licenses.map((l) => renderLicenseCard(l))}
              </ScrollView>
            </View>

            <View style={styles.listContainer}>
              <Text style={styles.sectionTitle}>Team Members</Text>
              {filteredMembers.map((member) => (
                <View key={member.id}>{renderMember({ item: member })}</View>
              ))}
              {filteredMembers.length === 0 && (
                <View style={{ padding: 40, alignItems: "center" }}>
                  <Icon
                    name="search-outline"
                    size={48}
                    color={theme.colors.textSecondary}
                  />
                  <Text
                    style={{ color: theme.colors.textSecondary, marginTop: 12 }}
                  >
                    No members found
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>

      {/* Management Modal */}
      <Modal
        isVisible={isManageModalVisible}
        onBackdropPress={() => setManageModalVisible(false)}
        style={styles.modal}
        backdropOpacity={0.5}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Manage Licenses</Text>
              <Text style={{ color: theme.colors.textSecondary, fontSize: 13 }}>
                {selectedMember?.first_name} {selectedMember?.last_name}
              </Text>
            </View>
            <TouchableOpacity onPress={() => setManageModalVisible(false)}>
              <Icon name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {licenses.map((license) => {
              const isSubscribed = selectedMember?.my_subscriptions?.some(
                (sub) => sub.feature_license === license.id && sub.is_active,
              );

              const isFeatureDisabled =
                !license.is_active || license.max_licenses === 0;

              return (
                <TouchableOpacity
                  key={license.id}
                  style={[
                    styles.licenseOption,
                    isSubscribed && {
                      borderColor: theme.colors.primary,
                    },
                    isFeatureDisabled && { opacity: 0.5 },
                  ]}
                  disabled={isFeatureDisabled}
                  onPress={() =>
                    handleToggleUserLicense(license, !isSubscribed)
                  }
                >
                  <Text style={styles.licenseOptionText}>
                    {license.feature.label}
                  </Text>
                  <Icon
                    name={isSubscribed ? "checkbox" : "square-outline"}
                    size={24}
                    color={
                      isSubscribed
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Button
            title="Done"
            onPress={() => {
              setManageModalVisible(false);
              refetchUsers(); // Refresh the list
            }}
            style={styles.saveButton}
          />
        </View>
      </Modal>

      <ThemeBottomSheet
        isVisible={isFilterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        title="Filter by License"
      >
        <Text style={styles.filterLabel}>Licenses</Text>
        <View style={{ gap: 8 }}>
          {licenses.map((license) => (
            <TouchableOpacity
              key={license.id || 0}
              style={[
                styles.filterOption,
                tempFilters.licenses.includes(license.id!) &&
                  styles.filterOptionSelected,
              ]}
              onPress={() => toggleLicenseFilter(license.id!)}
            >
              <Icon
                name={
                  tempFilters.licenses.includes(license.id!)
                    ? "checkmark-circle"
                    : "ellipse-outline"
                }
                size={20}
                color={
                  tempFilters.licenses.includes(license.id!)
                    ? theme.colors.primary
                    : theme.colors.textSecondary
                }
              />
              <Text
                style={{
                  color: theme.colors.text,
                  fontWeight: tempFilters.licenses.includes(license.id!)
                    ? "600"
                    : "400",
                }}
              >
                {license.feature.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

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
      </ThemeBottomSheet>
    </View>
  );
};

export default BackofficeLicensingScreen;
