import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, FlatList, ActivityIndicator, Linking, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

// Interface baseada no JSON da API Java
interface EmpresaProfile {
    id: string;
    nomeOficial: string;
    nomeFantasia: string;
    localizacao: string;
    descricao: string;
    cultura: string;
    fotoCapaUrl?: string;
    cnpj?: string; // Usamos para validar se é verificada
}

const MOCK_JOBS = [
    { id: '1', title: 'Desenvolvedor Java', location: 'Híbrido' },
    { id: '2', title: 'QA Engineer', location: 'Remoto' },
    { id: '3', title: 'Tech Lead', location: 'Presencial' },
];

export default function CompanyProfileScreen({ route, navigation }: any) {
    const { companyData } = route.params;
    const { colors } = useTheme();

    const [company, setCompany] = useState<EmpresaProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCompanyDetails();
    }, []);

    const loadCompanyDetails = async () => {
        try {
            if (companyData.id) {
                const response = await api.get(`/empresas/${companyData.id}`);
                setCompany(response.data);
            } else {
                setCompany(companyData);
            }
        } catch (error) {
            setCompany(companyData);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenMaps = () => {
        if (!company?.localizacao) return;
        const address = encodeURIComponent(company.localizacao);
        const url = Platform.select({
            ios: `maps:0,0?q=${address}`,
            android: `geo:0,0?q=${address}`
        });
        if (url) Linking.openURL(url).catch(err => console.error("Erro ao abrir mapa", err));
    };

    const renderJobCard = ({ item }: any) => (
        <TouchableOpacity style={[styles.jobCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.jobIconBg}>
                <Ionicons name="briefcase" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.jobTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
            <Text style={[styles.jobLoc, { color: colors.text }]}>{item.location}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center' }]}><ActivityIndicator color={colors.primary} /></View>;
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Capa */}
                <View style={styles.coverContainer}>
                    <Image
                        source={{ uri: company?.fotoCapaUrl || 'https://source.unsplash.com/random/800x600/?office,building' }}
                        style={styles.coverImage}
                    />
                    <View style={styles.overlay} />
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtnFloat}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>

                    {/* LOGO & Cabeçalho */}
                    <View style={styles.headerSection}>
                        <View style={[styles.logoContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <Text style={[styles.logoText, { color: colors.primary }]}>
                                {company?.nomeFantasia?.charAt(0) || 'E'}
                            </Text>
                        </View>

                        {/* NOME DA EMPRESA + VERIFICADO */}
                        <View style={styles.nameRow}>
                            <Text style={[styles.companyName, { color: colors.text }]}>
                                {company?.nomeFantasia}
                            </Text>
                            {/* Selo de Verificado */}
                            <Ionicons name="checkmark-circle" size={22} color="#1DA1F2" />
                        </View>

                        <Text style={[styles.officialName, { color: colors.text }]}>{company?.nomeOficial}</Text>

                        {/* Botão de Mapa */}
                        <TouchableOpacity onPress={handleOpenMaps} style={[styles.mapButton, { backgroundColor: 'rgba(0,122,255,0.1)' }]}>
                            <Ionicons name="location" size={16} color="#007AFF" />
                            <Text style={[styles.mapText, { color: "#007AFF" }]}>
                                {company?.localizacao || 'Localização não informada'}
                            </Text>
                            <Ionicons name="open-outline" size={14} color="#007AFF" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.divider} />

                    {/* Descrição */}
                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Sobre Nós</Text>
                        <Text style={[styles.description, { color: colors.text }]}>
                            {company?.descricao || "A empresa ainda não adicionou uma descrição detalhada, mas está verificada e ativa na plataforma."}
                        </Text>
                    </View>

                    {/* Cultura (Destaque) */}
                    {company?.cultura && (
                        <View style={[styles.cultureBox, { backgroundColor: 'rgba(52, 199, 89, 0.1)' }]}>
                            <View style={styles.cultureHeader}>
                                <Ionicons name="heart" size={20} color="#34C759" />
                                <Text style={[styles.cultureTitle, { color: '#2d8a3e' }]}>Nossa Cultura</Text>
                            </View>
                            <Text style={[styles.cultureText, { color: '#2d8a3e' }]}>
                                {company.cultura}
                            </Text>
                        </View>
                    )}

                    {/* Lista de Vagas */}
                    <View style={styles.jobsSection}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Vagas em Aberto</Text>
                        <FlatList
                            data={MOCK_JOBS}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            renderItem={renderJobCard}
                            keyExtractor={item => item.id}
                            contentContainerStyle={{ gap: 12, paddingBottom: 20 }}
                        />
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    // Capa
    coverContainer: { height: 200, width: '100%' },
    coverImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
    backBtnFloat: { position: 'absolute', top: 50, left: 24, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },

    // Conteúdo Principal
    content: { paddingHorizontal: 24 },

    // Header com Logo
    headerSection: { alignItems: 'center', marginTop: -50, marginBottom: 20 },
    logoContainer: {
        width: 100, height: 100, borderRadius: 24, borderWidth: 4,
        justifyContent: 'center', alignItems: 'center', marginBottom: 12,
        elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4
    },
    logoText: { fontSize: 48, fontWeight: 'bold' },

    // Linha do Nome + Verificado
    nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
    companyName: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },

    officialName: { fontSize: 14, opacity: 0.5, textAlign: 'center', marginBottom: 12 },

    // Botão Mapa
    mapButton: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, alignItems: 'center', gap: 6 },
    mapText: { fontWeight: '600', fontSize: 14 },

    divider: { height: 1, backgroundColor: '#DDD', width: '100%', marginVertical: 20, opacity: 0.5 },

    // Seções
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
    description: { fontSize: 15, lineHeight: 24, opacity: 0.8 },

    // Cultura
    cultureBox: { padding: 20, borderRadius: 20, marginBottom: 24 },
    cultureHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    cultureTitle: { fontSize: 16, fontWeight: 'bold' },
    cultureText: { fontSize: 15, lineHeight: 22, fontWeight: '500' },

    // Vagas
    jobsSection: { marginBottom: 40 },
    jobCard: { width: 160, padding: 16, borderRadius: 20, borderWidth: 1, marginRight: 0 },
    jobIconBg: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.05)', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    jobTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
    jobLoc: { fontSize: 12, opacity: 0.6 }
});