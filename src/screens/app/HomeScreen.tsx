import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
    RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface Empresa {
    id: string;
    nomeFantasia: string;
    fotoCapaUrl: string;
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
}

export default function HomeScreen() {
    const [vagas, setVagas] = useState<Vaga[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const { colors } = useTheme();
    const { userRole } = useAuth();

    const loadFeed = useCallback(async () => {
        try {
            if (userRole === 'ROLE_CANDIDATE') {
                const response = await api.get('/vagas');
                setVagas(response.data.content);
            } else {
                // Implementação futura para recrutador
                setVagas([]);
            }
        } catch (error) {
            console.error('Erro ao carregar feed', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userRole]);

    useEffect(() => {
        loadFeed();
    }, [loadFeed]);

    const handleSwipe = async (targetId: string, isLiked: boolean) => {
        try {
            await api.post('/swipe/candidate', {
                targetId,
                isLiked
            });

            setVagas((currentVagas) => currentVagas.filter(v => v.id !== targetId));

            if (isLiked) {
                // Feedback tátil ou visual opcional aqui
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível registrar sua ação.');
        }
    };

    const renderCard = ({ item }: { item: Vaga }) => (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.cardHeader}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{item.titulo}</Text>
                <Text style={[styles.cardSubtitle, { color: colors.primary }]}>{item.empresa.nomeFantasia}</Text>
            </View>

            <View style={styles.cardBody}>
                <View style={styles.tagContainer}>
                    <Text style={[styles.tag, { backgroundColor: colors.border, color: colors.text }]}>{item.modeloTrabalho}</Text>
                    <Text style={[styles.tag, { backgroundColor: colors.border, color: colors.text }]}>{item.localizacao}</Text>
                </View>

                <Text style={[styles.description, { color: colors.text }]} numberOfLines={6}>
                    {item.descricaoInclusiva}
                </Text>

                <Text style={[styles.salary, { color: colors.text }]}>
                    R$ {item.salarioMin.toFixed(2)} - R$ {item.salarioMax.toFixed(2)}
                </Text>
            </View>

            <View style={styles.actionContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.dislikeButton]}
                    onPress={() => handleSwipe(item.id, false)}
                >
                    <Ionicons name="close" size={30} color="#FF3B30" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionButton, styles.likeButton]}
                    onPress={() => handleSwipe(item.id, true)}
                >
                    <Ionicons name="heart" size={30} color="#34C759" />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={vagas}
                keyExtractor={(item) => item.id}
                renderItem={renderCard}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadFeed(); }} />
                }
                ListEmptyComponent={
                    <View style={styles.center}>
                        <Ionicons name="layers-outline" size={64} color={colors.border} />
                        <Text style={[styles.emptyText, { color: colors.text }]}>
                            Não há novas vagas no momento.
                        </Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    listContent: {
        padding: 16,
        paddingBottom: 80,
    },
    card: {
        borderRadius: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
        overflow: 'hidden',
    },
    cardHeader: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    cardBody: {
        padding: 20,
    },
    tagContainer: {
        flexDirection: 'row',
        marginBottom: 16,
        flexWrap: 'wrap',
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        fontSize: 12,
        marginRight: 8,
        marginBottom: 8,
        overflow: 'hidden',
        fontWeight: '600',
    },
    description: {
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 16,
        opacity: 0.8,
    },
    salary: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingBottom: 20,
        paddingTop: 10,
    },
    actionButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    dislikeButton: {
        borderWidth: 1,
        borderColor: '#FFE5E5',
    },
    likeButton: {
        borderWidth: 1,
        borderColor: '#E5FFE9',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center',
        opacity: 0.6,
    },
});