import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../../hooks/useTheme";

interface User {
  email?: string;
  gender?: string | number;
  dob?: string;
}

interface Props {
  user?: User;
  title?: string;
}

const PersonalInformation: React.FC<Props> = ({ user = {}, title = "Personal Information" }) => {
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
    paper: {
      borderRadius: 12,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.effects.cardBorder,
      backgroundColor: theme.colors.card,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
    },
    label: {
      color: theme.colors.textSecondary,
      fontSize: 12,
    },
    value: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: "600",
    },
  });

  const formatDate = (d?: string) => {
    if (!d) return "-";
    try {
      const dt = new Date(d);
      return dt.toLocaleDateString();
    } catch (e) {
      return d;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.paper}>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email || '-'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>{user.gender === '1' || user.gender === 1 ? 'Male' : user.gender === '2' || user.gender === 2 ? 'Female' : '-'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date of Birth</Text>
          <Text style={styles.value}>{formatDate(user.dob)}</Text>
        </View>
      </View>
    </View>
  );
};

export default PersonalInformation;
