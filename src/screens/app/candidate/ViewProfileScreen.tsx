import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';

export default function ViewProfileScreen({ route, navigation }: any) {
    const { candidateData } = route.params;
    const { colors } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-down" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Perfil do Candidato</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.profileHeader}>
                    <Image source={{ uri: candidateData.fotoPerfilUrl || 'https://github.com/github.png' }} style={styles.avatar} />
                    <Text style={[styles.name, { color: colors.text }]}>{candidateData.nome}</Text>
                    <Text style={[styles.role, { color: colors.text }]}>{candidateData.cargo}</Text>
                    <View style={styles.matchTag}>
                        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{candidateData.match}% Compatível</Text>
                    </View>
                </View>

                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Resumo</Text>
                    <Text style={[styles.text, { color: colors.text }]}>
                        Profissional apaixonado por tecnologia com experiência em desenvolvimento de software escalável.
                    </Text>
                </View>

                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Skills</Text>
                    <View style={styles.tags}>
                        {candidateData.skills.map((s: string, i: number) => (
                            <View key={i} style={[styles.tag, { borderColor: colors.border }]}>
                                <Text style={{ color: colors.text }}>{s}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 16, fontWeight: 'bold' },
    content: { padding: 24 },
    profileHeader: { alignItems: 'center', marginBottom: 24 },
    avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
    name: { fontSize: 24, fontWeight: 'bold' },
    role: { fontSize: 16, opacity: 0.6, marginBottom: 12 },
    matchTag: { backgroundColor: '#8A2BE2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    section: { padding: 20, borderRadius: 16, marginBottom: 16 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    text: { lineHeight: 22, opacity: 0.8 },
    tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 }
});