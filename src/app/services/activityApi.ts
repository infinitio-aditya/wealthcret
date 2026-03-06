import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../configs/axios/AxiosBaseQuery';

export interface GenericNewsResponse {
  count: number;
  next: string;
  previous: string;
  results: any[];
}

export const activityApi = createApi({
  reducerPath: 'activityApi',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['news'],
  endpoints: (builder) => ({
    getNews: builder.query<GenericNewsResponse, void>({
      query: () => ({
        url: '/api/news/',
        method: 'GET',
      }),
      providesTags: ['news'],
    }),
  }),
});

export const { useLazyGetNewsQuery, useGetNewsQuery } = activityApi;
