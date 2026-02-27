import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./AxiosBaseQuery";
import { GenericNewsResponse } from "../../types/backend/news";

export const newsApi = createApi({
  reducerPath: 'newsApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getNews: builder.query<GenericNewsResponse, {page: number, page_size: number}>({
      query: ({page, page_size}) => ({
        url: `/api/news/`,
        method: 'GET',
        params: {page, page_size}
      }),
    }),
  })
})

export const {
  useGetNewsQuery,
  useLazyGetNewsQuery
} = newsApi
