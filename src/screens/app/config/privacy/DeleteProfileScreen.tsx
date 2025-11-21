import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, SafeAreaView,
    ActivityIndicator, ScrollView, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../../context/ThemeContext';
import { useAuth } from '../../../../context/AuthContext';
import api from '../../../../services/api';

export default function DeleteProfileScreen({ navigation }: any) {
    const { colors } = useTheme();
    const { signOut, userRole } = useAuth();

    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            // endpoint hipotético para exclusão
            const endpoint = userRole === 'ROLE_RECRUITER'
                ? '/recruiters/me'
                : '/candidate/me';

            // await api.delete(endpoint); // Descomente quando o backend tiver o delete

            // Simulação
            await new Promise(resolve => setTimeout(resolve, 1500));

            Alert.alert(
                "Conta Excluída",
                "Sua conta e todos os seus dados foram removidos com sucesso.",
                [
                    {
                        text: "Ok",
                        onPress: async () => {
                            await signOut();
                        }
                    }
                ]
            );

        } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir sua conta no momento.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="close" size={28} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.hero}>
                    <View style={[styles.logoContainer, { backgroundColor: 'rgba(255, 59, 48, 0.1)' }]}>
                        <Ionicons name="prism" size={48} color="#FF3B30" />
                    </View>
                    <Text style={[styles.title, { color: colors.text }]}>Tem certeza que deseja partir?</Text>
                    <Text style={[styles.subtitle, { color: colors.text }]}>
                        Sentiremos sua falta no Includ.IA.
                    </Text>
                </View>

                <View style={[styles.warningBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.warningTitle, { color: colors.text }]}>O QUE VAI ACONTECER:</Text>

                    <View style={styles.pointRow}>
                        <Ionicons name="close-circle-outline" size={20} color="#FF3B30" />
                        <Text style={[styles.pointText, { color: colors.text }]}>
                            Seu perfil ficará invisível para recrutadores.
                        </Text>
                    </View>
                    <View style={styles.pointRow}>
                        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                        <Text style={[styles.pointText, { color: colors.text }]}>
                            Seus matches e histórico de conversas serão apagados.
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.checkboxContainer}
                    activeOpacity={0.8}
                    onPress={() => setConfirmed(!confirmed)}
                >
                    <View style={[
                        styles.checkbox,
                        { borderColor: confirmed ? '#FF3B30' : colors.border, backgroundColor: confirmed ? '#FF3B30' : 'transparent' }
                    ]}>
                        {confirmed && <Ionicons name="checkmark" size={16} color="#FFF" />}
                    </View>
                    <Text style={[styles.checkboxLabel, { color: colors.text }]}>
                        Entendo que essa ação é irreversível.
                    </Text>
                </TouchableOpacity>
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <TouchableOpacity
                    style={[styles.cancelBtn, { borderColor: colors.border }]}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={[styles.cancelText, { color: colors.text }]}>Cancelar, quero ficar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.deleteBtn,
                        { backgroundColor: confirmed ? '#FF3B30' : colors.border, opacity: confirmed ? 1 : 0.5 }
                    ]}
                    onPress={handleDelete}
                    disabled={!confirmed || loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.deleteText}>Excluir permanentemente</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 10 },
    backBtn: { width: 40, height: 40, justifyContent: 'center' },
    content: { paddingHorizontal: 24, paddingBottom: 120 },
    hero: { alignItems: 'center', marginTop: 20, marginBottom: 40 },
    logoContainer: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
    title: { fontSize: 28, fontWeight: '900', textAlign: 'center', marginBottom: 8, letterSpacing: -0.5 },
    subtitle: { fontSize: 16, textAlign: 'center', opacity: 0.6 },
    warningBox: { padding: 20, borderRadius: 20, borderWidth: 1, marginBottom: 30 },
    warningTitle: { fontSize: 12, fontWeight: '700', opacity: 0.5, marginBottom: 16, letterSpacing: 1 },
    pointRow: { flexDirection: 'row', gap: 12, marginBottom: 12, alignItems: 'flex-start' },
    pointText: { flex: 1, fontSize: 14, lineHeight: 20, opacity: 0.8 },
    checkboxContainer: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingHorizontal: 4 },
    checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
    checkboxLabel: { flex: 1, fontSize: 14, lineHeight: 20, fontWeight: '500' },
    footer: { position: 'absolute', bottom: 0, width: '100%', padding: 24, borderTopWidth: 1, gap: 12 },
    deleteBtn: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: "#FF3B30", shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
    deleteText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    cancelBtn: { height: 56, borderRadius: 16, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
    cancelText: { fontSize: 16, fontWeight: '600' }
});