import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MatchesScreen() {
    return (
        <View style={styles.container}>
            <Text>Tela de Matches</Text>
            <Text style={styles.subtitle}>
                Aqui você verá quem curtiu você e quem você curtiu.
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subtitle: {
        marginTop: 10,
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});