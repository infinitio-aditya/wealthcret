import {createApi} from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./AxiosBaseQuery";
import { Role, TeamMemberRole } from "../../types/backend/roles";

export const rolesApi = createApi({
  reducerPath: 'rolesApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['roles', 'teamMemberRoles'],
  endpoints: (builder) => ({
    getOrganizationRoles: builder.query<Role[], void>({
      query: () => ({
        url: `/api/roles/organization/`,
        method: 'GET'
      }),
      providesTags: ['roles']
    }),

    createOrganizationRole: builder.mutation<Role, Partial<Role>>({
      query: (role) => ({
        url: `/api/roles/organization/`,
        method: 'POST',
        data: role
      }),
      invalidatesTags: ['roles']
    }),

    updateOrganizationRole: builder.mutation<Role, Partial<Role>>({
      query: (role) => ({
        url: `/api/roles/organization/${role.id}/`,
        method: 'PATCH',
        data: role
      }),
      invalidatesTags: ['roles']
    }),

    deleteOrganizationRole: builder.mutation<Role, number>({
      query: (id) => ({
        url: `/api/roles/organization/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['roles']
    }),
    
    getTeamMemberRoles: builder.query<TeamMemberRole[], void>({
      query: () => ({
        url: `/api/roles/team_member_role/`,
        method: 'GET',
      }),
      providesTags: ['teamMemberRoles']
    }),

    createTeamMemberRole: builder.mutation<TeamMemberRole, Partial<TeamMemberRole>>({
      query: (data) => ({
        url: `/api/roles/team_member_role/`,
        method: 'POST',
        data
      }),
      invalidatesTags: ['teamMemberRoles']
    }), 

    updateTeamMemberRole: builder.mutation<TeamMemberRole, Partial<TeamMemberRole>>({
      query: ({id, ...data}) => ({
        url: `/api/roles/team_member_role/${id}/`,
        method: 'PATCH',
        data
      }),
      invalidatesTags: ['teamMemberRoles']
    }),
  })
})

export const {
  useGetOrganizationRolesQuery,
  useGetTeamMemberRolesQuery,
  useUpdateOrganizationRoleMutation,
  useDeleteOrganizationRoleMutation,
  useCreateOrganizationRoleMutation,
  useCreateTeamMemberRoleMutation,
  useUpdateTeamMemberRoleMutation,
} = rolesApi
