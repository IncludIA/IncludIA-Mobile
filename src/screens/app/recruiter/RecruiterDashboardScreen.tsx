import React, { useState, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView,
    ActivityIndicator, RefreshControl, StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import api from '../../../services/api';

const MOCK_JOBS = [
    { id: '1', titulo: 'Desenvolvedor Java Senior', status: 'ATIVA', candidatos: 15, matches: 3, views: 142 },
    { id: '2', titulo: 'Product Designer', status: 'PAUSADA', candidatos: 8, matches: 0, views: 56 },
    { id: '3', titulo: 'QA Automation', status: 'ATIVA', candidatos: 22, matches: 7, views: 301 },
];

export default function RecruiterDashboardScreen({ navigation }: any) {
    const { colors } = useTheme();
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadJobs = async () => {
        setLoading(true);
        try {
            const response = await api.get('/vagas/me');
            if (response.data.content && response.data.content.length > 0) {
                setJobs(response.data.content);
            } else {
                setJobs(MOCK_JOBS);
            }
        } catch (error) {
            setJobs(MOCK_JOBS);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => { loadJobs(); }, [])
    );

    const renderJobItem = ({ item }: any) => (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>

            <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                    <Text style={[styles.jobTitle, { color: colors.text }]} numberOfLines={1}>{item.titulo}</Text>
                    <Text style={styles.postedDate}>Publicada recentemente</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: item.status === 'ATIVA' ? 'rgba(52, 199, 89, 0.1)' : 'rgba(255, 149, 0, 0.1)' }]}>
                    <Text style={[styles.badgeText, { color: item.status === 'ATIVA' ? '#34C759' : '#FF9500' }]}>
                        {item.status || 'ATIVA'}
                    </Text>
                </View>
            </View>

            <View style={[styles.statsContainer, { backgroundColor: colors.background }]}>
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.text }]}>{item.candidatos || 0}</Text>
                    <Text style={styles.statLabel}>Aplicaram</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.primary }]}>{item.matches || 0}</Text>
                    <Text style={styles.statLabel}>Matches</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statItem}>
                    <Text style={[styles.statValue, { color: colors.text }]}>{item.views || 0}</Text>
                    <Text style={styles.statLabel}>Visualizações</Text>
                </View>
            </View>

            <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('CandidateFeed', { vagaId: item.id, jobTitle: item.titulo })}
            >
                <Text style={styles.btnText}>Avaliar Candidatos</Text>
                <Ionicons name="arrow-forward" size={16} color="#FFF" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={colors.background === '#000' ? 'light-content' : 'dark-content'} />

            <View style={styles.header}>
                <View>
                    <Text style={[styles.greeting, { color: colors.text }]}>Olá, Recrutador</Text>
                    <Text style={[styles.title, { color: colors.text }]}>Gestão de Vagas</Text>
                </View>
                <TouchableOpacity
                    style={[styles.addBtn, { backgroundColor: colors.primary }]}
                    onPress={() => navigation.navigate('PostJob')}
                >
                    <Ionicons name="add" size={28} color="#FFF" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={jobs}
                    keyExtractor={(item: any) => item.id}
                    renderItem={renderJobItem}
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={loadJobs} />}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <View style={[styles.iconBg, { backgroundColor: colors.card }]}>
                                <Ionicons name="briefcase-outline" size={48} color={colors.primary} />
                            </View>
                            <Text style={[styles.emptyTitle, { color: colors.text }]}>Nenhuma vaga ativa</Text>
                            <Text style={styles.emptyDesc}>Crie sua primeira vaga para começar a encontrar talentos.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 10 },
    greeting: { fontSize: 14, opacity: 0.6, marginBottom: 4 },
    title: { fontSize: 28, fontWeight: '800' },
    addBtn: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 4 } },

    card: { borderRadius: 20, borderWidth: 1, padding: 16, marginBottom: 16 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    jobTitle: { fontSize: 18, fontWeight: 'bold' },
    postedDate: { fontSize: 12, opacity: 0.5, marginTop: 4 },

    badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
    badgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },

    statsContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderRadius: 12, marginBottom: 16 },
    statItem: { alignItems: 'center', flex: 1 },
    statValue: { fontSize: 18, fontWeight: 'bold', marginBottom: 2 },
    statLabel: { fontSize: 11, opacity: 0.6 },
    divider: { width: 1, height: '80%', backgroundColor: '#CCC', opacity: 0.3 },

    actionBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 14, borderRadius: 14, gap: 8 },
    btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

    emptyState: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
    iconBg: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    emptyTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
    emptyDesc: { textAlign: 'center', opacity: 0.6, lineHeight: 20 }
});