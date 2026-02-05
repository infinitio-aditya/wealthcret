import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ClientListScreen from '../../screens/people/client/ClientListScreen';
import ClientDetailsScreen from '../../screens/people/client/ClientDetailsScreen';
import ClientDocumentsScreen from '../../screens/people/client/ClientDocumentsScreen';
import { ClientStackParamList } from '../NavigationParams';

const Stack = createStackNavigator<ClientStackParamList>();

const ClientStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ClientList" component={ClientListScreen} />
    <Stack.Screen name="ClientDetails" component={ClientDetailsScreen} />
  </Stack.Navigator>
);

export default ClientStackNavigator;
