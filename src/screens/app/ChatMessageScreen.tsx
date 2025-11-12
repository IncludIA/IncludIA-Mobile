import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MatchesStackParamList } from '../../navigation/AppNavigation';

type Props = NativeStackScreenProps<MatchesStackParamList, 'Chat'>;

export default function ChatMessageScreen({ route }: Props) {
    const { matchId } = route.params;

    return (
        <View style={styles.container}>
            <Text>Tela de Chat</Text>
            <Text>Chat ID: {matchId}</Text>
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