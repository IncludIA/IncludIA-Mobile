import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export default function EditProfileScreen({ navigation, route }: any) {
    const { colors } = useTheme();
    const { profileData } = route.params || {};
    const [name, setName] = useState(profileData?.nome || '');
    const [cargo, setCargo] = useState(profileData?.cargo || '');
    const [bio, setBio] = useState(profileData?.resumo || '');

    const handleSave = () => {
        Alert.alert("Sucesso", "Perfil atualizado!");
        navigation.goBack();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="close" size={24} color={colors.text} /></TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Editar Perfil</Text>
                <TouchableOpacity onPress={handleSave}><Text style={{ color: colors.primary, fontWeight: 'bold' }}>Salvar</Text></TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 24 }}>
                <Text style={[styles.label, { color: colors.text }]}>Nome</Text>
                <TextInput style={[styles.input, { color: colors.text, backgroundColor: colors.card }]} value={name} onChangeText={setName} />

                <Text style={[styles.label, { color: colors.text }]}>Cargo</Text>
                <TextInput style={[styles.input, { color: colors.text, backgroundColor: colors.card }]} value={cargo} onChangeText={setCargo} />

                <Text style={[styles.label, { color: colors.text }]}>Sobre</Text>
                <TextInput style={[styles.input, { color: colors.text, backgroundColor: colors.card, height: 100 }]} multiline value={bio} onChangeText={setBio} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
    title: { fontWeight: 'bold', fontSize: 16 },
    label: { marginBottom: 8, fontWeight: '600' },
    input: { padding: 12, borderRadius: 10, marginBottom: 20 }
});