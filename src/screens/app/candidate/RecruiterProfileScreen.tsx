import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Linking, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';

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
        fotoCapaUrl?: string;
    };
}

export default function RecruiterProfileScreen({ route, navigation }: any) {
    const { recruiterId, name } = route.params;
    const { colors } = useTheme();

    const [profile, setProfile] = useState<RecruiterProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const getInitials = (fullName: string) => {
        if (!fullName) return "R";
        const names = fullName.trim().split(' ');
        if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    const loadProfile = async () => {
        try {
            const response = await api.get(`/recruiters/${recruiterId}`);
            setProfile(response.data);
        } catch (error) {
            setProfile({
                id: recruiterId,
                nome: name || "Recrutador Demo",
                email: "recruiter@demo.com",
                isOnline: true,
                empresa: {
                    id: 'e1',
                    nomeFantasia: 'Empresa Parceira',
                    localizacao: 'São Paulo, SP'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleViewCompany = () => {
        if (profile?.empresa) {
            navigation.navigate('CompanyProfile', { companyData: profile.empresa });
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
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Perfil do Recrutador</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {profile && (
                    <>
                        <View style={styles.profileHeader}>

                            <View style={[styles.avatarContainer, {
                                borderColor: profile.isOnline ? '#34C759' : colors.border,
                                backgroundColor: profile.fotoPerfilUrl ? 'transparent' : colors.primary
                            }]}>
                                {profile.fotoPerfilUrl ? (
                                    <Image source={{ uri: profile.fotoPerfilUrl }} style={styles.avatarImage} />
                                ) : (
                                    <Text style={styles.avatarText}>{getInitials(profile.nome)}</Text>
                                )}
                            </View>

                            <Text style={[styles.name, { color: colors.text }]}>{profile.nome}</Text>
                            <Text style={[styles.role, { color: colors.text }]}>Tech Recruiter</Text>

                            {profile.isOnline && (
                                <View style={styles.onlineBadge}>
                                    <View style={styles.dot} />
                                    <Text style={styles.onlineText}>Disponível agora</Text>
                                </View>
                            )}
                        </View>

                        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Empresa Atual</Text>

                            <TouchableOpacity style={styles.companyCard} onPress={handleViewCompany}>
                                <View style={[styles.companyIcon, { backgroundColor: colors.primary }]}>
                                    <Ionicons name="business" size={24} color="#FFF" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={[styles.companyName, { color: colors.text }]}>
                                        {profile.empresa.nomeFantasia}
                                    </Text>
                                    <Text style={styles.companyLoc}>{profile.empresa.localizacao}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.border} />
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Experiência Anterior</Text>

                            <View style={styles.xpItem}>
                                <View style={[styles.xpIcon, { backgroundColor: '#EEE' }]}>
                                    <Ionicons name="briefcase" size={18} color="#666" />
                                </View>
                                <View>
                                    <Text style={[styles.xpRole, { color: colors.text }]}>Talent Acquisition</Text>
                                    <Text style={styles.xpCompany}>Consultoria RH • 2 anos</Text>
                                </View>
                            </View>

                            <View style={[styles.divider, { backgroundColor: colors.border }]} />

                            <View style={styles.xpItem}>
                                <View style={[styles.xpIcon, { backgroundColor: '#EEE' }]}>
                                    <Ionicons name="briefcase" size={18} color="#666" />
                                </View>
                                <View>
                                    <Text style={[styles.xpRole, { color: colors.text }]}>Analista de RH Jr</Text>
                                    <Text style={styles.xpCompany}>Startup Tech • 1 ano</Text>
                                </View>
                            </View>
                        </View>

                        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Contato</Text>
                            <TouchableOpacity
                                style={styles.contactRow}
                                onPress={() => Linking.openURL(`mailto:${profile.email}`)}
                            >
                                <Ionicons name="mail-outline" size={24} color={colors.primary} />
                                <Text style={[styles.emailText, { color: colors.text }]}>{profile.email}</Text>
                            </TouchableOpacity>
                        </View>
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
    avatarContainer: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, justifyContent: 'center', alignItems: 'center', marginBottom: 12, overflow: 'hidden' },
    avatarImage: { width: '100%', height: '100%' },
    avatarText: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
    name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4, textAlign: 'center' },
    role: { fontSize: 16, opacity: 0.6, marginBottom: 12 },

    onlineBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(52, 199, 89, 0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 6 },
    dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#34C759' },
    onlineText: { color: '#34C759', fontSize: 12, fontWeight: 'bold' },

    section: { padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 16, opacity: 0.8 },

    companyCard: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    companyIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    companyName: { fontSize: 16, fontWeight: 'bold' },
    companyLoc: { fontSize: 13, opacity: 0.6, marginTop: 2 },

    xpItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 4 },
    xpIcon: { width: 36, height: 36, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
    xpRole: { fontSize: 15, fontWeight: '600' },
    xpCompany: { fontSize: 13, opacity: 0.6 },
    divider: { height: 1, width: '100%', marginVertical: 12, opacity: 0.5 },

    contactRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    emailText: { fontSize: 15, textDecorationLine: 'underline' }
});