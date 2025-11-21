import React, { useState } from 'react';
import {
    View, Text, StyleSheet, Switch, SafeAreaView, TextInput, TouchableOpacity, Alert, Clipboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../../context/ThemeContext';

export default function TwoFactorScreen({ navigation }: any) {
    const { colors } = useTheme();

    const [isEnabled, setIsEnabled] = useState(false);
    const [step, setStep] = useState(0);
    const [code, setCode] = useState('');

    const SECRET_KEY = "JBSW Y3DP FQQH O33L";

    const handleToggle = (value: boolean) => {
        if (value) {
            setStep(1);
        } else {
            Alert.alert("Desativar 2FA", "Sua conta ficará menos segura. Confirmar?", [
                { text: "Cancelar", style: "cancel" },
                { text: "Desativar", style: "destructive", onPress: () => { setIsEnabled(false); setStep(0); } }
            ]);
        }
    };

    const copyToClipboard = () => {
        Clipboard.setString(SECRET_KEY);
        Alert.alert("Copiado", "Chave copiada para a área de transferência.");
    };

    const handleVerify = () => {
        if (code.length < 6) return Alert.alert("Erro", "Código inválido.");
        setIsEnabled(true);
        setStep(2);
        Alert.alert("Sucesso", "Autenticação de dois fatores ativada!");
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Autenticação em 2 Fatores</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.content}>
                {/* Header Switch */}
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.label, { color: colors.text }]}>Ativar 2FA</Text>
                        <Text style={styles.subLabel}>Aumente a segurança da sua conta exigindo um código extra ao entrar.</Text>
                    </View>
                    <Switch
                        value={isEnabled || step === 1}
                        onValueChange={handleToggle}
                        trackColor={{ false: "#767577", true: colors.primary }}
                        disabled={step === 2} // Se já ativado, clica para desativar no toggle
                    />
                </View>

                {/* PASSO 1: SETUP (Mostra Chave) */}
                {step === 1 && (
                    <View style={styles.setupContainer}>
                        <Text style={[styles.stepTitle, { color: colors.text }]}>Configuração</Text>
                        <Text style={[styles.stepDesc, { color: colors.text }]}>
                            Copie a chave abaixo e cole no seu aplicativo autenticador (Google Authenticator, Authy, etc).
                        </Text>

                        <TouchableOpacity style={[styles.keyBox, { backgroundColor: 'rgba(0,0,0,0.05)' }]} onPress={copyToClipboard}>
                            <Text style={[styles.keyText, { color: colors.primary }]}>{SECRET_KEY}</Text>
                            <Ionicons name="copy-outline" size={20} color={colors.primary} />
                        </TouchableOpacity>

                        <Text style={[styles.inputLabel, { color: colors.text }]}>Digite o código de 6 dígitos gerado:</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
                            placeholder="000000"
                            placeholderTextColor="#999"
                            keyboardType="number-pad"
                            maxLength={6}
                            value={code}
                            onChangeText={setCode}
                        />

                        <TouchableOpacity style={[styles.verifyBtn, { backgroundColor: colors.primary }]} onPress={handleVerify}>
                            <Text style={styles.verifyText}>Verificar e Ativar</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* PASSO 2: ATIVADO */}
                {step === 2 && (
                    <View style={styles.activeContainer}>
                        <Ionicons name="shield-checkmark" size={80} color="#34C759" />
                        <Text style={[styles.activeTitle, { color: colors.text }]}>Proteção Ativa</Text>
                        <Text style={styles.activeDesc}>
                            Sua conta está protegida. Solicitaremos um código sempre que detectarmos um login novo.
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, alignItems: 'center' },
    title: { fontSize: 16, fontWeight: 'bold' },
    content: { padding: 24 },

    card: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 30 },
    label: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
    subLabel: { fontSize: 12, opacity: 0.6, paddingRight: 10 },

    setupContainer: { marginTop: 10 },
    stepTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    stepDesc: { fontSize: 14, opacity: 0.7, lineHeight: 20, marginBottom: 20 },

    keyBox: { flexDirection: 'row', padding: 16, borderRadius: 12, justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderStyle: 'dashed', borderWidth: 1, borderColor: '#999' },
    keyText: { fontSize: 18, fontWeight: 'bold', letterSpacing: 2 },

    inputLabel: { fontSize: 14, fontWeight: '600', marginBottom: 10 },
    input: { height: 56, borderRadius: 12, borderWidth: 1, paddingHorizontal: 16, fontSize: 20, textAlign: 'center', letterSpacing: 5, marginBottom: 20 },

    verifyBtn: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    verifyText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

    activeContainer: { alignItems: 'center', marginTop: 40 },
    activeTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
    activeDesc: { textAlign: 'center', fontSize: 14, opacity: 0.6, paddingHorizontal: 20 }
});