import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from "./AxiosBaseQuery";

export const notificationApi = createApi({
  reducerPath: 'notificationApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    // FETCH VAPID PUBLIC KEY
    getVapidKey: builder.query<{ vapid_public_key: string }, void>({
      query: () => ({
        url: '/api/config/vapid/',
        method: 'GET',
      })
    }),

    // SAVE DEVICE TOKEN (Adapted for Mobile Push)
    saveDeviceToken: builder.mutation<void, {token: string, platform: 'ios' | 'android'}>({
      query: (payload) => ({
        url: '/api/devices/fcm-token/', // Typical mobile endpoint
        method: 'POST',
        data: payload,
      })
    }),

  })
});

export const {
  useGetVapidKeyQuery,
  useSaveDeviceTokenMutation,
} = notificationApi;
