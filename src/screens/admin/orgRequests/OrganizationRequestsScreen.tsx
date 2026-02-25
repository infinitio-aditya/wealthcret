import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../../hooks/useTheme";
import { useAlert } from "../../../context/AlertContext";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import Icon from "react-native-vector-icons/Ionicons";
import { OrganizationRequest } from "../../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { OrgRequestsStackParamList } from "../../../navigation/stacks/OrgRequestsStack";

const mockOrgRequests: OrganizationRequest[] = [
  {
    id: "1",
    organizationName: "Anderson Financial Group",
    requestType: "service_provider",
    contactPerson: "John Anderson",
    email: "john@andersonfinancial.com",
    phone: "+1 (555) 123-4567",
    status: "pending",
    requestDate: "2025-12-08",
    description: "Looking to provide comprehensive financial planning services",
  },
  {
    id: "2",
    organizationName: "Chen Wealth Partners",
    requestType: "referral_partner",
    contactPerson: "Emily Chen",
    email: "emily@chenwealthpartners.com",
    phone: "+1 (555) 234-5678",
    status: "pending",
    requestDate: "2025-12-07",
    description: "Interested in referring high-net-worth clients",
  },
  {
    id: "3",
    organizationName: "Martinez Holdings",
    requestType: "admin",
    contactPerson: "Robert Martinez",
    email: "robert@martinezholdings.com",
    phone: "+1 (555) 345-6789",
    status: "approved",
    requestDate: "2025-12-05",
    description: "Enterprise-level wealth management platform",
  },
];

const OrganizationRequestsScreen = () => {
  const { showAlert } = useAlert();
  const theme = useTheme();
  const navigation =
    useNavigation<StackNavigationProp<OrgRequestsStackParamList>>();
  const [requests, setRequests] = useState(mockOrgRequests);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const filteredRequests =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const handleViewDetails = (requestId: string) => {
    navigation.navigate("OrganizationRequestDetails", {
      requestId,
    });
  };

  const handleApprove = (id: string) => {
    showAlert(
      "Approve Request",
      "Are you sure you want to approve this organization request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: () => {
            setRequests((prev) =>
              prev.map((req) =>
                req.id === id ? { ...req, status: "approved" as const } : req,
              ),
            );
          },
        },
      ],
    );
  };

  const handleReject = (id: string) => {
    showAlert(
      "Reject Request",
      "Are you sure you want to reject this organization request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: () => {
            setRequests((prev) =>
              prev.map((req) =>
                req.id === id ? { ...req, status: "rejected" as const } : req,
              ),
            );
          },
        },
      ],
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return theme.colors.warning;
      case "approved":
        return theme.colors.success;
      case "rejected":
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "admin":
        return theme.colors.error;
      case "service_provider":
        return theme.colors.info;
      case "referral_partner":
        return theme.colors.success;
      default:
        return theme.colors.textSecondary;
    }
  };

  const renderRequest = ({ item }: { item: OrganizationRequest }) => {
    const styles = StyleSheet.create({
      requestCard: {
        marginBottom: 12,
      },
      requestHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
      },
      orgInfo: {
        flex: 1,
        marginRight: 12,
      },
      orgName: {
        fontSize: 18,
        fontWeight: "600",
        color: theme.colors.text,
        marginBottom: 4,
      },
      contactPerson: {
        fontSize: 14,
        color: theme.colors.textSecondary,
      },
      badges: {
        flexDirection: "row",
        gap: 8,
      },
      badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
      },
      badgeText: {
        fontSize: 10,
        fontWeight: "600",
        textTransform: "uppercase",
      },
      description: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginBottom: 12,
      },
      detailsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: theme.effects.cardBorder,
      },
      detailLabel: {
        fontSize: 12,
        color: theme.colors.textSecondary,
      },
      detailValue: {
        fontSize: 12,
        fontWeight: "500",
        color: theme.colors.text,
      },
      actionButtons: {
        flexDirection: "column",
        gap: 8,
        marginTop: 12,
      },
    });

    return (
      <Card style={styles.requestCard}>
        <View style={styles.requestHeader}>
          <View style={styles.orgInfo}>
            <Text style={styles.orgName}>{item.organizationName}</Text>
            <Text style={styles.contactPerson}>{item.contactPerson}</Text>
          </View>
          <View style={styles.badges}>
            <View
              style={[
                styles.badge,
                { backgroundColor: getStatusColor(item.status) + "20" },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: getStatusColor(item.status) },
                ]}
              >
                {item.status}
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                { backgroundColor: getTypeColor(item.requestType) + "20" },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: getTypeColor(item.requestType) },
                ]}
              >
                {item.requestType.replace("_", " ")}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.description}>{item.description}</Text>

        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Email</Text>
          <Text style={styles.detailValue}>{item.email}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Phone</Text>
          <Text style={styles.detailValue}>{item.phone}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailLabel}>Request Date</Text>
          <Text style={styles.detailValue}>
            {new Date(item.requestDate).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <View style={{ flex: 1 }}>
            <Button
              title="View Details"
              onPress={() => handleViewDetails(item.id)}
              variant="secondary"
              fullWidth
            />
          </View>
          {item.status === "pending" && (
            <>
              <View style={{ flex: 1 }}>
                <Button
                  title="Approve"
                  onPress={() => handleApprove(item.id)}
                  variant="primary"
                  fullWidth
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  title="Reject"
                  onPress={() => handleReject(item.id)}
                  variant="outline"
                  fullWidth
                />
              </View>
            </>
          )}
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
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 16,
    },
    filterContainer: {
      flexDirection: "row",
      gap: 8,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
    },
    filterButtonText: {
      fontSize: 14,
      fontWeight: "600",
    },
    listContainer: {
      padding: 16,
      paddingTop: 8,
    },
    statsContainer: {
      paddingBottom: 16,
      gap: 12,
    },
    statCard: {
      backgroundColor: theme.effects.cardBackground,
      borderRadius: 16,
      padding: 16,
      width: 110,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
    },
    statHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    statCount: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    statIcon: {
      width: 32,
      height: 32,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
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
  });

  const pendingCount = requests.filter((r) => r.status === "pending").length;
  const approvedCount = requests.filter((r) => r.status === "approved").length;
  const rejectedCount = requests.filter((r) => r.status === "rejected").length;

  const stats = [
    {
      label: "Pending",
      count: pendingCount,
      icon: "time-outline",
      color: theme.colors.warning,
    },
    {
      label: "Approved",
      count: approvedCount,
      icon: "checkmark-circle-outline",
      color: theme.colors.success,
    },
    {
      label: "Rejected",
      count: rejectedCount,
      icon: "close-circle-outline",
      color: theme.colors.error,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Organization Requests</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContainer}
        >
          {stats.map((stat, idx) => (
            <View key={idx} style={styles.statCard}>
              <View style={styles.statHeader}>
                <Text style={styles.statCount}>{stat.count}</Text>
                <View
                  style={[
                    styles.statIcon,
                    { backgroundColor: stat.color + "20" },
                  ]}
                >
                  <Icon name={stat.icon} size={18} color={stat.color} />
                </View>
              </View>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.filterContainer}>
          {["all", "pending", "approved", "rejected"].map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f as any)}
              style={[
                styles.filterButton,
                {
                  borderColor:
                    filter === f
                      ? theme.colors.primary
                      : theme.effects.cardBorder,
                  backgroundColor:
                    filter === f ? theme.colors.primary + "20" : "transparent",
                },
              ]}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  {
                    color:
                      filter === f ? theme.colors.primary : theme.colors.text,
                  },
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <FlatList
        data={filteredRequests}
        renderItem={renderRequest}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No organization requests found</Text>
          </View>
        }
      />
    </View>
  );
};

export default OrganizationRequestsScreen;
