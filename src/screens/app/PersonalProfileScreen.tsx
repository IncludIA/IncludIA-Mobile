import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ConfigAppScreen() {
    return (
        <View style={styles.container}>
            <Text>Tela de Configurações do App</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});