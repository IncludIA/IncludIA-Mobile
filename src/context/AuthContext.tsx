import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';

interface AuthContextData {
    isLoading: boolean;
    userToken: string | null;
    signIn: (token: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState<string | null>(null);

    useEffect(() => {
        const bootstrapAsync = async () => {
            let token: string | null = null;
            try {
                token = await SecureStore.getItemAsync('userToken');
            } catch (e) {
                console.error('Falha ao carregar o token', e);
            }

            setUserToken(token);
            setIsLoading(false);
        };

        bootstrapAsync();
    }, []);

    const authContextValue = React.useMemo(
        () => ({
            isLoading,
            userToken,
            signIn: async (token: string) => {
                try {
                    await SecureStore.setItemAsync('userToken', token);
                    setUserToken(token);
                } catch (e) {
                    console.error('Falha ao salvar o token', e);
                }
            },
            signOut: async () => {
                try {
                    await SecureStore.deleteItemAsync('userToken');
                    setUserToken(null);
                } catch (e) {
                    console.error('Falha ao remover o token', e);
                }
            },
        }),
        [isLoading, userToken]
    );

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};