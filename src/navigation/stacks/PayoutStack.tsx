import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PayoutScreen from '../../screens/admin/payOut/PayoutScreen';
import PayoutEditScreen from '../../screens/admin/payOut/PayoutEditScreen';
import { PayoutStackParamList } from '../NavigationParams';

const Stack = createStackNavigator<PayoutStackParamList>();

const PayoutStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Payout" component={PayoutScreen} />
    <Stack.Screen name="PayoutEdit" component={PayoutEditScreen} />
  </Stack.Navigator>
);

export default PayoutStackNavigator;
