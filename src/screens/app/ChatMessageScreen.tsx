import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity,
    KeyboardAvoidingView, Platform, SafeAreaView, Modal, TouchableWithoutFeedback, Alert, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import api from '../../services/api';

// --- INTERFACES ---
interface Message {
    id: string;
    text: string;
    senderId: string; // 'me' ou ID do recrutador
    timestamp: string; // ISO String
}

// --- MOCKS PARA DEMONSTRAÇÃO ---
const MOCK_MESSAGES: Message[] = [
    { id: '1', text: 'Olá! Vi seu perfil e achei muito interessante.', senderId: 'other', timestamp: new Date(Date.now() - 172800000).toISOString() }, // 2 dias atrás
    { id: '2', text: 'Oi! Muito obrigado. Fiquei interessado na vaga.', senderId: 'me', timestamp: new Date(Date.now() - 86400000).toISOString() }, // Ontem
    { id: '3', text: 'Podemos marcar uma conversa rápida?', senderId: 'other', timestamp: new Date(Date.now() - 86000000).toISOString() }, // Ontem
    { id: '4', text: 'Claro! Hoje à tarde fica bom?', senderId: 'me', timestamp: new Date().toISOString() }, // Hoje
];

export default function ChatMessageScreen({ route, navigation }: any) {
    const { matchId, name, photo, recruiterId } = route.params; // Recebe dados da navegação
    const { colors } = useTheme();

    const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
    const [inputText, setInputText] = useState('');
    const [isMatchActive, setIsMatchActive] = useState(true); // Controla se o match ainda existe
    const [menuVisible, setMenuVisible] = useState(false); // Controla o menu de 3 pontinhos

    const flatListRef = useRef<FlatList>(null);

    // Rola para o fim ao entrar
    useEffect(() => {
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }, []);

    // --- LÓGICA DE DATAS ---
    const getDateLabel = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();

        const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();

        if (isToday) return 'Hoje';
        if (isYesterday) return 'Ontem';
        return date.toLocaleDateString('pt-BR'); // Ex: 20/11/2024
    };

    const shouldShowDateHeader = (currentIndex: number) => {
        if (currentIndex === 0) return true; // Primeira msg sempre tem data

        const currentDate = new Date(messages[currentIndex].timestamp).toDateString();
        const prevDate = new Date(messages[currentIndex - 1].timestamp).toDateString();

        return currentDate !== prevDate;
    };

    // --- AÇÕES ---
    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMsg: Message = {
            id: Date.now().toString(),
            text: inputText,
            senderId: 'me',
            timestamp: new Date().toISOString()
        };

        setMessages([...messages, newMsg]);
        setInputText('');
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    };

    const handleAction = (action: 'UNMATCH' | 'REPORT' | 'BLOCK') => {
        setMenuVisible(false);

        if (action === 'UNMATCH') {
            Alert.alert(
                "Desfazer Match?",
                "Você não poderá mais enviar mensagens para este recrutador. Essa ação não pode ser desfeita.",
                [
                    { text: "Cancelar", style: "cancel" },
                    {
                        text: "Sim, desfazer",
                        style: 'destructive',
                        onPress: () => {
                            // Aqui chamaria a API: api.post(`/matches/${matchId}/unmatch`)
                            setIsMatchActive(false);
                        }
                    }
                ]
            );
        } else if (action === 'REPORT') {
            Alert.alert("Denúncia Enviada", "Analisaremos as mensagens desta conversa.");
        } else {
            Alert.alert("Bloqueado", "Este usuário foi bloqueado.");
            setIsMatchActive(false);
        }
    };

    const handleGoToProfile = () => {
        const targetId = recruiterId || 'mock-recruiter-id';
        navigation.navigate('RecruiterProfile', {
            recruiterId: targetId,
            name: name
        });
    };

    const renderMessageItem = ({ item, index }: { item: Message, index: number }) => {
        const isMe = item.senderId === 'me';
        const showDate = shouldShowDateHeader(index);

        return (
            <View>
                {showDate && (
                    <View style={styles.dateHeaderContainer}>
                        <View style={[styles.dateBadge, { backgroundColor: colors.card }]}>
                            <Text style={[styles.dateText, { color: colors.text }]}>{getDateLabel(item.timestamp)}</Text>
                        </View>
                    </View>
                )}

                <View style={[
                    styles.bubble,
                    isMe ? styles.bubbleMe : styles.bubbleThem,
                    { backgroundColor: isMe ? colors.primary : colors.card }
                ]}>
                    <Text style={{ color: isMe ? '#FFF' : colors.text, fontSize: 16 }}>
                        {item.text}
                    </Text>
                    <Text style={[
                        styles.timeText,
                        { color: isMe ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.4)' }
                    ]}>
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

            {/* HEADER CUSTOMIZADO */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.headerInfo} onPress={handleGoToProfile} activeOpacity={0.7}>
                    {photo ? (
                        <Image source={{ uri: photo }} style={styles.headerAvatar} />
                    ) : (
                        <View style={[styles.headerAvatarFallback, { backgroundColor: colors.primary }]}>
                            <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{name?.charAt(0)}</Text>
                        </View>
                    )}
                    <View>
                        <Text style={[styles.headerName, { color: colors.text }]}>{name}</Text>
                        {isMatchActive && <Text style={styles.headerStatus}>Toque para ver perfil</Text>}
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuBtn}>
                    <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id}
                renderItem={renderMessageItem}
                contentContainerStyle={styles.listContent}
            />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
                {isMatchActive ? (
                    <View style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
                        <TextInput
                            style={[styles.input, { color: colors.text, backgroundColor: colors.background }]}
                            placeholder="Digite uma mensagem..."
                            placeholderTextColor="#999"
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                        />
                        <TouchableOpacity
                            style={[styles.sendBtn, { backgroundColor: inputText.trim() ? colors.primary : '#CCC' }]}
                            onPress={handleSend}
                            disabled={!inputText.trim()}
                        >
                            <Ionicons name="send" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.unmatchContainer}>
                        <Ionicons name="heart-dislike" size={24} color="#FF3B30" />
                        <Text style={styles.unmatchText}>
                            O match foi desfeito. Vocês não podem mais conversar.
                        </Text>
                    </View>
                )}
            </KeyboardAvoidingView>

            <Modal visible={menuVisible} transparent animationType="fade">
                <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
                    <View style={styles.modalOverlay}>
                        <View style={[styles.menuBox, { backgroundColor: colors.card }]}>
                            <TouchableOpacity style={styles.menuOption} onPress={handleGoToProfile}>
                                <Ionicons name="person-circle-outline" size={20} color={colors.text} />
                                <Text style={[styles.menuText, { color: colors.text }]}>Ver Perfil</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.menuOption} onPress={() => handleAction('REPORT')}>
                                <Ionicons name="flag-outline" size={20} color={colors.text} />
                                <Text style={[styles.menuText, { color: colors.text }]}>Denunciar</Text>
                            </TouchableOpacity>
                            <View style={[styles.divider, { backgroundColor: colors.border }]} />
                            <TouchableOpacity style={styles.menuOption} onPress={() => handleAction('UNMATCH')}>
                                <Ionicons name="heart-dislike-outline" size={20} color="#FF3B30" />
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

    // Header
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, zIndex: 10 },
    backBtn: { marginRight: 12 },
    headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
    headerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    headerAvatarFallback: { width: 40, height: 40, borderRadius: 20, marginRight: 10, justifyContent: 'center', alignItems: 'center' },
    headerName: { fontSize: 16, fontWeight: 'bold' },
    headerStatus: { fontSize: 12, color: '#34C759' },
    menuBtn: { padding: 8 },

    // Lista
    listContent: { paddingHorizontal: 16, paddingVertical: 20 },

    // Datas
    dateHeaderContainer: { alignItems: 'center', marginBottom: 16, marginTop: 8 },
    dateBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, opacity: 0.8 },
    dateText: { fontSize: 12, fontWeight: '600', opacity: 0.7 },

    // Balões
    bubble: { maxWidth: '80%', padding: 12, borderRadius: 16, marginBottom: 8 },
    bubbleMe: { alignSelf: 'flex-end', borderBottomRightRadius: 2 },
    bubbleThem: { alignSelf: 'flex-start', borderBottomLeftRadius: 2 },
    timeText: { fontSize: 10, alignSelf: 'flex-end', marginTop: 4 },

    // Input
    inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, alignItems: 'flex-end' },
    input: { flex: 1, minHeight: 40, maxHeight: 100, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10, marginRight: 10 },
    sendBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 2 }, // Ajuste fino para alinhar com multiline

    // Unmatch Banner
    unmatchContainer: { backgroundColor: '#FFE5E5', padding: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 },
    unmatchText: { color: '#FF3B30', fontWeight: 'bold', fontSize: 14, flex: 1, textAlign: 'center' },

    // Modal Menu
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' },
    menuBox: { position: 'absolute', top: 60, right: 16, width: 200, borderRadius: 12, paddingVertical: 8, elevation: 5, shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5 },
    menuOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, gap: 12 },
    menuText: { fontSize: 16 },
    divider: { height: 1, marginVertical: 4 }
});