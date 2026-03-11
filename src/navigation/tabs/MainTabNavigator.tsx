import React from "react";
import { Platform, SafeAreaView, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import { MainTabParamList } from "../NavigationParams";

// Stacks
import DashboardStackNavigator from "../stacks/DashboardStack";
import ClientStackNavigator from "../stacks/ClientStack";
import SupportStackNavigator from "../stacks/SupportStack";
import DocumentStackNavigator from "../stacks/DocumentStack";
import {
  ORG_TYPE_AD,
  ORG_TYPE_RP,
  ORG_TYPE_SP,
  ORG_TYPE_CL,
} from "../../types/backend/constants";

// Screens
import OrgRequestsStackNavigator from "../stacks/OrgRequestsStack";
import PayoutScreen from "../../screens/admin/payOut/PayoutScreen";
import NotificationsScreen from "../../screens/NotificationsScreen";
import ProfileScreen from "../../screens/profile/ProfileScreen";

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const role = user?.organization?.org_type;

  const getTabConfig = (routeName: string) => {
    switch (routeName) {
      case "HomeTab":
        return { label: "Home", icon: "home-outline" };
      case "RoleTab1":
        if (role?.toString() === ORG_TYPE_AD)
          return { label: "Requests", icon: "business-outline" };
        if (role?.toString() === ORG_TYPE_CL)
          return { label: "Docs", icon: "document-text-outline" };
        return { label: "Clients", icon: "people-outline" }; // sp, rp
      case "RoleTab2":
        if (
          role?.toString() === ORG_TYPE_AD ||
          role?.toString() === ORG_TYPE_RP
        )
          return { label: "Payout", icon: "cash-outline" };
        return { label: "Support", icon: "help-buoy-outline" }; // sp, client
      case "AlertsTab":
        return { label: "Alerts", icon: "notifications-outline" };
      case "ProfileTab":
        return { label: "Profile", icon: "person-outline" };
      default:
        return { label: "", icon: "" };
    }
  };

  const getTabComponent = (routeName: string) => {
    switch (routeName) {
      case "HomeTab":
        return DashboardStackNavigator;
      case "RoleTab1":
        if (role?.toString() === ORG_TYPE_AD) return OrgRequestsStackNavigator;
        if (role?.toString() === ORG_TYPE_CL) return DocumentStackNavigator;
        return ClientStackNavigator;
      case "RoleTab2":
        if (
          role?.toString() === ORG_TYPE_AD ||
          role?.toString() === ORG_TYPE_RP
        )
          return PayoutScreen;
        return SupportStackNavigator;
      case "AlertsTab":
        return NotificationsScreen;
      case "ProfileTab":
        return ProfileScreen;
      default:
        return DashboardStackNavigator;
    }
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const { icon } = getTabConfig(route.name);
          return (
            <View style={{ alignItems: "center", width: "100%" }}>
              {focused && (
                <View
                  style={{
                    position: "absolute",
                    top: -12,
                    width: 32,
                    height: 3,
                    backgroundColor: theme.colors.primary,
                    borderRadius: 2,
                  }}
                />
              )}
              <Icon name={icon} size={24} color={color} />
            </View>
          );
        },
        tabBarLabel: getTabConfig(route.name).label,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.effects.cardBorder,
          height: Platform.OS === "ios" ? 100 : 65,
          paddingTop: 10,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={getTabComponent("HomeTab")} />
      <Tab.Screen name="RoleTab1" component={getTabComponent("RoleTab1")} />
      <Tab.Screen name="RoleTab2" component={getTabComponent("RoleTab2")} />
      <Tab.Screen name="AlertsTab" component={getTabComponent("AlertsTab")} />
      <Tab.Screen name="ProfileTab" component={getTabComponent("ProfileTab")} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
