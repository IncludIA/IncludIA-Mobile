import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ConfigApp from '../screens/app/config/ConfigAppScreen';

export type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Cadastro: undefined;
    Home: undefined;
    Matches: undefined;
    Perfil: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="ConfigApp" component={ConfigApp} />

            </Stack.Navigator>
        </NavigationContainer>
    );
}