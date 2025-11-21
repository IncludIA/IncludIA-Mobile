import React, { useState } from 'react';
import {
    View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity,
    Image, SafeAreaView, Platform, Alert, KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function EditProfileScreen({ navigation }: any) {
    const { colors } = useTheme();
    const { userRole } = useAuth();

    const [formData, setFormData] = useState({
        nome: 'Alex Pereira',
        bio: 'Desenvolvedor apaixonado por criar soluções inclusivas. Especialista em Java e React.',
        cargo: 'Full Stack Developer',
        localizacao: 'São Paulo, SP',
        linkedin: 'linkedin.com/in/alexp',
        github: 'github.com/alexp'
    });

    const handleSave = () => {
        Alert.alert('Perfil Atualizado', 'Suas informações foram salvas com sucesso.');
        navigation.goBack();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                        <Ionicons name="close" size={24} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>Editar Perfil</Text>
                    <TouchableOpacity onPress={handleSave} style={styles.iconBtn}>
                        <Ionicons name="checkmark" size={24} color={colors.primary} />
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.avatarSection}>
                        <View style={styles.imageWrapper}>
                            <Image
                                source={{ uri: 'https://github.com/github.png' }}
                                style={styles.avatar}
                            />
                            <TouchableOpacity style={[styles.cameraBtn, { backgroundColor: colors.primary }]}>
                                <Ionicons name="camera" size={18} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.roleTag, { color: colors.text, backgroundColor: colors.card }]}>
                            {userRole === 'ROLE_CANDIDATE' ? 'Candidato' : 'Recrutador'}
                        </Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Sobre</Text>
                        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <TextInput
                                style={[styles.input, { color: colors.text, borderBottomColor: colors.border }]}
                                placeholder="Nome Completo"
                                placeholderTextColor="#999"
                                value={formData.nome}
                                onChangeText={t => setFormData({ ...formData, nome: t })}
                            />
                            <TextInput
                                style={[styles.input, { color: colors.text, borderBottomColor: colors.border }]}
                                placeholder="Cargo Atual"
                                placeholderTextColor="#999"
                                value={formData.cargo}
                                onChangeText={t => setFormData({ ...formData, cargo: t })}
                            />
                            <TextInput
                                style={[styles.inputLast, { color: colors.text }]}
                                placeholder="Localização"
                                placeholderTextColor="#999"
                                value={formData.localizacao}
                                onChangeText={t => setFormData({ ...formData, localizacao: t })}
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Bio</Text>
                        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <TextInput
                                style={[styles.textArea, { color: colors.text }]}
                                placeholder="Conte um pouco sobre sua experiência..."
                                placeholderTextColor="#999"
                                multiline
                                numberOfLines={4}
                                value={formData.bio}
                                onChangeText={t => setFormData({ ...formData, bio: t })}
                            />
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: colors.text }]}>Conexões</Text>
                        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                            <View style={[styles.row, { borderBottomColor: colors.border }]}>
                                <Ionicons name="logo-linkedin" size={22} color="#0077B5" style={styles.icon} />
                                <TextInput
                                    style={[styles.inputFlex, { color: colors.text }]}
                                    placeholder="LinkedIn"
                                    placeholderTextColor="#999"
                                    value={formData.linkedin}
                                    onChangeText={t => setFormData({ ...formData, linkedin: t })}
                                    autoCapitalize="none"
                                />
                            </View>
                            <View style={styles.rowLast}>
                                <Ionicons name="logo-github" size={22} color={colors.text} style={styles.icon} />
                                <TextInput
                                    style={[styles.inputFlex, { color: colors.text }]}
                                    placeholder="GitHub"
                                    placeholderTextColor="#999"
                                    value={formData.github}
                                    onChangeText={t => setFormData({ ...formData, github: t })}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
    headerTitle: { fontSize: 17, fontWeight: '600' },
    iconBtn: { padding: 8 },
    scroll: { padding: 20, paddingBottom: 40 },
    avatarSection: { alignItems: 'center', marginBottom: 32 },
    imageWrapper: { position: 'relative', marginBottom: 12 },
    avatar: { width: 100, height: 100, borderRadius: 50 },
    cameraBtn: { position: 'absolute', bottom: 0, right: 0, padding: 8, borderRadius: 20, borderWidth: 3, borderColor: '#fff' },
    roleTag: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, fontSize: 13, fontWeight: '600', overflow: 'hidden' },
    section: { marginBottom: 24 },
    sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 10, marginLeft: 4, textTransform: 'uppercase', opacity: 0.6 },
    card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
    input: { padding: 16, fontSize: 16, borderBottomWidth: 1 },
    inputLast: { padding: 16, fontSize: 16 },
    textArea: { padding: 16, fontSize: 16, minHeight: 100, textAlignVertical: 'top' },
    row: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
    rowLast: { flexDirection: 'row', alignItems: 'center', padding: 16 },
    icon: { marginRight: 12 },
    inputFlex: { flex: 1, fontSize: 16 },
});