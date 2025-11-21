import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import api from '../../../services/api';

export default function PostJobScreen({ navigation }: any) {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        titulo: '',
        descricaoOriginal: '',
        localizacao: 'São Paulo, SP',
        tipoVaga: 'TEMPO_INTEGRAL',
        modeloTrabalho: 'HIBRIDO',
        salarioMin: '',
        salarioMax: '',
        experienciaRequerida: 'PLENO',
        beneficios: ''
    });

    const handlePost = async () => {
        if (!form.titulo || !form.descricaoOriginal) return Alert.alert("Erro", "Título e Descrição são obrigatórios");

        setLoading(true);
        try {
            await api.post('/vagas', {
                ...form,
                salarioMin: Number(form.salarioMin) || 0,
                salarioMax: Number(form.salarioMax) || 0,
                skillIds: [] // Futuro: Selecionar skills
            });
            Alert.alert("Sucesso", "Vaga publicada e a IA já está analisando candidatos!");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Erro", "Falha ao publicar vaga. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const InputField = ({ label, placeholder, value, onChange, multiline = false, keyboard = 'default' }: any) => (
        <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
            <TextInput
                style={[
                    styles.input,
                    { color: colors.text, backgroundColor: colors.card, borderColor: colors.border },
                    multiline && { height: 120, paddingTop: 12 }
                ]}
                placeholder={placeholder}
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChange}
                multiline={multiline}
                textAlignVertical={multiline ? 'top' : 'center'}
                keyboardType={keyboard}
            />
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={{ color: colors.text, fontSize: 16 }}>Cancelar</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Nova Oportunidade</Text>
                <TouchableOpacity onPress={handlePost} disabled={loading}>
                    {loading ? <ActivityIndicator color={colors.primary} /> : <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>Publicar</Text>}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content}>

                    <View style={[styles.aiTipBox, { backgroundColor: 'rgba(138, 43, 226, 0.1)' }]}>
                        <Ionicons name="sparkles" size={20} color="#8A2BE2" />
                        <Text style={[styles.aiTipText, { color: colors.text }]}>
                            Nossa IA vai reescrever sua descrição para torná-la mais inclusiva automaticamente.
                        </Text>
                    </View>

                    <InputField label="Título da Vaga" placeholder="Ex: Desenvolvedor Front-end React" value={form.titulo} onChange={(t: string) => setForm({ ...form, titulo: t })} />

                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <InputField label="Localização" placeholder="Ex: Remoto" value={form.localizacao} onChange={(t: string) => setForm({ ...form, localizacao: t })} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <InputField label="Nível" placeholder="Ex: Sênior" value={form.experienciaRequerida} onChange={(t: string) => setForm({ ...form, experienciaRequerida: t })} />
                        </View>
                    </View>

                    <InputField label="Descrição da Vaga" placeholder="Responsabilidades, requisitos..." value={form.descricaoOriginal} onChange={(t: string) => setForm({ ...form, descricaoOriginal: t })} multiline />

                    <View style={styles.row}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <InputField label="Salário Min" placeholder="0" value={form.salarioMin} onChange={(t: string) => setForm({ ...form, salarioMin: t })} keyboard="numeric" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <InputField label="Salário Max" placeholder="0" value={form.salarioMax} onChange={(t: string) => setForm({ ...form, salarioMax: t })} keyboard="numeric" />
                        </View>
                    </View>

                    <InputField label="Benefícios" placeholder="VR, VA, Plano de Saúde (separar por vírgula)" value={form.beneficios} onChange={(t: string) => setForm({ ...form, beneficios: t })} multiline />

                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, alignItems: 'center' },
    headerTitle: { fontSize: 17, fontWeight: 'bold' },
    content: { padding: 20 },
    aiTipBox: { flexDirection: 'row', padding: 16, borderRadius: 12, gap: 12, alignItems: 'center', marginBottom: 24 },
    aiTipText: { flex: 1, fontSize: 13, lineHeight: 18 },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, opacity: 0.7 },
    input: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 16 },
    row: { flexDirection: 'row' }
});