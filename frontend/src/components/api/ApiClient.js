import axios from "axios"
import { useAuth } from "./security/AuthContext";

export const apiClient = axios.create(
    {
        baseURL: 'http://localhost:8080'
    }
);

export const useAxiosInterceptor = () => {
    const { handleSessionExpired, token } = useAuth();

    apiClient.interceptors.request.use(
        config => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        error => Promise.reject(error)
    );


    apiClient.interceptors.response.use(
        response => response,
        error => {
            if (error.response && error.response.status === 401) {
                handleSessionExpired();
            }
            return Promise.reject(error);
        }
    );
};