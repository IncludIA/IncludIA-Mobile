import React, { useState } from 'react';
import {
    View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView,
    Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';
import api from '../../../../services/api';

export default function ChangePasswordScreen({ navigation }: any) {
    const { colors } = useTheme();

    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);

    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!currentPass || !newPass || !confirmPass) {
            return Alert.alert("Erro", "Preencha todos os campos.");
        }
        if (newPass !== confirmPass) {
            return Alert.alert("Erro", "A nova senha e a confirmação não coincidem.");
        }
        if (newPass.length < 8) {
            return Alert.alert("Senha Fraca", "A nova senha deve ter pelo menos 8 caracteres.");
        }

        setLoading(true);
        try {
            // Chamada para sua API Java (Necessário criar endpoint no AuthController)
            await api.post('/auth/change-password', {
                oldPassword: currentPass,
                newPassword: newPass
            });

            Alert.alert("Sucesso", "Sua senha foi atualizada.");
            navigation.goBack();
        } catch (error: any) {
            Alert.alert("Erro", "Senha atual incorreta ou falha no servidor.");
        } finally {
            setLoading(false);
        }
    };

    const PasswordInput = ({ label, value, onChange, show, onToggle }: any) => (
        <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <TextInput
                    style={[styles.input, { color: colors.text }]}
                    value={value}
                    onChangeText={onChange}
                    secureTextEntry={!show}
                    placeholder="********"
                    placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={onToggle} style={styles.eyeBtn}>
                    <Ionicons name={show ? "eye-off" : "eye"} size={20} color={colors.text} style={{ opacity: 0.6 }} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Alterar Senha</Text>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
                <View style={styles.content}>
                    <Text style={styles.description}>
                        Crie uma senha forte com no mínimo 8 caracteres, contendo letras e números para sua segurança.
                    </Text>

                    <PasswordInput
                        label="Senha Atual"
                        value={currentPass}
                        onChange={setCurrentPass}
                        show={showCurrent}
                        onToggle={() => setShowCurrent(!showCurrent)}
                    />

                    <View style={styles.divider} />

                    <PasswordInput
                        label="Nova Senha"
                        value={newPass}
                        onChange={setNewPass}
                        show={showNew}
                        onToggle={() => setShowNew(!showNew)}
                    />

                    <PasswordInput
                        label="Confirmar Nova Senha"
                        value={confirmPass}
                        onChange={setConfirmPass}
                        show={showNew}
                        onToggle={() => setShowNew(!showNew)}
                    />

                    <TouchableOpacity
                        style={[styles.saveBtn, { backgroundColor: colors.primary }]}
                        onPress={handleChangePassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.saveText}>Atualizar Senha</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
    backBtn: { padding: 4 },
    title: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 24 },
    description: { fontSize: 14, opacity: 0.6, lineHeight: 20, marginBottom: 30 },

    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, height: 56 },
    input: { flex: 1, paddingHorizontal: 16, fontSize: 16, height: '100%' },
    eyeBtn: { padding: 16 },

    divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.1)', marginVertical: 10 },

    saveBtn: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 20, shadowColor: "#000", shadowOpacity: 0.2, elevation: 4 },
    saveText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});