import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';

export default function PrivacyPolicyScreen({ navigation }: any) {
    const { colors } = useTheme();

    const Section = ({ title, text }: any) => (
        <View style={styles.section}>
            <Text style={[styles.h2, { color: colors.text }]}>{title}</Text>
            <Text style={[styles.p, { color: colors.text }]}>{text}</Text>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Política de Privacidade</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.intro, { color: colors.text }]}>
                    Sua privacidade é nossa prioridade. Esta política descreve como a Includ.IA coleta, usa e protege seus dados, em conformidade com a LGPD (Lei Geral de Proteção de Dados).
                </Text>

                <Section
                    title="1. Coleta de Dados"
                    text="Coletamos informações que você nos fornece diretamente, como nome, e-mail, histórico profissional, habilidades e foto de perfil. Também podemos coletar dados de uso e dispositivo automaticamente."
                />

                <Section
                    title="2. Uso das Informações"
                    text="Usamos seus dados para: (a) Fornecer e melhorar nossos serviços de match; (b) Personalizar sua experiência; (c) Comunicar novidades e atualizações; (d) Garantir a segurança da plataforma."
                />

                <Section
                    title="3. Compartilhamento de Dados"
                    text="Seus dados de perfil são compartilhados com Recrutadores apenas quando ocorre um Match ou quando você se candidata a uma vaga. Não vendemos seus dados para terceiros."
                />

                <Section
                    title="4. Segurança"
                    text="Implementamos medidas de segurança técnicas e organizacionais para proteger seus dados contra acesso não autorizado, alteração ou destruição."
                />

                <Section
                    title="5. Seus Direitos (LGPD)"
                    text="Você tem direito a acessar, corrigir, portar ou excluir seus dados pessoais. Você pode exercer esses direitos através do menu de Configurações > Privacidade do aplicativo."
                />

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)', },
    title: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 24 },
    intro: { fontSize: 14, fontStyle: 'italic', marginBottom: 24, opacity: 0.7, lineHeight: 20 },
    section: { marginBottom: 24 },
    h2: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    p: { fontSize: 14, lineHeight: 22, opacity: 0.8, textAlign: 'justify' }
});