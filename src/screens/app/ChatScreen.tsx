import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    SafeAreaView,
    FlatList,
    Image,
    TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { ChatStackParamList } from '../../navigation/AppTabNavigator';

type NewMatch = {
    id: string;
    name: string;
    isLikes?: boolean;
    image?: string;
};

type Conversation = {
    id: string;
    name: string;
    lastMessage: string;
    image: string;
    status?: 'liked_you' | 'your_turn' | 'none';
};

const newMatchesData: NewMatch[] = [
    { id: 'likes', name: 'Curtidas', isLikes: true },
    { id: '1', name: 'Match 1' },
    { id: '2', name: 'Match 2' },
    { id: '3', name: 'Match 3' },
    { id: '4', name: 'Match 4' },
];

const conversationsData: Conversation[] = [
    {
        id: 'alifer',
        name: 'Alifer',
        lastMessage: 'Ativo recentemente, dê um match agora!',
        image: 'https://via.placeholder.com/150/555555/FFFFFF?Text=A', // Placeholder
        status: 'liked_you',
    },
    {
        id: '123', // ID do match (igual ao do ChatMessageScreen)
        name: 'Fernando',
        lastMessage: 'Ooi',
        image: 'https://via.placeholder.com/150/888888/FFFFFF?Text=F', // Placeholder
        status: 'your_turn',
    },
    {
        id: 'nathalia',
        name: 'Nathalia',
        lastMessage: 'Eu sou terapeuta ocupacional, trabalho com criança...',
        image: 'https://via.placeholder.com/150/777777/FFFFFF?Text=N', // Placeholder
        status: 'your_turn',
    },
    {
        id: '456',
        name: 'Luan',
        lastMessage: 'oioi',
        image: 'https://via.placeholder.com/150/666666/FFFFFF?Text=L',
        status: 'your_turn',
    },
];


type Props = NativeStackScreenProps<ChatStackParamList, 'ChatList'>;

export default function ChatScreen({ navigation }: Props) {
    const { colors } = useTheme();

    // --- Render Items ---
    const renderNewMatch = ({ item }: { item: NewMatch }) => (
        <View style={styles.matchItemContainer}>
            {item.isLikes ? (
                <View style={[styles.matchItem, styles.likesItem, { borderColor: '#F0B90B' }]}>
                    <Text style={styles.likesText}>+99</Text>
                </View>
            ) : (
                <View style={[styles.matchItem, { backgroundColor: colors.card }]} />
            )}
            <Text style={[styles.matchName, { color: colors.text }]}>{item.name}</Text>
        </View>
    );

    const renderConversation = ({ item }: { item: Conversation }) => (
        <TouchableOpacity
            style={styles.conversationItem}
            onPress={() => item.status !== 'liked_you' && navigation.navigate('ChatMessage', { matchId: item.id })}
        >
            <Image source={{ uri: item.image }} style={styles.avatar} />
            <View style={styles.conversationTextContainer}>
                <View style={styles.conversationHeader}>
                    <Text style={[styles.conversationName, { color: colors.text }]}>{item.name}</Text>
                    {item.status === 'liked_you' && (
                        <View style={[styles.badge, { backgroundColor: '#F0B90B' }]}>
                            <Text style={styles.badgeTextLiked}>CURTIU VOCÊ</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.lastMessage} numberOfLines={1}>
                    {item.lastMessage}
                </Text>
            </View>
            {item.status === 'your_turn' && (
                <View style={[styles.badge, { backgroundColor: colors.text }]}>
                    <Text style={styles.badgeTextYourTurn}>Sua vez</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <View style={styles.container}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
                    <TextInput
                        style={[
                            styles.searchInput,
                            {
                                backgroundColor: colors.card,
                                color: colors.text,
                                borderColor: colors.border
                            }
                        ]}
                        placeholder="Buscar 18 Matches"
                        placeholderTextColor="#888"
                    />
                </View>

                <FlatList
                    data={conversationsData}
                    renderItem={renderConversation}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={
                        <>
                            <Text style={[styles.title, { color: colors.text }]}>Novos Matches</Text>
                            <FlatList
                                data={newMatchesData}
                                renderItem={renderNewMatch}
                                keyExtractor={(item) => item.id}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.matchesList}
                            />
                            <Text style={[styles.title, { color: colors.text, marginTop: 20 }]}>Mensagens</Text>
                        </>
                    }
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    searchIcon: {
        position: 'absolute',
        left: 30,
        zIndex: 1,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        paddingLeft: 40,
        paddingRight: 15,
        fontSize: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 15,
        marginTop: 10,
        marginBottom: 10,
    },
    matchesList: {
        paddingLeft: 15,
    },
    matchItemContainer: {
        marginRight: 10,
        alignItems: 'center',
        width: 80,
    },
    matchItem: {
        width: 70,
        height: 90,
        borderRadius: 10,
        marginBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    likesItem: {
        borderWidth: 2,
    },
    likesText: {
        color: '#F0B90B',
        fontSize: 18,
        fontWeight: 'bold',
    },
    matchName: {
        fontSize: 12,
        fontWeight: '500',
    },
    // Mensagens List
    conversationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12,
    },
    avatar: {
        width: 55,
        height: 55,
        borderRadius: 30,
        marginRight: 15,
    },
    conversationTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    conversationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    conversationName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    lastMessage: {
        fontSize: 14,
        color: '#888',
    },
    badge: {
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: 8,
    },
    badgeTextLiked: {
        color: '#000',
        fontSize: 10,
        fontWeight: 'bold',
    },
    badgeTextYourTurn: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
});