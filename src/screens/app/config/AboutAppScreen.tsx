import React, { useState } from 'react';
import {
    View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity,
    ScrollView, LayoutAnimation, Platform, UIManager, Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useTheme } from '../../../context/ThemeContext';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQS = [
    {
        question: "O que é a Includ.IA?",
        answer: "A Includ.IA é uma plataforma que utiliza Inteligência Artificial para conectar talentos diversos a empresas inclusivas, eliminando vieses inconscientes no processo de recrutamento."
    },
    {
        question: "Como funciona o Match?",
        answer: "Nossa IA analisa suas habilidades (hard e soft skills) e compara com os requisitos das vagas. Quando há alta compatibilidade cultural e técnica, sugerimos o Match."
    },
    {
        question: "Meus dados estão seguros?",
        answer: "Sim! Levamos a LGPD a sério. Seus dados sensíveis são anonimizados na primeira etapa da triagem para garantir um processo justo."
    },
    {
        question: "É gratuito para candidatos?",
        answer: "Sim! Acreditamos que o acesso a oportunidades de trabalho deve ser livre e democrático. Todas as funcionalidades para candidatos são gratuitas."
    }
];

export default function AboutAppScreen({ navigation }: any) {
    const { colors } = useTheme();
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const commitHash = Constants.expoConfig?.extra?.commitHash || 'N/A';

    const toggleExpand = (index: number) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const FAQItem = ({ item, index }: any) => {
        const isExpanded = expandedIndex === index;
        return (
            <TouchableOpacity
                style={[
                    styles.faqItem,
                    { backgroundColor: colors.card, borderColor: colors.border },
                    isExpanded && { borderColor: colors.primary }
                ]}
                activeOpacity={0.9}
                onPress={() => toggleExpand(index)}
            >
                <View style={styles.faqHeader}>
                    <Text style={[styles.question, { color: isExpanded ? colors.primary : colors.text }]}>
                        {item.question}
                    </Text>
                    <Ionicons
                        name={isExpanded ? "chevron-up" : "chevron-down"}
                        size={20}
                        color={isExpanded ? colors.primary : colors.text}
                    />
                </View>
                {isExpanded && (
                    <Text style={[styles.answer, { color: colors.text }]}>
                        {item.answer}
                    </Text>
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
                <Text style={[styles.headerTitle, { color: colors.text }]}>Sobre o App</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <View style={styles.brandSection}>
                    <View style={[styles.logoContainer, { backgroundColor: 'rgba(0,122,255,0.1)' }]}>
                        <Ionicons name="prism" size={48} color={colors.primary} />
                    </View>
                    <Text style={[styles.appName, { color: colors.text }]}>Includ.IA</Text>
                    <Text style={styles.version}>Versão 1.0.0</Text>

                    <View style={styles.hashTag}>
                        <Ionicons name="git-commit-outline" size={12} color="#999" />
                        <Text style={styles.hashText}>Build: {commitHash}</Text>
                    </View>
                </View>

                <View style={[styles.missionBox, { backgroundColor: colors.card }]}>
                    <Ionicons name="rocket-outline" size={24} color={colors.primary} style={{ marginBottom: 8 }} />
                    <Text style={[styles.missionText, { color: colors.text }]}>
                        "Nossa missão é criar um mercado de trabalho onde o talento seja o único critério de seleção, usando tecnologia para derrubar barreiras."
                    </Text>
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Perguntas Frequentes</Text>
                <View style={styles.faqList}>
                    {FAQS.map((item, index) => (
                        <FAQItem key={index} item={item} index={index} />
                    ))}
                </View>

                <View style={styles.linksContainer}>
                    <TouchableOpacity style={styles.linkItem} onPress={() => navigation.navigate('TermsOfUse')}>
                        <Text style={[styles.linkText, { color: colors.primary }]}>Termos de Uso</Text>
                        <Ionicons name="open-outline" size={16} color={colors.primary} />
                    </TouchableOpacity>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <TouchableOpacity style={styles.linkItem} onPress={() => navigation.navigate('PrivacyPolicy')}>
                        <Text style={[styles.linkText, { color: colors.primary }]}>Política de Privacidade</Text>
                        <Ionicons name="open-outline" size={16} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <View style={styles.socialRow}>
                        <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com')}>
                            <Ionicons name="logo-instagram" size={24} color={colors.text} style={{ opacity: 0.5 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Linking.openURL('https://linkedin.com')}>
                            <Ionicons name="logo-linkedin" size={24} color={colors.text} style={{ opacity: 0.5 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => Linking.openURL('https://github.com')}>
                            <Ionicons name="logo-github" size={24} color={colors.text} style={{ opacity: 0.5 }} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.copyright}>© 2025 FIAP Global Solution. Todos os direitos reservados.</Text>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    backBtn: { padding: 4 },

    content: { padding: 24 },

    brandSection: { alignItems: 'center', marginBottom: 32 },
    logoContainer: { width: 80, height: 80, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    appName: { fontSize: 28, fontWeight: '900', letterSpacing: -1, marginBottom: 4 },
    version: { fontSize: 12, opacity: 0.5, marginBottom: 6 },

    hashTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    hashText: { fontSize: 10, color: '#999', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },

    missionBox: { padding: 20, borderRadius: 16, marginBottom: 32, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
    missionText: { textAlign: 'center', fontSize: 14, lineHeight: 22, fontStyle: 'italic', opacity: 0.8 },

    sectionTitle: { fontSize: 14, fontWeight: '700', textTransform: 'uppercase', opacity: 0.5, marginBottom: 16, marginLeft: 4 },

    faqList: { marginBottom: 32 },
    faqItem: { borderRadius: 12, borderWidth: 1, marginBottom: 10, overflow: 'hidden' },
    faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
    question: { fontSize: 15, fontWeight: '600', flex: 1, paddingRight: 10 },
    answer: { paddingHorizontal: 16, paddingBottom: 16, fontSize: 14, lineHeight: 20, opacity: 0.7 },

    linksContainer: { borderRadius: 16, padding: 8, backgroundColor: 'rgba(0,0,0,0.03)', marginBottom: 32 },
    linkItem: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 12, gap: 8 },
    linkText: { fontSize: 14, fontWeight: '600' },
    divider: { height: 1, width: '100%', opacity: 0.5 },

    footer: { alignItems: 'center' },
    socialRow: { flexDirection: 'row', gap: 24, marginBottom: 16 },
    copyright: { fontSize: 10, opacity: 0.3 }
});