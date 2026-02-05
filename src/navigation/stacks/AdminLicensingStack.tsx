import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminLicensingScreen from '../../screens/admin/licensing/AdminLicensingScreen';
import OrganizationEditScreen from '../../screens/admin/orgRequests/OrganizationEditScreen';
import { AdminLicensingStackParamList } from '../NavigationParams';

const Stack = createStackNavigator<AdminLicensingStackParamList>();

const AdminLicensingStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AdminLicensing" component={AdminLicensingScreen} />
    <Stack.Screen name="OrganizationEdit" component={OrganizationEditScreen} />
  </Stack.Navigator>
);

export default AdminLicensingStackNavigator;
