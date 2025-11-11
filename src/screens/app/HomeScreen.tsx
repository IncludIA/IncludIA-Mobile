import { useAuth } from '../../context/AuthContext';
import React, { useEffect } from 'react';
import { Text } from 'react-native';
import api from '../../services/apiService';

export default function HomeScreen() {
    const { userToken } = useAuth();

    useEffect(() => {
        const fetchVagas = async () => {
            const vagas = await api.get('/vagas', {
                headers: { 'Authorization': `Bearer ${userToken}` }
            });
        };
        fetchVagas();
    }, [userToken]);

    return (
        <Text>Bem-vindo à Home Screen!</Text>
    );
}