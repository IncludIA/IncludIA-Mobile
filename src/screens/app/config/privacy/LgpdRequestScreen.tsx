import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Image, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';

export default function LgpdRequestScreen({ navigation }: any) {
    const { colors } = useTheme();
    const [requested, setRequested] = useState(false);

    const handleRequestData = () => {
        Alert.alert(
            "Solicitação Recebida",
            "Iniciamos o processamento do seu relatório de dados. Você receberá um arquivo ZIP no seu e-mail cadastrado em até 15 dias úteis, conforme a LGPD.",
            [{ text: "Entendi", onPress: () => setRequested(true) }]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Seus Dados</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="document-lock-outline" size={64} color={colors.primary} />
                </View>

                <Text style={[styles.headline, { color: colors.text }]}>
                    Transparência e Controle
                </Text>

                <Text style={[styles.text, { color: colors.text }]}>
                    No Includ.IA, levamos sua privacidade a sério. Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem o direito de solicitar uma cópia de todas as informações pessoais que processamos sobre você.
                </Text>

                <View style={[styles.infoBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[styles.infoTitle, { color: colors.text }]}>O que está incluído?</Text>
                    <View style={styles.listItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                        <Text style={[styles.listText, { color: colors.text }]}>Dados cadastrais</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                        <Text style={[styles.listText, { color: colors.text }]}>Histórico de Matches</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                        <Text style={[styles.listText, { color: colors.text }]}>Logs de acesso e dispositivos</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[
                        styles.requestBtn,
                        { backgroundColor: requested ? colors.card : colors.primary, borderColor: colors.primary }
                    ]}
                    onPress={handleRequestData}
                    disabled={requested}
                >
                    {requested ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Ionicons name="checkmark" size={20} color={colors.primary} />
                            <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Solicitação em andamento</Text>
                        </View>
                    ) : (
                        <Text style={styles.btnText}>Solicitar Relatório de Dados</Text>
                    )}
                </TouchableOpacity>

                <Text style={styles.footerNote}>
                    O link para download expira em 7 dias após o envio por e-mail.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingVertical: 25, alignItems: 'center' },
    backBtn: { padding: 4 },
    title: { fontSize: 16, fontWeight: '600' },
    content: { padding: 24 },

    iconContainer: { alignItems: 'center', marginVertical: 20 },
    headline: { fontSize: 24, fontWeight: '800', textAlign: 'center', marginBottom: 16 },
    text: { fontSize: 15, lineHeight: 24, opacity: 0.8, textAlign: 'center', marginBottom: 30 },

    infoBox: { padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 30 },
    infoTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
    listItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
    listText: { fontSize: 14, opacity: 0.8 },

    requestBtn: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
    btnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

    footerNote: { textAlign: 'center', marginTop: 16, fontSize: 12, opacity: 0.5 }
});