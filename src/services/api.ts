import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
    baseURL: 'http://192.168.15.51:8080',
    timeout: 10000,
});

api.interceptors.request.use(async (config) => {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch (error) {
        console.log("Erro ao recuperar token", error);
    }
    return config;
});

api.interceptors.response.use(
    response => response,
    error => {
        if (!error.response) {
            console.log("API Offline ou Erro de Rede. Usando dados locais.");
        }
        return Promise.reject(error);
    }
);

export default api;