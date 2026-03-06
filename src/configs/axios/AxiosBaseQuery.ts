import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { AxiosError, AxiosRequestConfig } from 'axios';
import axiosInstance from './AxiosConfig';

const axiosBaseQuery =
    (): BaseQueryFn<{
        url: string;
        method: AxiosRequestConfig['method'];
        data?: AxiosRequestConfig['data'];
        params?: AxiosRequestConfig['params'];
    }> =>
    async ({ url, method, data, params }) => {
        try {
            const result = await axiosInstance({ url, method, data, params });
            console.log('API Request:', result.data);
            return { data: result.data };
        } catch (axiosError) {
            let err = axiosError as AxiosError;
            return {
                error: {
                    status: err.response?.status || 'FETCH_ERROR',
                    data: err.response?.data || err.message,
                },
            };
        }
    };

export default axiosBaseQuery;
