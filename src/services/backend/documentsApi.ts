import {createApi} from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./AxiosBaseQuery";
import {UserDocument, UserDocumentResponse} from '../../types/backend/documents'

export const documentsApi = createApi({
  reducerPath: 'documentsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['documents', 'agreement_documents'],
  endpoints: (builder) => ({
    getUserDocuments: builder.query<UserDocument[], void>({
      query: () => ({
        url: `/api/documents/user/`,
        method: 'GET'
      }),
      providesTags: ['documents']
    }),

    getUserDocumentsById: builder.query<UserDocument[], string>({
      query: (id) => ({
        url: `/api/documents/user/${id}/list/`,
        method: 'GET'
      }),
      providesTags: ['documents']
    }),

    getUserDocumentFileById: builder.query<UserDocument[], {id: number, document_type: number}>({
      query: ({id, document_type}) => ({
        url: `/api/documents/user/${id}/${document_type}/view/`,
        method: 'GET'
      }),
      providesTags: ['documents']
    }),

    getPresignedUrl: builder.query<{url: string}, string>({
      query: (document_type) => ({
        url: `/api/documents/user/${document_type}/view/`,
        method: 'GET'
      }),
    }),

    deleteDocumentView: builder.mutation<void, number>({
      query: (id) => ({
        url: `/api/documents/user/${id}/delete/`,
        method: 'DELETE'
      }),
      invalidatesTags: ['documents']
    }),

    getAgreementDocumentTypes: builder.query<{documents: number[]}, void>({
      query: () => ({
        url: '/api/documents/user/agreement/types/',
        method: 'GET'
      })
    }),

    getUserAgreementDocuments: builder.query<UserDocument[], void>({
      query: () => ({
        url: `/api/documents/user/agreement/`,
        method: 'GET'
      }),
      providesTags: ['agreement_documents']
    }),

    generateDocument: builder.query<{presignedUrl: string}, string>({
      query: (document_type) => ({
        url: `/api/documents/user/agreement/${document_type}/generate/`,
        method: 'GET'
      }),
    }),

    getExpectedDocuments: builder.query<UserDocument[], void>({
      query: () => ({
        url: `/api/documents/user/expected/`,
        method: 'GET'
      }),
      providesTags: ['agreement_documents']
    }),

    uploadUserDocument: builder.mutation<Record<any, any>, any>({
      query: (formData) => ({
        url: '/api/documents/upload/',
        method: 'POST',
        data: formData
      }),
      invalidatesTags: ['agreement_documents']
    }),

    generateUserDocument: builder.query<Record<string, string>, string>({
      query: (documentType) => ({
        url: `/api/documents/user/agreement/${documentType}/generate/`,
        method: 'GET'
      })
    }),

    signAndUploadDocument: builder.mutation<Record<any, any>, {signature: string, document_id: number}>({
      query: ({signature, document_id}) => ({
        url: `/api/documents/user/agreement/${document_id}/sign/`,
        method: 'POST',
        data: {signature}
      }),
      invalidatesTags: ['agreement_documents']
    }),

    requestDocument: builder.mutation<UserDocumentResponse, {document: UserDocument, uuid: string}>({
      query: ({document, uuid}) => ({
        url: `/api/documents/user/${uuid}/request/`,
        method: 'POST',
        data: document
      }) 
    }),

    updateUserDocument: builder.mutation<UserDocumentResponse, {document: UserDocument, uuid: string}>({
      query: ({document, uuid}) => ({
        url: `/api/documents/user/${uuid}/${document.id}/`,
        method: 'PATCH',
        data: document
      }) 
    }),

  })
})

export const {
  useGetUserDocumentsQuery,
  useLazyGetPresignedUrlQuery,
  useDeleteDocumentViewMutation,
  useGetAgreementDocumentTypesQuery,
  useGetUserAgreementDocumentsQuery,
  useGenerateDocumentQuery,
  useLazyGetUserDocumentsByIdQuery,
  useGetExpectedDocumentsQuery,
  useUploadUserDocumentMutation,
  useLazyGenerateUserDocumentQuery,
  useSignAndUploadDocumentMutation,
  useRequestDocumentMutation,
  useUpdateUserDocumentMutation,
} = documentsApi
