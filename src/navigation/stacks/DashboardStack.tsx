import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../../screens/dashboard/DashboardScreen';
import NotificationsScreen from '../../screens/NotificationsScreen';
import NewsListScreen from '../../screens/dashboard/NewsListScreen';
import NewsDetailsScreen from '../../screens/dashboard/NewsDetailsScreen';
import { DashboardStackParamList } from '../NavigationParams';

const Stack = createStackNavigator<DashboardStackParamList>();

const DashboardStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Dashboard" component={DashboardScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="NewsList" component={NewsListScreen} />
    <Stack.Screen name="NewsDetails" component={NewsDetailsScreen} />
  </Stack.Navigator>
);

export default DashboardStackNavigator;
