// services/api.service.ts
import axios, { AxiosInstance } from 'axios';
import { API_URL } from '../Config';

class ApiService {
    private api: AxiosInstance;
    private static instance: ApiService;

    private constructor() {
        this.api = axios.create({
            baseURL: API_URL || 'http://localhost:8080/api',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add request interceptor
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    public getApi(): AxiosInstance {
        return this.api;
    }
}

export const getErrorMessage = (error: any): string => {
    return error.response?.data?.message || 'An unexpected error occurred';
};

export const api = ApiService.getInstance().getApi();