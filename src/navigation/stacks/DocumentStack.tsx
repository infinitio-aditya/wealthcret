import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DocumentsScreen from '../../screens/compliance/documents/DocumentsScreen';
import MyDocumentsScreen from '../../screens/compliance/documents/MyDocumentsScreen';
import { DocumentStackParamList } from '../NavigationParams';
import ClientDocumentsScreen from '@screens/people/client/ClientDocumentsScreen';

const Stack = createStackNavigator<DocumentStackParamList>();

const DocumentStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Documents" component={DocumentsScreen} />
    <Stack.Screen name="MyDocuments" component={MyDocumentsScreen} />
    <Stack.Screen name="ClientDocuments" component={ClientDocumentsScreen} />
  </Stack.Navigator>
);

export default DocumentStackNavigator;
