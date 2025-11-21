import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import HomeScreen from '../screens/app/HomeScreen';
import MatchesScreen from '../screens/app/MatchesScreen';
import ChatScreen from '../screens/app/ChatScreen';
import ChatMessageScreen from '../screens/app/ChatMessageScreen';
import PersonalProfileScreen from '../screens/app/PersonalProfileScreen';
import EditProfileScreen from '../screens/app/EditProfileScreen';
import ConfigAppScreen from '../screens/app/config/ConfigAppScreen';


export type HomeStackParamList = {
    Home: undefined;
};

export type MatchesStackParamList = {
    Matches: undefined;
};

export type ChatStackParamList = {
    ChatList: undefined;
    ChatMessage: { matchId: string };
};

export type ProfileStackParamList = {
    PersonalProfile: undefined;
    EditProfile: undefined;
    ConfigApp: undefined;
};

export type AppTabParamList = {
    HomeStack: undefined;
    MatchesStack: undefined;
    ChatStack: undefined;
    ProfileStack: undefined;
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
        <MatchesStack.Screen
            name="Matches"
            component={MatchesScreen}
            options={{ title: 'Curtidas' }}
        />
    </MatchesStack.Navigator>
)

const ChatStack = createNativeStackNavigator<ChatStackParamList>();
const ChatNavigator = () => (
    <ChatStack.Navigator>
        <ChatStack.Screen name="ChatList" component={ChatScreen} options={{ title: 'Conversas' }} />
        <ChatStack.Screen name="ChatMessage" component={ChatMessageScreen} />
    </ChatStack.Navigator>
);

const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const ProfileNavigator = () => (
    <ProfileStack.Navigator>
        <ProfileStack.Screen
            name="PersonalProfile"
            component={PersonalProfileScreen}
            options={{ headerShown: false }}
        />
        <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil' }} />
        <ProfileStack.Screen
            name="ConfigApp"
            component={ConfigAppScreen}
            options={{ headerShown: false }}
        />
    </ProfileStack.Navigator>
);


const Tab = createBottomTabNavigator<AppTabParamList>();

export default function AppTabNavigator() {
    const { colors, isDark } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    backgroundColor: isDark ? colors.card : colors.background,
                    borderTopColor: colors.border,
                },
                tabBarIcon: ({ color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    if (route.name === 'HomeStack') {
                        iconName = 'home-outline';
                    } else if (route.name === 'MatchesStack') {
                        iconName = 'heart-outline';
                    } else if (route.name === 'ChatStack') {
                        iconName = 'chatbubbles-outline';
                    } else if (route.name === 'ProfileStack') {
                        iconName = 'person-outline';
                    } else {
                        iconName = 'alert-circle-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="HomeStack" component={HomeNavigator} options={{ title: 'Home' }} />
            <Tab.Screen name="MatchesStack" component={MatchesNavigator} options={{ title: 'Matches' }} />

            <Tab.Screen
                name="ChatStack"
                component={ChatNavigator}
                options={({ route }) => ({
                    title: 'Conversas',
                    tabBarStyle: ((route) => {
                        const routeName = getFocusedRouteNameFromRoute(route) ?? 'ChatList';

                        if (routeName === 'ChatMessage') {
                            return { display: 'none' };
                        }

                        return {
                            backgroundColor: isDark ? colors.card : colors.background,
                            borderTopColor: colors.border,
                        };
                    })(route),
                })}
            />

            <Tab.Screen name="ProfileStack" component={ProfileNavigator} options={{ title: 'Perfil' }} />
        </Tab.Navigator>
    );
}