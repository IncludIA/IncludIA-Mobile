import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

// Telas de Autenticação
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Navegadores Principais Separados
import CandidateTabNavigator from './CandidateTabNavigator';
import RecruiterTabNavigator from './RecruiterTabNavigator';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cadastro" component={RegisterScreen} />
    </Stack.Navigator>
);

export default function AppNavigation() {
    const { isDark } = useTheme();
    const { isLoading, userToken, userRole } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: isDark ? '#000' : '#FFF' }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <NavigationContainer theme={isDark ? { dark: true, colors: { primary: '#007AFF', background: '#000', card: '#1C1C1E', text: '#FFF', border: '#333', notification: '#FF3B30' } } : undefined}>
            {userToken ? (
                userRole === 'ROLE_RECRUITER' ? (
                    <RecruiterTabNavigator />
                ) : (
                    <CandidateTabNavigator />
                )
            ) : (
                <AuthStack />
            )}
        </NavigationContainer>
    );
}