import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { useSelector } from "react-redux";
import { useTheme } from "../../../hooks/useTheme";
import Card from "../../../components/ui/Card";
import { RootState } from "../../../store";

const BillingScreen = () => {
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  // Directly use the user's license data attached to the organization
  const user = useSelector((state: RootState) => state.auth.user);
  const orgLicense = user?.license || {};
  const orgName = user?.organization || "Organization";

  const handleRefresh = async () => {
    setRefreshing(true);
    // In a fully live scenario, you might dispatch an action to refresh the user profile here
    // For now, we simulate a quick pull-to-refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const featureLicenses = orgLicense?.feature_licenses || [];

  // Calculate the grand total exactly as the reference project does
  const grandTotal =
    featureLicenses.reduce((sum: number, fl: any) => {
      if (fl.feature?.billing_type === 1) {
        return sum + (parseFloat(fl.lump_sum_amount) || 0);
      }
      if (fl.feature?.billing_type === 2) {
        return (
          sum + (parseFloat(fl.price_per_license) || 0) * (fl.max_licenses || 0)
        );
      }
      return sum;
    }, 0) || 0;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getStatusColor = (billingType: number) => {
    switch (billingType) {
      case 1:
        return theme.colors.success; // Lump Sum
      case 2:
        return theme.colors.primary; // Per License
      default:
        return theme.colors.textSecondary;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 16,
    },
    summaryCard: {
      marginBottom: 24,
      padding: 24,
      overflow: "hidden",
    },
    summaryTitle: {
      fontSize: 16,
      color: theme.colors.text,
      opacity: 0.9,
      marginBottom: 8,
    },
    orgName: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 16,
    },
    summaryAmount: {
      fontSize: 36,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: 16,
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    summaryLabel: {
      fontSize: 14,
      color: theme.colors.text,
      opacity: 0.8,
    },
    summaryValue: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 16,
    },
    featureItem: {
      marginBottom: 12,
    },
    itemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    itemInfo: {
      flex: 1,
      marginRight: 12,
    },
    itemDescription: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 4,
    },
    itemMetrics: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 2,
    },
    itemAmount: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    itemFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.effects.cardBorder,
    },
    statusBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "600",
      textTransform: "uppercase",
    },
    actionButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: theme.colors.primary + "20",
    },
    actionText: {
      fontSize: 12,
      fontWeight: "600",
      color: theme.colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <Text style={styles.orgName}>{orgName}</Text>

        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total License Cost</Text>
          <Text style={styles.summaryAmount}>{formatCurrency(grandTotal)}</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Start Date</Text>
            <Text style={styles.summaryValue}>
              {formatDate(orgLicense?.start_date)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>End Date</Text>
            <Text style={styles.summaryValue}>
              {formatDate(orgLicense?.end_date)}
            </Text>
          </View>
        </Card>

        {/* Feature/Billing Items */}
        <Text style={styles.sectionTitle}>Features</Text>
        {featureLicenses.length === 0 ? (
          <Text style={{ color: theme.colors.textSecondary }}>
            No feature licenses found for this organization.
          </Text>
        ) : (
          featureLicenses.map((item: any) => {
            const amount =
              item.feature?.billing_type === 1
                ? parseFloat(item.lump_sum_amount)
                : parseFloat(item.price_per_license) * item.max_licenses;

            return (
              <Card key={item.id} style={styles.featureItem}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemDescription}>
                      {item.feature?.label || "Unknown Feature"}
                    </Text>
                    <Text style={styles.itemMetrics}>
                      Allocated: {item.max_licenses}
                    </Text>
                    <Text style={styles.itemMetrics}>
                      Used: {item.used_licenses}
                    </Text>
                  </View>
                  <Text style={styles.itemAmount}>
                    {formatCurrency(amount || 0)}
                  </Text>
                </View>
                <View style={styles.itemFooter}>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          getStatusColor(item.feature?.billing_type) + "20",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(item.feature?.billing_type) },
                      ]}
                    >
                      {item.feature?.billing_type_display || "Unknown"}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default BillingScreen;
