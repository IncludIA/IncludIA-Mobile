import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

// Telas do Recrutador
import RecruiterDashboardScreen from '../screens/app/recruiter/RecruiterDashboardScreen';
import PostJobScreen from '../screens/app/recruiter/PostJobScreen';
import CandidateFeedScreen from '../screens/app/recruiter/CandidateFeedScreen';
import RecruiterProfileEditScreen from '../screens/app/recruiter/RecruiterProfileEditScreen';

// Telas Comuns
import NotificationScreen from '../screens/app/config/NotificationScreen';
import PrivacySecurityScreen from '../screens/app/config/PrivacySecurityScreen';
import HelpSupportScreen from '../screens/app/config/HelpSupportScreen';
import AboutAppScreen from '../screens/app/config/AboutAppScreen';
import PersonalDataScreen from '../screens/app/config/PersonalDataScreen';
import DeleteProfileScreen from '../screens/app/config/privacy/DeleteProfileScreen';
import ChangePasswordScreen from '../screens/app/config/privacy/ChangePasswordScreen';
import LgpdRequestScreen from '../screens/app/config/privacy/LgpdRequestScreen';
import TwoFactorScreen from '../screens/app/config/privacy/TwoFactorScreen';
import TermsOfUseScreen from '../screens/app/config/about/TermsOfUseScreen';
import PrivacyPolicyScreen from '../screens/app/config/about/PrivacyPolicyScreen';
import ChatMessageScreen from '../screens/app/chat/ChatMessageScreen';
import ChatScreen from '../screens/app/chat/ChatScreen';
import MatchDetailScreen from '../screens/app/candidate/MatchDetailScreen';
import MatchesScreen from '../screens/app/MatchesScreen';
import RecruiterProfileScreen from '../screens/app/candidate/RecruiterProfileScreen';
import ViewProfileScreen from '../screens/app/candidate/ViewProfileScreen';
import ConfigAppScreen from '../screens/app/config/ConfigAppScreen';
import VisibilityScreen from '../screens/app/config/privacy/VisibilityScreen';


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// --- STACKS ESPECÍFICAS DO RECRUTADOR ---

const DashboardStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Dashboard" component={RecruiterDashboardScreen} />
        <Stack.Screen name="PostJob" component={PostJobScreen} />
        <Stack.Screen name="CandidateFeed" component={CandidateFeedScreen} />
        <Stack.Screen name="ViewProfile" component={ViewProfileScreen} />
    </Stack.Navigator>
);

const MatchStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MatchesList" component={MatchesScreen} />
        <Stack.Screen name="MatchDetail" component={MatchDetailScreen} />
        <Stack.Screen name="RecruiterProfile" component={RecruiterProfileScreen} />
        <Stack.Screen name="ViewProfile" component={ViewProfileScreen} />
    </Stack.Navigator>
);

const ChatStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ChatList" component={ChatScreen} />
        <Stack.Screen name="ChatMessage" component={ChatMessageScreen} />
        <Stack.Screen name="ViewProfile" component={ViewProfileScreen} />
    </Stack.Navigator>
);

const ProfileStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Profile" component={RecruiterProfileEditScreen} />
        <Stack.Screen name="ConfigApp" component={ConfigAppScreen} />
        <Stack.Screen name="Notifications" component={NotificationScreen} />
        <Stack.Screen name="PrivacySecurity" component={PrivacySecurityScreen} />
        <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
        <Stack.Screen name="AboutApp" component={AboutAppScreen} />
        <Stack.Screen name="PersonalData" component={PersonalDataScreen} />
        <Stack.Screen name="DeleteProfile" component={DeleteProfileScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="LgpdRequest" component={LgpdRequestScreen} />
        <Stack.Screen name="TwoFactor" component={TwoFactorScreen} />
        <Stack.Screen name="Visibility" component={VisibilityScreen} />
        <Stack.Screen name="TermsOfUse" component={TermsOfUseScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    </Stack.Navigator>
);

export default function RecruiterTabNavigator() {
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
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: isDark ? '#666' : '#999',
                tabBarIcon: ({ focused, color }) => {
                    let iconName: any = 'home';
                    if (route.name === 'HomeTab') iconName = focused ? 'briefcase' : 'briefcase-outline';
                    else if (route.name === 'MatchesTab') iconName = focused ? 'heart' : 'heart-outline';
                    else if (route.name === 'ChatTab') iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                    else if (route.name === 'ProfileTab') iconName = focused ? 'person' : 'person-outline';
                    return <Ionicons name={iconName} size={focused ? 28 : 24} color={color} />;
                },
            })}
        >
            <Tab.Screen name="HomeTab" component={DashboardStack} />
            <Tab.Screen name="MatchesTab" component={MatchStack} />
            <Tab.Screen name="ChatTab" component={ChatStack} />
            <Tab.Screen name="ProfileTab" component={ProfileStack} />
        </Tab.Navigator>
    );
}