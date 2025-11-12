import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text>Tela de Home (Swipe)</Text>
            <Text style={styles.subtitle}>
                É aqui que o componente de Swipe (Tinder-like) será renderizado.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    subtitle: {
        marginTop: 10,
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});