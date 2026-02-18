import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";

interface CommissionDisplayProps {
  defaultCommission: number;
  title?: string;
  showLabel?: boolean;
}

const CommissionDisplay: React.FC<CommissionDisplayProps> = ({
  defaultCommission,
  title = "Default Commission",
  showLabel = true,
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
    commissionInput: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: theme.colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
    },
    commissionInputLabel: {
      flex: 1,
      fontSize: 14,
      color: theme.colors.text,
      fontWeight: "500",
    },
    commissionInputValue: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.primary,
      minWidth: 50,
      textAlign: "right",
    },
  });

  return (
    <View style={styles.container}>
      {showLabel && <Text style={styles.title}>{title}</Text>}
      <View style={styles.commissionInput}>
        <Text style={styles.commissionInputLabel}>{title}</Text>
        <Text style={styles.commissionInputValue}>
          {defaultCommission}%
        </Text>
      </View>
    </View>
  );
};

export default CommissionDisplay;
