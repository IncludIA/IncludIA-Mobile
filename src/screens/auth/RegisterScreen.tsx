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

const formatCPF = (value: string) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
};

export default function RegisterScreen({ navigation }: any) {
    const { signIn } = useAuth();
    const { colors } = useTheme();

    const [userType, setUserType] = useState<UserType>('candidate');
    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({
        nome: false,
        email: false,
        senha: false,
        cpf: false
    });

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        cpf: '',
        cidade: 'São Paulo',
        estado: 'SP',
        empresaId: ''
    });

    const handleCpfChange = (text: string) => {
        const formatted = formatCPF(text);
        setFormData({ ...formData, cpf: formatted });
        if (errors.cpf) setErrors({ ...errors, cpf: false });
    };

    const validateForm = () => {
        const newErrors = {
            nome: !formData.nome.trim(),
            email: !formData.email.trim(),
            senha: !formData.senha.trim(),
            cpf: userType === 'candidate' && !formData.cpf.trim()
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(hasError => hasError);
    };

    const handleRegister = async () => {
        if (!validateForm()) {
            return Alert.alert('Atenção', 'Preencha os campos destacados em vermelho.');
        }

        setLoading(true);

        const cpfLimpo = formData.cpf.replace(/\D/g, '');

        try {
            if (userType === 'candidate') {
                if (cpfLimpo.length !== 11) throw new Error('CPF inválido. Digite os 11 números.');

                await api.post('/auth/register-candidate', {
                    nome: formData.nome,
                    email: formData.email,
                    senha: formData.senha,
                    cpf: cpfLimpo,
                    cidade: formData.cidade,
                    estado: formData.estado
                });

            } else {
                let companyIdToUse = formData.empresaId;

                if (!companyIdToUse) {
                    const cnpjRandom = Date.now().toString().slice(0, 14);
                    const novaEmpresa = await api.post('/empresas', {
                        nomeOficial: "Minha Empresa " + cnpjRandom.slice(-4),
                        nomeFantasia: "Startup Demo",
                        cnpj: cnpjRandom,
                        localizacao: "São Paulo, SP",
                        descricao: "Empresa criada via App."
                    });
                    companyIdToUse = novaEmpresa.data.id;
                }

                await api.post('/auth/register-recruiter', {
                    nome: formData.nome,
                    email: formData.email,
                    senha: formData.senha,
                    empresaId: companyIdToUse
                });
            }

            await signIn(formData.email, formData.senha);

        } catch (error: any) {
            console.error(error);

            if (error.response?.status === 409) {
                Alert.alert(
                    'Conta Existente',
                    'Este e-mail ou CPF já possui cadastro. Vamos te levar para o login.',
                    [
                        { text: 'Ir para Login', onPress: () => navigation.navigate('Login') }
                    ]
                );
            } else {
                const msg = error.response?.data?.erro || error.message || 'Falha ao criar conta.';
                Alert.alert('Erro no Cadastro', msg);
            }
        } finally {
            setLoading(false);
        }
    };

    const getInputStyle = (hasError: boolean) => [
        styles.input,
        { backgroundColor: colors.card, color: colors.text, borderColor: hasError ? '#FF3B30' : colors.border },
        hasError && { borderWidth: 1.5 }
    ];

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={[styles.container, { backgroundColor: colors.background }]}>

            <View style={styles.navHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <View style={styles.logoSection}>
                    <View style={styles.iconBg}>
                        <Ionicons name="prism" size={40} color={colors.primary} />
                    </View>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Criar Conta</Text>
                    <Text style={[styles.headerSubtitle, { color: colors.text }]}>
                        Junte-se ao futuro do trabalho.
                    </Text>
                </View>

                <View style={[styles.toggleContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <TouchableOpacity
                        style={[styles.toggleBtn, userType === 'candidate' && styles.toggleBtnActive]}
                        onPress={() => setUserType('candidate')}
                    >
                        <Ionicons name="person" size={16} color={userType === 'candidate' ? '#FFF' : colors.text} />
                        <Text style={[styles.toggleText, { color: userType === 'candidate' ? '#FFF' : colors.text }]}>Candidato</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.toggleBtn, userType === 'recruiter' && styles.toggleBtnActive]}
                        onPress={() => setUserType('recruiter')}
                    >
                        <Ionicons name="briefcase" size={16} color={userType === 'recruiter' ? '#FFF' : colors.text} />
                        <Text style={[styles.toggleText, { color: userType === 'recruiter' ? '#FFF' : colors.text }]}>Recrutador</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.form}>
                    <TextInput
                        style={getInputStyle(errors.nome)}
                        placeholder="Nome Completo"
                        placeholderTextColor="#999"
                        onChangeText={t => {
                            setFormData({ ...formData, nome: t });
                            if (errors.nome) setErrors({ ...errors, nome: false });
                        }}
                    />
                    <TextInput
                        style={getInputStyle(errors.email)}
                        placeholder="Email"
                        placeholderTextColor="#999"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onChangeText={t => {
                            setFormData({ ...formData, email: t });
                            if (errors.email) setErrors({ ...errors, email: false });
                        }}
                    />
                    <TextInput
                        style={getInputStyle(errors.senha)}
                        placeholder="Senha (mínimo 8 caracteres)"
                        placeholderTextColor="#999"
                        secureTextEntry
                        onChangeText={t => {
                            setFormData({ ...formData, senha: t });
                            if (errors.senha) setErrors({ ...errors, senha: false });
                        }}
                    />

                    {userType === 'candidate' && (
                        <>
                            <View style={styles.dividerBox}>
                                <View style={[styles.line, { backgroundColor: colors.border }]} />
                                <Text style={[styles.dividerText, { color: colors.text }]}>DADOS PROFISSIONAIS</Text>
                                <View style={[styles.line, { backgroundColor: colors.border }]} />
                            </View>

                            <TextInput
                                style={getInputStyle(errors.cpf)}
                                placeholder="CPF (000.000.000-00)"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                maxLength={14}
                                value={formData.cpf}
                                onChangeText={handleCpfChange}
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

                    {userType === 'recruiter' && (
                        <>
                            <View style={styles.dividerBox}>
                                <View style={[styles.line, { backgroundColor: colors.border }]} />
                                <Text style={[styles.dividerText, { color: colors.text }]}>EMPRESA</Text>
                                <View style={[styles.line, { backgroundColor: colors.border }]} />
                            </View>

                            <View style={[styles.infoBox, { backgroundColor: 'rgba(0,123,255,0.1)' }]}>
                                <Ionicons name="information-circle" size={20} color={colors.primary} />
                                <Text style={[styles.infoText, { color: colors.text }]}>
                                    Deixe vazio para criar uma empresa de teste automaticamente.
                                </Text>
                            </View>
                            <TextInput
                                style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                                placeholder="ID da Empresa (Opcional)"
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
                                {userType === 'candidate' ? 'Finalizar Cadastro' : 'Criar Conta'}
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

    navHeader: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 10 },
    backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },

    scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },

    logoSection: { alignItems: 'center', marginBottom: 32 },
    iconBg: { width: 80, height: 80, borderRadius: 24, backgroundColor: '#F0F5FF', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    headerTitle: { fontSize: 32, fontWeight: '800', letterSpacing: -1, marginBottom: 4 },
    headerSubtitle: { fontSize: 16, opacity: 0.6, textAlign: 'center' },

    toggleContainer: { flexDirection: 'row', borderRadius: 12, borderWidth: 1, padding: 4, marginBottom: 24 },
    toggleBtn: { flex: 1, flexDirection: 'row', paddingVertical: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 8, gap: 8 },
    toggleBtnActive: { backgroundColor: '#007BFF' },
    toggleText: { fontWeight: '600', fontSize: 14 },

    dividerBox: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
    line: { flex: 1, height: 1 },
    dividerText: { paddingHorizontal: 12, fontSize: 12, fontWeight: '700', opacity: 0.5, letterSpacing: 1 },

    form: { gap: 12 },
    input: { height: 56, borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, fontSize: 16 },
    row: { flexDirection: 'row', gap: 12 },
    flexInput: { flex: 1 },
    smallInput: { width: 80, textAlign: 'center' },

    infoBox: { flexDirection: 'row', padding: 12, borderRadius: 8, gap: 10, alignItems: 'center', marginBottom: 4 },
    infoText: { flex: 1, fontSize: 13, lineHeight: 18 },

    button: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 16, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 10, elevation: 5 },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});