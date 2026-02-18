import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useTheme } from "../../hooks/useTheme";
import Card from "../../components/ui/Card";

interface MenuItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  screen?: string;
}

const SettingsScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const user = useSelector((state: RootState) => state.auth.user);

  const menuItems: MenuItem[] = [
    // {
    //   id: "1",
    //   title: "Support Tickets",
    //   description: "View and manage support tickets",
    //   icon: "🎫",
    //   screen: "Support",
    // },
    // {
    //   id: "2",
    //   title: "Risk Profiles",
    //   description: "Client risk assessments",
    //   icon: "📊",
    //   screen: "RiskProfile",
    // },
    // {
    //   id: "3",
    //   title: "Notifications",
    //   description: "Manage your notifications",
    //   icon: "🔔",
    //   screen: "Notifications",
    // },
    // {
    //   id: "4",
    //   title: "Invite Users",
    //   description: "Send invitations to new users",
    //   icon: "✉️",
    //   screen: "Invite",
    // },
    // {
    //   id: "5",
    //   title: "Billing",
    //   description: "View billing and invoices",
    //   icon: "💳",
    //   screen: "Billing",
    // },
    // {
    //     id: '6',
    //     title: 'Settings',
    //     description: 'App settings and preferences',
    //     icon: '⚙️',
    //     screen: 'Settings',
    // },
    {
      id: "7",
      title: "Help & Support",
      description: "Get help and support",
      icon: "❓",
    },
    {
      id: "8",
      title: "About",
      description: "App version and information",
      icon: "ℹ️",
    },
  ];

  // Add Theme option for Admin and Service Provider
  if (user && (user.role === "admin" || user.role === "service_provider")) {
    menuItems.splice(5, 0, {
      id: "billing",
      title: "Billing",
      description: "View billing and invoices",
      icon: "💳",
      screen: "Billing",
    });
  }

  // Add Theme option for Admin and Service Provider
  if (user && (user.role === "admin" || user.role === "service_provider")) {
    menuItems.splice(5, 0, {
      id: "theme",
      title: "Appearance",
      description: "Customize app theme",
      icon: "🎨",
      screen: "ThemeSelection",
    });
  }

  const handleMenuPress = (item: MenuItem) => {
    if (item.screen) {
      // For Screens in Drawer or Stacks
      try {
        navigation.navigate(item.screen);
      } catch (e) {
        console.warn("Navigation error:", e);
      }
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
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 24,
    },
    menuItem: {
      marginBottom: 12,
    },
    menuContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    icon: {
      fontSize: 24,
    },
    menuInfo: {
      flex: 1,
    },
    menuTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.text,
      marginBottom: 2,
    },
    menuDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    arrow: {
      fontSize: 20,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>More</Text>
        <Text style={styles.subtitle}>Additional features and settings</Text>

        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleMenuPress(item)}
            activeOpacity={0.8}
          >
            <Card style={styles.menuItem}>
              <View style={styles.menuContent}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>{item.icon}</Text>
                </View>
                <View style={styles.menuInfo}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
