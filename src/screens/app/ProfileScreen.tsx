import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
    const { signOut } = useAuth();

    return (
        <View style={styles.container}>
            <Text>Tela de Perfil</Text>
            <View style={{ marginTop: 20 }}>
                <Button title="Sair (Logout)" onPress={signOut} color="#FF3B30" />
            </View>
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