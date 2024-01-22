import { ValidateDomainRequest, ProxyUpdateRequest,
        HttpsSetupRequest, GetAllProxiesResponse, UserCreateRequest,
        RegisterRequest, LoginRequest, DockerGetPorts,
        DockerGetContainers, ProxyCreateRequest, SetupResponse, BasicDataResponse } from '@backend/types';
import { User } from '@backend/models/Users/User';
import { Proxy } from '@backend/models/Proxy/Proxy';
import { Certificate } from '@backend/models/Certificates/Certificate';
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Add meta tag
declare module 'axios' {
    export interface InternalAxiosRequestConfig {
      meta?: any;
    }
}

class RestApiClient {
    private axios: AxiosInstance;
    private baseURL: string;
    
    constructor () {

        this.baseURL = localStorage.getItem('apiOverride') ?? '/api';

        this.axios = axios.create({
            baseURL: this.baseURL,
            timeout: 5000
        });

        this.axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
            if (config.meta?.noAuth) return config;

            // Add auth header
            if (!localStorage.getItem('token')) {
                throw Error('No token found');
            }

            config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;

            return config;
        }, undefined);

        // Detect logouts
        this.axios.interceptors.response.use(undefined, (error) => {
            if (error?.response?.status === 401 && error?.config?.meta?.noAuth !== true) {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }

            throw error;
        });
    }

    async login(request: LoginRequest) {
        return this.axios.post('/login', request, { meta: { noAuth: true } } as InternalAxiosRequestConfig);
    }

    async register(request: RegisterRequest) {
        return this.axios.post('/register', request, { meta: { noAuth: true } } as InternalAxiosRequestConfig);
    }

    async createUser(request: UserCreateRequest) {
        return this.axios.post('/users', request, { meta: { noAuth: true } } as InternalAxiosRequestConfig);
    }

    async getAllProxies(): Promise<AxiosResponse<GetAllProxiesResponse>> {
        return this.axios.get('/proxy');
    }

    async getProxy(id: number): Promise<AxiosResponse<Proxy>> {
        return this.axios.get(`/proxy/${id}`);
    }

    async updateProxy(id: string, request: ProxyUpdateRequest): Promise<AxiosResponse<Proxy>> {
        return this.axios.put(`/proxy/${id}`, request);
    }

    async deleteProxy(id: string): Promise<AxiosResponse<Proxy>> {
        return this.axios.delete(`/proxy/${id}`);
    }

    async getDockerContainers(): Promise<AxiosResponse<DockerGetContainers>> {
        return this.axios.get('/docker/containers');
    }

    async getDockerPorts(container_id: string): Promise<AxiosResponse<DockerGetPorts>> {
        return this.axios.get(`/docker/ports/${container_id}`);
    }

    async createProxy(request: ProxyCreateRequest): Promise<AxiosResponse<any>> {
        return this.axios.post('/proxy', request);
    }

    async updateProxies(): Promise<AxiosResponse<any>> {
        return this.axios.post('/proxy/update');
    }

    async generateCertificate(domain: string): Promise<AxiosResponse<any>> {
        return this.axios.post(`/certificates/generate/${domain}`, undefined, { timeout: 60000 });
    }

    async setupHttps(request: HttpsSetupRequest) {
        return this.axios.post('/https/setup', request);
    }

    async checkSetup(): Promise<AxiosResponse<SetupResponse>> {
        return this.axios.get('/setup', { meta: { noAuth: true } } as InternalAxiosRequestConfig);
    }

    async validateDomainConnection(domain: string): Promise<{ success: boolean, message: string }> {
        return (await this.axios.post(`/identify/domain/${domain}`, undefined, { timeout: 60000 })).data;
    }

    async validateDestinationConnection(request: ValidateDomainRequest): Promise<AxiosResponse<{ success: boolean, message: string }>> {
        return (await this.axios.post(`/identify/destination/`, request, { timeout: 60000 }));
    }

    async getLocalPorts(): Promise<AxiosResponse<any>> {
        return this.axios.get('/hostsystem/local_ports');
    }

    async getAllUsers(): Promise<User[]> {
        return this.axios.get('/users');
    }

    async getHttpsTosUrl(): Promise<string> {
        return this.axios.get('/https/tos');
    }

    async getHttpsValidation(): Promise<boolean> {
        return this.axios.get('/https/validate');
    }

    async setValidation(status: boolean): Promise<void> {
        return this.axios.put('/setup/validate', { status });
    }

    async getAllCertificates(): Promise<AxiosResponse<BasicDataResponse<Certificate>>> {
        const response = await this.axios.get('/certificates');
        response.data.rows.forEach((row: Certificate) => row.expires = new Date(row.expires));
        return response;
    }
}

export default new RestApiClient();