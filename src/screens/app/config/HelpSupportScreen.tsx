import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView,
    Linking, LayoutAnimation, Platform, UIManager, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';

// Habilita animações no Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- DADOS DO FAQ (MOCK) ---
const FAQS = [
    {
        id: 1,
        question: "Como editar meu perfil profissional?",
        answer: "Vá até a aba 'Perfil' e toque no botão 'Editar Informações' ou no ícone de lápis. Você poderá atualizar suas experiências, educação e habilidades."
    },
    {
        id: 2,
        question: "Como funciona o sistema de Match?",
        answer: "Nossa IA analisa suas Hard e Soft Skills e cruza com os requisitos das vagas. Quando a compatibilidade é alta (>70%), sugerimos a vaga no seu feed."
    },
    {
        id: 3,
        question: "Recrutadores podem ver meu salário atual?",
        answer: "Não. Sua pretensão salarial é exibida apenas se estiver dentro da faixa da vaga, mas seu salário atual é confidencial."
    },
    {
        id: 4,
        question: "Como excluir minha conta?",
        answer: "Acesse Configurações > Privacidade e Segurança > Excluir Conta. Lembre-se que essa ação é irreversível e apagará todo seu histórico."
    },
    {
        id: 5,
        question: "O aplicativo é gratuito?",
        answer: "Sim! Para candidatos, todas as funcionalidades de busca, match e chat são 100% gratuitas."
    }
];

export default function HelpSupportScreen({ navigation }: any) {
    const { colors } = useTheme();
    const [expandedId, setExpandedId] = useState<number | null>(null);

    const toggleExpand = (id: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    const handleContact = (type: 'EMAIL' | 'WHATSAPP' | 'SITE') => {
        switch (type) {
            case 'EMAIL':
                Linking.openURL('mailto:RM555213@fiap.com.br');
                break;
            case 'WHATSAPP':
                Linking.openURL('https://wa.me/5512981813015');
                break;
            case 'SITE':
                Linking.openURL('https://github.com/IncludIA');
                break;
        }
    };

    const FAQItem = ({ item }: any) => {
        const isExpanded = expandedId === item.id;
        return (
            <TouchableOpacity
                style={[
                    styles.faqItem,
                    { backgroundColor: colors.card, borderColor: isExpanded ? colors.primary : colors.border }
                ]}
                activeOpacity={0.9}
                onPress={() => toggleExpand(item.id)}
            >
                <View style={styles.faqHeader}>
                    <Text style={[styles.question, { color: isExpanded ? colors.primary : colors.text }]}>
                        {item.question}
                    </Text>
                    <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={isExpanded ? colors.primary : colors.text}
                        style={{ opacity: 0.7 }}
                    />
                </View>
                {isExpanded && (
                    <View style={styles.answerContainer}>
                        <View style={[styles.divider, { backgroundColor: colors.border }]} />
                        <Text style={[styles.answer, { color: colors.text }]}>
                            {item.answer}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Central de Ajuda</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                {/* BANNER HERO */}
                <View style={[styles.banner, { backgroundColor: 'rgba(0,122,255,0.08)' }]}>
                    <View style={styles.bannerIcon}>
                        <Ionicons name="chatbubbles-outline" size={32} color={colors.primary} />
                    </View>
                    <Text style={[styles.bannerTitle, { color: colors.text }]}>Como podemos ajudar?</Text>
                    <Text style={styles.bannerSub}>
                        Selecione uma dúvida abaixo ou entre em contato com nosso time de suporte.
                    </Text>
                </View>

                {/* SEÇÃO FAQ */}
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Dúvidas Frequentes</Text>
                <View style={styles.faqList}>
                    {FAQS.map((item) => (
                        <FAQItem key={item.id} item={item} />
                    ))}
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>Fale Conosco</Text>

                <View style={styles.contactGrid}>
                    <TouchableOpacity
                        style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={() => handleContact('EMAIL')}
                    >
                        <View style={[styles.contactIconBox, { backgroundColor: 'rgba(0,122,255,0.1)' }]}>
                            <Ionicons name="mail" size={24} color="#007AFF" />
                        </View>
                        <Text style={[styles.contactLabel, { color: colors.text }]}>E-mail</Text>
                        <Text style={styles.contactSub}>Resposta em até 24h</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.contactCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={() => handleContact('WHATSAPP')}
                    >
                        <View style={[styles.contactIconBox, { backgroundColor: 'rgba(52,199,89,0.1)' }]}>
                            <Ionicons name="logo-whatsapp" size={24} color="#34C759" />
                        </View>
                        <Text style={[styles.contactLabel, { color: colors.text }]}>WhatsApp</Text>
                        <Text style={styles.contactSub}>Seg-Sex, 9h às 18h</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.siteBtn, { borderColor: colors.border }]}
                    onPress={() => handleContact('SITE')}
                >
                    <Text style={[styles.siteBtnText, { color: colors.text }]}>Visitar Central de Ajuda Web</Text>
                    <Ionicons name="open-outline" size={16} color={colors.text} />
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    title: { fontSize: 18, fontWeight: 'bold' },
    backBtn: { padding: 4 },
    content: { padding: 24 },

    // Banner
    banner: { padding: 24, borderRadius: 20, alignItems: 'center', marginBottom: 32 },
    bannerIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: 16, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    bannerTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
    bannerSub: { textAlign: 'center', fontSize: 14, opacity: 0.6, lineHeight: 20, maxWidth: '80%' },

    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },

    // FAQ Item
    faqList: { gap: 12 },
    faqItem: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
    faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, minHeight: 60 },
    question: { fontSize: 15, fontWeight: '600', flex: 1, paddingRight: 16 },
    answerContainer: { paddingHorizontal: 16, paddingBottom: 16 },
    divider: { height: 1, width: '100%', marginBottom: 12, opacity: 0.5 },
    answer: { fontSize: 14, lineHeight: 22, opacity: 0.7 },

    // Contact Grid
    contactGrid: { flexDirection: 'row', gap: 16, marginBottom: 16 },
    contactCard: { flex: 1, padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
    contactIconBox: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
    contactLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    contactSub: { fontSize: 11, opacity: 0.5 },

    // Site Button
    siteBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, gap: 8, borderStyle: 'dashed' },
    siteBtnText: { fontWeight: '600', fontSize: 14 }
});