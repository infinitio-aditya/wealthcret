import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OrganizationRequestsScreen from '../../screens/admin/orgRequests/OrganizationRequestsScreen';
import OrganizationRequestDetailsScreen from '../../screens/admin/orgRequests/OrganizationRequestDetailsScreen';

export type OrgRequestsStackParamList = {
  OrganizationRequests: undefined;
  OrganizationRequestDetails: {
    requestId: string;
  };
};

const Stack = createStackNavigator<OrgRequestsStackParamList>();

const OrgRequestsStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="OrganizationRequests"
        component={OrganizationRequestsScreen}
      />
      <Stack.Screen
        name="OrganizationRequestDetails"
        component={OrganizationRequestDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export default OrgRequestsStackNavigator;
