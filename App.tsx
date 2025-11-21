import React from 'react';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import AppNavigation from './src/navigation/AppNavigation';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <StatusBar barStyle="default" />
        <AppNavigation />
      </ThemeProvider>
    </AuthProvider>
  );
}