import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Importação das Telas Principais
import HomeScreen from '../screens/app/HomeScreen';
import MatchesScreen from '../screens/app/MatchesScreen';
import MatchDetailScreen from '../screens/app/MatchDetailScreen';
import RecruiterProfileScreen from '../screens/app/RecruiterProfileScreen';
import CompanyProfileScreen from '../screens/app/CompanyProfileScreen';
import ChatScreen from '../screens/app/ChatScreen';
import ChatMessageScreen from '../screens/app/ChatMessageScreen';
import ProfileScreen from '../screens/app/PersonalProfileScreen'; // Seu perfil pessoal

// Importação das Telas de Configuração
import EditProfileScreen from '../screens/app/config/EditProfileScreen';
import ConfigAppScreen from '../screens/app/config/ConfigAppScreen';
import NotificationScreen from '../screens/app/config/NotificationScreen';
import PrivacySecurityScreen from '../screens/app/config/PrivacySecurityScreen';
import HelpSupportScreen from '../screens/app/config/HelpSupportScreen';
import AboutAppScreen from '../screens/app/config/AboutAppScreen';
import PersonalDataScreen from '../screens/app/config/PersonalDataScreen';
import DeleteProfileScreen from '../screens/app/config/privacy/DeleteProfileScreen';
import ChangePasswordScreen from '../screens/app/config/privacy/ChangePasswordScreen';
import LgpdRequestScreen from '../screens/app/config/privacy/LgpdRequestScreen';
import TwoFactorScreen from '../screens/app/config/privacy/TwoFactorScreen';


export type HomeStackParamList = {
    Home: undefined;
};

export type MatchStackParamList = {
    MatchesList: undefined;
    MatchDetail: { matchData: any };
    RecruiterProfile: { recruiterId: string; name: string };
    CompanyProfile: { companyData: any };
};

export type ChatStackParamList = {
    ChatList: undefined;
    ChatMessage: { matchId: string; name?: string; photo?: string; recruiterId?: string };
    RecruiterProfile: { recruiterId: string; name: string };
    CompanyProfile: { companyData: any };
};

export type ProfileStackParamList = {
    Profile: undefined;
    EditProfile: { profileData?: any };
    ConfigApp: undefined;
    Notifications: undefined;
    PrivacySecurity: undefined;
    HelpSupport: undefined;
    AboutApp: undefined;
    PersonalData: undefined;
    DeleteProfile: undefined;
    ChangePassword: undefined;
    LgpdRequest: undefined;
    TwoFactor: undefined;
};

export type AppTabParamList = {
    HomeStack: undefined;
    MatchesStack: undefined;
    ChatStack: undefined;
    ProfileStack: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const MatchStack = createNativeStackNavigator<MatchStackParamList>();
const ChatStack = createNativeStackNavigator<ChatStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

// --- STACKS ---

const HomeNavigator = () => (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
        <HomeStack.Screen name="Home" component={HomeScreen} />
    </HomeStack.Navigator>
);

const MatchNavigator = () => (
    <MatchStack.Navigator screenOptions={{ headerShown: false }}>
        <MatchStack.Screen name="MatchesList" component={MatchesScreen} />
        <MatchStack.Screen name="MatchDetail" component={MatchDetailScreen} />
        <MatchStack.Screen name="RecruiterProfile" component={RecruiterProfileScreen} />
        <MatchStack.Screen name="CompanyProfile" component={CompanyProfileScreen} />
    </MatchStack.Navigator>
);

const ChatNavigator = () => (
    <ChatStack.Navigator screenOptions={{ headerShown: false }}>
        <ChatStack.Screen name="ChatList" component={ChatScreen} />
        <ChatStack.Screen name="ChatMessage" component={ChatMessageScreen} />
        {/* Chat também precisa acessar perfis */}
        <ChatStack.Screen name="RecruiterProfile" component={RecruiterProfileScreen} />
        <ChatStack.Screen name="CompanyProfile" component={CompanyProfileScreen} />
    </ChatStack.Navigator>
);

const ProfileNavigator = () => (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
        {/* Tela Principal do Perfil */}
        <ProfileStack.Screen name="Profile" component={ProfileScreen} />

        {/* Configurações e Edição */}
        <ProfileStack.Screen name="ConfigApp" component={ConfigAppScreen} />
        <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />

        {/* Telas do Menu de Configuração */}
        <ProfileStack.Screen name="Notifications" component={NotificationScreen} />
        <ProfileStack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
        <ProfileStack.Screen name="DeleteProfile" component={DeleteProfileScreen} />
        <ProfileStack.Screen name="HelpSupport" component={HelpSupportScreen} />
        <ProfileStack.Screen name="AboutApp" component={AboutAppScreen} />
        <ProfileStack.Screen name="PersonalData" component={PersonalDataScreen} />

        <ProfileStack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <ProfileStack.Screen name="LgpdRequest" component={LgpdRequestScreen} />
        <ProfileStack.Screen name="TwoFactor" component={TwoFactorScreen} />
    </ProfileStack.Navigator>
);

// --- TAB NAVIGATOR PRINCIPAL ---

export default function AppTabNavigator() {
    const { colors, isDark } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopColor: colors.border,
                    height: 60,
                    paddingBottom: 10,
                    paddingTop: 10,
                    elevation: 0,
                    shadowOpacity: 0,
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: isDark ? '#666' : '#999',
                tabBarIcon: ({ focused, color }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home';

                    if (route.name === 'HomeStack') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'MatchesStack') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === 'ChatStack') {
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    } else if (route.name === 'ProfileStack') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={focused ? 28 : 24} color={color} />;
                },
            })}
        >
            <Tab.Screen name="HomeStack" component={HomeNavigator} />
            <Tab.Screen name="MatchesStack" component={MatchNavigator} />
            <Tab.Screen name="ChatStack" component={ChatNavigator} />
            <Tab.Screen name="ProfileStack" component={ProfileNavigator} />
        </Tab.Navigator>
    );
}