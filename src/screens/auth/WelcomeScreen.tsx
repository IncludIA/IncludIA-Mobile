import React, { useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions, Animated, Easing, Linking
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AppNavigation';
import { useTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

type Props = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

const { width } = Dimensions.get('window');

const GITHUB_REPO_URL = "https://github.com/IncludIA";

export default function WelcomeScreen({ navigation }: Props) {
    const { colors } = useTheme();

    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 3000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: -1,
                    duration: 3000,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 0,
                    duration: 1500,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                })
            ])
        ).start();
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-8deg', '8deg']
    });

    const handleOpenGithub = () => {
        Linking.openURL(GITHUB_REPO_URL).catch(err => console.error("Couldn't load page", err));
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>

            <View style={styles.heroSection}>

                <Animated.View
                    style={[
                        styles.iconContainer,
                        {
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            transform: [{ rotate: spin }]
                        }
                    ]}
                >
                    <Ionicons name="prism" size={64} color={colors.primary} />
                </Animated.View>

                <Text style={[styles.brandName, { color: colors.text }]}>Includ.IA</Text>

                <Text style={[styles.tagline, { color: colors.primary }]}>
                    Talento não tem viés.
                </Text>

                <Text style={[styles.description, { color: colors.text }]}>
                    Revolucionamos o recrutamento usando Inteligência Artificial para conectar potências invisíveis a oportunidades reais.
                    {"\n\n"}
                    Sem preconceitos. Apenas competência.
                </Text>
            </View>

            <View style={styles.bottomSection}>
                <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: colors.primary }]}
                    onPress={() => navigation.navigate('Cadastro')}
                >
                    <Text style={styles.primaryButtonText}>Começar Agora</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.secondaryButton, { borderColor: colors.border }]}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Já tenho uma conta</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleOpenGithub} activeOpacity={0.7}>
                    <Text style={styles.footerText}>
                        Powered by <Text style={{ fontWeight: 'bold', color: colors.primary, textDecorationLine: 'underline' }}>FIAP Global Solution</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
    },
    heroSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        paddingTop: 40,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    brandName: {
        fontSize: 42,
        fontWeight: '900',
        letterSpacing: -1,
        marginBottom: 8,
    },
    tagline: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 24,
        textTransform: 'uppercase',
        letterSpacing: 1,
        opacity: 0.9,
    },
    description: {
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 24,
        opacity: 0.7,
        maxWidth: width * 0.85,
    },
    bottomSection: {
        padding: 32,
        width: '100%',
        alignItems: 'center',
        gap: 16,
    },
    primaryButton: {
        width: '100%',
        height: 64,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    primaryButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secondaryButton: {
        width: '100%',
        height: 64,
        borderRadius: 20,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    footerText: {
        marginTop: 16,
        fontSize: 12,
        opacity: 0.6,
    }
});