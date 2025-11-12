import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    DefaultTheme,
    DarkTheme,
    Theme as NavigationTheme,
} from '@react-navigation/native';

const colorsLight = {
    primary: '#007BFF',
    text: '#121212',
    background: '#FFFFFF',
    card: '#F5F5F5',
    border: '#DDDDDD',
    notification: '#FF3B30',
};

const colorsDark = {
    primary: '#007BFF',
    text: '#FFFFFF',
    background: '#121212',
    card: '#1E1E1E',
    border: '#2C2C2C',
    notification: '#FF3B30',
};

export const AppLightTheme: NavigationTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: colorsLight.primary,
        background: colorsLight.background,
        card: colorsLight.card,
        text: colorsLight.text,
        border: colorsLight.border,
        notification: colorsLight.notification,
    },
};

export const AppDarkTheme: NavigationTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        primary: colorsDark.primary,
        background: colorsDark.background,
        card: colorsDark.card,
        text: colorsDark.text,
        border: colorsDark.border,
        notification: colorsDark.notification,
    },
};

interface ThemeContextData {
    theme: 'light' | 'dark';
    isDark: boolean;
    colors: typeof colorsLight | typeof colorsDark;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const systemScheme = useColorScheme() || 'light';
    const [theme, setTheme] = useState(systemScheme);
    const isDark = theme === 'dark';
    const colors = isDark ? colorsDark : colorsLight;

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('@theme');
                if (savedTheme) {
                    setTheme(savedTheme as 'light' | 'dark');
                }
            } catch (e) {
                console.error('Failed to load theme.', e);
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        const newTheme = isDark ? 'light' : 'dark';
        setTheme(newTheme);
        try {
            await AsyncStorage.setItem('@theme', newTheme);
        } catch (e) {
            console.error('Failed to save theme.', e);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, isDark, colors, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};