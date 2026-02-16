import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { ProfileStackParamList } from "../NavigationParams";
import ProfileScreen from "@screens/profile/ProfileScreen";
import SettingsScreen from "@screens/profile/SettingsScreen";

const Stack = createStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
);

export default ProfileStackNavigator;
