import React, { useState } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,
    SafeAreaView, StatusBar, Alert, Share, Platform, Dimensions, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import api from '../../../services/api';

const { width } = Dimensions.get('window');

export default function JobDetailsScreen({ route, navigation }: any) {
    const { jobData } = route.params;
    const { colors } = useTheme();
    const [loading, setLoading] = useState(false);

    const formatSalary = (min: number, max: number) => {
        if (!min && !max) return "A combinar";
        return `R$ ${(min / 1000).toFixed(1)}k - ${(max / 1000).toFixed(1)}k`;
    };

    const formatEnum = (text: string) => {
        if (!text) return "";
        return text.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    };

    const handleApply = async () => {
        setLoading(true);
        try {
            await api.post('/swipe/candidate', { targetId: jobData.id, isLiked: true });
            Alert.alert("Sucesso!", "Sua candidatura foi enviada para o recrutador.");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Erro", "Não foi possível aplicar agora.");
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Olha essa vaga de ${jobData.titulo} na ${jobData.empresa.nomeFantasia} que vi no Includ.IA!`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const InfoCard = ({ icon, label, value, color }: any) => (
        <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
                <Ionicons name={icon} size={20} color={color} />
            </View>
            <View>
                <Text style={[styles.infoLabel, { color: colors.text }]}>{label}</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="light-content" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                bounces={false}
            >
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: jobData.empresa.fotoCapaUrl || 'https://source.unsplash.com/random/800x600/?office' }}
                        style={styles.coverImage}
                    />
                    <View style={styles.overlay} />

                    <SafeAreaView style={styles.navBar}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleBtn}>
                            <Ionicons name="arrow-back" size={24} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleShare} style={styles.circleBtn}>
                            <Ionicons name="share-social-outline" size={22} color="#FFF" />
                        </TouchableOpacity>
                    </SafeAreaView>

                    <View style={styles.headerInfo}>
                        <View style={styles.companyBadge}>
                            <Image
                                source={{ uri: jobData.empresa.fotoCapaUrl || 'https://github.com/github.png' }}
                                style={styles.miniLogo}
                            />
                            <Text style={styles.companyName}>{jobData.empresa.nomeFantasia}</Text>
                        </View>
                        <Text style={styles.jobTitle}>{jobData.titulo}</Text>
                        <View style={styles.locationRow}>
                            <Ionicons name="location" size={16} color="#FFF" />
                            <Text style={styles.locationText}>{jobData.localizacao}</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.content, { backgroundColor: colors.background }]}>

                    <View style={styles.gridContainer}>
                        <InfoCard
                            icon="cash-outline"
                            label="Salário"
                            value={formatSalary(jobData.salarioMin, jobData.salarioMax)}
                            color="#34C759"
                        />
                        <InfoCard
                            icon="briefcase-outline"
                            label="Modelo"
                            value={formatEnum(jobData.modeloTrabalho)}
                            color="#007AFF"
                        />
                        <InfoCard
                            icon="document-text-outline"
                            label="Contrato"
                            value={formatEnum(jobData.tipoVaga)}
                            color="#FF9500"
                        />
                        <InfoCard
                            icon="school-outline"
                            label="Nível"
                            value={jobData.experienciaRequerida}
                            color="#AF52DE"
                        />
                    </View>

                    <View style={[styles.aiBox, { backgroundColor: 'rgba(138, 43, 226, 0.08)', borderColor: 'rgba(138, 43, 226, 0.2)' }]}>
                        <View style={styles.aiHeader}>
                            <Ionicons name="sparkles" size={18} color="#8A2BE2" />
                            <Text style={styles.aiTitle}>Resumo Inclusivo (IA)</Text>
                        </View>
                        <Text style={[styles.aiText, { color: colors.text }]}>
                            {jobData.descricaoInclusiva}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Descrição da Vaga</Text>
                        <Text style={[styles.bodyText, { color: colors.text }]}>
                            {jobData.descricaoOriginal || jobData.descricaoInclusiva}
                        </Text>
                    </View>

                    {jobData.beneficios && (
                        <View style={styles.section}>
                            <Text style={[styles.sectionTitle, { color: colors.text }]}>Benefícios</Text>
                            <View style={styles.benefitsContainer}>
                                {jobData.beneficios.split(',').map((ben: string, i: number) => (
                                    <View key={i} style={[styles.benefitItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                        <Ionicons name="checkmark-circle" size={18} color="#34C759" />
                                        <Text style={[styles.benefitText, { color: colors.text }]}>{ben.trim()}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Habilidades Necessárias</Text>
                        <View style={styles.skillsContainer}>
                            {jobData.skills && jobData.skills.map((skill: string, i: number) => (
                                <View key={i} style={[styles.skillChip, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                    <Text style={[styles.skillText, { color: colors.text }]}>{skill}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.companyLink, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={() => navigation.navigate('CompanyProfile', { companyData: jobData.empresa })}
                    >
                        <View style={styles.companyLinkLeft}>
                            <Image source={{ uri: jobData.empresa.fotoCapaUrl || 'https://github.com/github.png' }} style={styles.miniLogoRound} />
                            <View>
                                <Text style={[styles.companyLinkName, { color: colors.text }]}>{jobData.empresa.nomeFantasia}</Text>
                                <Text style={{ color: colors.primary, fontSize: 12 }}>Ver perfil completo</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={colors.text} />
                    </TouchableOpacity>

                </View>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <TouchableOpacity
                    style={[styles.applyButton, { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 }]}
                    onPress={handleApply}
                    disabled={loading}
                >
                    <Text style={styles.applyButtonText}>
                        {loading ? "Enviando..." : "Candidatar-se Agora"}
                    </Text>
                    {!loading && <Ionicons name="arrow-forward" size={20} color="#FFF" />}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    imageContainer: { height: 300, width: '100%', position: 'relative' },
    coverImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.3)' },

    navBar: { position: 'absolute', top: 0, width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 40 : 10 },
    circleBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },

    headerInfo: { position: 'absolute', bottom: 40, left: 24, right: 24 },
    companyBadge: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8, backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingRight: 12, paddingLeft: 4, paddingVertical: 4, borderRadius: 20 },
    miniLogo: { width: 24, height: 24, borderRadius: 12 },
    companyName: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },
    jobTitle: { color: '#FFF', fontSize: 28, fontWeight: '800', lineHeight: 34, marginBottom: 8, textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    locationText: { color: '#FFF', fontSize: 14, fontWeight: '500' },

    content: { marginTop: -24, borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 24, paddingTop: 30 },

    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginBottom: 24 },
    infoCard: { width: '48%', flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, borderWidth: 1, gap: 10 },
    iconCircle: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    infoLabel: { fontSize: 11, opacity: 0.6, marginBottom: 2 },
    infoValue: { fontSize: 13, fontWeight: '700' },

    aiBox: { padding: 20, borderRadius: 20, borderWidth: 1, marginBottom: 24 },
    aiHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    aiTitle: { color: '#8A2BE2', fontWeight: 'bold', fontSize: 14 },
    aiText: { fontSize: 14, lineHeight: 22, opacity: 0.9 },

    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
    bodyText: { fontSize: 15, lineHeight: 24, opacity: 0.7 },

    benefitsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    benefitItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, gap: 6 },
    benefitText: { fontSize: 13, fontWeight: '500' },

    skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    skillChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    skillText: { fontSize: 13, fontWeight: '600' },

    companyLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 10 },
    companyLinkLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    miniLogoRound: { width: 40, height: 40, borderRadius: 20 },
    companyLinkName: { fontWeight: 'bold', fontSize: 16 },

    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 20, paddingBottom: Platform.OS === 'ios' ? 30 : 20, borderTopWidth: 1, shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, elevation: 10 },
    applyButton: { flexDirection: 'row', height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', gap: 10, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 },
    applyButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' }
});