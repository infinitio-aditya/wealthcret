import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../../hooks/useTheme";
import PersonIcon from "react-native-vector-icons/Ionicons";

interface User {
  first_name?: string;
  last_name?: string;
  mobile_number?: string;
}

interface SystemService {
  id: string;
  label: string;
}

interface TitleHeaderProps {
  user: User;
  selectedServices: string[]; // service ids
  systemServices: SystemService[];
  requestStatus: string;
  onApprove: () => void;
  onReject: () => void;
}

const TitleHeader: React.FC<TitleHeaderProps> = ({
  user,
  selectedServices,
  systemServices,
  requestStatus,
  onApprove,
  onReject,
}) => {
  const theme = useTheme();
  const styles = StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    paper: {
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      backgroundColor: theme.colors.card,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "lightgray",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },
    name: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
    },
    phone: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    actions: {
      marginLeft: "auto",
      flexDirection: "row",
      alignItems: "center",
    },
    actionBtn: {
      marginLeft: 8,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      backgroundColor: theme.effects.glassBackground,
    },
    chipRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginTop: 10,
      gap: 8,
    },
    chip: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 16,
      backgroundColor: theme.colors.primary,
      marginRight: 8,
    },
    chipText: {
      color: theme.colors.textOnPrimary,
      fontSize: 12,
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
  });

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

  const fullName =
    `${user.first_name || ""} ${user.last_name || ""}`.trim() || "-";

  return (
    <View style={styles.container}>
      <View style={styles.paper}>
        <View style={styles.row}>
          <View style={styles.avatar}>
            <PersonIcon name="person" size={28} color="#555" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.phone}>{user.mobile_number || "-"}</Text>
          </View>

          {/* <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: theme.colors.success },
              ]}
              onPress={onApprove}
            >
              <Text
                style={{ color: theme.colors.textOnPrimary, fontWeight: "600" }}
              >
                {requestStatus === "approved" ? "Complete" : "Approve"}
              </Text>
            </TouchableOpacity>

            {requestStatus !== "approved" && (
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  { backgroundColor: theme.colors.error },
                ]}
                onPress={onReject}
              >
                <Text
                  style={{
                    color: theme.colors.textOnPrimary,
                    fontWeight: "600",
                  }}
                >
                  Reject
                </Text>
              </TouchableOpacity>
            )}
          </View> */}
          <View
            style={[
              styles.badge,
              { backgroundColor: getStatusColor(requestStatus) + "20" },
            ]}
          >
            <Text
              style={[
                styles.badgeText,
                { color: getStatusColor(requestStatus) },
              ]}
            >
              {requestStatus}
            </Text>
          </View>
        </View>

        <View
          style={{
            height: 1,
            backgroundColor: theme.effects.cardBorder,
            marginTop: 12,
          }}
        />

        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 12 }}>
          {selectedServices.map((sid) => {
            const svc = systemServices.find((s) => s.id === sid);
            return (
              <View
                key={sid}
                style={[
                  styles.chip,
                  { backgroundColor: theme.colors.primary, marginBottom: 5 },
                ]}
              >
                <Text style={styles.chipText}>{svc?.label || sid}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default TitleHeader;
