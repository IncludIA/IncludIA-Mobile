import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

import HomeScreen from '../screens/app/HomeScreen';
import ExploreScreen from '../screens/app/ExploreScreen';
import MatchesScreen from '../screens/app/MatchesScreen';
import ChatScreen from '../screens/app/ChatScreen';
import ChatMessageScreen from '../screens/app/ChatMessageScreen';
import ProfileScreen from '../screens/app/ProfileScreen';
import EditProfileScreen from '../screens/app/config/EditProfileScreen';
import ConfigAppScreen from '../screens/app/config/ConfigAppScreen';
import MatchDetailScreen from '../screens/app/MatchDetailScreen';
import RecruiterProfileScreen from '../screens/app/RecruiterProfileScreen';
import CompanyProfileScreen from '../screens/app/CompanyProfileScreen';


export type HomeStackParamList = {
    Home: undefined;
};

export type MatchStackParamList = {
    MatchesList: undefined;
    MatchDetail: { matchData: any };
    RecruiterProfile: { recruiterId: string; name: string }; // Nova Rota
    CompanyProfile: { companyData: any }; // Nova Rota
};

export type ChatStackParamList = {
    ChatList: undefined;
    ChatMessage: { matchId: string; name?: string; photo?: string };
};

export type ProfileStackParamList = {
    Profile: undefined;
    EditProfile: undefined;
    ConfigApp: undefined;
};

export type AppTabParamList = {
    HomeStack: undefined;
    Explore: undefined;
    MatchesStack: undefined;
    ChatStack: undefined;
    ProfileStack: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const MatchStack = createNativeStackNavigator<MatchStackParamList>();
const ChatStack = createNativeStackNavigator<ChatStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();


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
    </ChatStack.Navigator>
);

const ProfileNavigator = () => (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
        <ProfileStack.Screen name="Profile" component={ProfileScreen} />
        <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
        <ProfileStack.Screen name="ConfigApp" component={ConfigAppScreen} />
    </ProfileStack.Navigator>
);


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
                    let iconName: any = 'home';
                    if (route.name === 'HomeStack') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'MatchesStack') iconName = focused ? 'heart' : 'heart-outline';
                    else if (route.name === 'ChatStack') iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    else if (route.name === 'ProfileStack') iconName = focused ? 'person' : 'person-outline';
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