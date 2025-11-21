import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,
    SafeAreaView, ActivityIndicator, RefreshControl, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../services/api';

// Interface do Candidato
interface CandidateProfile {
    id: string;
    nome: string;
    email: string;
    cargo?: string;
    resumo?: string;
    fotoPerfilUrl?: string;
    skills?: string[];
    experiencia?: any[];
    educacao?: any[];
    localizacao?: string;
    telefone?: string;
    linkedin?: string;
}

// Mock para Demo
const MOCK_PROFILE: CandidateProfile = {
    id: '1',
    nome: 'Alex Pereira',
    email: 'alex@dev.com',
    cargo: 'Desenvolvedor Full Stack',
    resumo: 'Apaixonado por tecnologia e acessibilidade. Tenho 3 anos de experiência com React Native e Java Spring Boot.',
    localizacao: 'São Paulo, SP',
    skills: ['React Native', 'Java', 'Spring Boot', 'TypeScript', 'Git'],
    experiencia: [
        { id: '1', cargo: 'Dev Júnior', empresa: 'Tech Solutions', periodo: '2021 - 2023' }
    ],
    educacao: [] // Vazio para testar a porcentagem
};

export default function PersonalProfileScreen({ navigation }: any) {
    const { colors } = useTheme();
    const [profile, setProfile] = useState<CandidateProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [completeness, setCompleteness] = useState(0);

    // Recarrega sempre que a tela ganha foco (caso volte da edição)
    useFocusEffect(
        useCallback(() => {
            loadProfile();
        }, [])
    );

    const calculateCompleteness = (data: CandidateProfile) => {
        let points = 0;
        const totalPoints = 7; // Total de critérios

        if (data.nome) points++;
        if (data.cargo) points++;
        if (data.resumo) points++;
        if (data.skills && data.skills.length > 0) points++;
        if (data.experiencia && data.experiencia.length > 0) points++;
        if (data.educacao && data.educacao.length > 0) points++;
        if (data.fotoPerfilUrl) points++;

        return Math.round((points / totalPoints) * 100);
    };

    const loadProfile = async () => {
        setLoading(true);
        try {
            // Tenta buscar da API (Endpoint hipotético /candidate/me)
            const response = await api.get('/candidate/profile/me');
            setProfile(response.data);
            setCompleteness(calculateCompleteness(response.data));
        } catch (error) {
            // Fallback
            setProfile(MOCK_PROFILE);
            setCompleteness(calculateCompleteness(MOCK_PROFILE));
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = () => {
        navigation.navigate('EditProfile', { profileData: profile });
    };

    const handleSettings = () => {
        navigation.navigate('ConfigApp'); // Navega para a tela da engrenagem
    };

    if (loading && !profile) {
        return <View style={[styles.center, { backgroundColor: colors.background }]}><ActivityIndicator color={colors.primary} /></View>;
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={colors.background === '#000' ? 'light-content' : 'dark-content'} />

            {/* Header com Configuração */}
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Meu Perfil</Text>
                <TouchableOpacity onPress={handleSettings} style={[styles.iconBtn, { backgroundColor: colors.card }]}>
                    <Ionicons name="settings-outline" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={loadProfile} />}
            >
                {profile && (
                    <>
                        {/* Cabeçalho do Perfil */}
                        <View style={styles.profileHeader}>
                            <View style={styles.avatarWrapper}>
                                {profile.fotoPerfilUrl ? (
                                    <Image source={{ uri: profile.fotoPerfilUrl }} style={styles.avatar} />
                                ) : (
                                    <View style={[styles.avatarFallback, { backgroundColor: colors.primary }]}>
                                        <Text style={styles.avatarText}>{profile.nome.charAt(0)}</Text>
                                    </View>
                                )}
                                <TouchableOpacity style={styles.editAvatarBtn} onPress={handleEdit}>
                                    <Ionicons name="camera" size={16} color="#FFF" />
                                </TouchableOpacity>
                            </View>

                            <Text style={[styles.name, { color: colors.text }]}>{profile.nome}</Text>
                            <Text style={[styles.role, { color: colors.text }]}>{profile.cargo || 'Adicione seu cargo'}</Text>
                            <Text style={styles.location}>
                                <Ionicons name="location-outline" size={14} /> {profile.localizacao || 'Localização não informada'}
                            </Text>
                        </View>

                        {/* Barra de Completude */}
                        <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <View style={styles.progressHeader}>
                                <Text style={[styles.progressTitle, { color: colors.text }]}>Perfil {completeness}% Completo</Text>
                                {completeness < 100 && (
                                    <TouchableOpacity onPress={handleEdit}>
                                        <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 12 }}>Completar Agora</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: `${completeness}%`, backgroundColor: completeness === 100 ? '#34C759' : colors.primary }]} />
                            </View>
                            <Text style={styles.progressHint}>
                                {completeness === 100
                                    ? "Parabéns! Seu perfil está campeão."
                                    : "Adicione mais detalhes para aparecer em mais buscas."}
                            </Text>
                        </View>

                        {/* Sobre */}
                        <View style={[styles.section, { backgroundColor: colors.card }]}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Sobre</Text>
                                <TouchableOpacity onPress={handleEdit}><Ionicons name="pencil" size={18} color={colors.primary} /></TouchableOpacity>
                            </View>
                            <Text style={[styles.bio, { color: colors.text }]}>
                                {profile.resumo || "Conte um pouco sobre você..."}
                            </Text>
                        </View>

                        {/* Skills */}
                        <View style={[styles.section, { backgroundColor: colors.card }]}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Skills</Text>
                                <TouchableOpacity onPress={handleEdit}><Ionicons name="add-circle-outline" size={22} color={colors.primary} /></TouchableOpacity>
                            </View>
                            <View style={styles.skillsRow}>
                                {profile.skills && profile.skills.length > 0 ? (
                                    profile.skills.map((skill, index) => (
                                        <View key={index} style={[styles.skillBadge, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                            <Text style={[styles.skillText, { color: colors.text }]}>{skill}</Text>
                                        </View>
                                    ))
                                ) : (
                                    <Text style={{ opacity: 0.5, color: colors.text }}>Nenhuma skill adicionada.</Text>
                                )}
                            </View>
                        </View>

                        {/* Experiência */}
                        <View style={[styles.section, { backgroundColor: colors.card }]}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Experiência</Text>
                                <TouchableOpacity onPress={handleEdit}><Ionicons name="add" size={22} color={colors.primary} /></TouchableOpacity>
                            </View>

                            {profile.experiencia && profile.experiencia.length > 0 ? (
                                profile.experiencia.map((xp, i) => (
                                    <View key={i} style={styles.xpItem}>
                                        <View style={[styles.xpIcon, { backgroundColor: 'rgba(0,0,0,0.05)' }]}>
                                            <Ionicons name="briefcase" size={18} color={colors.text} />
                                        </View>
                                        <View>
                                            <Text style={[styles.xpRole, { color: colors.text }]}>{xp.cargo}</Text>
                                            <Text style={styles.xpCompany}>{xp.empresa} • {xp.periodo}</Text>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <Text style={{ opacity: 0.5, color: colors.text }}>Adicione sua experiência profissional.</Text>
                            )}
                        </View>

                        {/* Educação */}
                        <View style={[styles.section, { backgroundColor: colors.card }]}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: colors.text }]}>Educação</Text>
                                <TouchableOpacity onPress={handleEdit}><Ionicons name="add" size={22} color={colors.primary} /></TouchableOpacity>
                            </View>
                            {/* Lógica similar à experiência */}
                            <Text style={{ opacity: 0.5, color: colors.text }}>Adicione sua formação acadêmica.</Text>
                        </View>

                    </>
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
    avatarWrapper: { position: 'relative', marginBottom: 16 },
    avatar: { width: 100, height: 100, borderRadius: 50 },
    avatarFallback: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center' },
    avatarText: { fontSize: 40, color: '#FFF', fontWeight: 'bold' },
    editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#007AFF', padding: 8, borderRadius: 20, borderWidth: 3, borderColor: '#FFF' },
    name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
    role: { fontSize: 16, opacity: 0.7, marginBottom: 4 },
    location: { fontSize: 14, opacity: 0.5 },

    progressCard: { padding: 20, borderRadius: 20, borderWidth: 1, marginBottom: 24 },
    progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    progressTitle: { fontWeight: '700', fontSize: 14 },
    progressBarBg: { height: 8, backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: 4, marginBottom: 8, overflow: 'hidden' },
    progressBarFill: { height: '100%', borderRadius: 4 },
    progressHint: { fontSize: 12, opacity: 0.6 },

    section: { padding: 20, borderRadius: 20, marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold' },
    bio: { lineHeight: 22, opacity: 0.8 },

    skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    skillBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
    skillText: { fontSize: 12, fontWeight: '600' },

    xpItem: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 12 },
    xpIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    xpRole: { fontWeight: '600', fontSize: 15 },
    xpCompany: { fontSize: 13, opacity: 0.6 }
});