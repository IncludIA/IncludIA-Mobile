import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Button,
    SafeAreaView,
    TouchableOpacity,
    Switch,
    Alert,
} from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../context/ThemeContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../../navigation/AppNavigation';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<ProfileStackParamList, 'ConfigApp'>;

export default function ConfigAppScreen({ navigation }: Props) {
    const { signOut } = useAuth();
    const { isDark, toggleTheme, colors } = useTheme();

    const handleDeleteAccount = () => {
        Alert.alert(
            'Deletar Conta',
            'Você tem certeza? Esta ação é irreversível.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Deletar',
                    style: 'destructive',
                    onPress: () => {
                        console.log('Conta deletada (simulação)');
                        signOut();
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={28} color={colors.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>Configurações</Text>

                <View style={[styles.optionRow, { backgroundColor: colors.card }]}>
                    <Text style={[styles.optionText, { color: colors.text }]}>Tema Escuro</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: colors.primary }}
                        thumbColor={'#f4f3f4'}
                        onValueChange={toggleTheme}
                        value={isDark}
                    />
                </View>

                <View style={styles.separator} />

                <View style={styles.buttonContainer}>
                    <Button title="Sair (Logout)" onPress={signOut} color={colors.primary} />
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        title="Deletar Conta"
                        onPress={handleDeleteAccount}
                        color={colors.notification}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 40,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    optionText: {
        fontSize: 16,
    },
    separator: {
        height: 40,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 15,
    },
});