import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View, Text, StyleSheet, Image, TouchableOpacity,
    Animated, Dimensions, ActivityIndicator, Modal, Platform, StatusBar, ScrollView, PanResponder, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';

const { width, height } = Dimensions.get('window');

// CONFIGURAÇÃO DO SWIPE
const SWIPE_THRESHOLD = 120; // Distância mínima para considerar o gesto
const SWIPE_OUT_DURATION = 250; // Velocidade que o card sai da tela

// --- TIPAGENS ---
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
    modeloTrabalho: string;
    salarioMin: number;
    salarioMax: number;
    empresa: Empresa;
    skills: string[];
    matchPercent?: number;
    distanciaKm?: number;
}

// --- DADOS MOCK (FALLBACK) ---
const MOCK_VAGAS: Vaga[] = [
    { id: 'mock-1', titulo: 'Dev Java Sênior', descricaoInclusiva: 'Foco em diversidade.', localizacao: 'SP', modeloTrabalho: 'HIBRIDO', salarioMin: 12000, salarioMax: 18000, skills: ['Java'], empresa: { id: 'e1', nomeFantasia: 'Nubank', fotoCapaUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop' } },
    { id: 'mock-2', titulo: 'Frontend React', descricaoInclusiva: 'Acessibilidade total.', localizacao: 'Remoto', modeloTrabalho: 'REMOTO', salarioMin: 8000, salarioMax: 14000, skills: ['React'], empresa: { id: 'e2', nomeFantasia: 'Google', fotoCapaUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop' } },
    { id: 'mock-3', titulo: 'Product Owner', descricaoInclusiva: 'Liderança humanizada.', localizacao: 'RJ', modeloTrabalho: 'PRESENCIAL', salarioMin: 10000, salarioMax: 15000, skills: ['Scrum'], empresa: { id: 'e3', nomeFantasia: 'Microsoft', fotoCapaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop' } },
];

const MY_SKILLS = ['Java', 'React', 'Spring', 'Comunicação', 'Inglês'];

export default function HomeScreen() {
    const { colors } = useTheme();

    const [vagas, setVagas] = useState<Vaga[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterVisible, setFilterVisible] = useState(false);
    const [filters, setFilters] = useState({ modelo: 'TODOS', ordenarPor: 'RELEVANCIA', apenasMatch: false });

    // Animação: Posição do Card (X, Y)
    const position = useRef(new Animated.ValueXY()).current;

    // --- GESTÃO DE ESTADO E CARREGAMENTO ---

    useEffect(() => {
        loadFiltersAndFeed();
    }, []);

    const loadFiltersAndFeed = async () => {
        try {
            const savedFilters = await AsyncStorage.getItem('@includia_filters');
            if (savedFilters) setFilters(JSON.parse(savedFilters));
            loadFeed(savedFilters ? JSON.parse(savedFilters) : filters);
        } catch (e) { loadFeed(filters); }
    };

    const updateFilters = async (newFilters: any) => {
        setFilters(newFilters);
        AsyncStorage.setItem('@includia_filters', JSON.stringify(newFilters));
        loadFeed(newFilters);
    };

    const loadFeed = useCallback(async (currentFilters = filters) => {
        setLoading(true);
        try {
            // Tenta API, falha para Mock
            let allVagas: Vaga[] = [];
            try {
                const res = await api.get('/vagas');
                allVagas = res.data.content?.length ? res.data.content : MOCK_VAGAS;
            } catch { allVagas = MOCK_VAGAS; }

            // Processa dados
            allVagas = allVagas.map(v => ({
                ...v,
                distanciaKm: v.distanciaKm || Math.floor(Math.random() * 15) + 1,
                matchPercent: calculateMatch(v.skills)
            }));

            // Aplica Filtros
            if (currentFilters.modelo !== 'TODOS') allVagas = allVagas.filter(v => v.modeloTrabalho === currentFilters.modelo);
            if (currentFilters.apenasMatch) allVagas = allVagas.filter(v => (v.matchPercent || 0) > 70);

            setVagas(allVagas);
        } finally { setLoading(false); }
    }, []);

    const calculateMatch = (skills: string[] = []) => {
        if (!skills.length) return 60;
        const common = skills.filter(s => MY_SKILLS.some(my => my.toLowerCase().includes(s.toLowerCase())));
        return 40 + Math.round((common.length / skills.length) * 60);
    };

    // --- LÓGICA CORE DO TINDER (PAN RESPONDER) ---

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,

            // Quando o usuário arrasta o dedo
            onPanResponderMove: (_, gesture) => {
                position.setValue({ x: gesture.dx, y: gesture.dy });
            },

            // Quando o usuário solta o dedo
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                    forceSwipe('right'); // LIKE
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    forceSwipe('left'); // DISLIKE
                } else if (gesture.dy < -SWIPE_THRESHOLD) { // Verifica se arrastou BEM pra cima
                    forceSwipe('up'); // SUPER LIKE
                } else {
                    resetPosition(); // Volta pro centro se não arrastou o suficiente
                }
            }
        })
    ).current;

    const forceSwipe = (direction: 'right' | 'left' | 'up') => {
        let xVal = 0;
        let yVal = 0;

        if (direction === 'right') xVal = width + 100;
        if (direction === 'left') xVal = -width - 100;
        if (direction === 'up') yVal = -height - 100; // Voa pra cima

        Animated.timing(position, {
            toValue: { x: xVal, y: yVal },
            duration: SWIPE_OUT_DURATION,
            useNativeDriver: false
        }).start(() => onSwipeComplete(direction));
    };

    const onSwipeComplete = (direction: string) => {
        const currentVaga = vagas[0];
        const action = direction === 'right' ? 'LIKE' : direction === 'up' ? 'SUPERLIKE' : 'DISLIKE';

        // 1. Executa a ação
        handleInteraction(action, currentVaga);

        // 2. Prepara o próximo card
        // Importante: Resetamos a posição ANTES de remover o item da lista para o próximo item nascer no centro
        position.setValue({ x: 0, y: 0 });
        setVagas(prev => prev.slice(1));
    };

    const resetPosition = () => {
        Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false
        }).start();
    };

    const handleInteraction = async (action: string, vaga: Vaga) => {
        console.log(`Ação: ${action} na vaga ${vaga.empresa.nomeFantasia}`);

        if (action === 'SUPERLIKE') Alert.alert('Super Like! ⭐', `Você enviou um destaque para ${vaga.empresa.nomeFantasia}`);

        try {
            await api.post('/swipe/candidate', { targetId: vaga.id, isLiked: action !== 'DISLIKE' });
        } catch (e) { /* API fail safe */ }
    };

    // Se clicar nos botões em vez de arrastar
    const handleButtonPress = (direction: 'right' | 'left' | 'up') => {
        forceSwipe(direction);
    };

    // --- ANIMAÇÕES VISUAIS ---

    const rotate = position.x.interpolate({
        inputRange: [-width / 2, 0, width / 2],
        outputRange: ['-10deg', '0deg', '10deg'],
        extrapolate: 'clamp'
    });

    const rotateAndTranslate = { transform: [{ rotate }, ...position.getTranslateTransform()] };

    const likeOpacity = position.x.interpolate({ inputRange: [0, width / 4], outputRange: [0, 1], extrapolate: 'clamp' });
    const nopeOpacity = position.x.interpolate({ inputRange: [-width / 4, 0], outputRange: [1, 0], extrapolate: 'clamp' });
    const superOpacity = position.y.interpolate({ inputRange: [-height / 4, 0], outputRange: [1, 0], extrapolate: 'clamp' });

    // --- RENDERIZAÇÃO ---

    const renderCards = () => {
        if (vagas.length === 0) {
            return (
                <View style={styles.emptyState}>
                    <View style={[styles.emptyIconBg, { backgroundColor: colors.card }]}>
                        <Ionicons name="prism" size={50} color={colors.primary} />
                    </View>
                    <Text style={[styles.emptyTitle, { color: colors.text }]}>Fim das sugestões</Text>
                    <Text style={{ color: colors.text, opacity: 0.6 }}>Tente ajustar seus filtros.</Text>
                    <TouchableOpacity style={[styles.refreshBtn, { backgroundColor: colors.primary }]} onPress={() => updateFilters({ ...filters, modelo: 'TODOS' })}>
                        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Limpar Filtros</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return vagas.slice(0, 2).reverse().map((item, index) => {
            const isTop = index === 1; // O último item do array (index 1) é o que fica no topo visualmente
            const handlers = isTop ? panResponder.panHandlers : {};
            const cardStyle = isTop ? rotateAndTranslate : { transform: [{ scale: 0.95 }] };

            return (
                <Animated.View
                    {...handlers}
                    key={item.id}
                    style={[styles.card, { backgroundColor: colors.card }, cardStyle, !isTop && { top: 10, zIndex: -1 }]}
                >
                    {isTop && (
                        <>
                            <Animated.View style={[styles.label, { left: 40, top: 50, borderColor: '#34C759', transform: [{ rotate: '-30deg' }], opacity: likeOpacity }]}>
                                <Text style={[styles.labelText, { color: '#34C759' }]}>LIKE</Text>
                            </Animated.View>
                            <Animated.View style={[styles.label, { right: 40, top: 50, borderColor: '#FF3B30', transform: [{ rotate: '30deg' }], opacity: nopeOpacity }]}>
                                <Text style={[styles.labelText, { color: '#FF3B30' }]}>NOPE</Text>
                            </Animated.View>
                            <Animated.View style={[styles.label, { alignSelf: 'center', top: '40%', borderColor: '#007AFF', opacity: superOpacity }]}>
                                <Text style={[styles.labelText, { color: '#007AFF' }]}>SUPER</Text>
                            </Animated.View>
                        </>
                    )}

                    <View style={styles.cardImageContainer}>
                        <Image source={{ uri: item.empresa.fotoCapaUrl || 'https://source.unsplash.com/random/800x600/?office' }} style={styles.cardImage} />
                        <View style={[styles.matchBadge, { backgroundColor: (item.matchPercent || 0) > 80 ? '#34C759' : '#8A2BE2' }]}>
                            <Ionicons name="prism" size={14} color="#FFF" />
                            <Text style={styles.matchText}>{item.matchPercent}% Match</Text>
                        </View>
                        <View style={styles.overlay}>
                            <View style={styles.badgeContainer}><Text style={styles.badgeText}>{item.modeloTrabalho}</Text></View>
                        </View>
                    </View>

                    <View style={styles.cardContent}>
                        <View>
                            <Text style={[styles.jobTitle, { color: colors.text }]} numberOfLines={2}>{item.titulo}</Text>
                            <Text style={[styles.companyName, { color: colors.primary }]}>
                                <Ionicons name="business" size={14} /> {item.empresa.nomeFantasia}
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <View style={styles.infoItem}><Ionicons name="location-outline" size={16} color="#999" /><Text style={[styles.infoText, { color: colors.text }]}>{item.localizacao}</Text></View>
                            <View style={styles.infoItem}><Ionicons name="wallet-outline" size={16} color="#999" /><Text style={[styles.infoText, { color: colors.text }]}>R$ {item.salarioMin / 1000}k - {item.salarioMax / 1000}k</Text></View>
                        </View>
                        <View style={[styles.aiBox, { backgroundColor: colors.background }]}>
                            <Text style={{ fontSize: 12, color: '#8A2BE2', fontWeight: 'bold', marginBottom: 4 }}>✨ Análise IA</Text>
                            <Text style={[styles.desc, { color: colors.text }]} numberOfLines={3}>{item.descricaoInclusiva}</Text>
                        </View>
                    </View>
                </Animated.View>
            );
        });
    };

    const renderFilterModal = () => (
        <Modal animationType="fade" transparent={true} visible={filterVisible} onRequestClose={() => setFilterVisible(false)}>
            <View style={styles.modalContainer}>
                <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>Filtros</Text>
                        <TouchableOpacity onPress={() => setFilterVisible(false)}><Ionicons name="close" size={24} color={colors.text} /></TouchableOpacity>
                    </View>
                    <ScrollView>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Modelo</Text>
                        <View style={styles.chipsContainer}>
                            {['TODOS', 'REMOTO', 'HIBRIDO', 'PRESENCIAL'].map(t => (
                                <TouchableOpacity key={t} style={[styles.chip, filters.modelo === t && { backgroundColor: colors.primary }]} onPress={() => updateFilters({ ...filters, modelo: t })}>
                                    <Text style={[styles.chipText, filters.modelo === t && { color: '#FFF' }]}>{t}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                    <TouchableOpacity style={[styles.applyButton, { backgroundColor: colors.primary }]} onPress={() => setFilterVisible(false)}>
                        <Text style={styles.applyButtonText}>Aplicar</Text>
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
                    <Text style={{ color: colors.text, opacity: 0.6 }}>{vagas.length} vagas</Text>
                </View>
                <TouchableOpacity style={[styles.filterBtn, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => setFilterVisible(true)}>
                    <Ionicons name="options" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.contentContainer}>
                {loading ? <ActivityIndicator size="large" color={colors.primary} /> : renderCards()}
            </View>

            {/* Botões de Ação (Footer) */}
            {vagas.length > 0 && (
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={[styles.actionBtn, styles.shadow, { backgroundColor: '#FFF' }]} onPress={() => handleButtonPress('left')}>
                        <Ionicons name="close" size={30} color="#FF3B30" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.smallBtn, styles.shadow, { backgroundColor: '#FFF', marginBottom: 15 }]} onPress={() => handleButtonPress('up')}>
                        <Ionicons name="star" size={24} color="#007AFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.shadow, { backgroundColor: '#FFF' }]} onPress={() => handleButtonPress('right')}>
                        <Ionicons name="heart" size={30} color="#34C759" />
                    </TouchableOpacity>
                </View>
            )}

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
    cardContent: { flex: 1, padding: 20, justifyContent: 'space-between' },

    matchBadge: { position: 'absolute', top: 16, right: 16, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, flexDirection: 'row', gap: 4 },
    matchText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)', padding: 16, justifyContent: 'flex-end' },
    badgeContainer: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start' },
    badgeText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },

    jobTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
    companyName: { fontSize: 16, fontWeight: '600' },
    infoRow: { flexDirection: 'row', gap: 15, marginTop: 10 },
    infoItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    infoText: { fontSize: 14, fontWeight: '500' },
    aiBox: { padding: 15, borderRadius: 16, marginTop: 10, flex: 1 },
    desc: { fontSize: 14, lineHeight: 20, opacity: 0.8 },

    // Labels de Ação
    label: { position: 'absolute', zIndex: 99, borderWidth: 3, paddingHorizontal: 10, borderRadius: 10 },
    labelText: { fontSize: 32, fontWeight: '800', letterSpacing: 2 },

    actionsContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', position: 'absolute', bottom: 40, width: '100%', gap: 25 },
    actionBtn: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center' },
    smallBtn: { width: 50, height: 50, borderRadius: 25 },
    shadow: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, elevation: 8 },

    emptyState: { alignItems: 'center' },
    emptyIconBg: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    refreshBtn: { paddingHorizontal: 30, paddingVertical: 12, borderRadius: 20, marginTop: 20 },

    // Modal
    modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '60%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold' },
    sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 10, textTransform: 'uppercase', opacity: 0.6 },
    chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
    chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#DDD' },
    chipText: { fontWeight: '600' },
    applyButton: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    applyButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' }
});