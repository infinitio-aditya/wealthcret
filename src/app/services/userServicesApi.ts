/**
 * User Services API Service
 * 
 * RTK Query API slice for user services and requests:
 * - Available services
 * - Service requests
 * - Service assignment
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../configs/axios/AxiosBaseQuery';
import { Service, ServiceRequest, ListResponse } from '../types/common';

export interface AssignmentRequest {
  id: string;
  service: Service;
  user_id: string;
  organization_id: string;
  status: string;
  created_at?: string;
}

export const userServicesApi = createApi({
  reducerPath: 'userServicesApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Service', 'ServiceRequest'],
  endpoints: (builder) => ({
    /**
     * Get list of available services
     * GET /api/services/
     */
    listServices: builder.query<ListResponse<Service>, void>({
      query: () => ({
        url: '/api/services/',
        method: 'GET',
      }),
      providesTags: ['Service'],
    }),

    /**
     * Get organization's services
     * GET /api/organization/services/
     */
    getOrganizationServices: builder.query<Service[], void>({
      query: () => ({
        url: '/api/organization/services/',
        method: 'GET',
      }),
      providesTags: ['Service'],
    }),

    /**
     * Get user's service requests
     * GET /api/services/user/{userId}/service_requests/
     */
    getUserServiceRequests: builder.query<ListResponse<ServiceRequest>, string>({
      query: (userId) => ({
        url: `/api/services/user/${userId}/service_requests/`,
        method: 'GET',
      }),
      providesTags: ['ServiceRequest'],
    }),

    /**
     * Get service request detail
     * GET /api/services/user/{userId}/service_requests/{requestId}/
     */
    getServiceRequestDetail: builder.query<
      ServiceRequest,
      { userId: string; requestId: string }
    >({
      query: ({ userId, requestId }) => ({
        url: `/api/services/user/${userId}/service_requests/${requestId}/`,
        method: 'GET',
      }),
      providesTags: ['ServiceRequest'],
    }),

    /**
     * Create service request
     * POST /api/services/user/{userId}/service_requests/
     */
    createServiceRequest: builder.mutation<
      ServiceRequest,
      { userId: string; service_id: string; [key: string]: any }
    >({
      query: ({ userId, ...data }) => ({
        url: `/api/services/user/${userId}/service_requests/`,
        method: 'POST',
        data,
      }),
      invalidatesTags: ['ServiceRequest'],
    }),

    /**
     * Update service request
     * PATCH /api/services/user/{userId}/service_requests/{requestId}/
     */
    updateServiceRequest: builder.mutation<
      ServiceRequest,
      { userId: string; requestId: string; [key: string]: any }
    >({
      query: ({ userId, requestId, ...data }) => ({
        url: `/api/services/user/${userId}/service_requests/${requestId}/`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: ['ServiceRequest'],
    }),

    /**
     * Complete service request
     * POST /api/services/user/{userId}/service_requests/{requestId}/final/
     */
    completeServiceRequest: builder.mutation<
      ServiceRequest,
      { userId: string; requestId: string }
    >({
      query: ({ userId, requestId }) => ({
        url: `/api/services/user/${userId}/service_requests/${requestId}/final/`,
        method: 'POST',
      }),
      invalidatesTags: ['ServiceRequest'],
    }),

    /**
     * Delete service request
     * DELETE /api/services/user/{userId}/service_requests/{requestId}/
     */
    deleteServiceRequest: builder.mutation<
      { success: boolean },
      { userId: string; requestId: string }
    >({
      query: ({ userId, requestId }) => ({
        url: `/api/services/user/${userId}/service_requests/${requestId}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ServiceRequest'],
    }),

    /**
     * List assignment requests
     * GET /api/services/assignment_requests/
     */
    listAssignmentRequests: builder.query<ListResponse<AssignmentRequest>, void>({
      query: () => ({
        url: '/api/services/assignment_requests/',
        method: 'GET',
      }),
      providesTags: ['Service'],
    }),
  }),
});

// Export hooks for endpoints
export const {
  useListServicesQuery,
  useGetOrganizationServicesQuery,
  useGetUserServiceRequestsQuery,
  useGetServiceRequestDetailQuery,
  useCreateServiceRequestMutation,
  useUpdateServiceRequestMutation,
  useCompleteServiceRequestMutation,
  useDeleteServiceRequestMutation,
  useListAssignmentRequestsQuery,
} = userServicesApi;
