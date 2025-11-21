import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView,
    SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, Modal, FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../../../services/api';
import { useTheme } from '../../../context/ThemeContext';



// --- INTERFACES ---
interface Skill { id?: string; nome: string; tipoSkill: string; }
interface Experiencia {
    id?: string;
    tituloCargo: string;
    empresa: { nomeFantasia: string };
    dataInicio: string;
    dataFim: string;
    descricao?: string;
    tipoEmprego?: string;
}
interface Formacao {
    id?: string;
    nomeInstituicao: string;
    grau: string;
    areaEstudo: string;
    dataInicio: string;
    dataFim: string;
}
interface Voluntariado { id?: string; organizacao: string; funcao: string; dataInicio: string; dataFim: string; }
interface Idioma { id?: string; nomeIdioma: string; nivelProficiencia: string; }

export default function EditProfileScreen({ navigation, route }: any) {
    const { colors } = useTheme();
    const { profileData } = route.params || {};

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Modais de Adição
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState('');
    const [tempItem, setTempItem] = useState<any>({});

    // --- ESTADOS DO PERFIL ---
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [resumo, setResumo] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');

    // Listas
    const [skills, setSkills] = useState<Skill[]>([]);
    const [experiencias, setExperiencias] = useState<Experiencia[]>([]);
    const [formacoes, setFormacoes] = useState<Formacao[]>([]);
    const [voluntariados, setVoluntariados] = useState<Voluntariado[]>([]);
    const [idiomas, setIdiomas] = useState<Idioma[]>([]);

    const [newSkillText, setNewSkillText] = useState('');

    useEffect(() => {
        loadFullProfile();
    }, []);

    const loadFullProfile = async () => {
        setLoading(true);
        try {
            if (profileData) populateForm(profileData);
            const response = await api.get('/candidate/profile/me');
            populateForm(response.data);
        } catch (error) {
            console.log("Usando dados locais/cache");
        } finally {
            setLoading(false);
        }
    };

    const populateForm = (data: any) => {
        if (!data) return;
        setNome(data.nome || '');
        setEmail(data.email || '');
        setCidade(data.cidade || '');
        setEstado(data.estado || '');
        setResumo(data.resumoPerfil || '');
        setSkills(data.skills || []);
        setExperiencias(data.experiencias || []);
        setFormacoes(data.formacoes || []);
        setVoluntariados(data.voluntariados || []);
        setIdiomas(data.idiomas || []);
    };

    const getInitials = (fullName: string) => {
        if (!fullName) return "C";
        const names = fullName.trim().split(' ');
        if (names.length === 1) return names[0].substring(0, 2).toUpperCase();
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    };

    // --- GERENCIAMENTO DE ITENS ---
    const handleAddSkill = () => {
        const text = newSkillText.trim();
        if (text.length > 0 && !skills.some(s => s.nome.toLowerCase() === text.toLowerCase())) {
            setSkills([...skills, { nome: text, tipoSkill: 'HARD_SKILL' }]);
            setNewSkillText('');
        }
    };
    const handleRemoveSkill = (name: string) => setSkills(skills.filter(s => s.nome !== name));

    const openModal = (type: string) => {
        setModalType(type);
        setTempItem({});
        setModalVisible(true);
    };

    const handleAddItem = () => {
        if (modalType === 'EXPERIENCIA') {
            setExperiencias([...experiencias, {
                ...tempItem,
                empresa: { nomeFantasia: tempItem.empresaName }, // Ajuste para estrutura da API
                tipoEmprego: 'TEMPO_INTEGRAL' // Default
            }]);
        } else if (modalType === 'EDUCACAO') {
            setFormacoes([...formacoes, tempItem]);
        } else if (modalType === 'VOLUNTARIADO') {
            setVoluntariados([...voluntariados, tempItem]);
        } else if (modalType === 'IDIOMA') {
            setIdiomas([...idiomas, tempItem]);
        }
        setModalVisible(false);
    };

    const handleRemoveItem = (listName: string, index: number) => {
        if (listName === 'EXPERIENCIA') setExperiencias(experiencias.filter((_, i) => i !== index));
        if (listName === 'EDUCACAO') setFormacoes(formacoes.filter((_, i) => i !== index));
        if (listName === 'VOLUNTARIADO') setVoluntariados(voluntariados.filter((_, i) => i !== index));
        if (listName === 'IDIOMA') setIdiomas(idiomas.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                resumoPerfil: resumo,
                resumoInclusivoIA: resumo,
                cidade,
                estado,
                skills,
                experiencias,
                formacoes,
                voluntariados,
                idiomas
            };
            await api.put('/candidate/profile/me', payload);
            Alert.alert("Sucesso", "Perfil atualizado!");
            navigation.goBack();
        } catch (error) {
            Alert.alert("Erro", "Falha ao salvar. Tente novamente.");
        } finally {
            setSaving(false);
        }
    };

    // --- RENDERIZADORES ---
    const renderListItem = (title: string, subtitle: string, onDelete: () => void, icon: any) => (
        <View style={[styles.listItem, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <View style={[styles.listIconBox, { backgroundColor: colors.card }]}>
                <Ionicons name={icon} size={20} color={colors.text} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={[styles.listTitle, { color: colors.text }]}>{title}</Text>
                <Text style={[styles.listSub, { color: colors.text }]}>{subtitle}</Text>
            </View>
            <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={18} color="#FF3B30" />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} disabled={saving}>
                    <Text style={{ color: colors.text, fontSize: 16 }}>Cancelar</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Editar Perfil</Text>
                <TouchableOpacity onPress={handleSave} disabled={saving}>
                    {saving ? <ActivityIndicator size="small" color={colors.primary} /> :
                        <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>Concluir</Text>}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                    {/* Avatar Fixo */}
                    <View style={styles.avatarSection}>
                        <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
                            <Text style={styles.avatarText}>{getInitials(nome)}</Text>
                        </View>
                        <Text style={{ color: colors.text, opacity: 0.5, fontSize: 12 }}>Nome e E-mail são gerenciados pelo sistema</Text>
                    </View>

                    {/* Dados Básicos (Read Only e Editáveis) */}
                    <Text style={[styles.sectionLabel, { color: colors.text }]}>Informações Básicas</Text>
                    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={[styles.readOnlyRow, { borderBottomColor: colors.border }]}>
                            <Text style={[styles.readOnlyLabel, { color: colors.text }]}>Nome</Text>
                            <Text style={[styles.readOnlyValue, { color: colors.text }]}>{nome}</Text>
                            <Ionicons name="lock-closed" size={14} color={colors.text} style={{ opacity: 0.3 }} />
                        </View>
                        <View style={[styles.readOnlyRow, { borderBottomColor: colors.border }]}>
                            <Text style={[styles.readOnlyLabel, { color: colors.text }]}>E-mail</Text>
                            <Text style={[styles.readOnlyValue, { color: colors.text }]}>{email}</Text>
                            <Ionicons name="lock-closed" size={14} color={colors.text} style={{ opacity: 0.3 }} />
                        </View>
                        <View style={styles.editRow}>
                            <View style={{ flex: 1, marginRight: 10 }}>
                                <Text style={[styles.inputLabel, { color: colors.primary }]}>Cidade</Text>
                                <TextInput style={[styles.input, { color: colors.text }]} value={cidade} onChangeText={setCidade} placeholder="Sua cidade" placeholderTextColor="#999" />
                            </View>
                            <View style={{ width: 80 }}>
                                <Text style={[styles.inputLabel, { color: colors.primary }]}>UF</Text>
                                <TextInput style={[styles.input, { color: colors.text }]} value={estado} onChangeText={setEstado} placeholder="SP" maxLength={2} placeholderTextColor="#999" />
                            </View>
                        </View>
                    </View>

                    {/* Resumo */}
                    <Text style={[styles.sectionLabel, { color: colors.text }]}>Resumo Profissional</Text>
                    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: 0 }]}>
                        <TextInput
                            style={[styles.textArea, { color: colors.text }]}
                            placeholder="Escreva um breve resumo sobre sua trajetória, objetivos e paixões. Nossa IA usará isso para encontrar as melhores vagas."
                            value={resumo}
                            onChangeText={setResumo}
                            multiline
                            textAlignVertical="top"
                            placeholderTextColor="#999"
                        />
                    </View>

                    {/* Skills */}
                    <Text style={[styles.sectionLabel, { color: colors.text }]}>Habilidades & Competências</Text>
                    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <View style={styles.addSkillRow}>
                            <TextInput
                                style={[styles.skillInput, { color: colors.text }]}
                                value={newSkillText}
                                onChangeText={setNewSkillText}
                                placeholder="Adicionar skill (ex: Java, Liderança)"
                                placeholderTextColor="#999"
                                onSubmitEditing={handleAddSkill}
                            />
                            <TouchableOpacity onPress={handleAddSkill}>
                                <Ionicons name="add-circle" size={32} color={colors.primary} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.tagsRow}>
                            {skills.map((s, i) => (
                                <TouchableOpacity key={i} style={[styles.tag, { borderColor: colors.border, backgroundColor: colors.background }]} onPress={() => handleRemoveSkill(s.nome)}>
                                    <Text style={[styles.tagText, { color: colors.text }]}>{s.nome}</Text>
                                    <Ionicons name="close" size={14} color={colors.text} style={{ opacity: 0.5 }} />
                                </TouchableOpacity>
                            ))}
                            {skills.length === 0 && <Text style={{ opacity: 0.4, color: colors.text, fontSize: 13 }}>Nenhuma skill adicionada.</Text>}
                        </View>
                    </View>

                    {/* Seções Dinâmicas */}
                    <View style={styles.dynamicSection}>
                        <View style={styles.listSectionHeader}>
                            <Text style={[styles.sectionLabel, { color: colors.text, marginTop: 0 }]}>Experiência</Text>
                            <TouchableOpacity onPress={() => openModal('EXPERIENCIA')} style={styles.addBtnSmall}>
                                <Ionicons name="add" size={20} color={colors.primary} />
                                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Adicionar</Text>
                            </TouchableOpacity>
                        </View>
                        {experiencias.map((xp, i) => renderListItem(xp.tituloCargo, `${xp.empresa?.nomeFantasia} • ${xp.dataInicio}`, () => handleRemoveItem('EXPERIENCIA', i), 'briefcase'))}
                    </View>

                    <View style={styles.dynamicSection}>
                        <View style={styles.listSectionHeader}>
                            <Text style={[styles.sectionLabel, { color: colors.text, marginTop: 0 }]}>Formação Acadêmica</Text>
                            <TouchableOpacity onPress={() => openModal('EDUCACAO')} style={styles.addBtnSmall}>
                                <Ionicons name="add" size={20} color={colors.primary} />
                                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Adicionar</Text>
                            </TouchableOpacity>
                        </View>
                        {formacoes.map((edu, i) => renderListItem(edu.nomeInstituicao, `${edu.grau} • ${edu.areaEstudo}`, () => handleRemoveItem('EDUCACAO', i), 'school'))}
                    </View>

                    <View style={styles.dynamicSection}>
                        <View style={styles.listSectionHeader}>
                            <Text style={[styles.sectionLabel, { color: colors.text, marginTop: 0 }]}>Idiomas</Text>
                            <TouchableOpacity onPress={() => openModal('IDIOMA')} style={styles.addBtnSmall}>
                                <Ionicons name="add" size={20} color={colors.primary} />
                                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Adicionar</Text>
                            </TouchableOpacity>
                        </View>
                        {idiomas.map((idioma, i) => renderListItem(idioma.nomeIdioma, idioma.nivelProficiencia, () => handleRemoveItem('IDIOMA', i), 'language'))}
                    </View>

                    <View style={styles.dynamicSection}>
                        <View style={styles.listSectionHeader}>
                            <Text style={[styles.sectionLabel, { color: colors.text, marginTop: 0 }]}>Voluntariado</Text>
                            <TouchableOpacity onPress={() => openModal('VOLUNTARIADO')} style={styles.addBtnSmall}>
                                <Ionicons name="add" size={20} color={colors.primary} />
                                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Adicionar</Text>
                            </TouchableOpacity>
                        </View>
                        {voluntariados.map((vol, i) => renderListItem(vol.funcao, vol.organizacao, () => handleRemoveItem('VOLUNTARIADO', i), 'heart'))}
                    </View>

                    <View style={{ height: 60 }} />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* MODAL DE ADIÇÃO */}
            <Modal visible={modalVisible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>
                            {modalType === 'EXPERIENCIA' ? 'Nova Experiência' :
                                modalType === 'EDUCACAO' ? 'Nova Formação' :
                                    modalType === 'IDIOMA' ? 'Novo Idioma' : 'Novo Voluntariado'}
                        </Text>

                        <ScrollView>
                            {modalType === 'EXPERIENCIA' && (
                                <>
                                    <TextInput style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]} placeholder="Cargo (Ex: Dev Pleno)" placeholderTextColor="#999" onChangeText={t => setTempItem({ ...tempItem, tituloCargo: t })} />
                                    <TextInput style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]} placeholder="Empresa" placeholderTextColor="#999" onChangeText={t => setTempItem({ ...tempItem, empresaName: t })} />
                                    <View style={{ flexDirection: 'row', gap: 10 }}>
                                        <TextInput style={[styles.modalInput, { flex: 1, color: colors.text, borderColor: colors.border }]} placeholder="Início (AAAA-MM-DD)" placeholderTextColor="#999" onChangeText={t => setTempItem({ ...tempItem, dataInicio: t })} />
                                        <TextInput style={[styles.modalInput, { flex: 1, color: colors.text, borderColor: colors.border }]} placeholder="Fim (AAAA-MM-DD)" placeholderTextColor="#999" onChangeText={t => setTempItem({ ...tempItem, dataFim: t })} />
                                    </View>
                                </>
                            )}
                            {modalType === 'EDUCACAO' && (
                                <>
                                    <TextInput style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]} placeholder="Instituição (Ex: FIAP)" placeholderTextColor="#999" onChangeText={t => setTempItem({ ...tempItem, nomeInstituicao: t })} />
                                    <TextInput style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]} placeholder="Curso / Área" placeholderTextColor="#999" onChangeText={t => setTempItem({ ...tempItem, areaEstudo: t })} />
                                    <TextInput style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]} placeholder="Grau (Ex: Bacharelado)" placeholderTextColor="#999" onChangeText={t => setTempItem({ ...tempItem, grau: t })} />
                                </>
                            )}
                            {modalType === 'IDIOMA' && (
                                <>
                                    <TextInput style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]} placeholder="Idioma (Ex: Inglês)" placeholderTextColor="#999" onChangeText={t => setTempItem({ ...tempItem, nomeIdioma: t })} />
                                    <TextInput style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]} placeholder="Nível (Ex: AVANCADO)" placeholderTextColor="#999" onChangeText={t => setTempItem({ ...tempItem, nivelProficiencia: t })} />
                                </>
                            )}
                            {modalType === 'VOLUNTARIADO' && (
                                <>
                                    <TextInput style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]} placeholder="Organização" placeholderTextColor="#999" onChangeText={t => setTempItem({ ...tempItem, organizacao: t })} />
                                    <TextInput style={[styles.modalInput, { color: colors.text, borderColor: colors.border }]} placeholder="Função" placeholderTextColor="#999" onChangeText={t => setTempItem({ ...tempItem, funcao: t })} />
                                </>
                            )}
                        </ScrollView>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalBtnCancel}>
                                <Text style={{ color: colors.text }}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleAddItem} style={[styles.modalBtnAdd, { backgroundColor: colors.primary }]}>
                                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>Adicionar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 25, borderBottomWidth: 1, alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 20 },

    avatarSection: { alignItems: 'center', marginBottom: 24 },
    avatarContainer: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    avatarText: { fontSize: 32, color: '#FFF', fontWeight: 'bold' },

    sectionLabel: { fontSize: 13, fontWeight: '700', marginBottom: 8, marginTop: 20, textTransform: 'uppercase', opacity: 0.5, letterSpacing: 0.5 },

    card: { borderRadius: 16, borderWidth: 1, padding: 16, overflow: 'hidden' },

    readOnlyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
    readOnlyLabel: { fontSize: 14, fontWeight: '600' },
    readOnlyValue: { fontSize: 14, opacity: 0.6 },

    editRow: { flexDirection: 'row', paddingTop: 12 },
    inputLabel: { fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
    input: { fontSize: 16, borderBottomWidth: 1, borderColor: '#DDD', paddingVertical: 4 },
    textArea: { fontSize: 16, minHeight: 100 },

    addSkillRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
    skillInput: { flex: 1, fontSize: 16, borderBottomWidth: 1, borderColor: '#DDD', paddingVertical: 8 },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    tag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, gap: 6 },
    tagText: { fontSize: 14 },

    dynamicSection: { marginBottom: 10 },
    listSectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 8 },
    addBtnSmall: { flexDirection: 'row', alignItems: 'center', gap: 4 },

    listItem: { flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
    listIconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    listTitle: { fontWeight: 'bold', fontSize: 15 },
    listSub: { fontSize: 13, opacity: 0.6 },
    deleteBtn: { padding: 8 },

    // Modal
    modalOverlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)', padding: 20 },
    modalContent: { padding: 24, borderRadius: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
    modalInput: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 12, fontSize: 16 },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 16, marginTop: 10 },
    modalBtnCancel: { padding: 10, justifyContent: 'center' },
    modalBtnAdd: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 }
});