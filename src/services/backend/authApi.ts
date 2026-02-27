import { createApi } from "@reduxjs/toolkit/query/react";
import { BulkInviteResponse, BulkUploadJob, BulkUploadJobRecord, BulkUploadJobRecordResponse, CustomUser, ForgotPasswordSendRequest, ForgotPasswordVerifyRequest, LoginRequest, LoginResponse, Organization, OrganizationTheme, OrgnizationListResponse, PredefinedTheme, ResetPasswordRequest, ResetPasswordResponse, SendOTPRequest, SendOTPResponse, VerifyOtpRequest, VerifyOTPResponse } from "../../types/backend/auth";
import { ProspectAssociation } from "../../types/backend/prospect";
import axiosBaseQuery from "./AxiosBaseQuery";

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['CustomUserSearch', 'bulk_upload_job', 'bulk_upload_job_records','orgnizations'],
  endpoints: (builder) => ({
    sendOtp: builder.mutation<SendOTPResponse, SendOTPRequest>({
      query: (data) => ({
        url: `/api/otp/send/`,
        method: 'POST',
        data
      })
    }),

    verifyOtp: builder.mutation<VerifyOTPResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: `/api/otp/verify/`,
        method: 'POST',
        data
      })
    }),

    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (data) => ({
        url: '/api/accounts/token/obtain/',
        method: 'POST',
        data
      })
    }),

    forgotPasswordSend: builder.mutation<SendOTPResponse, ForgotPasswordSendRequest>({
      query: (data) => ({
        url: '/api/accounts/forgot_password/',
        method: 'POST',
        data
      })
    }),

    forgotPasswordVerify: builder.mutation<VerifyOTPResponse, ForgotPasswordVerifyRequest>({
      query: (data) => ({
        url: '/api/accounts/forgot_password_verify/',
        method: 'POST',
        data
      })
    }),

    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: '/api/accounts/reset_password/',
        method: 'POST',
        data
      })
    }),

    getUser: builder.query<CustomUser, void>({
      query: () => ({
        url: '/api/accounts/get_user/',
        method: 'GET'
      })
    }),

    updateUser: builder.mutation<CustomUser, Partial<CustomUser>>({
      query: ({id, alternate_contact, alternate_contact_name}) => ({
        url: `/api/accounts/user/${id}/`,
        method: 'PATCH',
        data: {alternate_contact, alternate_contact_name}
      })
    }),

    getOrgnizationByOrgType: builder.query<Organization[], string>({
      query: (orgType) => ({
        url: `/api/accounts/organization/${orgType}/list/`,
        method: 'GET',
      }),
    }),

    getOrganizationTheme: builder.query<OrganizationTheme, void>({
      query: () => ({
        url: '/api/accounts/organization/theme/',
        method: 'GET'
      })
    }),
    getOrgnizations:builder.query<OrgnizationListResponse,{page: number, page_size: number, q: string}>({
      query:(params)=>({
        url:`/api/accounts/organizations/`,
        method:'GET',
        params
      }),
      providesTags :['orgnizations']
    }),

    updateOrganizationTheme: builder.mutation<OrganizationTheme, OrganizationTheme>({
      query: (data) => ({
        url: `/api/accounts/organization/theme/${data.id}/`,
        method: 'PATCH',
        data
      })
    }),

    getPredefinedThemes: builder.query<PredefinedTheme[], void>({
      query: () => ({
        url: '/api/accounts/organization/theme/predefined/',
        method: 'GET'
      })
    }),

    uploadThemeAssets: builder.mutation<PredefinedTheme, any>({
      query: (formData) => ({
        url: '/api/accounts/organization/theme/assets/upload/',
        method: 'POST',
        data: formData,
      })
    }),

    getBulkUploadJobs: builder.query<BulkUploadJob[], void>({
      query: () => ({
        url: `/api/accounts/bulk_upload/`,
        method: 'GET',
      }),
      providesTags: ['bulk_upload_job']
    }),

    createBulkUploadJob: builder.mutation<BulkUploadJob, any>({
      query: (data) => ({
        url: `/api/accounts/bulk_upload/`,
        method: 'POST',
        data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      invalidatesTags: ['bulk_upload_job']
    }),

    retrieveBulkUploadJob: builder.query<BulkUploadJob, number>({
      query: (id) => ({
        url: `/api/accounts/bulk_upload/${id}/`,
        method: 'GET',
      }),
      providesTags: ['bulk_upload_job']
    }),

    deleteBulkUploadJob: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/accounts/bulk_upload/${id}/`,
        method: 'DELETE'
      }),
      invalidatesTags: ['bulk_upload_job']
    }),

    fetchJobRecords: builder.query<BulkUploadJobRecordResponse, {page: number, page_size: number, bulk_job_record: string}>({
      query: ({bulk_job_record, page, page_size}) => ({
        url: `/api/accounts/bulk_upload/${bulk_job_record}/records/`,
        method: 'GET',
        params: {page, page_size}
      }),
      providesTags: ['bulk_upload_job_records']
    }),

    updateJobRecord: builder.mutation<BulkUploadJobRecord, BulkUploadJobRecord>({
      query: (record) => ({
        url: `/api/accounts/bulk_upload/${record.bulk_upload_job}/record/${record.id}/`,
        method: 'PATCH',
        data: record
      }),
    }),

    bulkInvite: builder.mutation<BulkInviteResponse, {ids: number[], bulk_upload_job: number}>({
      query: ({ids, bulk_upload_job}) => ({
        url: `/api/accounts/bulk_upload/${bulk_upload_job}/invite/`,
        method: 'POST',
        data: {ids}
      }),
    }),

    getOrganizationUsers: builder.query<CustomUser[], void>({
      query: () => ({
        url: '/api/accounts/users/',
        method: 'GET'
      }),
      providesTags: ['CustomUserSearch']
    }),

    retrieveOrganizationUsers: builder.query<ProspectAssociation[], string>({
      query: (uuid) => ({
        url: `/api/accounts/organization/${uuid}/users/`,
        method: 'GET'
      }),
      providesTags: ['CustomUserSearch']
    }),

    searchBulkUploadJobRecords: builder.query<BulkUploadJobRecordResponse, {page: number, page_size: number, q: string, id: number}>({
      query: (params) => ({
        url: `/api/accounts/bulk_upload/${params.id}/records/search/`,
        method: 'GET',
        params
      }),
    }),
  })
})

export const {
  useSendOtpMutation,
  useVerifyOtpMutation, 
  useLoginMutation,
  useForgotPasswordSendMutation,
  useForgotPasswordVerifyMutation,
  useResetPasswordMutation,
  useUpdateOrganizationThemeMutation,
  useGetUserQuery,
  useLazyGetUserQuery,
  useUpdateUserMutation,
  useGetOrgnizationByOrgTypeQuery,
  useLazyGetOrgnizationByOrgTypeQuery,
  useGetOrganizationThemeQuery,
  useGetPredefinedThemesQuery,
  useUploadThemeAssetsMutation,
  useGetBulkUploadJobsQuery,
  useRetrieveBulkUploadJobQuery,
  useLazyFetchJobRecordsQuery,
  useCreateBulkUploadJobMutation,
  useDeleteBulkUploadJobMutation,
  useBulkInviteMutation,
  useUpdateJobRecordMutation,
  useGetOrgnizationsQuery,
  useLazyGetOrgnizationsQuery,
  useGetOrganizationUsersQuery,
  useRetrieveOrganizationUsersQuery,
  useLazySearchBulkUploadJobRecordsQuery,
} = authApi
