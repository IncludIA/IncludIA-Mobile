import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView,
    SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import api from '../../../services/api';

// Tipagem baseada no seu JSON Java
interface Skill {
    id?: string;
    nome: string;
    tipoSkill: string; // 'HARD_SKILL' | 'SOFT_SKILL'
}

interface CandidateProfile {
    id: string;
    nome: string;
    email: string;
    resumoPerfil: string;
    cidade: string;
    estado: string;
    skills: Skill[];
    // Outros campos complexos omitidos da edição rápida para simplificar
}

export default function EditProfileScreen({ navigation, route }: any) {
    const { colors } = useTheme();
    const { profileData } = route.params || {}; // Recebe dados parciais se houver

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Estados do Formulário
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');
    const [resumo, setResumo] = useState('');

    // Gestão de Skills
    const [skills, setSkills] = useState<Skill[]>([]);
    const [newSkillText, setNewSkillText] = useState('');

    useEffect(() => {
        loadFullProfile();
    }, []);

    const loadFullProfile = async () => {
        setLoading(true);
        try {
            // Busca o perfil completo do candidato logado
            // Endpoint assumido com base no contexto: /candidate/profile/me ou similar
            // Se não tiver, usamos o profileData passado na navegação
            if (profileData) {
                populateForm(profileData);
            }

            // Tentativa de buscar dados frescos da API
            const response = await api.get('/candidate/profile/me');
            populateForm(response.data);

        } catch (error) {
            console.log("Usando dados de cache/navegação.");
        } finally {
            setLoading(false);
        }
    };

    const populateForm = (data: any) => {
        if (!data) return;
        setNome(data.nome || '');
        setEmail(data.email || '');
        setCidade(data.cidade || '');
        setEstado(data.estado || '');
        setResumo(data.resumoPerfil || '');
        setSkills(data.skills || []);
    };

    // --- LÓGICA DE AVATAR (LETRAS) ---
    const getInitials = (fullName: string) => {
        if (!fullName) return "C";
        const names = fullName.trim().split(' ');
        if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    // --- LÓGICA DE SKILLS ---
    const handleAddSkill = () => {
        const text = newSkillText.trim();
        if (text.length > 0 && !skills.some(s => s.nome.toLowerCase() === text.toLowerCase())) {
            const newSkillObj: Skill = {
                nome: text,
                tipoSkill: 'HARD_SKILL' // Padrão para adição rápida
            };
            setSkills([...skills, newSkillObj]);
            setNewSkillText('');
        }
    };

    const handleRemoveSkill = (skillName: string) => {
        setSkills(skills.filter(s => s.nome !== skillName));
    };

    // --- SALVAR ---
    const handleSave = async () => {
        setSaving(true);
        try {
            // Monta o payload no formato que o Java espera
            // Nota: Não enviamos ID ou Nome para edição, apenas os campos permitidos
            const payload = {
                resumoPerfil: resumo,
                cidade: cidade,
                estado: estado,
                skills: skills,
                // Preserva os outros campos se necessário, ou o backend faz o merge
            };

            // PUT no endpoint do candidato
            await api.put('/candidate/profile/me', payload);

            Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
            navigation.goBack();

        } catch (error) {
            Alert.alert("Erro", "Não foi possível salvar as alterações. Tente novamente.");
        } finally {
            setSaving(false);
        }
    };

    if (loading && !nome) {
        return (
            <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} disabled={saving}>
                    <Text style={{ color: colors.text, fontSize: 16 }}>Cancelar</Text>
                </TouchableOpacity>

                <Text style={[styles.headerTitle, { color: colors.text }]}>Editar Perfil</Text>

                <TouchableOpacity onPress={handleSave} disabled={saving}>
                    {saving ? (
                        <ActivityIndicator size="small" color={colors.primary} />
                    ) : (
                        <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>Concluir</Text>
                    )}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                    {/* AVATAR FIXO (Letras) */}
                    <View style={styles.avatarSection}>
                        <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
                            <Text style={styles.avatarText}>{getInitials(nome)}</Text>
                        </View>
                        <Text style={[styles.readOnlyLabel, { color: colors.text }]}>
                            Foto de perfil e nome são gerenciados pelo sistema.
                        </Text>
                    </View>

                    {/* CAMPOS TRAVADOS (Read-Only) */}
                    <Text style={[styles.sectionLabel, { color: colors.text }]}>Dados de Acesso</Text>
                    <View style={[styles.inputGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={[styles.readOnlyInput, { borderBottomColor: colors.border }]}>
                            <Text style={[styles.labelText, { color: colors.text }]}>Nome Completo</Text>
                            <Text style={[styles.valueText, { color: colors.text, opacity: 0.5 }]}>{nome}</Text>
                            <Ionicons name="lock-closed" size={14} color={colors.text} style={{ opacity: 0.3, position: 'absolute', right: 16, top: 20 }} />
                        </View>
                        <View style={styles.readOnlyInput}>
                            <Text style={[styles.labelText, { color: colors.text }]}>E-mail</Text>
                            <Text style={[styles.valueText, { color: colors.text, opacity: 0.5 }]}>{email}</Text>
                            <Ionicons name="lock-closed" size={14} color={colors.text} style={{ opacity: 0.3, position: 'absolute', right: 16, top: 20 }} />
                        </View>
                    </View>

                    {/* CAMPOS EDITÁVEIS */}
                    <Text style={[styles.sectionLabel, { color: colors.text }]}>Informações Públicas</Text>
                    <View style={[styles.inputGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={[styles.inputWrapper, { borderBottomColor: colors.border }]}>
                            <Text style={[styles.inputLabel, { color: colors.primary }]}>Cidade</Text>
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                value={cidade}
                                onChangeText={setCidade}
                                placeholder="Sua cidade"
                                placeholderTextColor="#999"
                            />
                        </View>
                        <View style={styles.inputWrapper}>
                            <Text style={[styles.inputLabel, { color: colors.primary }]}>Estado (UF)</Text>
                            <TextInput
                                style={[styles.input, { color: colors.text }]}
                                value={estado}
                                onChangeText={setEstado}
                                placeholder="SP, RJ, MG..."
                                placeholderTextColor="#999"
                                maxLength={2}
                                autoCapitalize="characters"
                            />
                        </View>
                    </View>

                    {/* RESUMO */}
                    <Text style={[styles.sectionLabel, { color: colors.text }]}>Sobre Você</Text>
                    <View style={[styles.inputGroup, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <TextInput
                            style={[styles.textArea, { color: colors.text }]}
                            placeholder="Escreva um breve resumo sobre suas experiências e objetivos..."
                            placeholderTextColor="#999"
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            value={resumo}
                            onChangeText={setResumo}
                        />
                    </View>

                    {/* SKILLS */}
                    <Text style={[styles.sectionLabel, { color: colors.text }]}>Habilidades (Skills)</Text>
                    <View style={[styles.skillsContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={styles.addSkillRow}>
                            <TextInput
                                style={[styles.skillInput, { color: colors.text, borderColor: colors.border }]}
                                placeholder="Adicionar skill (ex: Java)"
                                placeholderTextColor="#999"
                                value={newSkillText}
                                onChangeText={setNewSkillText}
                                onSubmitEditing={handleAddSkill}
                            />
                            <TouchableOpacity onPress={handleAddSkill} style={[styles.addBtn, { backgroundColor: colors.primary }]}>
                                <Ionicons name="add" size={24} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.tagsWrapper}>
                            {skills.map((skill, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.tag, { backgroundColor: colors.background, borderColor: colors.border }]}
                                    onPress={() => handleRemoveSkill(skill.nome)}
                                >
                                    <Text style={[styles.tagText, { color: colors.text }]}>{skill.nome}</Text>
                                    <Ionicons name="close-circle" size={16} color={colors.text} style={{ opacity: 0.5 }} />
                                </TouchableOpacity>
                            ))}
                            {skills.length === 0 && (
                                <Text style={{ color: '#999', fontSize: 13, fontStyle: 'italic', padding: 10 }}>
                                    Nenhuma skill adicionada.
                                </Text>
                            )}
                        </View>
                    </View>

                    <View style={{ height: 40 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15, borderBottomWidth: 1 },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 20 },

    // Avatar Section
    avatarSection: { alignItems: 'center', marginBottom: 24 },
    avatarContainer: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    avatarText: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
    readOnlyLabel: { fontSize: 12, opacity: 0.5, textAlign: 'center', maxWidth: 250 },

    sectionLabel: { fontSize: 13, fontWeight: '700', marginBottom: 8, marginTop: 16, opacity: 0.6, textTransform: 'uppercase' },

    // Inputs
    inputGroup: { borderRadius: 12, borderWidth: 1, overflow: 'hidden' },

    // Read Only Styles
    readOnlyInput: { padding: 16, backgroundColor: 'rgba(0,0,0,0.03)', borderBottomWidth: 1, borderColor: 'transparent' },
    labelText: { fontSize: 12, fontWeight: '600', marginBottom: 4, opacity: 0.7 },
    valueText: { fontSize: 16, fontWeight: '500' },

    // Editable Styles
    inputWrapper: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10, borderBottomWidth: 1 },
    inputLabel: { fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
    input: { fontSize: 16, height: 24, padding: 0 },
    textArea: { padding: 16, fontSize: 16, minHeight: 120 },

    // Skills
    skillsContainer: { borderRadius: 12, borderWidth: 1, padding: 16 },
    addSkillRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 },
    skillInput: { flex: 1, height: 44, borderBottomWidth: 1, fontSize: 16 },
    addBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
    tagsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    tag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, gap: 6 },
    tagText: { fontSize: 14, fontWeight: '500' }
});