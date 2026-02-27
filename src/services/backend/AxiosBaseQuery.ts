import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { AxiosError, AxiosRequestConfig } from 'axios';
import api from '../api';

const axiosBaseQuery =
    (): BaseQueryFn<{
        url: string;
        method: AxiosRequestConfig['method'];
        data?: AxiosRequestConfig['data'];
        params?: AxiosRequestConfig['params'];
        headers?: AxiosRequestConfig['headers'];
    }> =>
    async ({ url, method, data, params, headers }) => {
        console.log(`[API Request] ${method?.toUpperCase()} ${url}`, { data, params });
        try {
            const result = await api({ url, method, data, params, headers });
            console.log(`[API Success] ${url}`, result.data);
            return { data: result.data };
        } catch (axiosError) {
            let err = axiosError as AxiosError;
            console.error(`[API Error] ${url}`, {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });
            return {
                error: {
                    status: err.response?.status || 'FETCH_ERROR',
                    data: err.response?.data || err.message,
                },
            };
        }
    };

export default axiosBaseQuery;
