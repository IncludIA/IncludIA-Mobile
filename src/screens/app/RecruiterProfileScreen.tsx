import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Linking, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';

// Interface baseada no JSON do RecruiterProfileController
interface RecruiterProfile {
    id: string;
    nome: string;
    email: string;
    fotoPerfilUrl?: string;
    isOnline: boolean;
    empresa: {
        id: string;
        nomeFantasia: string;
        localizacao: string;
    };
}

export default function RecruiterProfileScreen({ route, navigation }: any) {
    const { recruiterId, name } = route.params; // Recebe ID da navegação
    const { colors } = useTheme();

    const [profile, setProfile] = useState<RecruiterProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            // Consumindo a API Java real
            const response = await api.get(`/recruiters/${recruiterId}`);
            setProfile(response.data);
        } catch (error) {
            console.error("Erro ao carregar recrutador", error);
            // Fallback para não quebrar a demo se a API falhar
            setProfile({
                id: recruiterId,
                nome: name || "Recrutador",
                email: "contato@includia.com",
                isOnline: false,
                empresa: { id: 'mock', nomeFantasia: 'Empresa Parceira', localizacao: 'Brasil' }
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Perfil Profissional</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {profile && (
                    <>
                        <View style={styles.profileHeader}>
                            <View style={[styles.avatarContainer, { borderColor: profile.isOnline ? '#34C759' : colors.border }]}>
                                {profile.fotoPerfilUrl ? (
                                    <Image source={{ uri: profile.fotoPerfilUrl }} style={styles.avatarImage} />
                                ) : (
                                    <Text style={styles.avatarText}>{profile.nome.charAt(0)}</Text>
                                )}
                            </View>

                            <Text style={[styles.name, { color: colors.text }]}>{profile.nome}</Text>
                            <Text style={[styles.company, { color: colors.primary }]}>
                                {profile.empresa?.nomeFantasia} • {profile.empresa?.localizacao}
                            </Text>

                            {/* Badge de Status */}
                            <View style={[styles.statusBadge, { backgroundColor: profile.isOnline ? 'rgba(52, 199, 89, 0.1)' : colors.card }]}>
                                <View style={[styles.dot, { backgroundColor: profile.isOnline ? '#34C759' : '#999' }]} />
                                <Text style={[styles.statusText, { color: profile.isOnline ? '#34C759' : colors.text }]}>
                                    {profile.isOnline ? 'Online agora' : 'Offline'}
                                </Text>
                            </View>
                        </View>

                        <View style={[styles.section, { backgroundColor: colors.card }]}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Contato</Text>

                            <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(`mailto:${profile.email}`)}>
                                <View style={[styles.iconBox, { backgroundColor: 'rgba(0,122,255,0.1)' }]}>
                                    <Ionicons name="mail" size={20} color="#007AFF" />
                                </View>
                                <View>
                                    <Text style={[styles.contactLabel, { color: colors.text }]}>E-mail Corporativo</Text>
                                    <Text style={[styles.contactValue, { color: colors.text }]}>{profile.email}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.border} style={{ marginLeft: 'auto' }} />
                            </TouchableOpacity>
                        </View>

                        {/* Botão para ver a empresa dele */}
                        {profile.empresa && (
                            <TouchableOpacity
                                style={[styles.companyButton, { borderColor: colors.primary }]}
                                onPress={() => navigation.navigate('CompanyProfile', { companyData: profile.empresa })}
                            >
                                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Ver Perfil da {profile.empresa.nomeFantasia}</Text>
                            </TouchableOpacity>
                        )}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 10 },
    backBtn: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 24 },

    profileHeader: { alignItems: 'center', marginBottom: 30 },
    avatarContainer: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E1E1E1', marginBottom: 16, overflow: 'hidden' },
    avatarImage: { width: '100%', height: '100%' },
    avatarText: { fontSize: 40, fontWeight: 'bold', color: '#666' },

    name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4, textAlign: 'center' },
    company: { fontSize: 16, opacity: 0.8, marginBottom: 12 },

    statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 6 },
    dot: { width: 8, height: 8, borderRadius: 4 },
    statusText: { fontSize: 12, fontWeight: '600' },

    section: { padding: 20, borderRadius: 16, marginBottom: 16 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 16 },

    contactRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    iconBox: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    contactLabel: { fontSize: 12, opacity: 0.6, marginBottom: 2 },
    contactValue: { fontSize: 14, fontWeight: '500' },

    companyButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 8 }
});