import {createApi} from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./AxiosBaseQuery";
import { CustomUser } from "../../types/backend/auth";


export const onboardingApi = createApi({
  reducerPath: 'onboardingApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    submitApplication: builder.mutation<any, void>({
      query: () => ({
        url: `/api/onboarding/application/submit/`,
        method: 'POST',
      }),
    }),

    verifyApplication: builder.mutation<CustomUser, void>({
      query: () => ({
        url: `/api/onboarding/application/approve/`,
        method: 'POST',
      }),
    }),
  })
})

export const {
    useSubmitApplicationMutation,
    useVerifyApplicationMutation
} = onboardingApi;
