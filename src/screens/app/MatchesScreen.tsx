import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';

// --- DADOS DE EXEMPLO PARA TESTE (MOCK) ---
const MOCK_MATCHES = [
    {
        id: 'mock-1',
        matchDate: new Date().toISOString(),
        jobVaga: {
            id: 'v1',
            titulo: 'Senior Frontend Engineer',
            localizacao: 'Remoto',
            empresa: {
                id: 'e1',
                nomeFantasia: 'Google',
                fotoCapaUrl: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=1000&auto=format&fit=crop'
            }
        },
        recruiter: {
            id: 'r1',
            nome: 'Sarah Connor',
            cargo: 'Tech Recruiter'
        }
    },
    {
        id: 'mock-2',
        matchDate: new Date(Date.now() - 86400000).toISOString(), // Ontem
        jobVaga: {
            id: 'v2',
            titulo: 'Java Backend Developer',
            localizacao: 'São Paulo, SP',
            empresa: {
                id: 'e2',
                nomeFantasia: 'Nubank',
                fotoCapaUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop'
            }
        },
        recruiter: {
            id: 'r2',
            nome: 'Roberto Carlos',
            cargo: 'Head of Engineering'
        }
    },
    {
        id: 'mock-3',
        matchDate: new Date(Date.now() - 172800000).toISOString(), // Anteontem
        jobVaga: {
            id: 'v3',
            titulo: 'Product Owner',
            localizacao: 'Rio de Janeiro, RJ',
            empresa: {
                id: 'e3',
                nomeFantasia: 'Microsoft',
                fotoCapaUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop'
            }
        },
        recruiter: {
            id: 'r3',
            nome: 'Amanda Waller',
            cargo: 'Talent Acquisition'
        }
    }
];

export default function MatchesScreen({ navigation }: any) {
    const [matches, setMatches] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();

    const loadMatches = async () => {
        setLoading(true);
        try {
            // Tenta buscar da API
            const response = await api.get('/matches/my-matches');
            const data = response.data.content || [];

            if (data.length > 0) {
                setMatches(data);
            } else {
                // SE A API ESTIVER VAZIA, USA OS EXEMPLOS
                console.log("API vazia, usando exemplos de teste.");
                setMatches(MOCK_MATCHES);
            }
        } catch (error) {
            // SE DER ERRO, USA OS EXEMPLOS TAMBÉM
            console.log("Erro na API, carregando exemplos.");
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

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[styles.itemContainer, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => navigation.navigate('MatchDetail', { matchData: item })}
        >
            <Image
                source={{ uri: item.jobVaga.empresa.fotoCapaUrl || 'https://github.com/github.png' }}
                style={styles.avatar}
            />
            <View style={styles.textContainer}>
                <Text style={[styles.jobTitle, { color: colors.text }]}>
                    {item.jobVaga.titulo}
                </Text>
                <Text style={[styles.companyName, { color: colors.primary }]}>
                    {item.jobVaga.empresa.nomeFantasia}
                </Text>
                <Text style={styles.dateText}>
                    Conectado em {new Date(item.matchDate).toLocaleDateString()}
                </Text>
            </View>
            <View style={styles.iconAction}>
                <Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.primary} />
            </View>
        </TouchableOpacity>
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
    itemContainer: { flexDirection: 'row', alignItems: 'center', padding: 16, marginBottom: 12, borderRadius: 16, borderWidth: 1, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
    avatar: { width: 56, height: 56, borderRadius: 12, marginRight: 16, backgroundColor: '#f0f0f0' },
    textContainer: { flex: 1 },
    jobTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
    companyName: { fontSize: 14, fontWeight: '600', opacity: 0.8 },
    dateText: { fontSize: 12, opacity: 0.5, marginTop: 4 },
    iconAction: { padding: 8 },
    emptyContainer: { marginTop: 100, alignItems: 'center' },
    emptyText: { marginTop: 16, fontSize: 16, opacity: 0.6 }
});