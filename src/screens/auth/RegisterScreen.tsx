import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    Alert,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AppNavigation';

type RegisterScreenProps = NativeStackScreenProps<AuthStackParamList, 'Cadastro'>;

export default function RegisterScreen({ navigation }: RegisterScreenProps) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { signIn } = useAuth();
    const { colors } = useTheme();

    const handleRegister = async () => {
        if (isLoading) return;
        setIsLoading(true);

        try {
            const token = 'simulated-jwt-token-from-api-register';
            await signIn(token);
        } catch (error) {
            console.error('Falha no cadastro:', error);
            Alert.alert(
                'Erro no Cadastro',
                'Não foi possível criar a conta. Tente novamente.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <View style={styles.innerContainer}>
                <Text style={[styles.title, { color: colors.text }]}>Crie sua Conta</Text>

                <TextInput
                    style={[
                        styles.input,
                        { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
                    ]}
                    placeholder="Nome Completo"
                    placeholderTextColor="#999"
                    value={nome}
                    onChangeText={setNome}
                    autoCapitalize="words"
                />
                <TextInput
                    style={[
                        styles.input,
                        { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
                    ]}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={[
                        styles.input,
                        { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
                    ]}
                    placeholder="Senha"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <Button
                    title={isLoading ? 'Criando...' : 'Cadastrar'}
                    onPress={handleRegister}
                    disabled={isLoading}
                    color={colors.primary}
                />

                <View style={styles.footer}>
                    <Text style={{ color: colors.text }}>Já tem uma conta?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text style={[styles.link, { color: colors.primary }]}> Faça Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    footer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    link: {
        fontWeight: 'bold',
    },
});