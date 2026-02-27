import {createApi} from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./AxiosBaseQuery";
import { Commission, CommissionItem, CommissionResponse, SearchItem } from "../../types/backend/commission";

export const commissionApi = createApi({
  reducerPath: 'commissionApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['commission', 'commissionItem'],
  endpoints: (builder) => ({
    getCommissionForAdmin: builder.query<CommissionResponse, {page: number, page_size: number}>({
      query: (params) => ({
        url: `/api/commission/`,
        method: 'GET',
        params,
      }),
      providesTags: ['commission']
    }),
    
    createCommission: builder.mutation<Commission, Commission>({
      query: (commission) => ({
        url: `/api/commission/`,
        method: 'POST',
        data: commission,
      }),
      invalidatesTags: ['commission']
    }),

    getCommission: builder.query<Commission, number>({
      query: (id) => ({
        url: `/api/commission/${id}/`,
        method: 'GET',
      }),
      providesTags: ['commission']
    }),

    updateCommission: builder.mutation<Commission, {id: number, commission: Partial<Commission>}>({
      query: ({commission, id}) => ({
        url: `/api/commission/${id}/`,
        method: 'PATCH',
        data: commission,
      }),
      invalidatesTags: ['commission']
    }),

    deleteCommission: builder.mutation<Commission, number>({
      query: (id) => ({
        url: `/api/commission/${id}/`,
        method: 'DELETE'
      }),
      invalidatesTags: ['commission']
    }),

    createCommissionItem: builder.mutation<CommissionItem, {id: number, commissionItem: CommissionItem}>({
      query: ({commissionItem, id}) => ({
        url: `/api/commission/${id}/item/`,
        method: 'POST',
        data: commissionItem
      }),
      invalidatesTags: ['commissionItem', 'commission']
    }),

    deleteCommissionItem: builder.mutation<void, {task_id: number, id: number}>({
      query: ({task_id, id}) => ({
        url: `/api/commission/${task_id}/item/${id}/`,
        method: 'DELETE'
      }),
      invalidatesTags: ['commission', 'commissionItem']
    }),

    updateCommissionItem: builder.mutation<void, {task_id: number, id: number, commissionItem: CommissionItem}>({
      query: ({task_id, id, commissionItem}) => ({
        url: `/api/commission/${task_id}/item/${id}/`,
        method: 'PATCH',
        data: commissionItem
      }),
      invalidatesTags: ['commission', 'commissionItem']
    }),

    searchCommission: builder.query<SearchItem[], Record<any, any>>({
      query: (params) => ({
        url: `/api/analytics/commission/search/`,
        method: 'GET',
        params
      }),
    }),

    calculatePayout: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/commission/${id}/calculate/`,
        method: 'POST'
      }),
      invalidatesTags: ['commission', 'commissionItem']
    }),

  })
})


export const {
  useLazyGetCommissionForAdminQuery,
  useGetCommissionQuery,
  useLazySearchCommissionQuery,
  useDeleteCommissionMutation,
  useCreateCommissionMutation,
  useCreateCommissionItemMutation,
  useDeleteCommissionItemMutation,
  useUpdateCommissionItemMutation,
  useUpdateCommissionMutation,
  useCalculatePayoutMutation,
} = commissionApi
