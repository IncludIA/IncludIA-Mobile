import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, TouchableOpacity,
    TextInput, SafeAreaView, StatusBar, RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import api from '../../../services/api';

// --- INTERFACES ---
interface ChatPreview {
    id: string;
    recipientId: string;
    recipientName: string;
    isOnline: boolean;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount: number;
}

// --- MOCKS ---
const MOCK_CHATS: ChatPreview[] = [
    {
        id: 'c1',
        recipientId: 'r1',
        recipientName: 'Sarah Connor',
        isOnline: true,
        lastMessage: 'Adoramos seu perfil! Podemos agendar uma entrevista?',
        lastMessageTime: new Date().toISOString(),
        unreadCount: 2 // Não lido
    },
    {
        id: 'c4',
        recipientId: 'r4',
        recipientName: 'Tech Recruiter IBM',
        isOnline: false,
        lastMessage: 'Seu teste técnico foi excelente! Parabéns.',
        lastMessageTime: new Date(Date.now() - 172800000).toISOString(),
        unreadCount: 5 // Não lido
    },
    {
        id: 'c2',
        recipientId: 'r2',
        recipientName: 'Roberto Carlos',
        isOnline: true,
        lastMessage: 'Obrigado pelo interesse na vaga de Java.',
        lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
        unreadCount: 0 // Lido
    },
    {
        id: 'c3',
        recipientId: 'r3',
        recipientName: 'Amanda Waller',
        isOnline: false,
        lastMessage: 'Vou verificar com o time técnico e te retorno.',
        lastMessageTime: new Date(Date.now() - 86400000).toISOString(),
        unreadCount: 0 // Lido
    }
];

export default function ChatScreen({ navigation }: any) {
    const { colors } = useTheme();
    const [chats, setChats] = useState<ChatPreview[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const getInitials = (name: string) => {
        const names = name.trim().split(' ');
        if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    const formatTime = (isoString: string) => {
        const date = new Date(isoString);
        const now = new Date();
        const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth();

        if (isToday) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return date.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    };

    const loadChats = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/chats');
            let data = response.data && response.data.length > 0 ? response.data : MOCK_CHATS;

            // Ordena: Mais recentes primeiro
            data.sort((a: ChatPreview, b: ChatPreview) =>
                new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
            );

            setChats(data);
        } catch (error) {
            // Fallback ordenado
            const sortedMock = [...MOCK_CHATS].sort((a, b) =>
                new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
            );
            setChats(sortedMock);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadChats();
    }, [loadChats]);

    const handleOpenChat = (chat: ChatPreview) => {
        const updatedChats = chats.map(c =>
            c.id === chat.id ? { ...c, unreadCount: 0 } : c
        );
        setChats(updatedChats);

        navigation.navigate('ChatMessage', {
            matchId: chat.id,
            name: chat.recipientName
        });
    };

    const filteredChats = chats.filter(c =>
        c.recipientName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const onlineUsers = chats.filter(c => c.isOnline);


    const renderOnlineAvatar = ({ item }: { item: ChatPreview }) => (
        <TouchableOpacity style={styles.onlineItem} onPress={() => handleOpenChat(item)}>
            <View style={[styles.avatarCircleBig, { backgroundColor: colors.primary }]}>
                <Text style={styles.avatarTextBig}>{getInitials(item.recipientName)}</Text>
                <View style={[styles.onlineBadgeBig, { borderColor: colors.background }]} />
            </View>
            <Text style={[styles.onlineName, { color: colors.text }]} numberOfLines={1}>
                {item.recipientName.split(' ')[0]}
            </Text>
        </TouchableOpacity>
    );

    const renderChatItem = ({ item }: { item: ChatPreview }) => {
        const isUnread = item.unreadCount > 0;
        const textColor = isUnread ? colors.text : '#888';
        const weight = isUnread ? '700' : '400';

        return (
            <TouchableOpacity
                style={[styles.chatItem, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => handleOpenChat(item)}
            >
                {/* Avatar de Letra */}
                <View style={styles.avatarContainer}>
                    <View style={[styles.avatarCircle, { backgroundColor: isUnread ? colors.primary : '#CCC' }]}>
                        <Text style={styles.avatarText}>{getInitials(item.recipientName)}</Text>
                    </View>
                    {item.isOnline && (
                        <View style={[styles.onlineBadge, { borderColor: colors.card }]} />
                    )}
                </View>

                <View style={styles.chatContent}>
                    <View style={styles.chatHeader}>
                        <Text style={[styles.chatName, { color: colors.text, fontWeight: isUnread ? 'bold' : '600' }]}>
                            {item.recipientName}
                        </Text>
                        <Text style={[styles.chatTime, { color: isUnread ? colors.primary : '#999', fontWeight: weight }]}>
                            {formatTime(item.lastMessageTime)}
                        </Text>
                    </View>

                    <View style={styles.chatFooter}>
                        <Text
                            style={[styles.lastMessage, { color: textColor, fontWeight: weight }]}
                            numberOfLines={1}
                        >
                            {item.lastMessage}
                        </Text>

                        {isUnread && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadText}>{item.unreadCount}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle={colors.background === '#000' ? 'light-content' : 'dark-content'} />

            <View style={[styles.header, { backgroundColor: colors.background }]}>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Mensagens</Text>
            </View>

            <View style={styles.searchContainer}>
                <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Ionicons name="search" size={20} color="#999" />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Buscar conversa..."
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            <FlatList
                data={filteredChats}
                keyExtractor={item => item.id}
                renderItem={renderChatItem}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={loadChats} />}
                ListHeaderComponent={
                    <>
                        {onlineUsers.length > 0 && (
                            <View style={styles.onlineSection}>
                                <Text style={[styles.sectionTitleOnline, { color: colors.text }]}>Online agora</Text>
                                <FlatList
                                    data={onlineUsers}
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={renderOnlineAvatar}
                                    keyExtractor={item => item.id}
                                    contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
                                />
                            </View>
                        )}
                        <Text style={[styles.sectionTitle, { color: colors.text, marginLeft: 24, marginBottom: 10 }]}>Recentes</Text>
                    </>
                }
                ListEmptyComponent={
                    !loading ? (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="chatbubbles-outline" size={60} color={colors.border} />
                            <Text style={[styles.emptyText, { color: colors.text }]}>Nenhuma mensagem.</Text>
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 40, paddingBottom: 10 },
    headerTitle: { fontSize: 28, fontWeight: '800' },

    searchContainer: { paddingHorizontal: 24, marginBottom: 20 },
    searchBox: { flexDirection: 'row', alignItems: 'center', height: 50, borderRadius: 16, paddingHorizontal: 16, borderWidth: 1 },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
    sectionTitleOnline: { fontSize: 14, fontWeight: '700', opacity: 0.6, textTransform: 'uppercase', marginBottom: 10, marginLeft: 24 },

    onlineSection: { marginBottom: 10 },
    sectionTitle: { fontSize: 14, fontWeight: '700', opacity: 0.6, textTransform: 'uppercase', marginBottom: 10, },

    // Estilos Online (Topo)
    onlineItem: { alignItems: 'center', marginRight: 20 },
    avatarCircleBig: { width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 6, position: 'relative' },
    avatarTextBig: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
    onlineBadgeBig: { width: 16, height: 16, backgroundColor: '#34C759', borderRadius: 8, position: 'absolute', bottom: 0, right: 0, borderWidth: 2 },
    onlineName: { fontSize: 12, fontWeight: '500' },

    listContent: { paddingBottom: 20 },

    // Estilos Chat Item
    chatItem: { flexDirection: 'row', alignItems: 'center', padding: 16, marginHorizontal: 24, marginBottom: 12, borderRadius: 20, borderWidth: 1 },
    avatarContainer: { position: 'relative', marginRight: 16 },
    avatarCircle: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
    avatarText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    onlineBadge: { width: 14, height: 14, backgroundColor: '#34C759', borderRadius: 7, position: 'absolute', bottom: 0, right: 0, borderWidth: 2 },

    chatContent: { flex: 1, justifyContent: 'center' },
    chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    chatName: { fontSize: 16 },
    chatTime: { fontSize: 12 },

    chatFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    lastMessage: { fontSize: 14, flex: 1, marginRight: 10 },
    unreadBadge: { backgroundColor: '#FF3B30', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, minWidth: 20, alignItems: 'center' },
    unreadText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

    emptyContainer: { alignItems: 'center', marginTop: 60 },
    emptyText: { fontSize: 18, fontWeight: 'bold', marginTop: 16 }
});