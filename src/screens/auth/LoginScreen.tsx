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

const generateCPF = (): string => {
    const rnd = (n: number) => Math.round(Math.random() * n);
    const mod = (dividendo: number, divisor: number) => Math.round(dividendo - (Math.floor(dividendo / divisor) * divisor));
    const n1 = rnd(9); const n2 = rnd(9); const n3 = rnd(9);
    const n4 = rnd(9); const n5 = rnd(9); const n6 = rnd(9);
    const n7 = rnd(9); const n8 = rnd(9); const n9 = rnd(9);
    let d1 = n9 * 2 + n8 * 3 + n7 * 4 + n6 * 5 + n5 * 6 + n4 * 7 + n3 * 8 + n2 * 9 + n1 * 10;
    d1 = 11 - (mod(d1, 11));
    if (d1 >= 10) d1 = 0;
    let d2 = d1 * 2 + n9 * 3 + n8 * 4 + n7 * 5 + n6 * 6 + n5 * 7 + n4 * 8 + n3 * 9 + n2 * 10 + n1 * 11;
    d2 = 11 - (mod(d2, 11));
    if (d2 >= 10) d2 = 0;
    return `${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}${n9}${d1}${d2}`;
};

const generateCNPJ = (): string => {
    const rnd = (n: number) => Math.round(Math.random() * n);
    const mod = (dividendo: number, divisor: number) => Math.round(dividendo - (Math.floor(dividendo / divisor) * divisor));
    const n = Array(8).fill(0).map(() => rnd(9));
    const n9 = 0; const n10 = 0; const n11 = 0; const n12 = 1;
    let d1 = n12 * 2 + n11 * 3 + n10 * 4 + n9 * 5 + n[7] * 6 + n[6] * 7 + n[5] * 8 + n[4] * 9 + n[3] * 2 + n[2] * 3 + n[1] * 4 + n[0] * 5;
    d1 = 11 - (mod(d1, 11));
    if (d1 >= 10) d1 = 0;
    let d2 = d1 * 2 + n12 * 3 + n11 * 4 + n10 * 5 + n9 * 6 + n[7] * 7 + n[6] * 8 + n[5] * 9 + n[4] * 2 + n[3] * 3 + n[2] * 4 + n[1] * 5 + n[0] * 6;
    d2 = 11 - (mod(d2, 11));
    if (d2 >= 10) d2 = 0;
    return `${n.join('')}${n9}${n10}${n11}${n12}${d1}${d2}`;
};

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [demoLoading, setDemoLoading] = useState<'candidate' | 'recruiter' | null>(null);

    const [errors, setErrors] = useState({ email: false, password: false });

    const { signIn, promptAsyncGoogle, signInSocial } = useAuth();
    const { colors } = useTheme();

    const handleLogin = async () => {
        const newErrors = {
            email: !email.trim(),
            password: !password.trim()
        };
        setErrors(newErrors);

        if (newErrors.email || newErrors.password) return;

        setLoading(true);
        try {
            await signIn(email, password);
        } catch (error: any) {
            console.log("Erro Login:", error.response?.data || error.message);
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

    const handleDemoCandidate = async () => {
        setDemoLoading('candidate');
        const uniqueId = Date.now();
        const demoEmail = `candidato${uniqueId}@fiap.com`;
        const demoPass = "fiap123456";
        const demoCpf = generateCPF();

        try {
            console.log(`Tentando criar candidato: ${demoEmail} CPF: ${demoCpf}`);
            await api.post('/auth/register-candidate', {
                nome: `Candidato FIAP`,
                email: demoEmail,
                senha: demoPass,
                cpf: demoCpf,
                cidade: "São Paulo",
                estado: "SP",
                resumoPerfil: "Perfil de teste gerado automaticamente."
            });
            await signIn(demoEmail, demoPass);
        } catch (error: any) {
            handleDemoError(error);
        } finally {
            setDemoLoading(null);
        }
    };

    const handleDemoRecruiter = async () => {
        setDemoLoading('recruiter');
        const uniqueId = Date.now();
        const demoEmail = `recrutador${uniqueId}@fiap.com`;
        const demoPass = "fiap123456";
        const validCNPJ = generateCNPJ();

        try {
            console.log(`Tentando criar empresa CNPJ: ${validCNPJ}`);

            const novaEmpresa = await api.post('/empresas', {
                nomeOficial: `Empresa Demo ${uniqueId}`,
                nomeFantasia: `Startup FIAP`,
                cnpj: validCNPJ,
                localizacao: "São Paulo, SP",
                descricao: "Empresa criada automaticamente para teste de recrutador.",
                cultura: "Inovação e Agilidade"
            });

            const empresaId = novaEmpresa.data.id;

            await api.post('/auth/register-recruiter', {
                nome: `Recrutador FIAP`,
                email: demoEmail,
                senha: demoPass,
                empresaId: empresaId
            });

            await signIn(demoEmail, demoPass);

        } catch (error: any) {
            handleDemoError(error);
        } finally {
            setDemoLoading(null);
        }
    };

    const handleDemoError = (error: any) => {
        console.error("Erro Detalhado:", error.response?.data);

        const msg = error.response?.data?.erro || error.message;

        if (msg?.includes("Network Error")) {
            Alert.alert("Erro de Conexão", "O Backend Java parece estar desligado.");
        } else {
            Alert.alert("Erro Demo", `Falha: ${JSON.stringify(msg) || 'Verifique o console'}`);
        }
    }

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

                    <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleLogin} disabled={loading || !!demoLoading}>
                        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Entrar</Text>}
                    </TouchableOpacity>

                    <View style={styles.demoContainer}>
                        <TouchableOpacity
                            style={[styles.demoButton, { borderColor: colors.primary }]}
                            onPress={handleDemoCandidate}
                            disabled={loading || !!demoLoading}
                        >
                            {demoLoading === 'candidate' ? (
                                <ActivityIndicator size="small" color={colors.primary} />
                            ) : (
                                <>
                                    <Ionicons name="person" size={16} color={colors.primary} />
                                    <Text style={[styles.demoText, { color: colors.primary }]}>Demo Candidato</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.demoButton, { borderColor: '#FF9500' }]}
                            onPress={handleDemoRecruiter}
                            disabled={loading || !!demoLoading}
                        >
                            {demoLoading === 'recruiter' ? (
                                <ActivityIndicator size="small" color="#FF9500" />
                            ) : (
                                <>
                                    <Ionicons name="briefcase" size={16} color="#FF9500" />
                                    <Text style={[styles.demoText, { color: '#FF9500' }]}>Demo Recrutador</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

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

    demoContainer: { flexDirection: 'row', gap: 12, marginTop: 8 },
    demoButton: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderStyle: 'dashed',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6
    },
    demoText: { fontSize: 14, fontWeight: '600' },

    dividerBox: { flexDirection: 'row', alignItems: 'center', marginVertical: 32 },
    line: { flex: 1, height: 1 },
    dividerText: { paddingHorizontal: 16, fontSize: 14, opacity: 0.5 },
    socialBox: { gap: 12 },
    socialBtn: { flexDirection: 'row', height: 56, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    socialText: { fontSize: 16, fontWeight: '600' },
    appleBtn: { width: '100%', height: 56 },
    footer: { marginTop: 40, alignItems: 'center' }
});