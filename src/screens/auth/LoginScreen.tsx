import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ActivityIndicator, KeyboardAvoidingView, Platform, Alert
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { signIn, promptAsyncGoogle } = useAuth();
    const { colors } = useTheme();

    const handleLogin = async () => {
        if (!email || !password) return Alert.alert('Erro', 'Preencha todos os campos');
        setLoading(true);
        try {
            await signIn(email, password);
        } catch (error) {
            Alert.alert('Erro', 'Email ou senha incorretos.');
        } finally {
            setLoading(false);
        }
    };

    // --- CORREÇÃO: BOTÃO MÁGICO À PROVA DE FALHAS ---
    const handleDemoLogin = async () => {
        setLoading(true);
        // Gera credenciais únicas baseadas no tempo atual para evitar ORA-00001 (Duplicidade)
        const uniqueId = Date.now();
        const demoEmail = `avaliador${uniqueId}@fiap.com`;
        const demoPass = "fiap123456";
        // CPF válido (gerador simples para passar na validação de 11 dígitos)
        const demoCpf = (uniqueId.toString() + "00000000000").slice(0, 11);

        try {
            console.log(`Criando usuário demo: ${demoEmail}`);

            // 1. Cria um usuário NOVO garantido
            await api.post('/auth/register-candidate', {
                nome: `Avaliador FIAP ${uniqueId}`,
                email: demoEmail,
                senha: demoPass,
                cpf: demoCpf,
                cidade: "São Paulo",
                estado: "SP",
                resumoPerfil: "Perfil de teste gerado automaticamente."
            });

            // 2. Loga com ele imediatamente
            console.log("Logando...");
            await signIn(demoEmail, demoPass);

        } catch (error: any) {
            console.error("Erro Demo:", error);
            if (error.message.includes("Network Error")) {
                Alert.alert("Erro de Conexão", "O Backend Java parece estar desligado ou travado. Reinicie a aplicação Java.");
            } else {
                Alert.alert('Erro Demo', 'Não foi possível entrar automaticamente. Tente reiniciar o Java.');
            }
        } finally {
            setLoading(false);
        }
    };
    // -------------------------------------------------

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
                        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                        placeholder="Email Corporativo ou Pessoal"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                        placeholder="Senha"
                        placeholderTextColor="#999"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleLogin} disabled={loading}>
                        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Entrar</Text>}
                    </TouchableOpacity>

                    {/* Botão Demo Atualizado */}
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

                <View style={styles.footer}>
                    <Text style={{ color: colors.text, opacity: 0.7 }}>Ainda não tem conta?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Cadastro')}>
                        <Text style={{ color: colors.primary, fontWeight: 'bold', marginTop: 5 }}>Criar Conta</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
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
    footer: { marginTop: 40, alignItems: 'center' }
});