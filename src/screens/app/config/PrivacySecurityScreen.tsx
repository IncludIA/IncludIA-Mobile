import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';

export default function PrivacySecurityScreen({ navigation }: any) {
    const { colors } = useTheme();

    const handleDeleteAccount = () => {
        navigation.navigate('DeleteProfile');
    };

    const MenuItem = ({ icon, label, color, onPress }: any) => (
        <TouchableOpacity
            style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={onPress}
        >
            <Ionicons name={icon} size={20} color={color || colors.text} />
            <Text style={[styles.label, { color: color || colors.text }]}>{label}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.border} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Privacidade</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Segurança</Text>
                <MenuItem
                    icon="key-outline"
                    label="Alterar Senha"
                    onPress={() => navigation.navigate('ChangePassword')}
                />
                <MenuItem
                    icon="shield-checkmark-outline"
                    label="Autenticação em 2 Fatores"
                    onPress={() => navigation.navigate('TwoFactor')}
                />

                <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Dados</Text>
                <MenuItem
                    icon="document-text-outline"
                    label="Solicitar meus dados (LGPD)"
                    onPress={() => navigation.navigate('LgpdRequest')}
                />

                <MenuItem
                    icon="eye-outline"
                    label="Visibilidade do Perfil"
                    onPress={() => navigation.navigate('Visibility')}
                />

                <TouchableOpacity
                    style={[styles.deleteBtn, { backgroundColor: 'rgba(255,59,48,0.1)' }]}
                    onPress={handleDeleteAccount}
                >
                    <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    <Text style={styles.deleteText}>Excluir Minha Conta</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    title: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 20 },
    sectionTitle: { fontSize: 14, fontWeight: '700', opacity: 0.6, marginBottom: 10, textTransform: 'uppercase' },
    item: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, gap: 12 },
    label: { flex: 1, fontSize: 16, fontWeight: '500' },
    deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 12, marginTop: 40, gap: 8 },
    deleteText: { color: '#FF3B30', fontWeight: 'bold', fontSize: 16 }
});