import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';

export default function AboutAppScreen({ navigation }: any) {
    const { colors } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.content}>
                <View style={[styles.logoContainer, { backgroundColor: colors.card }]}>
                    <Ionicons name="prism" size={60} color={colors.primary} />
                </View>

                <Text style={[styles.appName, { color: colors.text }]}>Includ.IA</Text>
                <Text style={styles.version}>Versão 1.0.0 Beta</Text>

                <Text style={[styles.description, { color: colors.text }]}>
                    A Includ.IA é uma plataforma revolucionária que utiliza Inteligência Artificial para eliminar vieses inconscientes nos processos de recrutamento, conectando talentos diversos a empresas que valorizam a inclusão real.
                </Text>

                <View style={styles.links}>
                    <TouchableOpacity style={styles.linkItem} onPress={() => Linking.openURL('https://github.com/IncludIA')}>
                        <Text style={[styles.linkText, { color: colors.primary }]}>Visite nosso site</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.linkItem} onPress={() => navigation.navigate('TermsOfUse')}>
                        <Text style={[styles.linkText, { color: colors.primary }]}>Termos de Uso</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.linkItem} onPress={() => navigation.navigate('PrivacyPolicy')}>
                        <Text style={[styles.linkText, { color: colors.primary }]}>Política de Privacidade</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.footer}>
                    Desenvolvido com 💙 para a FIAP Global Solution 2025
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    backBtn: { padding: 20, alignSelf: 'flex-start' },
    content: { flex: 1, alignItems: 'center', padding: 30, justifyContent: 'center' },
    logoContainer: { width: 120, height: 120, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20, elevation: 5 },
    appName: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
    version: { fontSize: 14, opacity: 0.5, marginBottom: 30 },
    description: { textAlign: 'center', lineHeight: 24, fontSize: 16, opacity: 0.8, marginBottom: 40 },
    links: { width: '100%', alignItems: 'center', gap: 16 },
    linkItem: { padding: 10 },
    linkText: { fontWeight: '600', fontSize: 16 },
    footer: { position: 'absolute', bottom: 30, fontSize: 12, opacity: 0.4, textAlign: 'center' }
});