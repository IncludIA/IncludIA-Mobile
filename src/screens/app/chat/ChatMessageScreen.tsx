import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity,
    KeyboardAvoidingView, Platform, SafeAreaView, Modal, TouchableWithoutFeedback,
    Alert, Image, ActivityIndicator, Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- CORREÇÃO DOS IMPORTES (Subindo 3 níveis) ---
import { useTheme } from '../../../context/ThemeContext';
import api from '../../../services/api';

// --- INTERFACES ---
interface Message {
    id: string;
    text: string;
    senderId: string; // 'me' ou ID do recrutador
    timestamp: string; // ISO String
}

// --- MOCKS (Para não travar a demo) ---
const MOCK_MESSAGES: Message[] = [
    { id: '1', text: 'Olá! Vi seu perfil e achei muito interessante.', senderId: 'other', timestamp: new Date(Date.now() - 172800000).toISOString() },
    { id: '2', text: 'Oi! Muito obrigado.\nFiquei interessado na vaga.', senderId: 'me', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: '3', text: 'Podemos marcar uma conversa rápida?', senderId: 'other', timestamp: new Date(Date.now() - 3600000).toISOString() },
];

export default function ChatMessageScreen({ route, navigation }: any) {
    const { matchId, name, photo, recruiterId } = route.params;
    const { colors } = useTheme();

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [isMatchActive, setIsMatchActive] = useState(true);

    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        loadMessages();
    }, []);

    // Rola para o final quando o teclado abre
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            flatListRef.current?.scrollToEnd({ animated: true });
        });
        return () => keyboardDidShowListener.remove();
    }, []);

    const loadMessages = async () => {
        try {
            const response = await api.get(`/chats/${matchId}/messages`);
            if (response.data && response.data.length > 0) {
                setMessages(response.data);
            } else {
                setMessages(MOCK_MESSAGES);
            }
        } catch (error) {
            setMessages(MOCK_MESSAGES);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (fullName: string) => {
        if (!fullName) return "?";
        const names = fullName.trim().split(' ');
        if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    const getDateLabel = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth();
        const yesterday = new Date(now); yesterday.setDate(now.getDate() - 1);
        const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth();

        if (isToday) return 'Hoje';
        if (isYesterday) return 'Ontem';
        return date.toLocaleDateString('pt-BR');
    };

    const shouldShowDateHeader = (currentIndex: number) => {
        if (currentIndex === 0) return true;
        const currentDate = new Date(messages[currentIndex].timestamp).toDateString();
        const prevDate = new Date(messages[currentIndex - 1].timestamp).toDateString();
        return currentDate !== prevDate;
    };

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const tempMsg: Message = {
            id: Date.now().toString(),
            text: inputText.trim(),
            senderId: 'me',
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, tempMsg]);
        setInputText('');

        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

        try {
            await api.post(`/chats/${matchId}/messages`, { text: tempMsg.text });
        } catch (error) {
            console.log("Erro de envio (API offline)");
        }
    };

    const handleAction = (action: string) => {
        setMenuVisible(false);
        if (action === 'PROFILE') {
            navigation.navigate('RecruiterProfile', { recruiterId: recruiterId || 'mock', name });
        } else if (action === 'UNMATCH') {
            Alert.alert("Desfazer Match", "Tem certeza?", [
                { text: "Cancelar", style: "cancel" },
                { text: "Sim", style: "destructive", onPress: () => setIsMatchActive(false) }
            ]);
        } else {
            Alert.alert("Denúncia", "Recebida.");
        }
    };

    const renderMessageItem = ({ item, index }: { item: Message, index: number }) => {
        const isMe = item.senderId === 'me';
        const showDate = shouldShowDateHeader(index);

        return (
            <View style={{ paddingHorizontal: 16 }}>
                {showDate && (
                    <View style={styles.dateBadgeContainer}>
                        <View style={[styles.dateBadge, { backgroundColor: colors.border }]}>
                            <Text style={styles.dateText}>{getDateLabel(item.timestamp)}</Text>
                        </View>
                    </View>
                )}

                <View style={[
                    styles.bubble,
                    isMe ? styles.bubbleMe : styles.bubbleThem,
                    { backgroundColor: isMe ? colors.primary : colors.card }
                ]}>
                    <Text style={[styles.messageText, { color: isMe ? '#FFF' : colors.text }]}>
                        {item.text}
                    </Text>

                    <Text style={[styles.timeText, { color: isMe ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.4)' }]}>
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.headerInfo} onPress={() => handleAction('PROFILE')}>
                    {photo ? (
                        <Image source={{ uri: photo }} style={styles.headerAvatar} />
                    ) : (
                        <View style={[styles.headerAvatarFallback, { backgroundColor: colors.primary }]}>
                            <Text style={styles.avatarText}>{getInitials(name)}</Text>
                        </View>
                    )}
                    <View>
                        <Text style={[styles.headerName, { color: colors.text }]}>{name}</Text>
                        {isMatchActive && <Text style={styles.headerStatus}>Online agora</Text>}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuBtn}>
                    <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={item => item.id}
                    renderItem={renderMessageItem}
                    contentContainerStyle={styles.listContent}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />

                {isMatchActive ? (
                    <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
                        <TextInput
                            style={[styles.input, { color: colors.text, backgroundColor: colors.background }]}
                            placeholder="Digite sua mensagem..."
                            placeholderTextColor="#999"
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            maxLength={500}
                        />
                        <TouchableOpacity
                            style={[styles.sendBtn, { backgroundColor: inputText.trim() ? colors.primary : '#CCC' }]}
                            onPress={handleSend}
                            disabled={!inputText.trim()}
                        >
                            <Ionicons name="send" size={20} color="#FFF" style={{ marginLeft: 2 }} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.unmatchBox}>
                        <Text style={styles.unmatchText}>Conversa encerrada.</Text>
                    </View>
                )}
            </KeyboardAvoidingView>

            <Modal visible={menuVisible} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={[styles.menuBox, { backgroundColor: colors.card }]}>
                            <TouchableOpacity style={styles.menuOption} onPress={() => handleAction('PROFILE')}>
                                <Text style={[styles.menuText, { color: colors.text }]}>Ver Perfil</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuOption} onPress={() => handleAction('REPORT')}>
                                <Text style={[styles.menuText, { color: colors.text }]}>Denunciar</Text>
                            </TouchableOpacity>
                            <View style={[styles.divider, { backgroundColor: colors.border }]} />
                            <TouchableOpacity style={styles.menuOption} onPress={() => handleAction('UNMATCH')}>
                                <Text style={[styles.menuText, { color: '#FF3B30' }]}>Desfazer Match</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, zIndex: 10, elevation: 2 },
    backBtn: { padding: 8, marginRight: 8 },
    headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    headerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    headerAvatarFallback: { width: 40, height: 40, borderRadius: 20, marginRight: 10, justifyContent: 'center', alignItems: 'center' },
    avatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
    headerName: { fontSize: 16, fontWeight: 'bold' },
    headerStatus: { fontSize: 12, color: '#34C759' },
    menuBtn: { padding: 8 },
    dateBadgeContainer: { alignItems: 'center', marginVertical: 16 },
    dateBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, opacity: 0.6 },
    dateText: { fontSize: 11, fontWeight: '600' },
    bubble: { maxWidth: '80%', padding: 12, borderRadius: 18, marginBottom: 4 },
    bubbleMe: { alignSelf: 'flex-end', borderBottomRightRadius: 2 },
    bubbleThem: { alignSelf: 'flex-start', borderBottomLeftRadius: 2 },
    messageText: { fontSize: 16, lineHeight: 22 },
    timeText: { fontSize: 10, alignSelf: 'flex-end', marginTop: 4, opacity: 0.8 },
    inputWrapper: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1 },
    input: { flex: 1, minHeight: 44, maxHeight: 120, borderRadius: 22, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, marginRight: 12, fontSize: 16 },
    sendBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 0 },
    unmatchBox: { padding: 20, backgroundColor: '#FFE5E5', alignItems: 'center' },
    unmatchText: { color: '#FF3B30', fontWeight: 'bold' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
    menuBox: { position: 'absolute', top: 60, right: 16, width: 180, borderRadius: 12, paddingVertical: 8, elevation: 5 },
    menuOption: { paddingVertical: 12, paddingHorizontal: 16 },
    menuText: { fontSize: 16 },
    divider: { height: 1, marginVertical: 4 },
    listContent: { paddingBottom: 20, paddingTop: 10 }
});