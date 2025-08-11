import axios, { AxiosError, AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios';
import { getApiUrl, isDevelopment } from '../../config/environment';
import { ApiResponse } from './types';

// Create axios instance with your existing configuration
export const createApiClient = (): AxiosInstance => {
    const client = axios.create({
        baseURL: getApiUrl(),
        timeout: 10 * 1000,
        headers: {
            'Content-Type': 'application/json'
        },
        withCredentials: true
    });

    // Your existing request interceptor
    client.interceptors.request.use(
        (config) => {
            if (isDevelopment()) {
                console.log(`API request :${config.method?.toUpperCase()} ${config.url}`);
                console.log('   Headers:', config.headers);
                console.log('   Data:', config.data);

                (config as any).metadata = { startTime: new Date() };
            }
            return config;
        },
        (error: AxiosError) => {
            if (isDevelopment()) {
                console.log('Request Error: ', error);
            }
            return Promise.reject(error);
        }
    );


    client.interceptors.response.use(
        (response) => {
            if (isDevelopment()) {
                const duration = new Date().getTime() - (response.config as any).metadata?.startTime?.getTime();
                console.log(`API Response: ${response.status} ${response.config.url} (${duration}ms)`);
            }
            return response;
        },
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                if (error.config.url?.includes('/auth/login') ||
                    error.config.url?.includes('/auth/refresh-token') ||
                    error.config.url?.includes('/auth/logout')) {
                    return Promise.reject(error);
                }

                originalRequest._retry = true;

                try {
                    if (isDevelopment()) {
                        console.log("Access token expired, attempting refresh...");
                    }

                    const refreshResponse = await client.post("/auth/refresh-token");

                    if (refreshResponse.data.success) {
                        if (isDevelopment()) {
                            console.log("Token refreshed successfully, retrying original request...");
                        }
                        return client(originalRequest);
                    }

                    throw new Error("Refresh Token invalid");
                } catch (error) {
                    if (isDevelopment()) {
                        console.log("Token refresh failed, user needs to login again");
                    }


                    const { useAuthStore } = await import('../../store/authStore');
                    useAuthStore.getState().clearAuth();

                    return Promise.reject(error);
                }
            }

            if (isDevelopment()) {
                console.error(`  API Error: ${error.response?.status} ${error.message}`);
                console.error('   URL:', error.config?.url);
                console.error('   Response Data:', error.response?.data);
            }

            return Promise.reject(error);
        }
    );

    return client;
};

export const apiClient = createApiClient();
export const get = <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    return apiClient.get<ApiResponse<T>>(url, config);
}
export const post = <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    return apiClient.post<ApiResponse<T>>(url, data, config)
}
export const del = <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponse<T>>> => {
    return apiClient.delete<ApiResponse<T>>(url, config)
}
export const put = <T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
): Promise<AxiosResponse<ApiResponse<T>>> => {
    return apiClient.put<ApiResponse<T>>(url, data, config);
};

// Export for direct use (backward compatibility)
export default apiClient;
