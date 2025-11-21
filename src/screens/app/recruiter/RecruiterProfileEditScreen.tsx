import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';

export default function RecruiterProfileEditScreen({ navigation }: any) {
    const { colors } = useTheme();
    const { signOut } = useAuth();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>Meu Perfil (Recrutador)</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ConfigApp')}>
                    <Text style={{ color: colors.primary }}>Configurações</Text>
                </TouchableOpacity>
            </View>

            <View style={{ padding: 20 }}>
                <Text style={{ color: colors.text, marginBottom: 20 }}>
                    Aqui o recrutador edita seus dados e os dados da empresa.
                </Text>

                <TouchableOpacity style={styles.btn} onPress={signOut}>
                    <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Sair</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
    title: { fontSize: 20, fontWeight: 'bold' },
    btn: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 10, alignItems: 'center' }
});