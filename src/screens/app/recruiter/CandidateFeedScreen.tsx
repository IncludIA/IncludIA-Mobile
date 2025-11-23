import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Dimensions, ActivityIndicator, Alert, PanResponder, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import api from '../../../services/api';

const { width, height } = Dimensions.get('window');

const MOCK_CANDIDATES = [
    { id: '1', nome: 'Ana Clara', cargo: 'Desenvolvedora Java', skills: ['Java', 'Spring', 'AWS'], match: 95, fotoPerfilUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop' },
    { id: '2', nome: 'Carlos Lima', cargo: 'Fullstack Engineer', skills: ['React', 'Node', 'Docker'], match: 88, fotoPerfilUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop' },
    { id: '3', nome: 'Beatriz Souza', cargo: 'Tech Lead', skills: ['Arquitetura', 'Microsserviços'], match: 75, fotoPerfilUrl: null }
];

export default function CandidateFeedScreen({ route, navigation }: any) {
    const { vagaId, jobTitle } = route.params || {};
    const { colors } = useTheme();
    const [candidates, setCandidates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const position = useRef(new Animated.ValueXY()).current;

    useEffect(() => {
        loadCandidates();
    }, []);

    const loadCandidates = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/vagas/${vagaId}/candidates-feed`);
            setCandidates(response.data && response.data.length > 0 ? response.data : MOCK_CANDIDATES);
        } catch (error) {
            setCandidates(MOCK_CANDIDATES);
        } finally {
            setLoading(false);
        }
    };

    const handleSwipe = async (liked: boolean) => {
        if (candidates.length === 0) return;
        const current = candidates[0];

        Animated.timing(position, {
            toValue: { x: liked ? 500 : -500, y: 0 },
            duration: 250,
            useNativeDriver: false
        }).start(() => {
            setCandidates(prev => prev.slice(1));
            position.setValue({ x: 0, y: 0 });
        });

        if (liked) Alert.alert("Interesse Registrado!", `Você curtiu ${current.nome}. Se houver match, avisaremos.`);

        try {
            await api.post('/swipe/recruiter', { vagaId, candidateId: current.id, isLiked: liked });
        } catch (e) { }
    };

    const renderCard = (item: any) => {
        const rotate = position.x.interpolate({ inputRange: [-300, 0, 300], outputRange: ['-10deg', '0deg', '10deg'] });

        return (
            <Animated.View style={[styles.card, { backgroundColor: colors.card, transform: [{ rotate }, ...position.getTranslateTransform()] }]}>
                <Image source={{ uri: item.fotoPerfilUrl || 'https://github.com/github.png' }} style={styles.image} />

                <View style={[styles.matchBadge, { backgroundColor: item.match > 90 ? '#34C759' : '#8A2BE2' }]}>
                    <Ionicons name="analytics" size={14} color="#FFF" />
                    <Text style={styles.matchText}>{item.match}% Fit</Text>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={[styles.name, { color: colors.text }]}>{item.nome}</Text>
                    <Text style={[styles.role, { color: colors.text }]}>{item.cargo}</Text>

                    <View style={styles.skillsRow}>
                        {item.skills.slice(0, 3).map((s: string, i: number) => (
                            <View key={i} style={[styles.skillChip, { borderColor: colors.border }]}>
                                <Text style={[styles.skillText, { color: colors.text }]}>{s}</Text>
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={styles.viewProfileBtn}
                        onPress={() => navigation.navigate('ViewProfile', { candidateData: item })}
                    >
                        <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Ver Perfil Completo</Text>
                        <Ionicons name="chevron-up" size={20} color={colors.primary} />
                    </TouchableOpacity>
                </View>
            </Animated.View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="close" size={28} color={colors.text} /></TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Candidatos</Text>
                    <Text style={{ color: colors.text, opacity: 0.5, fontSize: 12 }}>{jobTitle || 'Sua Vaga'}</Text>
                </View>
                <View style={{ width: 28 }} />
            </View>

            <View style={styles.content}>
                {loading ? <ActivityIndicator size="large" color={colors.primary} /> : (
                    candidates.length > 0 ? (
                        <>
                            {renderCard(candidates[0])}
                            <View style={styles.actions}>
                                <TouchableOpacity onPress={() => handleSwipe(false)} style={[styles.btn, { backgroundColor: '#FFF', shadowColor: '#000' }]}>
                                    <Ionicons name="close" size={30} color="#FF3B30" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleSwipe(true)} style={[styles.btn, { backgroundColor: '#34C759', shadowColor: '#000' }]}>
                                    <Ionicons name="checkmark" size={30} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </>
                    ) : (
                        <View style={{ alignItems: 'center' }}>
                            <Ionicons name="file-tray-outline" size={60} color={colors.border} />
                            <Text style={{ color: colors.text, marginTop: 20, textAlign: 'center' }}>Sem novos candidatos no momento.</Text>
                        </View>
                    )
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 50, alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { width: width * 0.9, height: height * 0.65, borderRadius: 24, overflow: 'hidden', elevation: 5, position: 'absolute' },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    matchBadge: { position: 'absolute', top: 20, right: 20, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, flexDirection: 'row', gap: 4 },
    matchText: { color: '#FFF', fontWeight: 'bold' },
    infoContainer: { position: 'absolute', bottom: 0, width: '100%', padding: 24, backgroundColor: 'rgba(0,0,0,0.8)', paddingBottom: 40 },
    name: { fontSize: 28, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
    role: { fontSize: 18, color: '#DDD', marginBottom: 16 },
    skillsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
    skillChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.2)' },
    skillText: { color: '#FFF', fontSize: 12 },
    viewProfileBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4, padding: 10 },
    actions: { flexDirection: 'row', gap: 60, position: 'absolute', bottom: 40 },
    btn: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', elevation: 5, shadowOpacity: 0.2, shadowOffset: { width: 0, height: 4 } }
});