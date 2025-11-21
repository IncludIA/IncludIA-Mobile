import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ActivityIndicator, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as AppleAuthentication from 'expo-apple-authentication';
import api from '../../services/api';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({ email: false, password: false });

    const { signIn, promptAsyncGoogle, signInSocial } = useAuth();
    const { colors } = useTheme();

    const handleLogin = async () => {
        const newErrors = {
            email: !email.trim(),
            password: !password.trim()
        };

        setErrors(newErrors);

        if (newErrors.email || newErrors.password) {
            return;
        }

        setLoading(true);
        try {
            await signIn(email, password);
        } catch (error) {
            Alert.alert('Erro de Acesso', 'Email ou senha incorretos.');
        } finally {
            setLoading(false);
        }
    };

    const getInputStyle = (hasError: boolean) => [
        styles.input,
        {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: hasError ? '#FF3B30' : colors.border,
            borderWidth: hasError ? 1.5 : 1
        }
    ];

    const handleDemoLogin = async () => {
        setLoading(true);
        const uniqueId = Date.now();
        const demoEmail = `avaliador${uniqueId}@fiap.com`;
        const demoPass = "fiap123456";
        const demoCpf = (uniqueId.toString() + "00000000000").slice(0, 11);

        try {
            await api.post('/auth/register-candidate', {
                nome: `Avaliador FIAP ${uniqueId}`,
                email: demoEmail,
                senha: demoPass,
                cpf: demoCpf,
                cidade: "São Paulo",
                estado: "SP",
                resumoPerfil: "Perfil de teste gerado automaticamente."
            });
            await signIn(demoEmail, demoPass);
        } catch (error: any) {
            if (error.message?.includes("Network Error")) {
                Alert.alert("Erro de Conexão", "O Backend Java parece estar desligado. Reinicie a aplicação Java.");
            } else {
                try { await signIn("admin@includia.com", "admin1234"); } catch (e) { }
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAppleLogin = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });
            if (credential.identityToken) {
                const name = credential.fullName?.givenName ?
                    `${credential.fullName.givenName} ${credential.fullName.familyName}` : undefined;
                await signInSocial(credential.identityToken, 'APPLE', credential.email || undefined, name);
            }
        } catch (e: any) {
            if (e.code !== 'ERR_REQUEST_CANCELED') Alert.alert('Erro', 'Login Apple falhou');
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.iconBg}>
                        <Ionicons name="prism" size={40} color={colors.primary} />
                    </View>
                    <Text style={[styles.title, { color: colors.text }]}>Includ.IA</Text>
                    <Text style={[styles.subtitle, { color: colors.text }]}>Futuro do trabalho, hoje.</Text>
                </View>

                <View style={styles.form}>
                    <TextInput
                        style={getInputStyle(errors.email)}
                        placeholder="Email Corporativo ou Pessoal"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={t => {
                            setEmail(t);
                            if (errors.email) setErrors({ ...errors, email: false });
                        }}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={getInputStyle(errors.password)}
                        placeholder="Senha"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={t => {
                            setPassword(t);
                            if (errors.password) setErrors({ ...errors, password: false });
                        }}
                        secureTextEntry
                    />

                    <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleLogin} disabled={loading}>
                        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Entrar</Text>}
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.demoButton, { borderColor: colors.primary }]} onPress={handleDemoLogin} disabled={loading}>
                        {loading ? (
                            <ActivityIndicator size="small" color={colors.primary} />
                        ) : (
                            <>
                                <Ionicons name="flash" size={20} color={colors.primary} />
                                <Text style={[styles.demoText, { color: colors.primary }]}>Entrar Automaticamente (Demo)</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                <View style={styles.dividerBox}>
                    <View style={[styles.line, { backgroundColor: colors.border }]} />
                    <Text style={[styles.dividerText, { color: colors.text }]}>ou</Text>
                    <View style={[styles.line, { backgroundColor: colors.border }]} />
                </View>

                <View style={styles.socialBox}>
                    <TouchableOpacity style={[styles.socialBtn, { borderColor: colors.border, backgroundColor: colors.card }]} onPress={() => promptAsyncGoogle()}>
                        <Ionicons name="logo-google" size={24} color="#DB4437" />
                        <Text style={[styles.socialText, { color: colors.text }]}>Google</Text>
                    </TouchableOpacity>

                    {Platform.OS === 'ios' && (
                        <AppleAuthentication.AppleAuthenticationButton
                            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                            cornerRadius={12}
                            style={styles.appleBtn}
                            onPress={handleAppleLogin}
                        />
                    )}
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('Cadastro')} style={styles.footer}>
                    <Text style={{ color: colors.text, opacity: 0.7 }}>Ainda não tem conta?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                        <Text style={{ color: colors.primary, fontWeight: 'bold', marginTop: 5 }}>Criar Conta</Text>
                    </TouchableOpacity>
                </TouchableOpacity>

            </View>
        </KeyboardAvoidingView >
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, justifyContent: 'center', padding: 24 },
    header: { alignItems: 'center', marginBottom: 40 },
    iconBg: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#F0F5FF', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    title: { fontSize: 32, fontWeight: '800', letterSpacing: -1 },
    subtitle: { fontSize: 16, opacity: 0.5, marginTop: 4 },
    form: { gap: 16 },
    input: { height: 56, borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, fontSize: 16 },
    button: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 4 },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    demoButton: { height: 56, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 8 },
    demoText: { fontSize: 16, fontWeight: '600' },
    dividerBox: { flexDirection: 'row', alignItems: 'center', marginVertical: 32 },
    line: { flex: 1, height: 1 },
    dividerText: { paddingHorizontal: 16, fontSize: 14, opacity: 0.5 },
    socialBox: { gap: 12 },
    socialBtn: { flexDirection: 'row', height: 56, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    socialText: { fontSize: 16, fontWeight: '600' },
    appleBtn: { width: '100%', height: 56 },
    footer: { marginTop: 40, alignItems: 'center' }
});