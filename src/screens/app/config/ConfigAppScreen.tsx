import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';
import { useAuth } from '../../../context/AuthContext';

export default function ConfigAppScreen({ navigation }: any) {
    const { colors, isDark, toggleTheme } = useTheme();
    const { signOut } = useAuth();

    const handleLogout = () => {
        Alert.alert(
            "Sair",
            "Tem certeza que deseja sair da sua conta?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sair", style: "destructive", onPress: signOut }
            ]
        );
    };

    const OptionItem = ({ icon, label, onPress, value, isSwitch }: any) => (
        <TouchableOpacity
            style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={isSwitch ? toggleTheme : onPress}
            activeOpacity={isSwitch ? 1 : 0.7}
        >
            <View style={[styles.iconBox, { backgroundColor: isSwitch ? 'rgba(0,0,0,0.05)' : colors.background }]}>
                <Ionicons name={icon} size={20} color={colors.text} />
            </View>
            <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
            {isSwitch ? (
                <Switch
                    value={value}
                    onValueChange={toggleTheme}
                    trackColor={{ false: "#767577", true: colors.primary }}
                />
            ) : (
                <Ionicons name="chevron-forward" size={20} color={colors.border} />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Configurações</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Geral</Text>

                <OptionItem icon="moon-outline" label="Modo Escuro" isSwitch value={isDark} />
                <OptionItem icon="notifications-outline" label="Notificações" onPress={() => { }} />
                <OptionItem icon="lock-closed-outline" label="Privacidade & Segurança" onPress={() => { }} />

                <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Conta</Text>

                <OptionItem icon="person-circle-outline" label="Dados Pessoais" onPress={() => navigation.navigate('EditProfile')} />
                <OptionItem icon="help-circle-outline" label="Ajuda e Suporte" onPress={() => { }} />

                <TouchableOpacity
                    style={[styles.logoutBtn, { borderColor: '#FF3B30' }]}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
                    <Text style={styles.logoutText}>Sair da Conta</Text>
                </TouchableOpacity>

                <Text style={styles.version}>Includ.IA v1.0.0 (Beta)</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 10 },
    backBtn: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 24 },

    sectionTitle: { fontSize: 14, fontWeight: '700', opacity: 0.5, textTransform: 'uppercase', marginBottom: 12, marginLeft: 4 },
    item: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 10, borderWidth: 1 },
    iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    label: { flex: 1, fontSize: 16, fontWeight: '500' },

    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginTop: 30, gap: 8 },
    logoutText: { color: '#FF3B30', fontWeight: 'bold', fontSize: 16 },
    version: { textAlign: 'center', marginTop: 20, opacity: 0.3, fontSize: 12 }
});