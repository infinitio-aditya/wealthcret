import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '../app/contexts/AuthContext';
import LoginScreen from '../screens/preAuth/LoginScreen';
import MainDrawerNavigator from './drawer/MainDrawerNavigator';

import ForgotPasswordScreen from '../screens/preAuth/ForgotPasswordScreen';
import OTPVerificationScreen from '../screens/preAuth/OTPVerificationScreen';
import ResetPasswordScreen from '../screens/preAuth/ResetPasswordScreen';

export type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  OTPVerification: undefined;
  ResetPassword: undefined;
  Main: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    // Show a splash/loading screen while checking authentication
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen}
            options={{ animationEnabled: false }}
          />
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
        <Stack.Screen 
          name="Main" 
          component={MainDrawerNavigator}
          options={{ animationEnabled: false }}
        />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
