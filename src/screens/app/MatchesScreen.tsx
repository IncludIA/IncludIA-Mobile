import React, { useState, useCallback } from 'react';
import {
    View, Text, FlatList, StyleSheet, TouchableOpacity, Image,
    ActivityIndicator, RefreshControl, Alert
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';


interface MatchItem {
    id: string;
    matchDate: string;
    jobVaga: {
        id: string;
        titulo: string;
        localizacao: string;
        empresa: {
            id: string;
            nomeFantasia: string;
            fotoCapaUrl?: string;
        };
    };
    recruiter: {
        id: string;
        nome: string;
        cargo?: string;
    };
}

const MOCK_MATCHES: MatchItem[] = [
    {
        id: 'mock-1',
        matchDate: new Date().toISOString(),
        jobVaga: {
            id: 'v1',
            titulo: 'Senior Frontend Engineer',
            localizacao: 'Remoto',
            empresa: { id: 'e1', nomeFantasia: 'Google', fotoCapaUrl: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=1000&auto=format&fit=crop' }
        },
        recruiter: { id: 'r1', nome: 'Sarah Connor', cargo: 'Tech Recruiter' }
    },
    {
        id: 'mock-2',
        matchDate: new Date().toISOString(),
        jobVaga: {
            id: 'v2',
            titulo: 'Java Backend Developer',
            localizacao: 'São Paulo, SP',
            empresa: { id: 'e2', nomeFantasia: 'Nubank', fotoCapaUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop' }
        },
        recruiter: { id: 'r2', nome: 'Roberto Carlos', cargo: 'Head of Engineering' }
    }
];

export default function MatchesScreen({ navigation }: any) {
    const [matches, setMatches] = useState<MatchItem[]>([]);
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();

    const loadMatches = async () => {
        setLoading(true);
        try {
            const response = await api.get('/matches/my-matches');
            const data = response.data.content || response.data || [];

            if (data.length > 0) {
                setMatches(data);
            } else {
                console.log("API retornou lista vazia. Usando Mocks.");
                setMatches(MOCK_MATCHES);
            }
        } catch (error) {
            console.log("Erro na API de Matches. Usando Fallback.");
            setMatches(MOCK_MATCHES);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadMatches();
        }, [])
    );

    const handleOpenChat = (item: MatchItem) => {
        navigation.navigate('ChatStack', {
            screen: 'ChatMessage',
            params: {
                matchId: item.id,
                name: item.recruiter.nome || 'Recrutador',
                photo: item.jobVaga.empresa.fotoCapaUrl,
                recruiterId: item.recruiter.id
            }
        });
    };

    const handleOpenDetails = (item: MatchItem) => {
        navigation.navigate('MatchDetail', { matchData: item });
    };

    const renderItem = ({ item }: { item: MatchItem }) => (
        <View style={[styles.cardWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>

            <TouchableOpacity
                style={styles.mainClickArea}
                onPress={() => handleOpenDetails(item)}
                activeOpacity={0.7}
            >
                <Image
                    source={{ uri: item.jobVaga.empresa.fotoCapaUrl || 'https://github.com/github.png' }}
                    style={styles.avatar}
                />
                <View style={styles.textContainer}>
                    <Text style={[styles.jobTitle, { color: colors.text }]} numberOfLines={1}>
                        {item.jobVaga.titulo}
                    </Text>
                    <Text style={[styles.companyName, { color: colors.primary }]}>
                        {item.jobVaga.empresa.nomeFantasia}
                    </Text>
                    <Text style={styles.dateText}>
                        Match em {new Date(item.matchDate).toLocaleDateString()}
                    </Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.chatIconBtn, { backgroundColor: 'rgba(0,122,255,0.1)' }]}
                onPress={() => handleOpenChat(item)}
            >
                <Ionicons name="chatbubble-ellipses" size={24} color="#007AFF" />
            </TouchableOpacity>

        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Matches</Text>
                <Text style={[styles.headerSubtitle, { color: colors.text }]}>Suas conexões ({matches.length})</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={matches}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="heart-dislike-outline" size={60} color={colors.border} />
                            <Text style={[styles.emptyText, { color: colors.text }]}>
                                Ainda sem matches. Continue explorando!
                            </Text>
                        </View>
                    }
                    refreshControl={
                        <RefreshControl refreshing={loading} onRefresh={loadMatches} />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 20 },
    headerTitle: { fontSize: 32, fontWeight: '800' },
    headerSubtitle: { fontSize: 16, opacity: 0.6 },

    listContent: { paddingHorizontal: 20, paddingBottom: 20 },

    cardWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        marginBottom: 12,
        borderRadius: 16,
        borderWidth: 1,
        // Sombra leve
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2
    },

    mainClickArea: { flex: 1, flexDirection: 'row', alignItems: 'center' },

    avatar: { width: 56, height: 56, borderRadius: 12, marginRight: 14, backgroundColor: '#f0f0f0' },
    textContainer: { flex: 1, paddingRight: 8 },

    jobTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
    companyName: { fontSize: 14, fontWeight: '600', opacity: 0.9 },
    dateText: { fontSize: 12, opacity: 0.5, marginTop: 4 },

    // Botão de Chat
    chatIconBtn: {
        padding: 12,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4
    },

    emptyContainer: { marginTop: 100, alignItems: 'center' },
    emptyText: { marginTop: 16, fontSize: 16, opacity: 0.6 }
});