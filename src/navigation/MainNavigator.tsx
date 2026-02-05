// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createStackNavigator } from '@react-navigation/stack';

// // Screens
// import DashboardScreen from '../screens/dashboard/DashboardScreen';
// import ClientListScreen from '../screens/people/client/ClientListScreen';
// import ClientDetailsScreen from '../screens/people/client/ClientDetailsScreen';
// import TeamMembersScreen from '../screens/people/teamMembers/TeamMembersScreen';
// import MemberRolesScreen from '../screens/backOffice/memberRoles/MemberRolesScreen';
// import DocumentsScreen from '../screens/compliance/documents/DocumentsScreen';
// import MyDocumentsScreen from '../screens/compliance/documents/MyDocumentsScreen';
// import ClientDocumentsScreen from '../screens/people/client/ClientDocumentsScreen';
// import ProfileScreen from '../screens/profile/ProfileScreen';
// import SupportScreen from '../screens/backOffice/support/SupportScreen';
// import TicketDetailsScreen from '../screens/backOffice/support/TicketDetailsScreen';
// import RiskProfileScreen from '../screens/compliance/riskProfile/RiskProfileScreen';
// import RiskProfileDetailsScreen from '../screens/compliance/riskProfile/RiskProfileDetailsScreen';
// import ServiceRequestsScreen from '../screens/admin/serviceResuests/ServiceRequestsScreen';
// import AdminLicensingScreen from '../screens/admin/licensing/AdminLicensingScreen';
// import OrganizationRequestsScreen from '../screens/admin/orgRequests/OrganizationRequestsScreen';
// import PayoutScreen from '../screens/admin/payOut/PayoutScreen';
// import PayoutEditScreen from '../screens/admin/payOut/PayoutEditScreen';
// import BulkUploadScreen from '../screens/backOffice/bulkUpload/BulkUploadScreen';
// import OrganizationEditScreen from '../screens/admin/orgRequests/OrganizationEditScreen';
// import NotificationsScreen from '../screens/NotificationsScreen';
// import InviteScreen from '../screens/admin/invite/InviteScreen';
// import BillingScreen from '../screens/admin/payOut/BillingScreen';
// import SettingsScreen from '../screens/profile/SettingsScreen';
// import BackofficeLicensingScreen from '../screens/backOffice/licensing/BackofficeLicensingScreen';
// import CustomerMappingScreen from '../screens/backOffice/customerMapping/CustomerMappingScreen';
// import PrivacyPolicyScreen from '../screens/otherScreens/PrivacyPolicyScreen';
// import TermsAndConditionsScreen from '../screens/otherScreens/TermsAndConditionsScreen';
// import FAQScreen from '../screens/otherScreens/FAQScreen';
// import FeedbackScreen from '../screens/otherScreens/FeedbackScreen';
// import CreateTicketScreen from '../screens/backOffice/support/CreateTicketScreen';
// import ThemeSelectionScreen from '../screens/ThemeSelectionScreen';

// // Types
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import CustomDrawerContent from './CustomDrawerContent';
// import { useTheme } from '../hooks/useTheme';
// import Icon from 'react-native-vector-icons/Ionicons';

// // Types
// import { useSelector } from 'react-redux';
// import { RootState } from '../store';
// import { TouchableOpacity, View } from 'react-native';
// import ContactSupportScreen from '@screens/otherScreens/ContactSupportScreen';
// import {
//   AdminLicensingStackParamList,
//   ClientStackParamList,
//   DashboardStackParamList,
//   DocumentStackParamList,
//   MainDrawerParamList,
//   MainTabParamList,
//   PayoutStackParamList,
//   RiskProfileStackParamList,
//   SupportStackParamList,
//   TeamMembersStackParamList,
// } from './NavigationParams';

// const Tab = createBottomTabNavigator<MainTabParamList>();
// const Drawer = createDrawerNavigator<MainDrawerParamList>();
// const DashboardStack = createStackNavigator<DashboardStackParamList>();
// const ClientStack = createStackNavigator<ClientStackParamList>();
// const SupportStack = createStackNavigator<SupportStackParamList>();
// const DocumentStack = createStackNavigator<DocumentStackParamList>();
// const AdminLicensingStack =
//   createStackNavigator<AdminLicensingStackParamList>();
// const PayoutStack = createStackNavigator<PayoutStackParamList>();
// const RiskProfileStack = createStackNavigator<RiskProfileStackParamList>();
// const TeamMembersStack = createStackNavigator<TeamMembersStackParamList>();

// const DashboardStackNavigator = () => (
//   <DashboardStack.Navigator screenOptions={{ headerShown: false }}>
//     <DashboardStack.Screen name="Dashboard" component={DashboardScreen} />
//     <DashboardStack.Screen
//       name="Notifications"
//       component={NotificationsScreen}
//     />
//   </DashboardStack.Navigator>
// );

// const ClientStackNavigator = () => (
//   <ClientStack.Navigator screenOptions={{ headerShown: false }}>
//     <ClientStack.Screen name="ClientList" component={ClientListScreen} />
//     <ClientStack.Screen name="ClientDetails" component={ClientDetailsScreen} />
//   </ClientStack.Navigator>
// );

// const SupportStackNavigator = () => (
//   <SupportStack.Navigator screenOptions={{ headerShown: false }}>
//     <SupportStack.Screen name="Support" component={SupportScreen} />
//     <SupportStack.Screen name="TicketDetails" component={TicketDetailsScreen} />
//     <SupportStack.Screen name="CreateTicket" component={CreateTicketScreen} />
//     <SupportStack.Screen
//       name="ServiceRequests"
//       component={ServiceRequestsScreen}
//     />
//   </SupportStack.Navigator>
// );

// const RiskProfileStackNavigator = () => (
//   <RiskProfileStack.Navigator screenOptions={{ headerShown: false }}>
//     <RiskProfileStack.Screen name="RiskProfile" component={RiskProfileScreen} />
//     <RiskProfileStack.Screen
//       name="RiskProfileDetails"
//       component={RiskProfileDetailsScreen}
//     />
//   </RiskProfileStack.Navigator>
// );

// const DocumentStackNavigator = () => (
//   <DocumentStack.Navigator screenOptions={{ headerShown: false }}>
//     <DocumentStack.Screen name="Documents" component={DocumentsScreen} />
//     <DocumentStack.Screen name="MyDocuments" component={MyDocumentsScreen} />
//   </DocumentStack.Navigator>
// );

// const AdminLicensingStackNavigator = () => (
//   <AdminLicensingStack.Navigator screenOptions={{ headerShown: false }}>
//     <AdminLicensingStack.Screen
//       name="AdminLicensing"
//       component={AdminLicensingScreen}
//     />
//     <AdminLicensingStack.Screen
//       name="OrganizationEdit"
//       component={OrganizationEditScreen}
//     />
//   </AdminLicensingStack.Navigator>
// );

// const PayoutStackNavigator = () => (
//   <PayoutStack.Navigator screenOptions={{ headerShown: false }}>
//     <PayoutStack.Screen name="Payout" component={PayoutScreen} />
//     <PayoutStack.Screen name="PayoutEdit" component={PayoutEditScreen} />
//   </PayoutStack.Navigator>
// );

// const TeamMembersStackNavigator = () => (
//   <TeamMembersStack.Navigator screenOptions={{ headerShown: false }}>
//     <TeamMembersStack.Screen name="TeamMembers" component={TeamMembersScreen} />
//   </TeamMembersStack.Navigator>
// );

// const MainTabNavigator = () => {
//   const theme = useTheme();
//   const user = useSelector((state: RootState) => state.auth.user);
//   const role = user?.role || 'client';

//   const getTabConfig = (routeName: string) => {
//     switch (routeName) {
//       case 'HomeTab':
//         return { label: 'Home', icon: 'home-outline' };
//       case 'RoleTab1':
//         if (role === 'admin')
//           return { label: 'Requests', icon: 'business-outline' };
//         if (role === 'client')
//           return { label: 'Docs', icon: 'document-text-outline' };
//         return { label: 'Clients', icon: 'people-outline' }; // sp, rp
//       case 'RoleTab2':
//         if (role === 'admin' || role === 'referral_partner')
//           return { label: 'Payout', icon: 'cash-outline' };
//         return { label: 'Support', icon: 'help-buoy-outline' }; // sp, client
//       case 'AlertsTab':
//         return { label: 'Alerts', icon: 'notifications-outline' };
//       case 'ProfileTab':
//         return { label: 'Profile', icon: 'person-outline' };
//       default:
//         return { label: '', icon: '' };
//     }
//   };

//   const getTabComponent = (routeName: string) => {
//     switch (routeName) {
//       case 'HomeTab':
//         return DashboardStackNavigator;
//       case 'RoleTab1':
//         if (role === 'admin') return OrganizationRequestsScreen;
//         if (role === 'client') return DocumentStackNavigator;
//         return ClientStackNavigator;
//       case 'RoleTab2':
//         if (role === 'admin' || role === 'referral_partner')
//           return PayoutScreen;
//         return SupportStackNavigator;
//       case 'AlertsTab':
//         return NotificationsScreen;
//       case 'ProfileTab':
//         return ProfileScreen;
//       default:
//         return DashboardStackNavigator;
//     }
//   };

//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           const { icon } = getTabConfig(route.name);
//           return (
//             <View style={{ alignItems: 'center', width: '100%' }}>
//               {focused && (
//                 <View
//                   style={{
//                     position: 'absolute',
//                     top: -12,
//                     width: 32,
//                     height: 3,
//                     backgroundColor: theme.colors.primary,
//                     borderRadius: 2,
//                   }}
//                 />
//               )}
//               <Icon name={icon} size={24} color={color} />
//             </View>
//           );
//         },
//         tabBarLabel: getTabConfig(route.name).label,
//         tabBarActiveTintColor: theme.colors.primary,
//         tabBarInactiveTintColor: theme.colors.textSecondary,
//         tabBarLabelStyle: {
//           fontSize: 10,
//           fontWeight: '600',
//           marginBottom: 4,
//         },
//         tabBarStyle: {
//           backgroundColor: theme.colors.surface,
//           borderTopColor: theme.effects.cardBorder,
//           height: 65,
//           paddingTop: 10,
//         },
//         headerShown: false,
//       })}
//     >
//       <Tab.Screen name="HomeTab" component={getTabComponent('HomeTab')} />
//       <Tab.Screen name="RoleTab1" component={getTabComponent('RoleTab1')} />
//       <Tab.Screen name="RoleTab2" component={getTabComponent('RoleTab2')} />
//       <Tab.Screen name="AlertsTab" component={getTabComponent('AlertsTab')} />
//       <Tab.Screen name="ProfileTab" component={getTabComponent('ProfileTab')} />
//     </Tab.Navigator>
//   );
// };

// const MainNavigator = () => {
//   const theme = useTheme();

//   return (
//     <Drawer.Navigator
//       drawerContent={props => <CustomDrawerContent {...props} />}
//       screenOptions={({ navigation }) => ({
//         headerShown: true,
//         headerStyle: {
//           backgroundColor: theme.colors.background,
//           elevation: 0,
//           shadowOpacity: 0,
//           borderBottomWidth: 1,
//           borderBottomColor: theme.effects.cardBorder,
//         },
//         headerLeft: () => (
//           <TouchableOpacity
//             onPress={() => navigation.toggleDrawer()}
//             style={{ marginLeft: 16 }}
//           >
//             <Icon name="menu" size={24} color={theme.colors.text} />
//           </TouchableOpacity>
//         ),
//         headerTitleStyle: {
//           color: theme.colors.text,
//           fontWeight: 'bold',
//         },
//         drawerType: 'slide',
//       })}
//     >
//       <Drawer.Screen
//         name="MainTabs"
//         component={MainTabNavigator}
//         options={{ title: 'Wealthcret' }}
//       />
//       <Drawer.Screen
//         name="DashboardStack"
//         component={DashboardStackNavigator}
//         options={{ title: 'Dashboard' }}
//       />
//       <Drawer.Screen
//         name="ClientStack"
//         component={ClientStackNavigator}
//         options={{ title: 'Clients' }}
//       />
//       <Drawer.Screen
//         name="SupportStack"
//         component={SupportStackNavigator}
//         options={{ title: 'Support' }}
//       />
//       <Drawer.Screen
//         name="DocumentStack"
//         component={DocumentStackNavigator}
//         options={{ title: 'Documents' }}
//       />
//       <Drawer.Screen
//         name="TeamMembersStack"
//         component={TeamMembersStackNavigator}
//         options={{ title: 'Team Members' }}
//       />
//       <Drawer.Screen
//         name="RiskProfileStack"
//         component={RiskProfileStackNavigator}
//         options={{ title: 'Risk Profile' }}
//       />
//       <Drawer.Screen
//         name="BulkUploads"
//         component={BulkUploadScreen}
//         options={{ title: 'Bulk Upload' }}
//       />
//       <Drawer.Screen
//         name="CustomerMapping"
//         component={CustomerMappingScreen}
//         options={{ title: 'Mapping' }}
//       />
//       <Drawer.Screen
//         name="MemberRoles"
//         component={MemberRolesScreen}
//         options={{ title: 'Roles' }}
//       />
//       <Drawer.Screen
//         name="OrganizationRequests"
//         component={OrganizationRequestsScreen}
//         options={{ title: 'Requests' }}
//       />
//       <Drawer.Screen
//         name="AdminLicensingStack"
//         component={AdminLicensingStackNavigator}
//         options={{ title: 'Licensing' }}
//       />
//       <Drawer.Screen
//         name="PayoutStack"
//         component={PayoutStackNavigator}
//         options={{ title: 'Payouts' }}
//       />
//       <Drawer.Screen
//         name="Invite"
//         component={InviteScreen}
//         options={{ title: 'Invite' }}
//       />
//       <Drawer.Screen
//         name="ServiceRequests"
//         component={ServiceRequestsScreen}
//         options={{ title: 'Service Requests' }}
//       />
//       <Drawer.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{ title: 'My Profile' }}
//       />
//       <Drawer.Screen
//         name="Settings"
//         component={SettingsScreen}
//         options={{ title: 'Settings' }}
//       />
//       <Drawer.Screen
//         name="Billing"
//         component={BillingScreen}
//         options={{ title: 'Billing' }}
//       />
//       <Drawer.Screen
//         name="BackofficeLicensing"
//         component={BackofficeLicensingScreen}
//         options={{ title: 'Licensing' }}
//       />
//       <Drawer.Screen
//         name="PrivacyPolicy"
//         component={PrivacyPolicyScreen}
//         options={{ title: 'Privacy Policy' }}
//       />
//       <Drawer.Screen
//         name="TermsAndConditions"
//         component={TermsAndConditionsScreen}
//         options={{ title: 'Terms & Conditions' }}
//       />
//       <Drawer.Screen
//         name="FAQ"
//         component={FAQScreen}
//         options={{ title: 'FAQ' }}
//       />
//       <Drawer.Screen
//         name="Feedback"
//         component={FeedbackScreen}
//         options={{ title: 'Feedback' }}
//       />
//       <Drawer.Screen
//         name="ContactSupport"
//         component={ContactSupportScreen}
//         options={{ title: 'Contact Support' }}
//       />
//       <Drawer.Screen
//         name="ThemeSelection"
//         component={ThemeSelectionScreen}
//         options={{
//           title: 'Select Theme',
//           drawerItemStyle: { display: 'none' },
//         }}
//       />
//     </Drawer.Navigator>
//   );
// };

// export default MainNavigator;
