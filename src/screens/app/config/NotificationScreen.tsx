import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';

export default function NotificationScreen({ navigation }: any) {
    const { colors } = useTheme();

    const [settings, setSettings] = useState({
        pushMatches: true,
        pushMessages: true,
        emailNews: false,
        smsAlerts: true
    });

    const toggleSwitch = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const SettingItem = ({ label, subLabel, value, onToggle }: any) => (
        <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={{ flex: 1 }}>
                <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
                <Text style={styles.subLabel}>{subLabel}</Text>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: "#767577", true: colors.primary }}
            />
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Notificações</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Push Notifications</Text>
                <SettingItem
                    label="Novos Matches"
                    subLabel="Seja avisado quando uma empresa curtir você."
                    value={settings.pushMatches}
                    onToggle={() => toggleSwitch('pushMatches')}
                />
                <SettingItem
                    label="Mensagens"
                    subLabel="Receba alertas de novas mensagens no chat."
                    value={settings.pushMessages}
                    onToggle={() => toggleSwitch('pushMessages')}
                />

                <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Outros canais</Text>
                <SettingItem
                    label="E-mails de Marketing"
                    subLabel="Novidades e dicas de carreira."
                    value={settings.emailNews}
                    onToggle={() => toggleSwitch('emailNews')}
                />
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
    item: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1 },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    subLabel: { fontSize: 12, opacity: 0.6, maxWidth: '90%' }
});