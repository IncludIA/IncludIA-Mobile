import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { ChatStackParamList } from '../../navigation/AppTabNavigator';

type Props = NativeStackScreenProps<any, any>;

interface MatchItem {
    id: string;
    vagaId: string;
    candidateId: string;
    matchScore: number;
    status: string;
}

export default function MatchesScreen({ navigation }: Props) {
    const [matches, setMatches] = useState<MatchItem[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const { colors } = useTheme();

    const loadMatches = async () => {
        try {
            const response = await api.get('/matches/my-matches');
            setMatches(response.data.content);
        } catch (error) {
            console.error('Erro ao carregar matches', error);
        } finally {
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadMatches();
        }, [])
    );

    const renderItem = ({ item }: { item: MatchItem }) => (
        <TouchableOpacity
            style={[styles.itemContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
            onPress={() => {
                // Navegando para a stack de Chat
                navigation.navigate('ChatStack', {
                    screen: 'ChatMessage',
                    params: { matchId: item.id }
                });
            }}
        >
            <View style={[styles.avatar, { backgroundColor: colors.border }]}>
                <Ionicons name="briefcase" size={24} color={colors.text} />
            </View>
            <View style={styles.textContainer}>
                <Text style={[styles.itemName, { color: colors.text }]}>
                    Nova Oportunidade
                </Text>
                <Text style={[styles.itemStatus, { color: colors.primary }]}>
                    Compatibilidade: {item.matchScore}%
                </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.border} />
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Seus Matches</Text>
            </View>
            <FlatList
                data={matches}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                refreshing={refreshing}
                onRefresh={() => { setRefreshing(true); loadMatches(); }}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={[styles.emptyText, { color: colors.text }]}>
                            Você ainda não tem matches. Continue explorando!
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
    header: {
        padding: 20,
        paddingTop: 60,
    },
    headerTitle: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    listContent: {
        paddingHorizontal: 20,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    itemName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    itemStatus: {
        fontSize: 14,
    },
    emptyContainer: {
        marginTop: 50,
        alignItems: 'center',
    },
    emptyText: {
        textAlign: 'center',
        opacity: 0.6,
        fontSize: 16,
    },
});