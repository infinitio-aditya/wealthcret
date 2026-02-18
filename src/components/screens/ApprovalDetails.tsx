import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import Card from "../ui/Card";

interface ApprovalDetail {
  approvedBy?: string;
  approvalComments?: string;
  approvalDate?: string;
}

interface ApprovalDetailsProps {
  details: ApprovalDetail;
  title?: string;
}

const ApprovalDetails: React.FC<ApprovalDetailsProps> = ({
  details,
  title = "Approval Details",
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      marginBottom: 10,
      letterSpacing: 1,
    },
    approvalRow: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.effects.cardBorder,
    },
    approvalRowLast: {
      borderBottomWidth: 0,
    },
    approvalLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginBottom: 4,
      fontWeight: "500",
    },
    approvalValue: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
      lineHeight: 20,
    },
  });

  const hasDetails = details.approvedBy || details.approvalDate;

  if (!hasDetails) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Card>
        {details.approvedBy && (
          <View style={styles.approvalRow}>
            <Text style={styles.approvalLabel}>Approved By</Text>
            <Text style={styles.approvalValue}>{details.approvedBy}</Text>
          </View>
        )}
        {details.approvalDate && (
          <View style={styles.approvalRow}>
            <Text style={styles.approvalLabel}>Date</Text>
            <Text style={styles.approvalValue}>{details.approvalDate}</Text>
          </View>
        )}
        {details.approvalComments && (
          <View style={[styles.approvalRow, styles.approvalRowLast]}>
            <Text style={styles.approvalLabel}>Comments</Text>
            <Text style={styles.approvalValue}>
              {details.approvalComments}
            </Text>
          </View>
        )}
      </Card>
    </View>
  );
};

export default ApprovalDetails;
