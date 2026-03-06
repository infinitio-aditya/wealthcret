/**
 * Dashboard API Service
 * 
 * RTK Query API slice for dashboard-related endpoints:
 * - User aggregated data
 * - Dashboard metrics
 * - Analytics
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../configs/axios/AxiosBaseQuery';
import { UserAggregatedData, DashboardData, PaginatedResponse } from '../types/dashboard';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Dashboard', 'Analytics'],
  endpoints: (builder) => ({
    /**
     * Get user aggregated dashboard data
     * GET /api/analytics/user/dashboard/
     * Returns user metrics, portfolio, news, etc.
     */
    getUserAggregatedData: builder.query<UserAggregatedData, void>({
      query: () => ({
        url: '/api/analytics/user/dashboard/',
        method: 'GET',
      }),
      providesTags: ['Dashboard'],
    }),

    /**
     * Get dashboard data (alternative endpoint)
     * GET /api/analytics/dashboard/
     */
    getDashboardData: builder.query<DashboardData, void>({
      query: () => ({
        url: '/api/analytics/dashboard/',
        method: 'GET',
      }),
      providesTags: ['Dashboard'],
    }),
  }),
});

// Export hooks for endpoints
export const {
  useGetUserAggregatedDataQuery,
  useLazyGetUserAggregatedDataQuery,
  useGetDashboardDataQuery,
} = dashboardApi;
