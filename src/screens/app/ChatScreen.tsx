import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChatStackParamList } from '../../navigation/AppNavigation';

type Props = NativeStackScreenProps<ChatStackParamList, 'ChatList'>;

export default function ChatScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Text>Lista de Conversas</Text>
            <Button
                title="Abrir Chat com 'Match 1'"
                onPress={() => navigation.navigate('ChatMessage', { matchId: '123' })}
            />
            <Button
                title="Abrir Chat com 'Match 2'"
                onPress={() => navigation.navigate('ChatMessage', { matchId: '456' })}
            />
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