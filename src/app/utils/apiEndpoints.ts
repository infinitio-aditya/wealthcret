/**
 * API Endpoints Registry
 * 
 * Centralized documentation of all available API endpoints
 * Maps to RTK Query hooks for easy reference
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH_TOKEN: '/api/auth/refresh',
    GET_USER: '/api/users/me',
    CHANGE_PASSWORD: '/api/auth/change-password',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
    VERIFY_OTP: '/api/auth/verify-otp',
  },

  // User Management
  USERS: {
    GET_USER: '/api/users/me',
    GET_ORGANIZATION: '/api/users/organization',
    UPDATE_PROFILE: '/api/users/profile',
    GET_TEAM_MEMBERS: '/api/users/team',
    ADD_TEAM_MEMBER: '/api/users/team/invite',
    REMOVE_TEAM_MEMBER: '/api/users/team/{userId}',
    UPDATE_TEAM_MEMBER: '/api/users/team/{userId}',
  },

  // Dashboard & Aggregated Data
  DASHBOARD: {
    GET_AGGREGATED_DATA: '/api/dashboard/aggregated',
    GET_CARDS: '/api/dashboard/cards',
    GET_METRICS: '/api/dashboard/metrics',
    GET_CHARTS: '/api/dashboard/charts',
  },

  // Documents
  DOCUMENTS: {
    GET_DOCUMENTS: '/api/documents',
    GET_DOCUMENT: '/api/documents/{documentId}',
    UPLOAD_DOCUMENT: '/api/documents/upload',
    DELETE_DOCUMENT: '/api/documents/{documentId}',
    DOWNLOAD_DOCUMENT: '/api/documents/{documentId}/download',
    GET_DOCUMENT_TYPES: '/api/documents/types',
    GET_MY_DOCUMENTS: '/api/documents/my-documents',
  },

  // Compliance & Risk Management
  COMPLIANCE: {
    GET_COMPLIANCE_DATA: '/api/compliance/dashboard',
    GET_COMPLIANCE_STATUS: '/api/compliance/status',
    GET_RISK_PROFILE: '/api/compliance/risk-profile',
    CREATE_RISK_PROFILE: '/api/compliance/risk-profile',
    UPDATE_RISK_PROFILE: '/api/compliance/risk-profile/{riskId}',
    GET_COMPLIANCE_DOCUMENTS: '/api/compliance/documents',
    GET_COMPLIANCE_CHECKLIST: '/api/compliance/checklist',
    SUBMIT_COMPLIANCE_FORM: '/api/compliance/submit',
  },

  // User Services (Clients, Prospects, etc.)
  USER_SERVICES: {
    GET_SERVICES: '/api/services',
    GET_CLIENTS: '/api/services/clients',
    GET_CLIENT: '/api/services/clients/{clientId}',
    CREATE_CLIENT: '/api/services/clients',
    UPDATE_CLIENT: '/api/services/clients/{clientId}',
    DELETE_CLIENT: '/api/services/clients/{clientId}',
    GET_CLIENT_DOCUMENTS: '/api/services/clients/{clientId}/documents',
    GET_SERVICE_REQUESTS: '/api/services/requests',
    CREATE_SERVICE_REQUEST: '/api/services/requests',
    UPDATE_SERVICE_REQUEST: '/api/services/requests/{requestId}',
  },

  // System Health & Status
  SYSTEM: {
    GET_SYSTEM_HEALTH: '/api/system/health',
    GET_SYSTEM_STATUS: '/api/system/status',
    GET_VERSION: '/api/system/version',
  },

  // Admin Operations
  ADMIN: {
    GET_ORGANIZATIONS: '/api/admin/organizations',
    GET_ORGANIZATION: '/api/admin/organizations/{orgId}',
    CREATE_ORGANIZATION: '/api/admin/organizations',
    UPDATE_ORGANIZATION: '/api/admin/organizations/{orgId}',
    GET_ORG_REQUESTS: '/api/admin/organization-requests',
    GET_ORG_REQUEST: '/api/admin/organization-requests/{requestId}',
    APPROVE_ORG_REQUEST: '/api/admin/organization-requests/{requestId}/approve',
    REJECT_ORG_REQUEST: '/api/admin/organization-requests/{requestId}/reject',
    INVITE_USER: '/api/admin/invites',
    GET_INVITES: '/api/admin/invites',
    GET_LICENSING: '/api/admin/licensing',
    UPDATE_LICENSING: '/api/admin/licensing/{licenseId}',
    GET_PAYOUTS: '/api/admin/payouts',
    GET_PAYOUT: '/api/admin/payouts/{payoutId}',
    CREATE_PAYOUT: '/api/admin/payouts',
    UPDATE_PAYOUT: '/api/admin/payouts/{payoutId}',
    GET_BILLING: '/api/admin/billing',
    GET_SERVICE_REQUESTS: '/api/admin/service-requests',
  },

  // BackOffice Operations
  BACKOFFICE: {
    GET_SUPPORT_TICKETS: '/api/backoffice/support-tickets',
    GET_TICKET: '/api/backoffice/support-tickets/{ticketId}',
    CREATE_TICKET: '/api/backoffice/support-tickets',
    UPDATE_TICKET: '/api/backoffice/support-tickets/{ticketId}',
    GET_BULK_UPLOADS: '/api/backoffice/bulk-uploads',
    UPLOAD_BULK: '/api/backoffice/bulk-uploads/upload',
    GET_CUSTOMER_MAPPING: '/api/backoffice/customer-mapping',
    GET_LICENSING: '/api/backoffice/licensing',
    UPDATE_LICENSING: '/api/backoffice/licensing/{id}',
  },

  // Notifications
  NOTIFICATIONS: {
    GET_NOTIFICATIONS: '/api/notifications',
    GET_NOTIFICATION: '/api/notifications/{notificationId}',
    MARK_AS_READ: '/api/notifications/{notificationId}/read',
    MARK_ALL_AS_READ: '/api/notifications/mark-all-read',
    DELETE_NOTIFICATION: '/api/notifications/{notificationId}',
  },
};

/**
 * RTK Query Hooks Mapping
 * Shows which hooks to use for each endpoint
 */
export const HOOKS_MAPPING = {
  // Auth API
  authApi: {
    useLoginMutation: API_ENDPOINTS.AUTH.LOGIN,
    useLogoutMutation: API_ENDPOINTS.AUTH.LOGOUT,
    useRefreshTokenMutation: API_ENDPOINTS.AUTH.REFRESH_TOKEN,
    useGetUserQuery: API_ENDPOINTS.AUTH.GET_USER,
    useChangePasswordMutation: API_ENDPOINTS.AUTH.CHANGE_PASSWORD,
    useForgotPasswordMutation: API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
    useResetPasswordMutation: API_ENDPOINTS.AUTH.RESET_PASSWORD,
    useVerifyOtpMutation: API_ENDPOINTS.AUTH.VERIFY_OTP,
  },

  // Dashboard API
  dashboardApi: {
    useGetUserAggregatedDataQuery: API_ENDPOINTS.DASHBOARD.GET_AGGREGATED_DATA,
    useGetDashboardCardsQuery: API_ENDPOINTS.DASHBOARD.GET_CARDS,
    useGetMetricsQuery: API_ENDPOINTS.DASHBOARD.GET_METRICS,
    useGetChartsQuery: API_ENDPOINTS.DASHBOARD.GET_CHARTS,
  },

  // Documents API
  documentsApi: {
    useGetDocumentsQuery: API_ENDPOINTS.DOCUMENTS.GET_DOCUMENTS,
    useGetDocumentQuery: API_ENDPOINTS.DOCUMENTS.GET_DOCUMENT,
    useUploadDocumentMutation: API_ENDPOINTS.DOCUMENTS.UPLOAD_DOCUMENT,
    useDeleteDocumentMutation: API_ENDPOINTS.DOCUMENTS.DELETE_DOCUMENT,
    useDownloadDocumentMutation: API_ENDPOINTS.DOCUMENTS.DOWNLOAD_DOCUMENT,
    useGetDocumentTypesQuery: API_ENDPOINTS.DOCUMENTS.GET_DOCUMENT_TYPES,
    useGetMyDocumentsQuery: API_ENDPOINTS.DOCUMENTS.GET_MY_DOCUMENTS,
  },

  // Compliance API
  complianceApi: {
    useGetComplianceDataQuery: API_ENDPOINTS.COMPLIANCE.GET_COMPLIANCE_DATA,
    useGetComplianceStatusQuery: API_ENDPOINTS.COMPLIANCE.GET_COMPLIANCE_STATUS,
    useGetRiskProfileQuery: API_ENDPOINTS.COMPLIANCE.GET_RISK_PROFILE,
    useCreateRiskProfileMutation: API_ENDPOINTS.COMPLIANCE.CREATE_RISK_PROFILE,
    useUpdateRiskProfileMutation: API_ENDPOINTS.COMPLIANCE.UPDATE_RISK_PROFILE,
    useGetComplianceDocumentsQuery: API_ENDPOINTS.COMPLIANCE.GET_COMPLIANCE_DOCUMENTS,
    useGetComplianceChecklistQuery: API_ENDPOINTS.COMPLIANCE.GET_COMPLIANCE_CHECKLIST,
    useSubmitComplianceFormMutation: API_ENDPOINTS.COMPLIANCE.SUBMIT_COMPLIANCE_FORM,
  },

  // User Services API
  userServicesApi: {
    useGetServicesQuery: API_ENDPOINTS.USER_SERVICES.GET_SERVICES,
    useGetClientsQuery: API_ENDPOINTS.USER_SERVICES.GET_CLIENTS,
    useGetClientQuery: API_ENDPOINTS.USER_SERVICES.GET_CLIENT,
    useCreateClientMutation: API_ENDPOINTS.USER_SERVICES.CREATE_CLIENT,
    useUpdateClientMutation: API_ENDPOINTS.USER_SERVICES.UPDATE_CLIENT,
    useDeleteClientMutation: API_ENDPOINTS.USER_SERVICES.DELETE_CLIENT,
    useGetClientDocumentsQuery: API_ENDPOINTS.USER_SERVICES.GET_CLIENT_DOCUMENTS,
    useGetServiceRequestsQuery: API_ENDPOINTS.USER_SERVICES.GET_SERVICE_REQUESTS,
    useCreateServiceRequestMutation: API_ENDPOINTS.USER_SERVICES.CREATE_SERVICE_REQUEST,
    useUpdateServiceRequestMutation: API_ENDPOINTS.USER_SERVICES.UPDATE_SERVICE_REQUEST,
  },

  // System API
  systemApi: {
    useGetSystemHealthQuery: API_ENDPOINTS.SYSTEM.GET_SYSTEM_HEALTH,
    useGetSystemStatusQuery: API_ENDPOINTS.SYSTEM.GET_SYSTEM_STATUS,
    useGetVersionQuery: API_ENDPOINTS.SYSTEM.GET_VERSION,
  },
};

/**
 * Usage Example
 * 
 * import { useGetDocumentsQuery } from '../path/to/documentsApi';
 * 
 * const DocumentsScreen = () => {
 *   const { data, isLoading, error } = useGetDocumentsQuery();
 *   
 *   if (isLoading) return <LoadingScreen />;
 *   if (error) return <ErrorState onRetry={refetch} />;
 *   if (!data?.length) return <EmptyState />;
 *   
 *   return <FlatList data={data} renderItem={renderDocument} />;
 * };
 */
