import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { useTheme } from "../../../hooks/useTheme";
import { useAlert } from "../../../context/AlertContext";
import Card from "../../../components/ui/Card";
import Button from "../../../components/ui/Button";
import ServicesList from "../../../components/screens/ServicesList";
import DocumentsList from "../../../components/screens/DocumentsList";
import ApprovalDetails from "../../../components/screens/ApprovalDetails";
import CommissionEditor from "../../../components/screens/CommissionEditor";
import TitleHeader from "../../../components/screens/TitleHeader";
import PersonalInformation from "../../../components/screens/PersonalInformation";
import { OrganizationRequest } from "../../../types";

type RouteParams = {
  OrganizationRequestDetails: {
    requestId: string;
  };
};

interface ApprovalDetail {
  approvedBy?: string;
  approvalComments?: string;
  approvalDate?: string;
}

interface Service {
  id: string;
  name: string;
  segment?: string;
  aum?: number;
  commission?: number;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
}

const OrganizationRequestDetailsScreen = () => {
  const { showAlert } = useAlert();
  const theme = useTheme();
  const route =
    useRoute<RouteProp<RouteParams, "OrganizationRequestDetails">>();
  const [loading, setLoading] = useState(true);
  const [request, setRequest] = useState<OrganizationRequest | null>(null);
  const [approvalDetails, setApprovalDetails] = useState<ApprovalDetail | null>(
    null,
  );
  const [services, setServices] = useState<Service[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [defaultCommission, setDefaultCommission] = useState<number>(5);

  useEffect(() => {
    // Mock loading request data with additional details
    setTimeout(() => {
      setRequest({
        id: route.params?.requestId || "1",
        organizationName: "Global Wealth Partners",
        requestType: "service_provider",
        contactPerson: "Sarah Jenkins",
        email: "sarah.j@globalwealth.com",
        phone: "+1 (555) 012-3456",
        status: "pending",
        requestDate: "2023-10-20",
        description:
          "Expanding our operations to offer specialized portfolio management services for high-net-worth clients.",
      });

      // Mock services
      setServices([
        {
          id: "1",
          name: "Portfolio Management",
          segment: "HNI",
          aum: 50000000,
          commission: 5,
        },
        {
          id: "2",
          name: "Financial Planning",
          segment: "Affluent",
          aum: 25000000,
          commission: 3,
        },
        {
          id: "3",
          name: "Wealth Advisory",
          segment: "Ultra HNI",
          aum: 100000000,
          commission: 4,
        },
      ]);

      // Mock documents
      setDocuments([
        {
          id: "1",
          name: "Company_Registration.pdf",
          type: "Registration",
          uploadDate: "2023-10-15",
        },
        {
          id: "2",
          name: "Tax_Certificate.pdf",
          type: "Tax Document",
          uploadDate: "2023-10-16",
        },
        {
          id: "3",
          name: "Business_License.pdf",
          type: "License",
          uploadDate: "2023-10-17",
        },
      ]);

      // Set approval details if approved
      setApprovalDetails({
        approvedBy: undefined,
        approvalComments: undefined,
        approvalDate: undefined,
      });

      setDefaultCommission(5);
      setLoading(false);
    }, 500);
  }, [route.params?.requestId]);

  const handleApprove = () => {
    showAlert(
      "Approve Request",
      "Are you sure you want to approve this organization?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Approve",
          onPress: () => {
            setRequest((prev) =>
              prev ? { ...prev, status: "approved" } : null,
            );
            setApprovalDetails({
              approvedBy: "Admin User",
              approvalComments: "Approved on review",
              approvalDate: new Date().toISOString().split("T")[0],
            });
          },
        },
      ],
    );
  };

  const handleReject = () => {
    showAlert(
      "Reject Request",
      "Are you sure you want to reject this organization?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: () => {
            setRequest((prev) =>
              prev ? { ...prev, status: "rejected" } : null,
            );
            setApprovalDetails({
              approvedBy: "Admin User",
              approvalComments: "Rejected - does not meet criteria",
              approvalDate: new Date().toISOString().split("T")[0],
            });
          },
        },
      ],
    );
  };

  const handleCommissionSave = () => {
    showAlert("Success", "Default commission updated successfully");
  };

  const handleUpdateDefaultCommission = (value: number) => {
    setDefaultCommission(value);
    showAlert("Success", `Default commission updated to ${value}%`);
  };

  const handleSaveServiceOverride = (
    serviceId: string,
    payload: Partial<Service>,
  ) => {
    setServices((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, ...payload } : s)),
    );
    showAlert("Saved", `Saved override for service`);
  };

  const handleDocumentDelete = (doc: Document) => {
    showAlert("Delete Document", `Delete ${doc.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          setDocuments((prev) => prev.filter((d) => d.id !== doc.id)),
      },
    ]);
  };

  const handleDocumentPreview = (doc: Document) => {
    showAlert("Preview", `Open ${doc.name}`);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: 16,
    },
    header: {
      marginBottom: 20,
    },
    orgName: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 5,
    },
    statusBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    statusText: {
      fontSize: 12,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      marginBottom: 10,
      letterSpacing: 1,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.effects.cardBorder,
    },
    infoLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      fontWeight: "500",
    },
    infoValue: {
      fontSize: 14,
      fontWeight: "500",
      color: theme.colors.text,
      textAlign: "right",
      flex: 1,
      marginLeft: 20,
    },
    description: {
      fontSize: 15,
      color: theme.colors.text,
      lineHeight: 22,
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: theme.effects.cardBorder,
      backgroundColor: theme.colors.card,
    },
    buttonRow: {
      flexDirection: "row",
      gap: 12,
    },
    actionButton: {
      flex: 1,
    },
  });

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const statusColors = {
    pending: theme.colors.warning,
    approved: theme.colors.success,
    rejected: theme.colors.error,
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title/Header (with actions & chips) */}
        <TitleHeader
          user={{
            first_name: request?.contactPerson?.split(" ")[0],
            last_name: request?.contactPerson?.split(" ").slice(1).join(" "),
            mobile_number: request?.phone,
          }}
          selectedServices={services.map((s) => s.id)}
          systemServices={services.map((s) => ({ id: s.id, label: s.name }))}
          requestStatus={request?.status || "pending"}
          onApprove={handleApprove}
          onReject={handleReject}
        />

        {/* Organization Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Organization Details</Text>
          <Card>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Type</Text>
              <Text style={styles.infoValue}>
                {request?.requestType.replace(/_/g, " ").toUpperCase()}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Date Requested</Text>
              <Text style={styles.infoValue}>{request?.requestDate}</Text>
            </View>
          </Card>
        </View>

        {/* Personal Information */}
        <PersonalInformation
          user={{ email: request?.email, gender: undefined, dob: undefined }}
        />

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Card>
            <Text style={styles.description}>{request?.description}</Text>
          </Card>
        </View>

        {/* Services list */}
        <ServicesList services={services} title="Assigned Services" />

        {/* Commission editor (default + per-service overrides) */}
        <CommissionEditor
          services={services}
          selectedServices={services}
          userOrganizationDefaultCommission={defaultCommission}
          onUpdateDefaultCommission={handleUpdateDefaultCommission}
          onSaveServiceOverride={handleSaveServiceOverride}
        />

        {/* Reusable Documents Component */}
        <DocumentsList
          documents={documents}
          title="Documents"
          onDocumentPress={handleDocumentPreview}
          onDelete={handleDocumentDelete}
        />

        {/* Reusable Approval Details Component */}
        {request?.status !== "pending" && approvalDetails && (
          <ApprovalDetails details={approvalDetails} title="Approval Details" />
        )}

        {/* Spacer for footer button area */}
        <View style={{ height: request?.status === "pending" ? 100 : 40 }} />
      </ScrollView>

      {/* Action Buttons */}
      {request?.status === "pending" && (
        <View style={styles.footer}>
          <View style={styles.buttonRow}>
            <View style={styles.actionButton}>
              <Button title="Reject" onPress={handleReject} variant="outline" />
            </View>
            <View style={styles.actionButton}>
              <Button
                title="Approve"
                onPress={handleApprove}
                variant="primary"
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default OrganizationRequestDetailsScreen;
