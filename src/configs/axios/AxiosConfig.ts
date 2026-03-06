import axios from 'axios';
import { getStringDataFromLocal } from '../localStorage/AppLocalStorage';
import { BACKEND_BASE_URL } from '../../environments/env';

const axiosInstance = axios.create({
    baseURL: `${BACKEND_BASE_URL}`,
});

axiosInstance.interceptors.request.use(async (config) => {
    const jwtKey = 'token';
    const token = await getStringDataFromLocal(jwtKey);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
},
    (error) => Promise.reject(error)
);

const responseFunc = (response: any) => {
    return response;
};

const errorFunc = (error: any) => {
    return Promise.reject(error);
};

axiosInstance.interceptors.response.use(responseFunc, errorFunc);

export default axiosInstance;
