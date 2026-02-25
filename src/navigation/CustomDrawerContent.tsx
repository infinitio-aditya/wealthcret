import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { useSelector, useDispatch } from "react-redux";
import Icon from "react-native-vector-icons/Ionicons";
import { RootState } from "../store";
import { useTheme } from "../hooks/useTheme";
import { logout } from "../store/slices/authSlice";
import LinearGradient from "react-native-linear-gradient";

import { UserRole } from "../types";

interface SubMenuItem {
  label: string;
  path: string;
  roles: UserRole[];
}

interface MenuItem {
  icon: string;
  label: string;
  path?: string;
  roles: UserRole[];
  children?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
  {
    icon: "home-outline",
    label: "Dashboard",
    path: "DashboardStack",
    roles: ["admin", "service_provider", "referral_partner", "client"],
  },
  {
    icon: "shield-checkmark-outline",
    label: "Admin",
    roles: ["admin"],
    children: [
      { label: "Invite", path: "Invite", roles: ["admin"] },
      {
        label: "Organization Requests",
        path: "OrganizationRequests",
        roles: ["admin"],
      },
      { label: "Service Request", path: "ServiceRequests", roles: ["admin"] },
      { label: "Licensing", path: "AdminLicensingStack", roles: ["admin"] },
      { label: "Payout", path: "PayoutStack", roles: ["admin"] },
      { label: "Billing", path: "Billing", roles: ["admin"] },
    ],
  },
  {
    icon: "people-outline",
    label: "People",
    roles: ["service_provider", "referral_partner"],
    children: [
      {
        label: "Prospect/Client",
        path: "ClientStack",
        roles: ["service_provider", "referral_partner"],
      },
      {
        label: "Team Members",
        path: "TeamMembersStack",
        roles: ["service_provider", "referral_partner"],
      }, // Mapping web 'team' to RN MemberRoles or similar
    ],
  },
  {
    icon: "shield-outline",
    label: "Compliance",
    roles: ["service_provider", "referral_partner", "client"],
    children: [
      {
        label: "Risk Profile",
        path: "RiskProfileStack",
        roles: ["service_provider", "referral_partner", "client"],
      }, // Risk Profile is under SupportStack in RN
      {
        label: "Documents",
        path: "DocumentStack",
        roles: ["service_provider", "referral_partner"],
      },
    ],
  },
  {
    icon: "business-outline",
    label: "Backoffice",
    roles: ["service_provider", "referral_partner", "client"],
    children: [
      {
        label: "Support",
        path: "SupportStack",
        roles: ["service_provider", "referral_partner", "client"],
      },
      // { label: 'Bulk Upload', path: 'BulkUploads', roles: ['service_provider', 'referral_partner'] },
      {
        label: "Licensing",
        path: "BackofficeLicensing",
        roles: ["service_provider", "referral_partner"],
      },
      {
        label: "Member Roles",
        path: "MemberRoles",
        roles: ["service_provider", "referral_partner"],
      },
      {
        label: "Customer Mapping",
        path: "CustomerMapping",
        roles: ["service_provider", "referral_partner"],
      },
    ],
  },
  // {
  //     icon: 'document-text-outline',
  //     label: 'My Documents',
  //     path: 'DocumentStack', // MyDocuments is under DocumentStack
  //     roles: ['client'],
  // },
  // {
  //     icon: 'headset-outline',
  //     label: 'Support',
  //     path: 'SupportStack',
  //     roles: ['client'],
  // },
];

export const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const theme = useTheme();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const toggleMenu = (label: string) => {
    setExpandedMenus((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label],
    );
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const userRole = user?.role || "client";
  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole as UserRole),
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      padding: 24,
      borderBottomWidth: 1,
      borderBottomColor: theme.effects.cardBorder,
    },
    logoSection: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 24,
    },
    logoIconSquare: {
      width: 48,
      height: 48,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
    },
    logoUpperText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
    },
    logoLowerText: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    userInfo: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingTop: 12,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.colors.primary + "20",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.colors.primary + "40",
    },
    avatarText: {
      color: theme.colors.primary,
      fontSize: 16,
      fontWeight: "bold",
    },
    userName: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text,
    },
    userRoleTag: {
      fontSize: 11,
      color: theme.colors.textSecondary,
    },
    menuContainer: {
      padding: 12,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 12,
      marginBottom: 2,
    },
    menuLabel: {
      flex: 1,
      fontSize: 15,
      fontWeight: "500",
      color: theme.colors.text,
      marginLeft: 12,
    },
    submenu: {
      marginLeft: 16,
      paddingLeft: 24,
      borderLeftWidth: 1,
      borderLeftColor: theme.effects.cardBorder,
      marginVertical: 4,
    },
    submenuItem: {
      paddingVertical: 10,
    },
    submenuLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    activeSubmenuLabel: {
      color: theme.colors.primary,
      fontWeight: "600",
    },
    footer: {
      padding: 20,
      borderTopWidth: 1,
      borderTopColor: theme.effects.cardBorder,
    },
    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    logoutText: {
      fontSize: 15,
      color: theme.colors.error,
      fontWeight: "600",
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoSection}>
          <LinearGradient
            colors={[theme.colors.primary, theme.colors.primary + "80"]}
            style={styles.logoIconSquare}
          >
            <Text style={{ fontSize: 24, color: "#FFF", fontWeight: "bold" }}>
              W
            </Text>
          </LinearGradient>
          <View>
            <Text style={styles.logoUpperText}>Wealthcret</Text>
            <Text style={styles.logoLowerText}>Enterprise Platform</Text>
          </View>
        </View>

        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name?.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userRoleTag}>
              {user?.role?.replace("_", " ").toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.menuContainer}
      >
        {filteredMenuItems.map((item) => {
          const isExpanded = expandedMenus.includes(item.label);
          const hasChildren = item.children && item.children.length > 0;
          const filteredChildren =
            item.children?.filter((child) =>
              child.roles.includes(userRole as UserRole),
            ) || [];

          if (hasChildren && filteredChildren.length === 0) return null;

          return (
            <View key={item.label}>
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  isExpanded && hasChildren
                    ? { backgroundColor: theme.colors.primary + "10" }
                    : {},
                ]}
                onPress={() => {
                  if (hasChildren) {
                    toggleMenu(item.label);
                  } else if (item.path) {
                    props.navigation.navigate(item.path);
                  }
                }}
              >
                <Icon
                  name={item.icon}
                  size={22}
                  color={
                    isExpanded && hasChildren
                      ? theme.colors.primary
                      : theme.colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.menuLabel,
                    isExpanded && hasChildren
                      ? { color: theme.colors.primary }
                      : {},
                  ]}
                >
                  {item.label}
                </Text>
                {hasChildren && (
                  <Icon
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={
                      isExpanded
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
                  />
                )}
              </TouchableOpacity>

              {hasChildren && isExpanded && (
                <View style={styles.submenu}>
                  {filteredChildren.map((child) => (
                    <TouchableOpacity
                      key={child.path}
                      style={styles.submenuItem}
                      onPress={() => props.navigation.navigate(child.path)}
                    >
                      <Text style={styles.submenuLabel}>{child.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Icon name="log-out-outline" size={22} color={theme.colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CustomDrawerContent;
