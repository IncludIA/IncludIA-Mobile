import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView,
    SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';

export default function RecruiterProfileEditScreen({ navigation }: any) {
    const { colors } = useTheme();
    const { signOut } = useAuth();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Dados do Recrutador
    const [recruiterName, setRecruiterName] = useState('');
    const [recruiterEmail, setRecruiterEmail] = useState('');

    // Dados da Empresa
    const [companyName, setCompanyName] = useState('');
    const [companyDesc, setCompanyDesc] = useState('');
    const [companyCulture, setCompanyCulture] = useState('');
    const [companyLocation, setCompanyLocation] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const response = await api.get('/recruiters/me');
            const data = response.data;

            setRecruiterName(data.nome);
            setRecruiterEmail(data.email);

            if (data.empresa) {
                setCompanyName(data.empresa.nomeFantasia);
                setCompanyDesc(data.empresa.descricao);
                setCompanyCulture(data.empresa.cultura);
                setCompanyLocation(data.empresa.localizacao);
            }
        } catch (error) {
            setRecruiterName("Recrutador Demo");
            setRecruiterEmail("rh@demo.com");
            setCompanyName("Startup Demo");
            setCompanyDesc("Empresa focada em inovação.");
            setCompanyLocation("São Paulo, SP");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/recruiters/me', { nome: recruiterName });

            await api.put('/empresas/me', {
                nomeFantasia: companyName,
                descricao: companyDesc,
                cultura: companyCulture,
                localizacao: companyLocation
            });

            Alert.alert("Sucesso", "Perfil atualizado!");
        } catch (error) {
            Alert.alert("Erro", "Falha ao salvar alterações.");
        } finally {
            setSaving(false);
        }
    };

    const getInitials = (n: string) => n ? n.charAt(0).toUpperCase() : "R";

    if (loading) {
        return <View style={[styles.center, { backgroundColor: colors.background }]}><ActivityIndicator color={colors.primary} /></View>;
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

            {/* Header com Configuração */}
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Meu Perfil</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ConfigApp')} style={[styles.iconBtn, { backgroundColor: colors.card }]}>
                    <Ionicons name="settings-outline" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                    {/* Avatar do Recrutador */}
                    <View style={styles.profileHeader}>
                        <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
                            <Text style={styles.avatarText}>{getInitials(recruiterName)}</Text>
                        </View>
                        <Text style={[styles.name, { color: colors.text }]}>{recruiterName}</Text>
                        <Text style={[styles.role, { color: colors.text }]}>Tech Recruiter em {companyName}</Text>
                    </View>

                    {/* EDIÇÃO: DADOS PESSOAIS */}
                    <Text style={[styles.sectionLabel, { color: colors.text }]}>Meus Dados</Text>
                    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Nome Completo</Text>
                            <TextInput
                                style={[styles.input, { color: colors.text, borderBottomColor: colors.border }]}
                                value={recruiterName}
                                onChangeText={setRecruiterName}
                            />
                        </View>
                        <View style={[styles.inputGroup, { borderBottomWidth: 0 }]}>
                            <Text style={[styles.label, { color: colors.text }]}>E-mail Corporativo</Text>
                            <Text style={{ color: colors.text, opacity: 0.5, paddingVertical: 8 }}>{recruiterEmail}</Text>
                        </View>
                    </View>

                    <Text style={[styles.sectionLabel, { color: colors.text }]}>Dados da Empresa</Text>
                    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Nome Fantasia</Text>
                            <TextInput
                                style={[styles.input, { color: colors.text, borderBottomColor: colors.border }]}
                                value={companyName}
                                onChangeText={setCompanyName}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Localização (Sede)</Text>
                            <TextInput
                                style={[styles.input, { color: colors.text, borderBottomColor: colors.border }]}
                                value={companyLocation}
                                onChangeText={setCompanyLocation}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.text }]}>Sobre a Empresa</Text>
                            <TextInput
                                style={[styles.textArea, { color: colors.text, borderBottomColor: colors.border }]}
                                value={companyDesc}
                                onChangeText={setCompanyDesc}
                                multiline
                                placeholder="Descreva a missão da empresa..."
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={[styles.inputGroup, { borderBottomWidth: 0 }]}>
                            <Text style={[styles.label, { color: colors.text }]}>Cultura & Valores</Text>
                            <TextInput
                                style={[styles.textArea, { color: colors.text }]}
                                value={companyCulture}
                                onChangeText={setCompanyCulture}
                                multiline
                                placeholder="Ex: Inovação, Diversidade..."
                                placeholderTextColor="#999"
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.saveBtn, { backgroundColor: colors.primary }]}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveText}>Salvar Alterações</Text>}
                    </TouchableOpacity>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 10 },
    headerTitle: { fontSize: 28, fontWeight: '800' },
    iconBtn: { padding: 10, borderRadius: 12 },
    content: { padding: 24 },

    profileHeader: { alignItems: 'center', marginBottom: 30 },
    avatarContainer: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    avatarText: { fontSize: 32, color: '#FFF', fontWeight: 'bold' },
    name: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
    role: { fontSize: 14, opacity: 0.6 },

    sectionLabel: { fontSize: 13, fontWeight: '700', marginBottom: 8, marginTop: 10, textTransform: 'uppercase', opacity: 0.6 },
    card: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },

    inputGroup: { borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)', marginBottom: 12, paddingBottom: 4 },
    label: { fontSize: 12, fontWeight: 'bold', marginBottom: 4, opacity: 0.8 },
    input: { fontSize: 16, paddingVertical: 4 },
    textArea: { fontSize: 16, minHeight: 60, textAlignVertical: 'top', paddingVertical: 4 },

    saveBtn: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 10, elevation: 4 },
    saveText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});