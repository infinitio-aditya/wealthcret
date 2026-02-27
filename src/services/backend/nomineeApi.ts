import {createApi} from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./AxiosBaseQuery";
import { Nominee } from "../../types/backend/nominee";

export const nomineeApi = createApi({
  reducerPath: 'nomineeApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['nominees'],
  endpoints: (builder) => ({
    getNominees: builder.query<Nominee[], void>({
      query: () => ({
        url: `/api/nominee/`,
        method: 'GET'
      }),
      providesTags: ['nominees']
    }),

    createNominee: builder.mutation<Nominee, Nominee>({
      query: (nom) => ({
        url: `/api/nominee/`,
        method: 'POST',
        data:nom
      }),
      invalidatesTags: ['nominees']
    }),

    updateNominee: builder.mutation<Nominee, Nominee>({
      query: (nom) => ({
        url: `/api/nominee/${nom.id}/`,
        method: 'PATCH',
        data:nom
      }),
      invalidatesTags: ['nominees']
    }),

    deleteNominee: builder.mutation<Nominee, number>({
      query: (id) => ({
        url: `/api/nominee/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['nominees']
    }) 
  })
})

export const {
  useGetNomineesQuery,
  useCreateNomineeMutation,
  useUpdateNomineeMutation,
  useDeleteNomineeMutation
} = nomineeApi
