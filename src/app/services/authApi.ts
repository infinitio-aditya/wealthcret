/**
 * Authentication API Service
 * 
 * RTK Query API slice for all authentication-related endpoints:
 * - OTP send/verify
 * - Login
 * - Password reset
 * - User retrieval
 * - Organization lookup
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../configs/axios/AxiosBaseQuery';
import {
  CustomUser,
  SendOTPRequest,
  SendOTPResponse,
  VerifyOtpRequest,
  VerifyOTPResponse,
  LoginRequest,
  LoginResponse,
  ForgotPasswordSendRequest,
  ForgotPasswordSendResponse,
  ForgotPasswordVerifyRequest,
  ForgotPasswordVerifyResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  Organization,
} from '../types/auth';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['CurrentUser', 'Organization'],
  endpoints: (builder) => ({
    /**
     * Send OTP to phone or email
     * POST /api/otp/send/
     */
    sendOtp: builder.mutation<SendOTPResponse, SendOTPRequest>({
      query: (data) => ({
        url: '/api/otp/send/',
        method: 'POST',
        data,
      }),
    }),

    /**
     * Verify OTP code
     * POST /api/otp/verify/
     */
    verifyOtp: builder.mutation<VerifyOTPResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: '/api/otp/verify/',
        method: 'POST',
        data,
      }),
    }),

    /**
     * User login with email and password
     * POST /api/accounts/token/obtain/
     * Returns access token and user object
     */
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: '/api/accounts/token/obtain/',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['CurrentUser'],
    }),

    /**
     * Send forgot password OTP
     * POST /api/accounts/forgot_password/
     */
    forgotPasswordSend: builder.mutation<ForgotPasswordSendResponse, ForgotPasswordSendRequest>({
      query: (data) => ({
        url: '/api/accounts/forgot_password/',
        method: 'POST',
        data,
      }),
    }),

    /**
     * Verify forgot password OTP
     * POST /api/accounts/forgot_password_verify/
     */
    forgotPasswordVerify: builder.mutation<
      ForgotPasswordVerifyResponse,
      ForgotPasswordVerifyRequest
    >({
      query: (data) => ({
        url: '/api/accounts/forgot_password_verify/',
        method: 'POST',
        data,
      }),
    }),

    /**
     * Reset password with new password
     * POST /api/accounts/reset_password/
     */
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: '/api/accounts/reset_password/',
        method: 'POST',
        data,
      }),
    }),

    /**
     * Get current logged-in user details
     * GET /api/accounts/get_user/
     * Requires valid JWT token in Authorization header
     */
    getUser: builder.query<CustomUser, void>({
      query: () => ({
        url: '/api/accounts/get_user/',
        method: 'GET',
      }),
      providesTags: ['CurrentUser'],
    }),

    /**
     * Update current user details
     * PATCH /api/accounts/user/{id}/
     */
    updateUser: builder.mutation<CustomUser, Partial<CustomUser>>({
      query: (data) => {
        const { id, uuid, ...updateData } = data;
        const userId = id || uuid;
        return {
          url: `/api/accounts/user/${userId}/`,
          method: 'PATCH',
          data: updateData,
        };
      },
      invalidatesTags: ['CurrentUser'],
    }),

    /**
     * Get organizations by type
     * GET /api/accounts/organization/{org_type}/list/
     * org_type: 'admin', 'service_provider', 'referral_partner', 'client'
     */
    getOrganizationByOrgType: builder.query<Organization[], string>({
      query: (orgType) => ({
        url: `/api/accounts/organization/${orgType}/list/`,
        method: 'GET',
      }),
      providesTags: ['Organization'],
    }),

    /**
     * List all organizations
     * GET /api/accounts/organizations/
     */
    listOrganizations: builder.query<Organization[], void>({
      query: () => ({
        url: '/api/accounts/organizations/',
        method: 'GET',
      }),
      providesTags: ['Organization'],
    }),

    /**
     * Get organization details
     * GET /api/accounts/organization/{id}/
     */
    getOrganization: builder.query<Organization, string>({
      query: (id) => ({
        url: `/api/accounts/organization/${id}/`,
        method: 'GET',
      }),
      providesTags: ['Organization'],
    }),

    /**
     * Search for users/customers
     * GET /api/accounts/user/search/?q=query
     */
    searchUsers: builder.query<CustomUser[], string>({
      query: (query) => ({
        url: '/api/accounts/user/search/',
        method: 'GET',
        params: { q: query },
      }),
    }),
  }),
});

// Export hooks for endpoints
export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useLoginMutation,
  useForgotPasswordSendMutation,
  useForgotPasswordVerifyMutation,
  useResetPasswordMutation,
  useGetUserQuery,
  useLazyGetUserQuery,
  useUpdateUserMutation,
  useGetOrganizationByOrgTypeQuery,
  useListOrganizationsQuery,
  useGetOrganizationQuery,
  useSearchUsersQuery,
} = authApi;
