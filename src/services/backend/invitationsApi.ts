import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./AxiosBaseQuery";
import { Invitation, InvitationCreateRequest, InvitationCreateResponse, InvitationVerifyRequest, InvitationVerifyResponse } from "../../types/backend/invitation";

export const inviteApi = createApi({
  reducerPath: 'inviteApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getInvitation: builder.query<Invitation, string>({
      query: (uuid) => ({
        url: `/api/subscription/invitation/${uuid}/`,
        method: 'GET'
      })
    }),

    verifyInvitation: builder.mutation<InvitationVerifyResponse, InvitationVerifyRequest>({
      query: (inviteRequest) => ({
        url: `/api/subscription/invitation/${inviteRequest.uuid}/verify/`,
        method: 'POST',
        data: inviteRequest
      })
    }),

    createInvite: builder.mutation<InvitationCreateResponse, Partial<InvitationCreateRequest>>({
      query: (inviteRequest) => ({
        url: `/api/subscription/invitation/create/`,
        method: 'POST',
        data: inviteRequest
      })
    }),

    updateInvite: builder.mutation<InvitationCreateResponse, Partial<InvitationCreateRequest>>({
      query: (inviteRequest) => ({
        url: `/api/subscription/invitation/update/`,
        method: 'POST',
        data: inviteRequest
      })
    }),
  })
});

export const {
  useGetInvitationQuery,
  useVerifyInvitationMutation,
  useCreateInviteMutation,
  useUpdateInviteMutation
} = inviteApi;
