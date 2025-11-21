import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export default function MatchDetailScreen({ route, navigation }: any) {
    const { colors } = useTheme();

    // --- PROTEÇÃO CONTRA ERRO ---
    // Se route.params não existir (ex: reload da página), usamos undefined
    const matchData = route.params?.matchData;

    // Se não tiver dados, mostramos loading e voltamos para a tela anterior
    if (!matchData) {
        useEffect(() => {
            // Volta para a lista de matches automaticamente se der erro
            navigation.goBack();
        }, []);

        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ color: colors.text, marginTop: 10 }}>Carregando dados...</Text>
            </View>
        );
    }
    // ----------------------------

    const { jobVaga, recruiter } = matchData;
    const { empresa } = jobVaga;

    const handleOpenChat = () => {
        navigation.navigate('ChatStack', {
            screen: 'ChatMessage',
            params: {
                matchId: matchData.id,
                name: recruiter.nome || 'Recrutador',
                photo: empresa.fotoCapaUrl
            }
        });
    };

    const handleOpenRecruiter = () => {
        navigation.navigate('RecruiterProfile', {
            recruiterId: recruiter.id,
            name: recruiter.nome || 'Recrutador'
        });
    };

    const handleOpenCompany = () => {
        navigation.navigate('CompanyProfile', {
            companyData: empresa
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={28} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Hero Section */}
                <View style={styles.hero}>
                    <View style={styles.matchIconContainer}>
                        <Ionicons name="heart" size={60} color="#FFF" />
                        <View style={styles.miniIcon}>
                            <Ionicons name="star" size={20} color="#FFD700" />
                        </View>
                    </View>

                    <Text style={[styles.title, { color: colors.text }]}>It's a Match!</Text>
                    <Text style={[styles.subtitle, { color: colors.text }]}>
                        A <Text style={{ fontWeight: 'bold', color: colors.primary }}>{empresa.nomeFantasia}</Text> gostou do seu perfil.
                    </Text>
                </View>

                {/* Card da Vaga */}
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={styles.cardHeader}>
                        <Image
                            source={{ uri: empresa.fotoCapaUrl || 'https://github.com/github.png' }}
                            style={styles.companyLogo}
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.jobTitle, { color: colors.text }]}>{jobVaga.titulo}</Text>
                            <Text style={[styles.location, { color: colors.text }]}>{jobVaga.localizacao}</Text>
                        </View>
                    </View>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Link para Recrutador */}
                    <TouchableOpacity onPress={handleOpenRecruiter} activeOpacity={0.7}>
                        <View style={styles.recruiterInfo}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <Text style={[styles.sectionLabel, { color: colors.text }]}>RECRUTADOR RESPONSÁVEL</Text>
                                <Text style={{ fontSize: 12, color: colors.primary }}>Ver Perfil</Text>
                            </View>

                            <View style={styles.personRow}>
                                <View style={[styles.avatarFallback, { backgroundColor: colors.primary }]}>
                                    <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 18 }}>
                                        {recruiter.nome ? recruiter.nome.charAt(0) : 'R'}
                                    </Text>
                                </View>
                                <View>
                                    <Text style={[styles.recruiterName, { color: colors.text }]}>
                                        {recruiter.nome || 'Equipe de RH'}
                                    </Text>
                                    <Text style={[styles.recruiterRole, { color: colors.text }]}>
                                        {recruiter.cargo || 'Tech Recruiter'}
                                    </Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.text} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Link para Empresa */}
                <TouchableOpacity
                    style={[styles.companyButton, { borderColor: colors.primary }]}
                    onPress={handleOpenCompany}
                >
                    <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Ver Perfil da Empresa</Text>
                    <Ionicons name="business-outline" size={20} color={colors.primary} />
                </TouchableOpacity>

                <View style={[styles.tipBox, { backgroundColor: 'rgba(52, 199, 89, 0.1)' }]}>
                    <Ionicons name="bulb" size={24} color="#34C759" />
                    <Text style={[styles.tipText, { color: colors.text }]}>
                        Envie uma mensagem apresentando-se. Mencione o que chamou sua atenção na vaga!
                    </Text>
                </View>

            </ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 24, paddingTop: 50, paddingBottom: 10 },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },

    scrollContent: { paddingHorizontal: 24, paddingBottom: 140 },

    hero: { alignItems: 'center', marginVertical: 24 },
    matchIconContainer: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: '#FF3B30', justifyContent: 'center', alignItems: 'center',
        marginBottom: 16,
        shadowColor: '#FF3B30', shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 10
    },
    miniIcon: { position: 'absolute', top: 0, right: 0, backgroundColor: '#FFF', borderRadius: 15, padding: 4, elevation: 5 },
    title: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
    subtitle: { fontSize: 16, textAlign: 'center', marginTop: 8, opacity: 0.7, paddingHorizontal: 20 },

    card: { borderRadius: 24, borderWidth: 1, padding: 20, marginTop: 16 },
    cardHeader: { flexDirection: 'row', gap: 16, alignItems: 'center' },
    companyLogo: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#f0f0f0' },
    jobTitle: { fontSize: 18, fontWeight: 'bold', lineHeight: 24 },
    location: { fontSize: 14, opacity: 0.6, marginTop: 2 },

    divider: { height: 1, marginVertical: 20, opacity: 0.5 },

    sectionLabel: { fontSize: 12, fontWeight: '700', opacity: 0.5, letterSpacing: 1 },
    recruiterInfo: {},
    personRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    avatarFallback: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
    recruiterName: { fontSize: 16, fontWeight: 'bold' },
    recruiterRole: { fontSize: 13, opacity: 0.6 },

    companyButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 16 },

    tipBox: { flexDirection: 'row', padding: 16, borderRadius: 16, marginTop: 24, gap: 12, alignItems: 'center' },
    tipText: { flex: 1, fontSize: 14, lineHeight: 20, opacity: 0.9 },

    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 24, borderTopWidth: 1, gap: 12 },
    chatButton: { height: 56, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
    chatButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    secondaryButton: { height: 56, borderRadius: 16, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
    secondaryButtonText: { fontSize: 16, fontWeight: '600' }
});