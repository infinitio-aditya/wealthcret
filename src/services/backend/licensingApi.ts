import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./AxiosBaseQuery";
import { Feature, License, OrganizationLicense } from "../../types/backend/license";
import { CustomUserSearchResponse, UserFeatureSubscription } from "../../types/backend/auth";

export const licensingApi = createApi({
  reducerPath: 'licensingApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['licensing', 'features', 'org_license', 'feature_license', 'CustomUserSearch'],
  endpoints: (builder) => ({
    getFeatures: builder.query<Feature[], void>({
      query: () => ({
        url: `/api/licensing/features/`,
        method: 'GET',
      }),
      providesTags: ['features'],
    }),

    getLicensingCount: builder.query<{active_organizations: number, active_users: number}, void>({
      query: () => ({
        url: `/api/licensing/count/`,
        method: 'GET',
      }),
      providesTags: ['licensing'],
    }),

    createLicensing: builder.mutation<OrganizationLicense, OrganizationLicense>({
      query: (data) => ({
        url: `/api/licensing/create/`,
        method: 'POST',
        data
      }),
      invalidatesTags: ['licensing'],
    }),

    searchLicensing: builder.query<OrganizationLicense[], {query: string}>({
      query: ({query}) => ({
        url: `/api/licensing/search/`,
        method: 'GET',
        params: {query},
      }),
      providesTags: ['licensing'],
    }),

    getOrgLicense: builder.query<OrganizationLicense, void>({
      query: () => ({
        url: `/api/licensing/organization/`,
        method: 'GET',
      }),
      providesTags: ['org_license', 'feature_license'],
    }),

    getOrgLicenseById: builder.query<OrganizationLicense, number>({
      query: (id) => ({
        url: `/api/licensing/organization/${id}/`,
        method: 'GET',
      }),
      providesTags: ['org_license', 'feature_license'],
    }),

    updateOrgLicense: builder.mutation<OrganizationLicense, Partial<OrganizationLicense>>({
      query: (data) => ({
        url: `/api/licensing/organization/${data.id}/`,
        method: 'PATCH',
        data
      }),
      invalidatesTags: ['org_license'],
    }),

    createFeatureLicense: builder.mutation<License, Partial<License>>({
      query: (data) => ({
        url: `/api/licensing/organization/${data.organization_license}/features/`,
        method: 'POST',
        data
      }),
      invalidatesTags: ['feature_license', 'org_license'],
    }),

    updateFeatureLicense: builder.mutation<License, Partial<License>>({
      query: (data) => ({
        url: `/api/licensing/organization/${data.organization_license}/features/${data.id}/`,
        method: 'PATCH',
        data
      }),
      invalidatesTags: ['feature_license', 'org_license'],
    }),

    createUserFeatureLicense: builder.mutation<UserFeatureSubscription, {ufs: Partial<UserFeatureSubscription>, uuid: string}>({
      query: ({ufs, uuid}) => ({
        url: `/api/licensing/user/${uuid}/features/`,
        method: 'POST',
        data: ufs
      }),
    }),

    updateUserFeatureLicense: builder.mutation<UserFeatureSubscription, {ufs: Partial<UserFeatureSubscription>, uuid: string}>({
      query: ({ufs, uuid}) => ({
        url: `/api/licensing/user/${uuid}/features/${ufs.id}/`,
        method: 'PATCH',
        data: ufs
      }),
    }),

    searchUser: builder.query<CustomUserSearchResponse, {page: number, page_size: number, q: string}>({
      query: (params) => ({
        url: '/api/accounts/user/search/',
        method: 'GET',
        params
      }),
    }),
  }),
});

export const {
  useGetLicensingCountQuery,
  useLazySearchLicensingQuery,
  useGetFeaturesQuery,
  useGetOrgLicenseQuery,
  useCreateLicensingMutation,
  useGetOrgLicenseByIdQuery,
  useLazySearchUserQuery,
  useUpdateOrgLicenseMutation,
  useCreateFeatureLicenseMutation,
  useUpdateFeatureLicenseMutation,
  useCreateUserFeatureLicenseMutation,
  useUpdateUserFeatureLicenseMutation,
} = licensingApi;
