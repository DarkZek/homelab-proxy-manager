import { ProxyCreateRequest } from '@backend/types/requests/Proxy/ProxyCreateRequest';
import { DockerGetContainers } from '@backend/types/responses/Docker/DockerGetContainers';
import { LoginRequest } from '@backend/types/requests/Auth/LoginRequest';
import { GetAllProxiesResponse } from '@backend/types/responses/Proxy/GetAllProxiesResponse';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

class RestApiClient {
    private axios: AxiosInstance;
    
    constructor () {

        const baseURL = localStorage.getItem('apiOverride') ?? '/api';

        this.axios = axios.create({
            baseURL,
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

    async getDockerContainers(): Promise<AxiosResponse<DockerGetContainers>> {
        return this.axios.get('/docker/containers');
    }

    async getDockerPorts(container_id: string): Promise<AxiosResponse<DockerGetContainers>> {
        return this.axios.get(`/docker/ports/${container_id}`);
    }

    async createProxy(request: ProxyCreateRequest): Promise<AxiosResponse<any>> {
        return this.axios.post('/proxy', request);
    }
}

export default new RestApiClient();