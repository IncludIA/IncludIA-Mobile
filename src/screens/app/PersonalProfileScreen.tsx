import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import { ProfileStackParamList } from '../../navigation/AppTabNavigator';

type Props = NativeStackScreenProps<ProfileStackParamList, 'PersonalProfile'>;

export default function PersonalProfileScreen({ navigation }: Props) {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.navigate('EditProfile')}
                >
                    <Ionicons name="pencil-outline" size={26} color={colors.text} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.navigate('ConfigApp')}
                >
                    <Ionicons name="settings-outline" size={26} color={colors.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text style={{ color: colors.text }}>Tela de Perfil Pessoal</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: 60,
        paddingHorizontal: 20,
        position: 'absolute',
        top: 0,
        zIndex: 1,
    },
    iconButton: {
        padding: 5,
        marginLeft: 15,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});