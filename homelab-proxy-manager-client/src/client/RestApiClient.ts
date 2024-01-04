import axios, { AxiosInstance } from 'axios';
import { LoginRequest } from '@shared/requests/Auth/LoginRequest';

class RestApiClient {
    private axios: AxiosInstance;
    
    constructor () {
        this.axios = axios.create({
            baseURL: '/api',
            timeout: 1000
        });

        this.axios.interceptors.request.use((config) => {
            if (config.url === '/login') return config;

            // Add auth header
            if (!localStorage.getItem('token')) {
                alert('logout')
                return Promise.reject();
            }
            config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;

            return config;
        }, (error) => {
            return Promise.reject(error);
        });
    }

    async login(request: LoginRequest) {
        return this.axios.post('/login', request);
    }

    async getAllProxies() {
        return this.axios.get('/proxy');
    }
}

export default new RestApiClient();