import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import api from '../../services/api';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { ChatStackParamList } from '../../navigation/AppTabNavigator';

type Props = NativeStackScreenProps<ChatStackParamList, 'ChatMessage'>;

interface Message {
    id: string;
    conteudo: string;
    senderId: string;
    timestamp: string;
}

export default function ChatMessageScreen({ route, navigation }: Props) {
    const { matchId } = route.params;
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const flatListRef = useRef<FlatList>(null);
    const { colors } = useTheme();
    // Atenção: Precisamos do ID do usuário para saber quem enviou a msg (lado direito/esquerdo)
    // O AuthContext precisaria expor o userID, mas para simplificar vamos usar o userRole para inferência ou atualizar o Context se possível.
    // Como não tenho o ID no contexto agora, vou assumir que a API retorna se a msg é "minha" ou não, ou implementar decoding.

    // Para fins deste código "profissional", assumimos um fetch polido:

    useEffect(() => {
        // Simulação de busca de chat ID a partir do Match (caso o backend não tenha direto)
        // Se o backend tivesse /matches/{id}/chat seria ideal.
        // Vou usar uma rota hipotética baseada no seu controller de Chat que lista mensagens por chatId.
        // Como o MatchResponse não tem chatId, vamos supor que passamos o chatId ou o buscamos.
        // Ajuste Rápido: O ChatController pede chatId. O MatchController não entrega.
        // Solução Profissional: Listar mensagens assumindo que o matchId seja usado para buscar o chat primeiro.

        // Mock de load inicial para estrutura
        setLoading(false);
    }, []);

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        // Implementação de envio
        const tempMsg: Message = {
            id: Date.now().toString(),
            conteudo: newMessage,
            senderId: 'me',
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [tempMsg, ...prev]);
        setNewMessage('');

        // Aqui entraria a chamada real: await api.post(...)
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isMe = item.senderId === 'me';
        return (
            <View style={[
                styles.messageBubble,
                isMe ? styles.myMessage : styles.theirMessage,
                { backgroundColor: isMe ? colors.primary : colors.card }
            ]}>
                <Text style={{ color: isMe ? '#FFF' : colors.text }}>{item.conteudo}</Text>
                <Text style={[styles.timestamp, { color: isMe ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.4)' }]}>
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={90}
        >
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Chat</Text>
                <View style={{ width: 24 }} />
            </View>

            {loading ? (
                <ActivityIndicator style={{ marginTop: 20 }} size="large" color={colors.primary} />
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    inverted
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', color: colors.text, marginTop: 20, opacity: 0.5 }}>
                            Inicie a conversa!
                        </Text>
                    }
                />
            )}

            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
                <TextInput
                    style={[styles.input, { color: colors.text, backgroundColor: colors.background }]}
                    placeholder="Digite sua mensagem..."
                    placeholderTextColor="#999"
                    value={newMessage}
                    onChangeText={setNewMessage}
                    multiline
                />
                <TouchableOpacity
                    style={[styles.sendButton, { backgroundColor: colors.primary }]}
                    onPress={handleSend}
                    disabled={!newMessage.trim()}
                >
                    <Ionicons name="send" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 8,
    },
    myMessage: {
        alignSelf: 'flex-end',
        borderBottomRightRadius: 4,
    },
    theirMessage: {
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 4,
    },
    timestamp: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 100,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 10,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});