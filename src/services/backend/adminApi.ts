import {createApi} from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./AxiosBaseQuery";
import { ApprovalRequest } from "../../types/backend/onboarding";
import { Organization } from "../../types/backend/auth";


export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getApprovalRequestList: builder.query<ApprovalRequest[], void>({
      query: () => ({
        url: `/api/onboarding/approval-requests/`,
        method: 'GET',
      }),
    }),

    getApprovalRequest: builder.query<ApprovalRequest, number>({
      query: (id) => ({
        url: `/api/onboarding/approval-requests/${id}/`,
        method: 'GET',
      }),
    }),

    updateApprovalRequest: builder.mutation<ApprovalRequest, Partial<ApprovalRequest>>({
      query: (req) => ({
        url: `/api/onboarding/approval-requests/${req.id}/`,
        method: 'PATCH',
        data: req
      }),
    }),
    updateOrganization: builder.mutation<Organization, Partial<Organization>>({
      query: (org) => ({
        url: `/api/accounts/organization/${org.id}/`,
        method: 'PATCH',
        data: org
      }),
    }),
  })
})

export const {
  useGetApprovalRequestListQuery,
  useGetApprovalRequestQuery,
  useUpdateApprovalRequestMutation,
  useUpdateOrganizationMutation,
} = adminApi;
