import {createApi} from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./AxiosBaseQuery";
import { Service, OrganizationService, UserService, AssignmentRequestResponse } from "../../types/backend/userservices";

export const userServicesApi = createApi({
  reducerPath: 'useServicesApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['services', 'orgServices', 'userServices', 'assignmentRequests'],
  endpoints: (builder) => ({
    getServices: builder.query<Service[], void>({
      query: () => ({
        url: `/api/services/`,
        method: 'GET'
      }),
      providesTags: ['services']
    }),

    getOrganizationServices: builder.query<OrganizationService[], void>({
      query: () => ({
        url: `/api/organization/services/`,
        method: 'GET'
      }),
      providesTags: ['orgServices']
    }),

    getServicesByOrgId: builder.query<OrganizationService[], number>({
      query: (id) => ({
        url: `/api/services/organization/${id}/list/`,
        method: 'GET'
      }),
      providesTags: ['orgServices']
    }),

    createService: builder.mutation<OrganizationService[], OrganizationService[]>({
      query: (nom) => ({
        url: `/api/organization/services/`,
        method: 'POST',
        data:nom
      }),
      invalidatesTags: ['orgServices']
    }),

    updateService: builder.mutation<OrganizationService, {service: Partial<OrganizationService>, organization_id: number}>({
      query: ({service, organization_id}) => ({
        url: `/api/services/${service.id}/?org_id=${organization_id}`,
        method: 'PATCH',
        data:service
      }),
      invalidatesTags: ['orgServices']
    }),

    deleteService: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/services/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['orgServices']
    }),

    getUserServices: builder.query<UserService[], number>({
      query: (id) => ({
        url: `/api/services/user/${id}/service_requests/`,
        method: 'GET'
      }),
      providesTags: ['userServices']
    }),

    updateUserService: builder.mutation<UserService, {service: Partial<UserService>, user_id: number}>({
      query: ({service, user_id}) => ({
        url: `/api/services/user/${user_id}/service_requests/${service.id}/`,
        method: 'PATCH',
        data:service
      }),
      invalidatesTags: ['userServices']
    }),

    updateServiceFinalResult: builder.mutation<UserService, {service: Partial<UserService>, user_id: number}>({
      query: ({service, user_id}) => ({
        url: `/api/services/user/${user_id}/service_requests/${service.id}/final/`,
        method: 'PATCH',
        data:service
      }),
      invalidatesTags: ['userServices']
    }),

    getAssignmentRequests: builder.query<AssignmentRequestResponse, {page: number, page_size: number}>({
      query: ({page, page_size}) => ({
        url: `/api/services/assignment_requests/`,
        method: 'GET',
        params: {page, page_size}
      }),
      providesTags: ['assignmentRequests']
    }),

    createBulkUserService: builder.mutation<UserService[], {services: Partial<UserService>[], user_id: number}>({
      query: ({services, user_id}) => ({
        url: `/api/services/user/${user_id}/service_requests/`,
        method: 'POST',
        data: services
      }),
      invalidatesTags: ['userServices']
    }),

  })
})

export const {
  useGetServicesQuery,
  useGetOrganizationServicesQuery,
  useLazyGetServicesQuery,
  useGetUserServicesQuery,
  useLazyGetUserServicesQuery,
  useLazyGetServicesByOrgIdQuery,
  useLazyGetAssignmentRequestsQuery,
  useCreateServiceMutation,
  useDeleteServiceMutation,
  useUpdateServiceMutation,
  useUpdateUserServiceMutation,
  useUpdateServiceFinalResultMutation,
  useCreateBulkUserServiceMutation,
} = userServicesApi
