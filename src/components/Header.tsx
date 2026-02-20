import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { useTheme } from "../hooks/useTheme";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  rightElement,
}) => {
  const theme = useTheme();
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      backgroundColor: theme.colors.background,
      borderBottomWidth: 1,
      borderBottomColor: theme.effects.cardBorder,
    },
    leftContainer: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    backButton: {
      padding: 4,
      marginRight: 8,
    },
    titleContainer: {
      flex: 1,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    subtitle: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    rightContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
  });

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.rightContainer}>{rightElement}</View>
    </View>
  );
};

export default Header;
