import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';

export default function TermsOfUseScreen({ navigation }: any) {
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
                <Text style={[styles.title, { color: colors.text }]}>Termos de Uso</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.lastUpdate, { color: colors.text }]}>Última atualização: 21 de Novembro de 2025</Text>

                <Text style={[styles.p, { color: colors.text }]}>
                    Bem-vindo ao Includ.IA. Ao acessar ou usar nosso aplicativo móvel, você concorda em cumprir e estar vinculado a estes Termos de Uso.
                </Text>

                <Section
                    title="1. Aceitação dos Termos"
                    text="Ao criar uma conta, você confirma que leu, entendeu e concorda com estes termos. Se você não concordar, não deverá usar o serviço."
                />

                <Section
                    title="2. Uso do Serviço"
                    text="A Includ.IA é uma plataforma de conexão entre talentos e empresas. Você concorda em usar o serviço apenas para fins lícitos e para a busca de emprego ou recrutamento. É proibido usar a plataforma para enviar spam, assédio ou conteúdo ofensivo."
                />

                <Section
                    title="3. Contas de Usuário"
                    text="Você é responsável por manter a confidencialidade de sua senha e conta. A Includ.IA não se responsabiliza por qualquer perda ou dano decorrente do não cumprimento desta obrigação."
                />

                <Section
                    title="4. Propriedade Intelectual"
                    text="Todo o conteúdo, design, gráficos e código da Includ.IA são propriedade exclusiva da FIAP Global Solution e estão protegidos por leis de direitos autorais."
                />

                <Section
                    title="5. Cancelamento"
                    text="Podemos suspender ou encerrar seu acesso ao serviço a qualquer momento, sem aviso prévio, se você violar estes Termos."
                />

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    title: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 24 },
    lastUpdate: { fontSize: 12, opacity: 0.5, marginBottom: 20 },
    section: { marginBottom: 24 },
    h2: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
    p: { fontSize: 14, lineHeight: 22, opacity: 0.8, textAlign: 'justify' }
});