import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';

export default function HelpSupportScreen({ navigation }: any) {
    const { colors } = useTheme();

    const FAQItem = ({ question }: any) => (
        <TouchableOpacity style={[styles.faqItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.question, { color: colors.text }]}>{question}</Text>
            <Ionicons name="chevron-down" size={20} color={colors.text} />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Ajuda</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.banner}>
                    <Ionicons name="headset" size={48} color={colors.primary} />
                    <Text style={[styles.bannerText, { color: colors.text }]}>Como podemos ajudar?</Text>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Perguntas Frequentes</Text>
                <FAQItem question="Como mudar meu currículo?" />
                <FAQItem question="Como funciona o Match?" />
                <FAQItem question="As empresas veem meus dados?" />
                <FAQItem question="Como excluir minha conta?" />

                <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Fale Conosco</Text>
                <TouchableOpacity
                    style={[styles.contactBtn, { backgroundColor: colors.primary }]}
                    onPress={() => Linking.openURL('mailto:suporte@includia.com')}
                >
                    <Text style={styles.contactText}>Enviar E-mail para Suporte</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
    title: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 20 },
    banner: { alignItems: 'center', marginBottom: 30 },
    bannerText: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
    faqItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 10, alignItems: 'center' },
    question: { fontWeight: '500' },
    contactBtn: { padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    contactText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});