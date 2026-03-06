import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { AxiosError, AxiosRequestConfig } from 'axios';
import axiosInstance from './AxiosConfig';

/**
 * Axios Base Query for RTK Query
 * 
 * This is a custom base query function that integrates axios with RTK Query.
 * It handles:
 * - Request/response transformation
 * - Error handling
 * - Type safety for RTK Query
 */

interface AxiosBaseQueryArgs {
  url: string;
  method: AxiosRequestConfig['method'];
  data?: AxiosRequestConfig['data'];
  params?: AxiosRequestConfig['params'];
}

const axiosBaseQuery = (): BaseQueryFn<AxiosBaseQueryArgs> => {
  return async ({ url, method, data, params }) => {
    try {
      const result = await axiosInstance({
        url,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      const error = axiosError as AxiosError;
      return {
        error: {
          status: error.response?.status || 'FETCH_ERROR',
          data: error.response?.data || error.message,
        },
      };
    }
  };
};

export default axiosBaseQuery;
