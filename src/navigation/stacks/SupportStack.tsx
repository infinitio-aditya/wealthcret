import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SupportScreen from '../../screens/backOffice/support/SupportScreen';
import TicketDetailsScreen from '../../screens/backOffice/support/TicketDetailsScreen';
import CreateTicketScreen from '../../screens/backOffice/support/CreateTicketScreen';
import ServiceRequestsScreen from '../../screens/admin/serviceResuests/ServiceRequestsScreen';
import { SupportStackParamList } from '../NavigationParams';

const Stack = createStackNavigator<SupportStackParamList>();

const SupportStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Support" component={SupportScreen} />
    <Stack.Screen name="TicketDetails" component={TicketDetailsScreen} />
    <Stack.Screen name="CreateTicket" component={CreateTicketScreen} />
    <Stack.Screen name="ServiceRequests" component={ServiceRequestsScreen} />
  </Stack.Navigator>
);

export default SupportStackNavigator;
