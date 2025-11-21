import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    ActivityIndicator, KeyboardAvoidingView, Platform, Alert, ScrollView
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';

type UserType = 'candidate' | 'recruiter';

export default function RegisterScreen({ navigation }: any) {
    const { signIn } = useAuth();
    const { colors } = useTheme();

    const [userType, setUserType] = useState<UserType>('candidate');
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        cpf: '',
        cidade: 'São Paulo',
        estado: 'SP',
        // Campo extra para recrutador (opcional na interface, obrigatório na API)
        empresaId: ''
    });

    const handleRegister = async () => {
        // Validação básica comum
        if (!formData.nome || !formData.email || !formData.senha) {
            return Alert.alert('Erro', 'Preencha os campos obrigatórios.');
        }

        setLoading(true);
        try {
            if (userType === 'candidate') {
                if (!formData.cpf) throw new Error('CPF é obrigatório para candidatos.');

                // 1. Registrar Candidato
                await api.post('/auth/register-candidate', {
                    nome: formData.nome,
                    email: formData.email,
                    senha: formData.senha,
                    cpf: formData.cpf,
                    cidade: formData.cidade,
                    estado: formData.estado
                });

            } else {
                // Lógica Inteligente para Recrutador
                let companyIdToUse = formData.empresaId;

                // Se não informou ID da empresa, cria uma "Empresa Padrão" na hora (UX de Startup)
                if (!companyIdToUse) {
                    const cnpjRandom = Date.now().toString().slice(0, 14); // CNPJ fictício único
                    const novaEmpresa = await api.post('/empresas', {
                        nomeOficial: "Minha Empresa " + cnpjRandom.slice(-4),
                        nomeFantasia: "Startup Demo",
                        cnpj: cnpjRandom,
                        localizacao: "São Paulo, SP",
                        descricao: "Empresa criada automaticamente via App Mobile."
                    });
                    companyIdToUse = novaEmpresa.data.id;
                    console.log("Empresa criada automaticamente:", companyIdToUse);
                }

                // 2. Registrar Recrutador
                await api.post('/auth/register-recruiter', {
                    nome: formData.nome,
                    email: formData.email,
                    senha: formData.senha,
                    empresaId: companyIdToUse
                });
            }

            // 3. Login Automático após sucesso
            await signIn(formData.email, formData.senha);

        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.erro || error.message || 'Falha ao criar conta.';
            Alert.alert('Erro no Cadastro', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Criar Conta</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* SELETOR DE TIPO DE CONTA (Segmented Control) */}
                <View style={[styles.toggleContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <TouchableOpacity
                        style={[styles.toggleBtn, userType === 'candidate' && styles.toggleBtnActive]}
                        onPress={() => setUserType('candidate')}
                    >
                        <Ionicons name="person" size={16} color={userType === 'candidate' ? '#FFF' : colors.text} />
                        <Text style={[styles.toggleText, { color: userType === 'candidate' ? '#FFF' : colors.text }]}>Sou Candidato</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.toggleBtn, userType === 'recruiter' && styles.toggleBtnActive]}
                        onPress={() => setUserType('recruiter')}
                    >
                        <Ionicons name="briefcase" size={16} color={userType === 'recruiter' ? '#FFF' : colors.text} />
                        <Text style={[styles.toggleText, { color: userType === 'recruiter' ? '#FFF' : colors.text }]}>Sou Recrutador</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.form}>
                    <Text style={[styles.sectionLabel, { color: colors.text }]}>Dados de Acesso</Text>

                    <TextInput
                        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                        placeholder="Nome Completo"
                        placeholderTextColor="#999"
                        onChangeText={t => setFormData({ ...formData, nome: t })}
                    />
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                        placeholder="Email"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={t => setFormData({ ...formData, email: t })}
                    />
                    <TextInput
                        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                        placeholder="Senha (mínimo 8 caracteres)"
                        placeholderTextColor="#999"
                        secureTextEntry
                        onChangeText={t => setFormData({ ...formData, senha: t })}
                    />

                    {/* CAMPOS ESPECÍFICOS DE CANDIDATO */}
                    {userType === 'candidate' && (
                        <>
                            <Text style={[styles.sectionLabel, { color: colors.text, marginTop: 10 }]}>Perfil Profissional</Text>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                                placeholder="CPF (apenas números)"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                maxLength={11}
                                onChangeText={t => setFormData({ ...formData, cpf: t })}
                            />
                            <View style={styles.row}>
                                <TextInput
                                    style={[styles.input, styles.flexInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                                    placeholder="Cidade"
                                    placeholderTextColor="#999"
                                    defaultValue="São Paulo"
                                    onChangeText={t => setFormData({ ...formData, cidade: t })}
                                />
                                <TextInput
                                    style={[styles.input, styles.smallInput, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                                    placeholder="UF"
                                    placeholderTextColor="#999"
                                    defaultValue="SP"
                                    maxLength={2}
                                    onChangeText={t => setFormData({ ...formData, estado: t })}
                                />
                            </View>
                        </>
                    )}

                    {/* CAMPOS ESPECÍFICOS DE RECRUTADOR */}
                    {userType === 'recruiter' && (
                        <>
                            <Text style={[styles.sectionLabel, { color: colors.text, marginTop: 10 }]}>Dados da Empresa</Text>
                            <View style={[styles.infoBox, { backgroundColor: 'rgba(0,123,255,0.1)' }]}>
                                <Ionicons name="information-circle" size={20} color={colors.primary} />
                                <Text style={[styles.infoText, { color: colors.text }]}>
                                    Se deixar o ID vazio, criaremos uma empresa fictícia para você testar a plataforma.
                                </Text>
                            </View>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                                placeholder="ID da Empresa (Opcional para teste)"
                                placeholderTextColor="#999"
                                onChangeText={t => setFormData({ ...formData, empresaId: t })}
                            />
                        </>
                    )}

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: colors.primary }]}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.buttonText}>
                                {userType === 'candidate' ? 'Cadastrar como Candidato' : 'Cadastrar como Recrutador'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    headerContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
    backBtn: { marginRight: 16 },
    headerTitle: { fontSize: 24, fontWeight: 'bold' },
    scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },

    toggleContainer: { flexDirection: 'row', borderRadius: 12, borderWidth: 1, padding: 4, marginBottom: 24 },
    toggleBtn: { flex: 1, flexDirection: 'row', paddingVertical: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 8, gap: 8 },
    toggleBtnActive: { backgroundColor: '#007BFF' },
    toggleText: { fontWeight: '600', fontSize: 14 },

    sectionLabel: { fontSize: 14, fontWeight: '700', marginBottom: 12, opacity: 0.6, textTransform: 'uppercase' },
    form: { gap: 12 },
    input: { height: 50, borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, fontSize: 16 },
    row: { flexDirection: 'row', gap: 12 },
    flexInput: { flex: 1 },
    smallInput: { width: 80, textAlign: 'center' },

    infoBox: { flexDirection: 'row', padding: 12, borderRadius: 8, gap: 10, alignItems: 'center', marginBottom: 4 },
    infoText: { flex: 1, fontSize: 13, lineHeight: 18 },

    button: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 24, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 10, elevation: 5 },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});