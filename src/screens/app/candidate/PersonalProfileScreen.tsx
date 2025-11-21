import React, { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,
    SafeAreaView, ActivityIndicator, RefreshControl, StatusBar, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../../../context/ThemeContext';
import api from '../../../services/api';

const { width } = Dimensions.get('window');

// --- TIPAGEM COMPLETA DO PERFIL ---
interface CandidateProfile {
    id: string;
    nome: string;
    email: string;
    telefone?: string;
    resumoPerfil?: string;
    cidade?: string;
    estado?: string;
    fotoPerfilUrl?: string;
    skills?: { id?: string; nome: string; tipoSkill?: string }[];
    experiencias?: {
        id?: string;
        tituloCargo: string;
        empresa: { nomeFantasia: string };
        dataInicio: string;
        dataFim?: string;
        tipoEmprego?: string;
    }[];
    formacoes?: {
        id?: string;
        nomeInstituicao: string;
        grau: string;
        areaEstudo?: string;
        dataInicio?: string;
        dataFim?: string;
    }[];
    voluntariados?: {
        id?: string;
        organizacao: string;
        funcao: string;
    }[];
    idiomas?: {
        id?: string;
        nomeIdioma: string;
        nivelProficiencia: string;
    }[];
}

export default function PersonalProfileScreen({ navigation }: any) {
    const { colors } = useTheme();
    const [profile, setProfile] = useState<CandidateProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [completeness, setCompleteness] = useState(0);

    // Recarrega os dados sempre que a tela ganha foco (ex: ao voltar da edição)
    useFocusEffect(
        useCallback(() => {
            loadProfile();
        }, [])
    );

    // --- CÁLCULO DE PROGRESSO (GAMIFICATION) ---
    const calculateProgress = (data: CandidateProfile) => {
        if (!data) return;

        let score = 0;
        const totalPoints = 7; // Total de seções avaliadas

        if (data.nome && data.email) score++;
        if (data.cidade || data.estado) score++;
        if (data.resumoPerfil && data.resumoPerfil.length > 10) score++;
        if (data.skills && data.skills.length > 0) score++;
        if (data.experiencias && data.experiencias.length > 0) score++;
        if (data.formacoes && data.formacoes.length > 0) score++;
        if (data.idiomas && data.idiomas.length > 0) score++;

        setCompleteness(Math.round((score / totalPoints) * 100));
    };

    const loadProfile = async () => {
        setLoading(true);
        try {
            // 1. Tenta buscar dados frescos da API
            const response = await api.get('/candidate/profile/me');
            const apiData = response.data;

            if (apiData) {
                setProfile(apiData);
                calculateProgress(apiData);
                // Salva no cache para acesso offline
                await AsyncStorage.setItem('@includia_candidate_profile', JSON.stringify(apiData));
            }
        } catch (error) {
            console.log("Erro na API, tentando carregar do cache local...");
            // 2. Se der erro, tenta carregar do cache
            const saved = await AsyncStorage.getItem('@includia_candidate_profile');
            if (saved) {
                const data = JSON.parse(saved);
                setProfile(data);
                calculateProgress(data);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        // Passa os dados atuais para a tela de edição para pré-preencher
        navigation.navigate('EditProfile', { profileData: profile });
    };

    const handleSettings = () => {
        navigation.navigate('ConfigApp');
    };

    // Gera iniciais para o avatar (Ex: "Ana Silva" -> "AS")
    const getInitials = (n: string) => {
        if (!n) return "EU";
        const parts = n.trim().split(' ');
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    };

    // Pega o cargo mais recente ou retorna padrão
    const getCurrentRole = () => {
        if (profile?.experiencias && profile.experiencias.length > 0) {
            return profile.experiencias[0].tituloCargo;
        }
        return "Disponível para oportunidades";
    };

    const getLocation = () => {
        if (profile?.cidade && profile?.estado) return `${profile.cidade}, ${profile.estado}`;
        if (profile?.cidade) return profile.cidade;
        return "Localização não informada";
    };

    // Loading inicial
    if (loading && !profile) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={colors.background === '#000' ? 'light-content' : 'dark-content'} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Meu Perfil</Text>
                <TouchableOpacity onPress={handleSettings} style={[styles.iconBtn, { backgroundColor: colors.card }]}>
                    <Ionicons name="settings-outline" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={loadProfile} />}
                showsVerticalScrollIndicator={false}
            >
                {profile ? (
                    <>
                        {/* CARD DO PERFIL (AVATAR E NOME) */}
                        <View style={styles.profileHeader}>
                            <View style={styles.avatarContainer}>
                                {profile.fotoPerfilUrl ? (
                                    <Image source={{ uri: profile.fotoPerfilUrl }} style={styles.avatarImage} />
                                ) : (
                                    <View style={[styles.avatarFallback, { backgroundColor: colors.primary }]}>
                                        <Text style={styles.avatarText}>{getInitials(profile.nome)}</Text>
                                    </View>
                                )}
                                {/* Botão flutuante de edição no avatar */}
                                <TouchableOpacity style={styles.editAvatarBtn} onPress={handleEdit}>
                                    <Ionicons name="pencil" size={14} color="#FFF" />
                                </TouchableOpacity>
                            </View>

                            <Text style={[styles.name, { color: colors.text }]}>{profile.nome}</Text>
                            <Text style={[styles.role, { color: colors.text }]}>{getCurrentRole()}</Text>

                            <View style={styles.locationRow}>
                                <Ionicons name="location-outline" size={14} color={colors.text} style={{ opacity: 0.6 }} />
                                <Text style={[styles.location, { color: colors.text }]}>
                                    {getLocation()}
                                </Text>
                            </View>

                            <TouchableOpacity style={[styles.editBtn, { borderColor: colors.primary }]} onPress={handleEdit}>
                                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Editar Informações</Text>
                            </TouchableOpacity>
                        </View>

                        {/* BARRA DE PROGRESSO (GAMIFICATION) */}
                        <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <View style={styles.progressHeader}>
                                <Text style={[styles.progressTitle, { color: colors.text }]}>Força do Perfil</Text>
                                <Text style={[styles.progressPercent, { color: colors.primary }]}>{completeness}%</Text>
                            </View>

                            <View style={styles.progressBarBg}>
                                <View style={[
                                    styles.progressBarFill,
                                    { width: `${completeness}%`, backgroundColor: completeness === 100 ? '#34C759' : colors.primary }
                                ]} />
                            </View>

                            <Text style={styles.progressHint}>
                                {completeness === 100
                                    ? "🔥 Perfil Campeão! Você tem prioridade nos matches."
                                    : "💡 Complete seu perfil para aparecer em mais buscas."}
                            </Text>
                        </View>

                        {/* SOBRE */}
                        <View style={[styles.section, { backgroundColor: colors.card }]}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Sobre</Text>
                            </View>
                            <Text style={[styles.bio, { color: colors.text }]}>
                                {profile.resumoPerfil || "Adicione um resumo para a IA analisar seu perfil e encontrar as melhores vagas."}
                            </Text>
                        </View>

                        {/* SKILLS */}
                        <View style={[styles.section, { backgroundColor: colors.card }]}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Habilidades</Text>
                            </View>
                            <View style={styles.skillsRow}>
                                {profile.skills && profile.skills.length > 0 ? (
                                    profile.skills.map((skill: any, index: number) => (
                                        <View key={index} style={[styles.skillBadge, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                            <Text style={[styles.skillText, { color: colors.text }]}>{skill.nome}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={{ opacity: 0.5, color: colors.text }}>Nenhuma habilidade adicionada.</Text>
                                )}
                            </View>
                        </View>

                        {/* EXPERIÊNCIA */}
                        <View style={[styles.section, { backgroundColor: colors.card }]}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Experiência</Text>
                            </View>
                            {profile.experiencias && profile.experiencias.length > 0 ? (
                                profile.experiencias.map((xp: any, i: number) => (
                                    <View key={i} style={styles.xpItem}>
                                        <View style={[styles.xpIcon, { backgroundColor: 'rgba(0,0,0,0.05)' }]}>
                                            <Ionicons name="briefcase" size={18} color={colors.text} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.xpRole, { color: colors.text }]}>{xp.tituloCargo}</Text>
                                            <Text style={styles.xpCompany}>
                                                {xp.empresa?.nomeFantasia} • {new Date(xp.dataInicio).getFullYear()} - {xp.dataFim ? new Date(xp.dataFim).getFullYear() : 'Atual'}
                                            </Text>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <Text style={{ opacity: 0.5, color: colors.text }}>Adicione sua experiência profissional.</Text>
                            )}
                        </View>

                        {/* FORMAÇÃO */}
                        <View style={[styles.section, { backgroundColor: colors.card }]}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Educação</Text>
                            </View>
                            {profile.formacoes && profile.formacoes.length > 0 ? (
                                profile.formacoes.map((edu, i) => (
                                    <View key={i} style={styles.xpItem}>
                                        <View style={[styles.xpIcon, { backgroundColor: 'rgba(0,0,0,0.05)' }]}>
                                            <Ionicons name="school" size={18} color={colors.text} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.xpRole, { color: colors.text }]}>{edu.nomeInstituicao}</Text>
                                            <Text style={styles.xpCompany}>{edu.grau} • {edu.areaEstudo}</Text>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <Text style={{ opacity: 0.5, color: colors.text }}>Adicione sua formação acadêmica.</Text>
                            )}
                        </View>

                        {/* IDIOMAS (Opcional) */}
                        {profile.idiomas && profile.idiomas.length > 0 && (
                            <View style={[styles.section, { backgroundColor: colors.card }]}>
                                <View style={styles.sectionHeader}>
                                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Idiomas</Text>
                                </View>
                                {profile.idiomas.map((idioma, i) => (
                                    <View key={i} style={styles.xpItem}>
                                        <View style={[styles.xpIcon, { backgroundColor: 'rgba(0,0,0,0.05)' }]}>
                                            <Ionicons name="language" size={18} color={colors.text} />
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <Text style={[styles.xpRole, { color: colors.text }]}>{idioma.nomeIdioma}</Text>
                                            <Text style={styles.xpCompany}>{idioma.nivelProficiencia}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}

                        <View style={{ height: 40 }} />
                    </>
                ) : (
                    <View style={[styles.center, { marginTop: 50 }]}>
                        <Text style={{ color: colors.text, opacity: 0.6 }}>Perfil não encontrado ou erro de conexão.</Text>
                        <TouchableOpacity onPress={loadProfile} style={{ marginTop: 20, padding: 10 }}>
                            <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Tentar Novamente</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 10 },
    headerTitle: { fontSize: 28, fontWeight: '800' },
    iconBtn: { padding: 10, borderRadius: 12 },
    scrollContent: { padding: 24, paddingBottom: 40 },

    profileHeader: { alignItems: 'center', marginBottom: 24 },
    avatarContainer: { position: 'relative', marginBottom: 16 },
    avatarImage: { width: 100, height: 100, borderRadius: 50 },
    avatarFallback: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
    avatarText: { fontSize: 36, color: '#FFF', fontWeight: 'bold' },
    editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#333', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },

    name: { fontSize: 22, fontWeight: 'bold', marginBottom: 4, textAlign: 'center' },
    role: { fontSize: 16, opacity: 0.7, marginBottom: 4, textAlign: 'center' },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
    location: { fontSize: 14, opacity: 0.5 },
    editBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },

    progressCard: { padding: 20, borderRadius: 20, borderWidth: 1, marginBottom: 20 },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    progressTitle: { fontWeight: '700', fontSize: 14 },
    progressPercent: { fontWeight: '800', fontSize: 14 },
    progressBarBg: { height: 8, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 4, marginBottom: 8, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 4 },
    progressHint: { fontSize: 12, opacity: 0.6, lineHeight: 18 },

    section: { padding: 20, borderRadius: 20, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    sectionHeader: { marginBottom: 12 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold' },
    bio: { lineHeight: 22, opacity: 0.8, fontSize: 14 },

    skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    skillBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
    skillText: { fontSize: 12, fontWeight: '600' },

    xpItem: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 },
    xpIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    xpRole: { fontWeight: '600', fontSize: 15 },
    xpCompany: { fontSize: 13, opacity: 0.6 }
});