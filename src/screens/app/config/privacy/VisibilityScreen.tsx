import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';

export default function VisibilityScreen({ navigation }: any) {
    const { colors } = useTheme();

    const [settings, setSettings] = useState({
        publicProfile: true,
        showSalary: false,
        invisibleMode: false,
    });

    const toggleSwitch = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
        // Aqui você chamaria api.put('/candidate/settings', { ... })
    };

    const SettingItem = ({ label, description, value, onToggle, icon }: any) => (
        <View style={[styles.item, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={24} color={colors.text} />
            </View>
            <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
                <Text style={styles.description}>{description}</Text>
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
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Visibilidade</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Controle de Privacidade</Text>

                <SettingItem
                    icon="eye-outline"
                    label="Perfil Público"
                    description="Permitir que recrutadores encontrem seu perfil nas buscas."
                    value={settings.publicProfile}
                    onToggle={() => toggleSwitch('publicProfile')}
                />

                <SettingItem
                    icon="cash-outline"
                    label="Mostrar Pretensão Salarial"
                    description="Exibir sua faixa salarial para empresas compatíveis."
                    value={settings.showSalary}
                    onToggle={() => toggleSwitch('showSalary')}
                />

                <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 20 }]}>Modo Furtivo</Text>

                <SettingItem
                    icon="ghost-outline"
                    label="Modo Invisível"
                    description="Seu perfil ficará oculto para todos, exceto para vagas que você se candidatar."
                    value={settings.invisibleMode}
                    onToggle={() => toggleSwitch('invisibleMode')}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
    backBtn: { padding: 4 },
    title: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 20 },
    sectionTitle: { fontSize: 14, fontWeight: '700', opacity: 0.6, marginBottom: 12, textTransform: 'uppercase' },
    item: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1 },
    iconContainer: { marginRight: 16, opacity: 0.7 },
    label: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
    description: { fontSize: 12, opacity: 0.6, lineHeight: 18 }
});