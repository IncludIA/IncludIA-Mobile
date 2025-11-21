import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Alert } from 'react-native';
import { jwtDecode } from 'jwt-decode';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import api from '../services/api';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextData {
    isLoading: boolean;
    userToken: string | null;
    signIn: (email: string, pass: string) => Promise<void>;
    signInSocial: (token: string, provider: 'GOOGLE' | 'APPLE', email?: string, nome?: string) => Promise<void>;
    signOut: () => Promise<void>;
    promptAsyncGoogle: () => Promise<any>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState<string | null>(null);

    const [request, response, promptAsyncGoogle] = Google.useAuthRequest({
        // Configure seus IDs do Google Cloud aqui se tiver
        androidClientId: "SEU_ANDROID_CLIENT_ID",
        iosClientId: "SEU_IOS_CLIENT_ID",
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { authentication } = response;
            // Em produção, enviaríamos este token para o backend validar
            signInSocial(authentication!.accessToken, 'GOOGLE');
        }
    }, [response]);

    useEffect(() => {
        const loadStorageData = async () => {
            try {
                const token = await SecureStore.getItemAsync('userToken');
                if (token) {
                    // Verifica expiração simples (opcional)
                    const decoded: any = jwtDecode(token);
                    if (decoded.exp * 1000 < Date.now()) {
                        await signOut();
                    } else {
                        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                        setUserToken(token);
                    }
                }
            } catch {
                // Token inválido ou corrompido
                await signOut();
            } finally {
                setIsLoading(false);
            }
        };
        loadStorageData();
    }, []);

    const signIn = async (email: string, pass: string) => {
        try {
            const { data } = await api.post('/auth/login', { email, senha: pass });
            await handleSuccess(data.token);
        } catch (error: any) {
            console.error("Login Error:", error.response?.data || error.message);
            throw error;
        }
    };

    const signInSocial = async (token: string, provider: 'GOOGLE' | 'APPLE', email?: string, nome?: string) => {
        try {
            const { data } = await api.post('/auth/social-login', { token, provider, email, nome });
            await handleSuccess(data.token);
        } catch (error) {
            Alert.alert('Erro', 'Falha no login social. Verifique o backend.');
        }
    };

    const handleSuccess = async (token: string) => {
        await SecureStore.setItemAsync('userToken', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUserToken(token);
    };

    const signOut = async () => {
        await SecureStore.deleteItemAsync('userToken');
        setUserToken(null);
        delete api.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ isLoading, userToken, signIn, signInSocial, signOut, promptAsyncGoogle }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);