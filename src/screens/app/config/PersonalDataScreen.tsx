import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../context/ThemeContext';

export default function PersonalDataScreen({ navigation }: any) {
    const { colors } = useTheme();

    // Mock de dados (em produção viria do Contexto ou API)
    const userData = {
        nome: "Alex Pereira",
        cpf: "123.***.***-99",
        email: "alex@dev.com",
        telefone: "(11) 99999-9999",
        endereco: "São Paulo, SP"
    };

    const DataRow = ({ label, value, icon }: any) => (
        <View style={[styles.row, { borderBottomColor: colors.border }]}>
            <View style={[styles.iconBox, { backgroundColor: 'rgba(0,0,0,0.05)' }]}>
                <Ionicons name={icon} size={20} color={colors.text} />
            </View>
            <View>
                <Text style={styles.label}>{label}</Text>
                <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color={colors.text} /></TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Dados Pessoais</Text>
                <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                    <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Editar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <DataRow label="Nome Completo" value={userData.nome} icon="person-outline" />
                    <DataRow label="CPF" value={userData.cpf} icon="card-outline" />
                    <DataRow label="E-mail" value={userData.email} icon="mail-outline" />
                    <DataRow label="Telefone" value={userData.telefone} icon="call-outline" />
                    <DataRow label="Localização" value={userData.endereco} icon="location-outline" />
                </View>

                <Text style={styles.infoText}>
                    Alguns dados como CPF não podem ser alterados pelo aplicativo por motivos de segurança. Entre em contato com o suporte.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
    title: { fontSize: 18, fontWeight: 'bold' },
    content: { padding: 20 },
    card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden' },
    row: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 16, borderBottomWidth: 1 },
    iconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    label: { fontSize: 12, opacity: 0.6, marginBottom: 2 },
    value: { fontSize: 16, fontWeight: '500' },
    infoText: { marginTop: 16, fontSize: 12, opacity: 0.5, textAlign: 'center', paddingHorizontal: 20 }
});