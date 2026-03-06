/**
 * Documents API Service
 * 
 * RTK Query API slice for document management:
 * - List user documents
 * - Upload documents
 * - Delete documents
 * - Document request
 */

import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../configs/axios/AxiosBaseQuery';
import { Document, ListResponse } from '../types/common';

export const documentsApi = createApi({
  reducerPath: 'documentsApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Document'],
  endpoints: (builder) => ({
    /**
     * Get list of user documents
     * GET /api/documents/user/
     */
    listUserDocuments: builder.query<ListResponse<Document>, { userId?: string } | void>({
      query: (params) => ({
        url: '/api/documents/user/',
        method: 'GET',
        params,
      }),
      providesTags: ['Document'],
    }),

    /**
     * Get expected documents for user
     * GET /api/documents/user/expected/
     */
    getExpectedDocuments: builder.query<Document[], void>({
      query: () => ({
        url: '/api/documents/user/expected/',
        method: 'GET',
      }),
      providesTags: ['Document'],
    }),

    /**
     * Get document detail
     * GET /api/documents/user/{userId}/{documentId}/
     */
    getDocumentDetail: builder.query<Document, { userId: string; documentId: string }>({
      query: ({ userId, documentId }) => ({
        url: `/api/documents/user/${userId}/${documentId}/`,
        method: 'GET',
      }),
      providesTags: ['Document'],
    }),

    /**
     * Upload document
     * POST /api/documents/upload/
     */
    uploadDocument: builder.mutation<Document, FormData>({
      query: (formData) => ({
        url: '/api/documents/upload/',
        method: 'POST',
        data: formData,
      }),
      invalidatesTags: ['Document'],
    }),

    /**
     * Delete document
     * DELETE /api/documents/user/{documentId}/delete/
     */
    deleteDocument: builder.mutation<{ success: boolean }, string>({
      query: (documentId) => ({
        url: `/api/documents/user/${documentId}/delete/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Document'],
    }),

    /**
     * Request documents from user
     * POST /api/documents/user/request/
     */
    requestDocuments: builder.mutation<{ success: boolean }, { document_types: string[] }>({
      query: (data) => ({
        url: '/api/documents/user/request/',
        method: 'POST',
        data,
      }),
    }),
  }),
});

// Export hooks for endpoints
export const {
  useListUserDocumentsQuery,
  useGetExpectedDocumentsQuery,
  useGetDocumentDetailQuery,
  useUploadDocumentMutation,
  useDeleteDocumentMutation,
  useRequestDocumentsMutation,
} = documentsApi;
