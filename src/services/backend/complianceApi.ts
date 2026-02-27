import {createApi} from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./AxiosBaseQuery";
import { RiskProfile, RiskProfileQuestion, RiskProfileResponse } from "../../types/backend/compliance";

export const complianceApi = createApi({
  reducerPath: 'complianceApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getRiskProfiles: builder.query<RiskProfileResponse, Partial<{page: number, page_size: number, q: string}>>({
      query: ({page, page_size, q}) => ({
        url: `/api/compliance/risk_profiles/`,
        method: 'GET',
        params: {page, page_size, q}
      }),
    }),

    getClientRiskProfile: builder.query<RiskProfile, void>({
      query: () => ({
        url: `/api/compliance/client/risk_profile/`,
        method: 'GET'
      }),
    }),

    getQuestions: builder.query<RiskProfileQuestion[], void>({
      query: () => ({
        url: `/api/compliance/questions/`,
        method: 'GET'
      }),
    }),
    
    submitAssessment: builder.mutation<RiskProfile, {result: Record<number, number>}>({
      query: (data) => ({
        url: `/api/compliance/assessment/submit/`,
        method: 'POST',
        data
      }),
    }),

    retrieveRiskProfile: builder.query<RiskProfile, number>({
      query: (id) => ({
        url: `/api/compliance/risk_profiles/${id}/`,
        method: 'GET'
      }),
    }),

  })
})


export const {
  useLazyGetRiskProfilesQuery,
  useGetClientRiskProfileQuery,
  useGetQuestionsQuery,
  useSubmitAssessmentMutation,
  useRetrieveRiskProfileQuery,
} = complianceApi
