/**
 * Compliance API Service
 * 
 * RTK Query API slice for compliance-related endpoints:
 * - Risk profiles
 * - Compliance checks
 * - Assessment
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../configs/axios/AxiosBaseQuery';
import { RiskProfile, Compliance } from '../types/common';

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: string;
  options?: string[];
  weight?: number;
}

export interface AssessmentSubmission {
  answers: Record<string, string | number>;
  [key: string]: any;
}

export interface AssessmentResult {
  risk_score: number;
  risk_category: string;
  recommendation?: string;
}

export const complianceApi = createApi({
  reducerPath: 'complianceApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['RiskProfile', 'Compliance', 'Assessment'],
  endpoints: (builder) => ({
    /**
     * Get risk profiles list
     * GET /api/compliance/risk_profiles/
     */
    listRiskProfiles: builder.query<RiskProfile[], void>({
      query: () => ({
        url: '/api/compliance/risk_profiles/',
        method: 'GET',
      }),
      providesTags: ['RiskProfile'],
    }),

    /**
     * Get user's risk profile
     * GET /api/compliance/user/risk_profile/
     */
    getUserRiskProfile: builder.query<RiskProfile, void>({
      query: () => ({
        url: '/api/compliance/user/risk_profile/',
        method: 'GET',
      }),
      providesTags: ['RiskProfile'],
    }),

    /**
     * Get risk profile by ID
     * GET /api/compliance/risk_profile/{id}/
     */
    getRiskProfileDetail: builder.query<RiskProfile, string>({
      query: (id) => ({
        url: `/api/compliance/risk_profile/${id}/`,
        method: 'GET',
      }),
      providesTags: ['RiskProfile'],
    }),

    /**
     * Get assessment questions
     * GET /api/compliance/assessment/questions/
     */
    getAssessmentQuestions: builder.query<AssessmentQuestion[], void>({
      query: () => ({
        url: '/api/compliance/assessment/questions/',
        method: 'GET',
      }),
      providesTags: ['Assessment'],
    }),

    /**
     * Submit risk assessment
     * POST /api/compliance/assessment/submit/
     */
    submitAssessment: builder.mutation<AssessmentResult, AssessmentSubmission>({
      query: (data) => ({
        url: '/api/compliance/assessment/submit/',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['RiskProfile'],
    }),

    /**
     * Get compliance checks
     * GET /api/compliance/checks/
     */
    listComplianceChecks: builder.query<Compliance[], void>({
      query: () => ({
        url: '/api/compliance/checks/',
        method: 'GET',
      }),
      providesTags: ['Compliance'],
    }),
  }),
});

// Export hooks for endpoints
export const {
  useListRiskProfilesQuery,
  useGetUserRiskProfileQuery,
  useGetRiskProfileDetailQuery,
  useGetAssessmentQuestionsQuery,
  useSubmitAssessmentMutation,
  useListComplianceChecksQuery,
} = complianceApi;
