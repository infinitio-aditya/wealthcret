import { createApi } from "@reduxjs/toolkit/query/react";
import { Activity, BulkProspectRequest, BulkProspectResponse, CreateAssociationRequest, Prospect, ProspectAssociation, ProspectRequest, ProspectResponse } from "../../types/backend/prospect";
import axiosBaseQuery from "./AxiosBaseQuery";

export const prospectApi = createApi({
  reducerPath: 'prospectApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['prospects', 'activities', 'bulk_upload_job', 'bulk_upload_job_records', 'people'],
  endpoints: (builder) => ({
    getProspects: builder.query<ProspectResponse, {page: number, page_size: number, userType: string}>({
      query: ({page, page_size, userType}) => ({
        url: `/api/referral/prospects/`,
        method: 'GET',
        params: {page, page_size, user_type: userType}
      }),
      providesTags: ['prospects']
    }),

    createProspect: builder.mutation<Prospect, ProspectRequest>({
      query: (prospectRequest) => ({
        url: `/api/referral/prospect/add/`,
        method: 'POST',
        data: prospectRequest
      }),
      invalidatesTags: ['prospects', 'activities']
    }),

    createBulkProspects: builder.mutation<BulkProspectResponse, BulkProspectRequest[]>({
      query: (data) => ({
        url: `/api/referral/prospect/add/bulk/`,
        method: 'POST',
        data
      }),
      invalidatesTags: ['prospects', 'activities']
    }),

    retrieveProspect: builder.query<void, number>({
      query: (id) => ({
        url: `/api/referral/prospects/${id}/`,
        method: 'GET',
      }),
    }),

    deleteProspect: builder.mutation<void, {id: number, params: Object}>({
      query: ({id, params}) => ({
        url: `/api/referral/prospects/${id}/`,
        method: 'DELETE',
        params
      }),
      invalidatesTags: ['prospects', 'activities']
    }),

    createActivity: builder.mutation<Activity, {activity: Activity, id: number}>({
      query: ({activity, id}) => ({
        url: `/api/referral/prospects/${id}/activity/`,
        method: 'POST',
        data: activity
      }),
      invalidatesTags: ['activities']
    }),

    updateActivity: builder.mutation<Activity, {id: number;      activity_id: number;  activity: Partial<Activity>;}>({
     query: ({ id, activity_id, activity }) => ({
      url: `/api/referral/prospects/${id}/activity/${activity_id}/`,
      method: 'PATCH',         
      data: activity,
      }),
      invalidatesTags: ['activities'],
    }),
    
    createAssociation: builder.mutation<ProspectAssociation, CreateAssociationRequest>({
      query: (data) => ({
        url: `/api/referral/prospect/create/association/`,
        method: 'POST',
        data
      })
    }),

    getProspectsClients: builder.query<ProspectResponse, Partial<{page: number, page_size: number, user_types: string, q: string}>>({
      query: ({user_types, page, page_size, q}) => ({
        url: `/api/referral/referrals/`,
        method: 'GET',
        params: {user_types, page, page_size, q}
      }),
    }),

    updateProspectAssociation: builder.mutation<ProspectAssociation, Partial<ProspectAssociation>>({
      query: (data) => ({
        url: `/api/referral/association/${data.id}/`,
        method: 'PATCH',
        data
      }),
    }),
  })
})

export const {
  useLazyGetProspectsQuery,
  useRetrieveProspectQuery,
  useGetProspectsClientsQuery,
  useLazyGetProspectsClientsQuery,
  useCreateProspectMutation,
  useDeleteProspectMutation,
  useCreateActivityMutation,
  useCreateAssociationMutation,
  useCreateBulkProspectsMutation,
  useUpdateActivityMutation,
  useUpdateProspectAssociationMutation,
} = prospectApi
