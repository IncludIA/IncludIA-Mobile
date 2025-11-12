import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/AppNavigation';

type Props = NativeStackScreenProps<ProfileStackParamList, 'PersonalProfile'>;

export default function PersonalProfileScreen({ navigation }: Props) {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.navigate('EditProfile')}
                >
                    <Ionicons name="pencil-outline" size={26} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.iconButton}
                    onPress={() => navigation.navigate('ConfigApp')}
                >
                    <Ionicons name="settings-outline" size={26} color="#333" />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                <Text>Tela de Perfil Pessoal</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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