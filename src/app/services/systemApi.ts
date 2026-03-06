/**
 * System API Service
 * 
 * RTK Query API slice for system-related endpoints:
 * - Health checks
 * - System status
 * - Configuration
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../configs/axios/AxiosBaseQuery';

export interface HealthCheckResponse {
  status: string;
  message?: string;
  timestamp?: string;
  version?: string;
}

export const systemApi = createApi({
  reducerPath: 'systemApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['System'],
  endpoints: (builder) => ({
    /**
     * Health check endpoint
     * GET /api/health/
     * Check if backend is running and healthy
     */
    healthCheck: builder.query<HealthCheckResponse, void>({
      query: () => ({
        url: '/api/health/',
        method: 'GET',
      }),
      providesTags: ['System'],
    }),
  }),
});

// Export hooks for endpoints
export const {
  useHealthCheckQuery,
  useLazyHealthCheckQuery,
} = systemApi;
