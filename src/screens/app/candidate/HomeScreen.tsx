import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity,
    Animated, Dimensions, ActivityIndicator, Modal, Platform, StatusBar, ScrollView, PanResponder, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../../context/ThemeContext';
import api from '../../../services/api';


const { width, height } = Dimensions.get('window');
const SWIPE_THRESHOLD = 120;
const SWIPE_OUT_DURATION = 250;

interface Empresa {
    id: string;
    nomeFantasia: string;
    fotoCapaUrl?: string;
}

interface Vaga {
    id: string;
    titulo: string;
    descricaoInclusiva: string;
    localizacao: string;

    tipoVaga: 'TEMPO_INTEGRAL' | 'MEIO_PERIODO' | 'CONTRATO' | 'FREELANCE' | 'ESTAGIO';
    modeloTrabalho: 'PRESENCIAL' | 'HIBRIDO' | 'REMOTO';
    salarioMin: number;
    salarioMax: number;
    beneficios: string;
    experienciaRequerida: string;
    skillIds: string[];

    empresa: Empresa;
    skills: string[];
    matchPercent?: number;
    distanciaKm?: number;
}

const MOCK_VAGAS: Vaga[] = [
    {
        id: 'mock-1',
        titulo: 'Desenvolvedor Java Sênior',
        descricaoInclusiva: 'Buscamos pessoas apaixonadas por código limpo. Valorizamos histórias de vida e superação.',
        localizacao: 'São Paulo, SP',
        modeloTrabalho: 'HIBRIDO',
        tipoVaga: 'TEMPO_INTEGRAL',
        salarioMin: 12000,
        salarioMax: 18000,
        beneficios: 'VR, VA, Gympass, Plano de Saúde',
        experienciaRequerida: 'Sênior',
        skillIds: ['1'],
        skills: ['Java', 'Spring Boot', 'Microservices'],
        empresa: { id: 'e1', nomeFantasia: 'Nubank', fotoCapaUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop' }
    },
    {
        id: 'mock-2',
        titulo: 'Frontend Engineer (React)',
        descricaoInclusiva: 'Ambiente seguro e acolhedor. Foco em Acessibilidade (WCAG).',
        localizacao: 'Remoto',
        modeloTrabalho: 'REMOTO',
        tipoVaga: 'CONTRATO',
        salarioMin: 8000,
        salarioMax: 14000,
        beneficios: 'Flexibilidade de horário, Bônus anual',
        experienciaRequerida: 'Pleno',
        skillIds: ['2'],
        skills: ['React', 'TypeScript', 'CSS'],
        empresa: { id: 'e2', nomeFantasia: 'Google', fotoCapaUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop' }
    },
    {
        id: 'mock-3',
        titulo: 'Product Owner Inclusivo',
        descricaoInclusiva: 'Lidere produtos que mudam o mundo. Visão estratégica e empatia.',
        localizacao: 'Rio de Janeiro, RJ',
        modeloTrabalho: 'PRESENCIAL',
        tipoVaga: 'TEMPO_INTEGRAL',
        salarioMin: 10000,
        salarioMax: 15000,
        beneficios: 'PLR, Plano Dental, Creche',
        experienciaRequerida: 'Especialista',
        skillIds: ['3'],
        skills: ['Scrum', 'Liderança', 'Inglês'],
        empresa: { id: 'e3', nomeFantasia: 'Microsoft', fotoCapaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop' }
    }
];

const MY_SKILLS = ['Java', 'React', 'Spring', 'Comunicação', 'Inglês'];

export default function HomeScreen({ navigation }: any) {
    const { colors } = useTheme();

    const [vagas, setVagas] = useState<Vaga[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterVisible, setFilterVisible] = useState(false);

    const [filters, setFilters] = useState({
        modelo: 'TODOS',
        tipoContrato: 'TODOS',
        minSalario: 0,
        ordenarPor: 'RELEVANCIA',
        apenasMatch: false
    });

    const position = useRef(new Animated.ValueXY()).current;

    useEffect(() => {
        loadFiltersAndFeed();
    }, []);

    const loadFiltersAndFeed = async () => {
        try {
            const savedFilters = await AsyncStorage.getItem('@includia_filters_v2');
            if (savedFilters) setFilters(JSON.parse(savedFilters));
            loadFeed(savedFilters ? JSON.parse(savedFilters) : filters);
        } catch (e) { loadFeed(filters); }
    };

    const updateFilters = async (newFilters: any) => {
        setFilters(newFilters);
        AsyncStorage.setItem('@includia_filters_v2', JSON.stringify(newFilters));
        loadFeed(newFilters);
    };

    const loadFeed = useCallback(async (currentFilters = filters) => {
        setLoading(true);
        try {
            let allVagas: Vaga[] = [];
            try {
                const res = await api.get('/vagas');
                allVagas = res.data.content?.length ? res.data.content : MOCK_VAGAS;
            } catch { allVagas = MOCK_VAGAS; }

            allVagas = allVagas.map(v => ({
                ...v,
                distanciaKm: v.distanciaKm || Math.floor(Math.random() * 15) + 1,
                matchPercent: calculateMatch(v.skills)
            }));

            if (currentFilters.modelo !== 'TODOS') {
                allVagas = allVagas.filter(v => v.modeloTrabalho === currentFilters.modelo);
            }
            if (currentFilters.tipoContrato !== 'TODOS') {
                allVagas = allVagas.filter(v => v.tipoVaga === currentFilters.tipoContrato);
            }
            if (currentFilters.minSalario > 0) {
                allVagas = allVagas.filter(v => v.salarioMax >= currentFilters.minSalario);
            }
            if (currentFilters.apenasMatch) {
                allVagas = allVagas.filter(v => (v.matchPercent || 0) > 70);
            }

            if (currentFilters.ordenarPor === 'SALARIO') allVagas.sort((a, b) => b.salarioMax - a.salarioMax);

            setVagas(allVagas);
        } finally { setLoading(false); }
    }, []);

    const calculateMatch = (skills: string[] = []) => {
        if (!skills?.length) return 60;
        const common = skills.filter(s => MY_SKILLS.some(my => my.toLowerCase().includes(s.toLowerCase())));
        return 40 + Math.round((common.length / skills.length) * 60);
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gesture) => position.setValue({ x: gesture.dx, y: gesture.dy }),
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) forceSwipe('right');
                else if (gesture.dx < -SWIPE_THRESHOLD) forceSwipe('left');
                else if (gesture.dy < -SWIPE_THRESHOLD) forceSwipe('up');
                else resetPosition();
            }
        })
    ).current;

    const forceSwipe = (direction: 'right' | 'left' | 'up') => {
        const xVal = direction === 'right' ? width + 100 : direction === 'left' ? -width - 100 : 0;
        const yVal = direction === 'up' ? -height - 100 : 0;
        Animated.timing(position, { toValue: { x: xVal, y: yVal }, duration: SWIPE_OUT_DURATION, useNativeDriver: false }).start(() => onSwipeComplete(direction));
    };

    const onSwipeComplete = (direction: string) => {
        const currentVaga = vagas[0];
        const action = direction === 'right' ? 'LIKE' : direction === 'up' ? 'SUPERLIKE' : 'DISLIKE';
        handleInteraction(action, currentVaga);
        position.setValue({ x: 0, y: 0 });
        setVagas(prev => prev.slice(1));
    };

    const resetPosition = () => Animated.spring(position, { toValue: { x: 0, y: 0 }, friction: 5, useNativeDriver: false }).start();

    const handleInteraction = async (action: string, vaga: Vaga) => {
        if (action === 'SUPERLIKE') Alert.alert('Super Like! ⭐', `Você enviou um destaque para ${vaga.empresa.nomeFantasia}`);
        try { await api.post('/swipe/candidate', { targetId: vaga.id, isLiked: action !== 'DISLIKE' }); } catch (e) { }
    };

    const handleButtonPress = (direction: 'right' | 'left' | 'up') => forceSwipe(direction);

    const handleCompanyPress = (empresa: Empresa) => {
        navigation.navigate('CompanyProfile', { companyData: empresa });
    };

    const renderCard = (item: Vaga, isTop: boolean) => {
        const rotate = position.x.interpolate({ inputRange: [-width / 2, 0, width / 2], outputRange: ['-10deg', '0deg', '10deg'], extrapolate: 'clamp' });
        const animatedStyle = isTop ? { transform: [{ rotate }, ...position.getTranslateTransform()] } : { transform: [{ scale: 0.95 }] };

        const modeloLabel = item.modeloTrabalho === 'TEMPO_INTEGRAL' ? 'Integral' : item.modeloTrabalho;
        const tipoLabel = item.tipoVaga === 'TEMPO_INTEGRAL' ? 'CLT' : item.tipoVaga === 'CONTRATO' ? 'PJ' : item.tipoVaga;

        return (
            <Animated.View
                {...(isTop ? panResponder.panHandlers : {})}
                key={item.id}
                style={[styles.card, { backgroundColor: colors.card }, animatedStyle, !isTop && { top: 10, zIndex: -1 }]}
            >
                <View style={styles.cardImageContainer}>

                    <TouchableOpacity
                        style={styles.infoBtn}
                        onPress={() => navigation.navigate('JobDetails', { jobData: item })}
                    >
                        <Ionicons name="information-circle" size={28} color="#FFF" />
                    </TouchableOpacity>
                    <Image source={{ uri: item.empresa.fotoCapaUrl || 'https://source.unsplash.com/random/800x600/?office' }} style={styles.cardImage} />

                    <View style={[styles.matchBadge, { backgroundColor: (item.matchPercent || 0) > 80 ? '#34C759' : '#8A2BE2' }]}>
                        <Ionicons name="prism" size={14} color="#FFF" />
                        <Text style={styles.matchText}>{item.matchPercent}% Match</Text>
                    </View>

                    <View style={styles.overlay}>
                        <View style={styles.tagRow}>
                            <View style={styles.badgeContainer}><Text style={styles.badgeText}>{modeloLabel}</Text></View>
                            <View style={[styles.badgeContainer, { backgroundColor: '#FF9500' }]}><Text style={styles.badgeText}>{tipoLabel}</Text></View>
                            <View style={[styles.badgeContainer, { backgroundColor: 'rgba(0,0,0,0.7)' }]}><Text style={styles.badgeText}>{item.experienciaRequerida}</Text></View>
                        </View>
                    </View>
                </View>

                <View style={styles.cardContent}>
                    <View>
                        <Text style={[styles.jobTitle, { color: colors.text }]} numberOfLines={2}>{item.titulo}</Text>

                        <TouchableOpacity onPress={() => handleCompanyPress(item.empresa)} style={styles.companyBtn}>
                            <Ionicons name="business" size={16} color={colors.primary} />
                            <Text style={[styles.companyName, { color: colors.primary }]}>
                                {item.empresa.nomeFantasia}
                            </Text>
                            <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}><Ionicons name="location-outline" size={16} color="#999" /><Text style={[styles.infoText, { color: colors.text }]}>{item.localizacao}</Text></View>
                        <View style={styles.infoItem}><Ionicons name="cash-outline" size={16} color="#999" /><Text style={[styles.infoText, { color: colors.text }]}>R$ {item.salarioMin / 1000}k - {item.salarioMax / 1000}k</Text></View>
                    </View>

                    <View style={[styles.aiBox, { backgroundColor: colors.background }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 12, color: '#8A2BE2', fontWeight: 'bold', marginBottom: 4 }}>✨ Análise IA</Text>
                            <Text style={{ fontSize: 10, color: '#999' }}>Benefícios: {item.beneficios?.split(',')[0]}...</Text>
                        </View>
                        <Text style={[styles.desc, { color: colors.text }]} numberOfLines={3}>{item.descricaoInclusiva}</Text>
                    </View>
                </View>
            </Animated.View>
        );
    };

    const renderFilterModal = () => (
        <Modal animationType="fade" transparent={true} visible={filterVisible} onRequestClose={() => setFilterVisible(false)}>
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Filtros</Text>
                        <TouchableOpacity onPress={() => setFilterVisible(false)}><Ionicons name="close" size={24} color={colors.text} /></TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>

                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Modelo de Trabalho</Text>
                        <View style={styles.chipsContainer}>
                            {['TODOS', 'REMOTO', 'HIBRIDO', 'PRESENCIAL'].map(t => (
                                <TouchableOpacity key={t} style={[styles.chip, filters.modelo === t && { backgroundColor: colors.primary, borderColor: colors.primary }]} onPress={() => updateFilters({ ...filters, modelo: t })}>
                                    <Text style={[styles.chipText, filters.modelo === t && { color: '#FFF' }]}>{t}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}>Tipo de Contrato</Text>
                        <View style={styles.chipsContainer}>
                            {[
                                { id: 'TODOS', label: 'Todos' },
                                { id: 'TEMPO_INTEGRAL', label: 'CLT' },
                                { id: 'CONTRATO', label: 'PJ' },
                                { id: 'ESTAGIO', label: 'Estágio' }
                            ].map(opt => (
                                <TouchableOpacity key={opt.id} style={[styles.chip, filters.tipoContrato === opt.id && { backgroundColor: colors.primary, borderColor: colors.primary }]} onPress={() => updateFilters({ ...filters, tipoContrato: opt.id })}>
                                    <Text style={[styles.chipText, filters.tipoContrato === opt.id && { color: '#FFF' }]}>{opt.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}>Salário Mínimo</Text>
                        <View style={styles.chipsContainer}>
                            {[0, 3000, 5000, 8000, 12000].map(val => (
                                <TouchableOpacity key={val} style={[styles.chip, filters.minSalario === val && { backgroundColor: colors.primary, borderColor: colors.primary }]} onPress={() => updateFilters({ ...filters, minSalario: val })}>
                                    <Text style={[styles.chipText, filters.minSalario === val && { color: '#FFF' }]}>{val === 0 ? 'Qualquer' : `R$ ${val / 1000}k+`}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={[styles.switchRow, { borderTopColor: colors.border }]}>
                            <Text style={[styles.switchLabel, { color: colors.text }]}>Apenas Super Matches ({'>'}70%)</Text>
                            <TouchableOpacity onPress={() => updateFilters({ ...filters, apenasMatch: !filters.apenasMatch })}>
                                <Ionicons name={filters.apenasMatch ? "toggle" : "toggle-outline"} size={40} color={filters.apenasMatch ? colors.primary : "#999"} />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    <TouchableOpacity style={[styles.applyButton, { backgroundColor: colors.primary }]} onPress={() => setFilterVisible(false)}>
                        <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={colors.background === '#000' ? 'light-content' : 'dark-content'} />
            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <View>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Explorar</Text>
                    <Text style={{ color: colors.text, opacity: 0.6 }}>{vagas.length} vagas disponíveis</Text>
                </View>
                <TouchableOpacity style={[styles.filterBtn, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setFilterVisible(true)}>
                    <Ionicons name="options" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>
            <View style={styles.contentContainer}>
                {loading ? <ActivityIndicator size="large" color={colors.primary} /> : (
                    vagas.length > 0 ? (
                        <>
                            {vagas.slice(0, 2).reverse().map((item, index) => renderCard(item, index === 1))}
                            <View style={styles.actionsContainer}>
                                <TouchableOpacity style={[styles.actionBtn, styles.shadow, { backgroundColor: '#FFF' }]} onPress={() => handleButtonPress('left')}><Ionicons name="close" size={30} color="#FF3B30" /></TouchableOpacity>
                                <TouchableOpacity style={[styles.actionBtn, styles.smallBtn, styles.shadow, { backgroundColor: '#FFF', marginBottom: 15 }]} onPress={() => handleButtonPress('up')}><Ionicons name="star" size={24} color="#007AFF" /></TouchableOpacity>
                                <TouchableOpacity style={[styles.actionBtn, styles.shadow, { backgroundColor: '#FFF' }]} onPress={() => handleButtonPress('right')}><Ionicons name="heart" size={30} color="#34C759" /></TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="prism" size={50} color={colors.primary} />
                            <Text style={[styles.emptyTitle, { color: colors.text }]}>Fim das sugestões</Text>
                            <Text style={{ color: colors.text, opacity: 0.6 }}>Tente ajustar seus filtros.</Text>
                            <TouchableOpacity style={[styles.refreshBtn, { backgroundColor: colors.primary }]} onPress={() => updateFilters({ ...filters, modelo: 'TODOS', apenasMatch: false })}>
                                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Resetar Filtros</Text>
                            </TouchableOpacity>
                        </View>
                    )
                )}
            </View>
            {renderFilterModal()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: Platform.OS === 'android' ? 50 : 60, paddingBottom: 10, zIndex: 10 },
    headerTitle: { fontSize: 28, fontWeight: '800' },
    filterBtn: { width: 48, height: 48, borderRadius: 16, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
    contentContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -30 },
    card: { width: width * 0.9, height: height * 0.62, borderRadius: 24, overflow: 'hidden', position: 'absolute', backgroundColor: '#FFF', elevation: 5 },
    cardImageContainer: { height: '45%', width: '100%', position: 'relative' },
    cardImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    matchBadge: { position: 'absolute', top: 16, right: 16, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, flexDirection: 'row', gap: 4 },
    matchText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)', padding: 16, justifyContent: 'flex-end' },
    tagRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
    badgeContainer: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, marginBottom: 4 },
    badgeText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
    cardContent: { flex: 1, padding: 20, justifyContent: 'space-between' },
    jobTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
    companyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
    companyName: { fontSize: 16, fontWeight: '600' },
    infoRow: { flexDirection: 'row', gap: 15, marginTop: 10 },
    infoItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    infoBtn: {
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)'
    },
    infoText: { fontSize: 14, fontWeight: '500' },
    aiBox: { padding: 15, borderRadius: 16, marginTop: 10, flex: 1 },
    desc: { fontSize: 14, lineHeight: 20, opacity: 0.8 },
    actionsContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', position: 'absolute', bottom: 40, width: '100%', gap: 25 },
    actionBtn: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
    smallBtn: { width: 50, height: 50, borderRadius: 25 },
    shadow: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, elevation: 8 },
    emptyState: { alignItems: 'center' },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, marginTop: 20 },
    refreshBtn: { paddingHorizontal: 30, paddingVertical: 12, borderRadius: 20, marginTop: 20 },
    modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '70%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold' },
    sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 10, textTransform: 'uppercase', opacity: 0.6 },
    chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
    chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#DDD' },
    chipText: { fontWeight: '600' },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 20, marginTop: 10, borderTopWidth: 1 },
    switchLabel: { fontSize: 16, fontWeight: '600' },
    applyButton: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    applyButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});