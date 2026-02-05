import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RiskProfileScreen from '../../screens/compliance/riskProfile/RiskProfileScreen';
import RiskProfileDetailsScreen from '../../screens/compliance/riskProfile/RiskProfileDetailsScreen';
import { RiskProfileStackParamList } from '../NavigationParams';

const Stack = createStackNavigator<RiskProfileStackParamList>();

const RiskProfileStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="RiskProfile" component={RiskProfileScreen} />
    <Stack.Screen
      name="RiskProfileDetails"
      component={RiskProfileDetailsScreen}
    />
  </Stack.Navigator>
);

export default RiskProfileStackNavigator;
