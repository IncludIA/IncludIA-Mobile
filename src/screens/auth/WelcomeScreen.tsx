import React from 'react';
import { View, Text, StyleSheet, Button, SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AppNavigation';
import { useTheme } from '../../context/ThemeContext';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>Includ.IA</Text>
                <Text style={[styles.subtitle, { color: colors.text }]}>
                    Recrutamento Inclusivo na Velocidade do Swipe.
                </Text>
            </View>
            <View style={styles.actions}>
                <Button
                    title="Criar Conta"
                    onPress={() => navigation.navigate('Cadastro')}
                    color={colors.primary}
                />
                <View style={{ marginVertical: 8 }} />
                <Button
                    title="Entrar"
                    onPress={() => navigation.navigate('Login')}
                    color={colors.primary}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    actions: {
        padding: 20,
        paddingBottom: 40,
    },
});