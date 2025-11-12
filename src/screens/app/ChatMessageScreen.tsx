import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChatStackParamList } from '../../navigation/AppNavigation';

type Props = NativeStackScreenProps<ChatStackParamList, 'ChatMessage'>;

export default function ChatMessageScreen({ route }: Props) {
    const { matchId } = route.params;

    return (
        <View style={styles.container}>
            <Text>Tela de Chat</Text>
            <Text>Conversando com Match ID: {matchId}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});