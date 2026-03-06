import { BaseQueryFn } from '@reduxjs/toolkit/query';
import { AxiosError, AxiosRequestConfig } from 'axios';
import axiosInstance from '../../configs/axios/AxiosConfig';

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
            const result = await axiosInstance({ url, method, data, params, headers });
            console.log(`[API Success] ${url}`, result.data);
            return { data: result.data };
        } catch (axiosError) {
            let err = axiosError as AxiosError;
            const errorData = err.response?.data;
            
            console.error(`[API Error] ${method?.toUpperCase()} ${url}`, {
                status: err.response?.status,
                data: typeof errorData === 'string' && errorData.includes('<!DOCTYPE html>') 
                    ? '[HTML Response - check console/network]' 
                    : errorData,
                message: err.message
            });

            // If it's HTML, we might want to log a snippet of it to see the error title
            if (typeof errorData === 'string' && errorData.includes('<title>')) {
                const titleMatch = errorData.match(/<title>(.*?)<\/title>/);
                if (titleMatch) console.error(`[API Error Title] ${titleMatch[1]}`);
            }

            return {
                error: {
                    status: err.response?.status || 'FETCH_ERROR',
                    data: errorData || err.message,
                },
            };
        }
    };

export default axiosBaseQuery;
