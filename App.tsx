import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigation';
import { AuthProvider } from './src/context/AuthContext';
import {
  ThemeProvider,
  useTheme,
  AppLightTheme,
  AppDarkTheme,
} from './src/context/ThemeContext';

const AppContent = () => {
  const { theme, isDark } = useTheme();
  const navigationTheme = theme === 'dark' ? AppDarkTheme : AppLightTheme;

  return (
    <NavigationContainer theme={navigationTheme}>
      <AuthProvider>
        <AppNavigator />
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </AuthProvider>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}