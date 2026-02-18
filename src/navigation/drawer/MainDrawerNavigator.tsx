import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../hooks/useTheme';
import CustomDrawerContent from '../CustomDrawerContent';
import { MainDrawerParamList } from '../NavigationParams';

// Navigators
import MainTabNavigator from '../tabs/MainTabNavigator';
import DashboardStackNavigator from '../stacks/DashboardStack';
import ClientStackNavigator from '../stacks/ClientStack';
import SupportStackNavigator from '../stacks/SupportStack';
import DocumentStackNavigator from '../stacks/DocumentStack';
import TeamMembersStackNavigator from '../stacks/TeamMembersStack';
import RiskProfileStackNavigator from '../stacks/RiskProfileStack';
import AdminLicensingStackNavigator from '../stacks/AdminLicensingStack';
import PayoutStackNavigator from '../stacks/PayoutStack';
import OrgRequestsStackNavigator from '../stacks/OrgRequestsStack';

// Screens
import BulkUploadScreen from '../../screens/backOffice/bulkUpload/BulkUploadScreen';
import CustomerMappingScreen from '../../screens/backOffice/customerMapping/CustomerMappingScreen';
import MemberRolesScreen from '../../screens/backOffice/memberRoles/MemberRolesScreen';
import InviteScreen from '../../screens/admin/invite/InviteScreen';
import ServiceRequestsScreen from '../../screens/admin/serviceResuests/ServiceRequestsScreen';
import ProfileScreen from '../../screens/profile/ProfileScreen';
import SettingsScreen from '../../screens/profile/SettingsScreen';
import BillingScreen from '../../screens/admin/payOut/BillingScreen';
import BackofficeLicensingScreen from '../../screens/backOffice/licensing/BackofficeLicensingScreen';
import PrivacyPolicyScreen from '../../screens/otherScreens/PrivacyPolicyScreen';
import TermsAndConditionsScreen from '../../screens/otherScreens/TermsAndConditionsScreen';
import FAQScreen from '../../screens/otherScreens/FAQScreen';
import FeedbackScreen from '../../screens/otherScreens/FeedbackScreen';
import ContactSupportScreen from '../../screens/otherScreens/ContactSupportScreen';
import ThemeSelectionScreen from '../../screens/ThemeSelectionScreen';

const Drawer = createDrawerNavigator<MainDrawerParamList>();

const MainDrawerNavigator = () => {
  const theme = useTheme();

  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={({ navigation }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: theme.effects.cardBorder,
        },
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={{ marginLeft: 16 }}
          >
            <Icon name="menu" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        ),
        headerTitleStyle: {
          color: theme.colors.text,
          fontWeight: 'bold',
        },
        drawerType: 'slide',
      })}
    >
      <Drawer.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ title: 'Wealthcret' }}
      />
      <Drawer.Screen
        name="DashboardStack"
        component={DashboardStackNavigator}
        options={{ title: 'Dashboard' }}
      />
      <Drawer.Screen
        name="ClientStack"
        component={ClientStackNavigator}
        options={{ title: 'Clients' }}
      />
      <Drawer.Screen
        name="SupportStack"
        component={SupportStackNavigator}
        options={{ title: 'Support' }}
      />
      <Drawer.Screen
        name="DocumentStack"
        component={DocumentStackNavigator}
        options={{ title: 'Documents' }}
      />
      <Drawer.Screen
        name="TeamMembersStack"
        component={TeamMembersStackNavigator}
        options={{ title: 'Team Members' }}
      />
      <Drawer.Screen
        name="RiskProfileStack"
        component={RiskProfileStackNavigator}
        options={{ title: 'Risk Profile' }}
      />
      <Drawer.Screen
        name="BulkUploads"
        component={BulkUploadScreen}
        options={{ title: 'Bulk Upload' }}
      />
      <Drawer.Screen
        name="CustomerMapping"
        component={CustomerMappingScreen}
        options={{ title: 'Mapping' }}
      />
      <Drawer.Screen
        name="MemberRoles"
        component={MemberRolesScreen}
        options={{ title: 'Roles' }}
      />
      <Drawer.Screen
        name="OrganizationRequests"
        component={OrgRequestsStackNavigator}
        options={{ title: 'Requests' }}
      />
      <Drawer.Screen
        name="AdminLicensingStack"
        component={AdminLicensingStackNavigator}
        options={{ title: 'Licensing' }}
      />
      <Drawer.Screen
        name="PayoutStack"
        component={PayoutStackNavigator}
        options={{ title: 'Payouts' }}
      />
      <Drawer.Screen
        name="Invite"
        component={InviteScreen}
        options={{ title: 'Invite' }}
      />
      <Drawer.Screen
        name="ServiceRequests"
        component={ServiceRequestsScreen}
        options={{ title: 'Service Requests' }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'My Profile' }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Drawer.Screen
        name="Billing"
        component={BillingScreen}
        options={{ title: 'Billing' }}
      />
      <Drawer.Screen
        name="BackofficeLicensing"
        component={BackofficeLicensingScreen}
        options={{ title: 'Licensing' }}
      />
      <Drawer.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{ title: 'Privacy Policy' }}
      />
      <Drawer.Screen
        name="TermsAndConditions"
        component={TermsAndConditionsScreen}
        options={{ title: 'Terms & Conditions' }}
      />
      <Drawer.Screen
        name="FAQ"
        component={FAQScreen}
        options={{ title: 'FAQ' }}
      />
      <Drawer.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={{ title: 'Feedback' }}
      />
      <Drawer.Screen
        name="ContactSupport"
        component={ContactSupportScreen}
        options={{ title: 'Contact Support' }}
      />
      <Drawer.Screen
        name="ThemeSelection"
        component={ThemeSelectionScreen}
        options={{
          title: 'Select Theme',
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer.Navigator>
  );
};

export default MainDrawerNavigator;
