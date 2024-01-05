import { LoginRequest } from '@backend/types/requests/Auth/LoginRequest';
import { GetAllProxiesResponse } from '@backend/types/responses/Proxy/GetAllProxiesResponse';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

class RestApiClient {
    private axios: AxiosInstance;
    
    constructor () {
        this.axios = axios.create({
            baseURL: 'http://localhost/api',
            timeout: 1000
        });

        this.axios.interceptors.request.use((config) => {
            if (config.url === '/login') return config;

            console.log(`Token: ${localStorage.getItem('token')}`)

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

    async getAllProxies(): Promise<AxiosResponse<GetAllProxiesResponse>> {
        return this.axios.get('/proxy');
    }
}

export default new RestApiClient();