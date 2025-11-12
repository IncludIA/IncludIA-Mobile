import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MatchesStackParamList } from '../../navigation/AppNavigation';

type Props = NativeStackScreenProps<MatchesStackParamList, 'Matches'>;

export default function MatchesScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <Text>Tela de Matches</Text>
            <Button
                title="Ir para Chat (Exemplo)"
                onPress={() => navigation.navigate('Chat', { matchId: '123' })}
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