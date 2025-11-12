import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

import HomeScreen from '../screens/app/HomeScreen';
import ProfileScreen from '../screens/app/ProfileScreen';
import ChatScreen from '../screens/app/ChatScreen';
import MatchesScreen from '../screens/app/MatchesScreen';
import SplashScreen from '../screens/app/SplashScreen';


export type AuthStackParamList = {
    Login: undefined;
    Cadastro: undefined;
};

export type HomeStackParamList = {
    Home: undefined;
};

export type MatchesStackParamList = {
    Matches: undefined;
    Chat: { matchId: string };
};

export type ProfileStackParamList = {
    Profile: undefined;
};

export type AppTabParamList = {
    HomeStack: undefined;
    MatchesStack: undefined;
    ProfileStack: undefined;
};

export type RootStackParamList = {
    Auth: undefined;
    App: undefined;
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const HomeNavigator = () => (
    <HomeStack.Navigator>
        <HomeStack.Screen name="Home" component={HomeScreen} options={{ title: 'Includ.IA' }} />
    </HomeStack.Navigator>
);

const MatchesStack = createNativeStackNavigator<MatchesStackParamList>();
const MatchesNavigator = () => (
    <MatchesStack.Navigator>
        <MatchesStack.Screen name="Matches" component={MatchesScreen} />
        <MatchesStack.Screen name="Chat" component={ChatScreen} />
    </MatchesStack.Navigator>
);

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const ProfileNavigator = () => (
    <ProfileStack.Navigator>
        <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Meu Perfil' }} />
    </ProfileStack.Navigator>
);

const Tab = createBottomTabNavigator<AppTabParamList>();
const AppTabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="HomeStack" component={HomeNavigator} options={{ title: 'Home' }} />
            <Tab.Screen name="MatchesStack" component={MatchesNavigator} options={{ title: 'Matches' }} />
            <Tab.Screen name="ProfileStack" component={ProfileNavigator} options={{ title: 'Perfil' }} />
        </Tab.Navigator>
    );
};

const Auth = createNativeStackNavigator<AuthStackParamList>();
const AuthNavigator = () => {
    return (
        <Auth.Navigator screenOptions={{ headerShown: false }}>
            <Auth.Screen name="Login" component={LoginScreen} />
            <Auth.Screen name="Cadastro" component={RegisterScreen} />
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