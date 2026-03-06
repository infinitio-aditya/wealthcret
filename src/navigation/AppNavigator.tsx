import React from "react";
import { View, ActivityIndicator } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RootState } from "../store";
import { setToken, setUser } from "../store/slices/authSlice";
import LoginScreen from "../screens/preAuth/LoginScreen";
import MainDrawerNavigator from "./drawer/MainDrawerNavigator";

import ForgotPasswordScreen from "../screens/preAuth/ForgotPasswordScreen";
import OTPVerificationScreen from "../screens/preAuth/OTPVerificationScreen";
import ResetPasswordScreen from "../screens/preAuth/ResetPasswordScreen";

export type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  OTPVerification: undefined;
  ResetPassword: undefined;
  Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const [isInitializing, setIsInitializing] = React.useState(true);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  React.useEffect(() => {
    const hydrateAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userStr = await AsyncStorage.getItem("user");

        if (token && userStr) {
          const user = JSON.parse(userStr);
          dispatch(setToken(token));
          dispatch(setUser(user));
        }
      } catch (error) {
        console.error("Re-hydration failed:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    hydrateAuth();
  }, [dispatch]);

  if (isInitializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen
            name="OTPVerification"
            component={OTPVerificationScreen}
          />
          <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        </>
      ) : (
        <Stack.Screen name="Main" component={MainDrawerNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
