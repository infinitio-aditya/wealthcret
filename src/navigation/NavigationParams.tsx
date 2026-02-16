export type MainTabParamList = {
  HomeTab: undefined;
  RoleTab1: undefined;
  RoleTab2: undefined;
  AlertsTab: undefined;
  ProfileTab: undefined;
};

export type DashboardStackParamList = {
  Dashboard: undefined;
  Notifications: undefined;
  NewsList: undefined;
  NewsDetails: { newsId: string };
};

export type ClientStackParamList = {
  ClientList: undefined;
  ClientDetails: { clientId: string };
};

export type SupportStackParamList = {
  Support: undefined;
  TicketDetails: { ticketId: string };
  CreateTicket: undefined;
  RiskProfile: undefined;
  RiskProfileDetails: { profileId: string };
  ServiceRequests: undefined;
};

export type DocumentStackParamList = {
  Documents: undefined;
  MyDocuments: undefined;
  ClientDocuments: { clientId: string };
};

export type AdminLicensingStackParamList = {
  AdminLicensing: undefined;
  OrganizationEdit: { orgId: string };
};

export type PayoutStackParamList = {
  Payout: undefined;
  PayoutEdit: { payoutId: string };
};

export type RiskProfileStackParamList = {
  RiskProfile: undefined;
  RiskProfileDetails: { profileId: string };
};

export type TeamMembersStackParamList = {
  TeamMembers: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
};

export type MainDrawerParamList = {
  MainTabs: undefined;
  DashboardStack: undefined;
  ClientStack: undefined;
  SupportStack: undefined;
  DocumentStack: undefined;
  BulkUploads: undefined;
  CustomerMapping: undefined;
  MemberRoles: undefined;
  OrganizationRequests: undefined;
  AdminLicensingStack: undefined;
  PayoutStack: undefined;
  Invite: undefined;
  ServiceRequests: undefined;
  Profile: undefined;
  Settings: undefined;
  Billing: undefined;
  BackofficeLicensing: undefined;
  PrivacyPolicy: undefined;
  TermsAndConditions: undefined;
  FAQ: undefined;
  Feedback: undefined;
  ContactSupport: undefined;
  ThemeSelection: undefined;
  RiskProfileStack: undefined;
  ProfileStack: undefined;
  TeamMembersStack: undefined;
};
