import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';

// Importe o novo navegador de Abas
import AppTabNavigator from './AppTabNavigator';

// Importe apenas as telas de Auth e Splash
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import SplashScreen from '../screens/app/SplashScreen';
import WelcomeScreen from '../screens/auth/WelcomeScreen';

// --- DEFINIÇÃO DE TIPOS ---

export type AuthStackParamList = {
    Welcome: undefined;
    Cadastro: undefined;
    Login: undefined;
};

export type RootStackParamList = {
    Auth: undefined;
    App: undefined;
};


const Auth = createNativeStackNavigator<AuthStackParamList>();
const AuthNavigator = () => {
    return (
        <Auth.Navigator
            initialRouteName="Welcome"
            screenOptions={{ headerShown: false }}
        >
            <Auth.Screen name="Welcome" component={WelcomeScreen} />
            <Auth.Screen name="Cadastro" component={RegisterScreen} />
            <Auth.Screen name="Login" component={LoginScreen} />
        </Auth.Navigator>
    );
};

const Root = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const { isLoading, userToken } = useAuth();

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <Root.Navigator screenOptions={{ headerShown: false }}>
            {userToken == null ? (
                <Root.Screen name="Auth" component={AuthNavigator} />
            ) : (
                <Root.Screen name="App" component={AppTabNavigator} />
            )}
        </Root.Navigator>
    );
}