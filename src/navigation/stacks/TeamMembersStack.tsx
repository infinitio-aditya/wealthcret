import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TeamMembersScreen from '../../screens/people/teamMembers/TeamMembersScreen';
import { TeamMembersStackParamList } from '../NavigationParams';

const Stack = createStackNavigator<TeamMembersStackParamList>();

const TeamMembersStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TeamMembers" component={TeamMembersScreen} />
  </Stack.Navigator>
);

export default TeamMembersStackNavigator;
