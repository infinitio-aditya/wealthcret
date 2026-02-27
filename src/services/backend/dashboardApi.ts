import {createApi} from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./AxiosBaseQuery";
import { UserAggregatedData } from "../../types/backend/dashboard";

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getUserAggregatedData: builder.query<UserAggregatedData, void>({
      query: () => ({
        url: `/api/analytics/user/dashboard/`,
        method: 'GET'
      }),
    }),
  })
})


export const {
  useGetUserAggregatedDataQuery
} = dashboardApi
