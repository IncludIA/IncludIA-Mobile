import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const api = axios.create({
    baseURL: 'http://192.168.15.51:8080', // Seu IP atual confirmado
    timeout: 15000, // Aumentei o timeout para redes lentas
});

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 403) {
            console.error('Sessão expirada ou não autorizada.');
        }
        return Promise.reject(error);
    }
);

export default api;