import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../../hooks/useTheme";
import Card from "../../../components/ui/Card";
import LinearGradient from "react-native-linear-gradient";

interface BillingItem {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "overdue";
}

const mockBillingItems: BillingItem[] = [
  {
    id: "1",
    description: "Premium Portfolio Analytics - December 2025",
    amount: 49.99,
    date: "2025-12-01",
    status: "paid",
  },
  {
    id: "2",
    description: "Advanced Risk Assessment - December 2025",
    amount: 79.99,
    date: "2025-12-01",
    status: "paid",
  },
  {
    id: "3",
    description: "Multi-Currency Support - Annual",
    amount: 299.99,
    date: "2025-11-15",
    status: "paid",
  },
];

const BillingScreen = () => {
  const theme = useTheme();
  const [billingItems] = useState(mockBillingItems);

  const totalAmount = billingItems.reduce((sum, item) => sum + item.amount, 0);
  const paidAmount = billingItems
    .filter((item) => item.status === "paid")
    .reduce((sum, item) => sum + item.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return theme.colors.success;
      case "pending":
        return theme.colors.warning;
      case "overdue":
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
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
    summaryGradient: {
      padding: 24,
    },
    summaryTitle: {
      fontSize: 16,
      color: theme.colors.text,
      opacity: 0.9,
      marginBottom: 8,
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
      color: theme.colors.primary,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 16,
    },
    billingItem: {
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
    itemDate: {
      fontSize: 14,
      color: theme.colors.textSecondary,
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
    downloadButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: theme.colors.primary + "20",
    },
    downloadText: {
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
      >
        {/* Summary Card */}
        <Card style={styles.summaryCard}>
          {/* <LinearGradient
            colors={[theme.colors.background, theme.colors.background + "20"]}
            style={styles.summaryGradient}
          > */}
          <Text style={styles.summaryTitle}>Total Billing</Text>
          <Text style={styles.summaryAmount}>
            {formatCurrency(totalAmount)}
          </Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Paid</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(paidAmount)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pending</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(totalAmount - paidAmount)}
            </Text>
          </View>
          {/* </LinearGradient> */}
        </Card>

        {/* Billing Items */}
        <Text style={styles.sectionTitle}>Billing History</Text>
        {billingItems.map((item) => (
          <Card key={item.id} style={styles.billingItem}>
            <View style={styles.itemHeader}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <Text style={styles.itemDate}>
                  {new Date(item.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </View>
              <Text style={styles.itemAmount}>
                {formatCurrency(item.amount)}
              </Text>
            </View>
            <View style={styles.itemFooter}>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(item.status) + "20" },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    { color: getStatusColor(item.status) },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
              <TouchableOpacity style={styles.downloadButton}>
                <Text style={styles.downloadText}>Download Invoice</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

export default BillingScreen;
