import React from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AppNavigation';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Includ.IA</Text>
                <Text style={styles.subtitle}>
                    Recrutamento Inclusivo na Velocidade do Swipe.
                </Text>
            </View>
            <View style={styles.actions}>
                <Button
                    title="Criar Conta"
                    onPress={() => navigation.navigate('Cadastro')}
                />
                <View style={{ marginVertical: 8 }} />
                <Button
                    title="Entrar"
                    onPress={() => navigation.navigate('Login')}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    actions: {
        padding: 20,
        paddingBottom: 40,
    },
});