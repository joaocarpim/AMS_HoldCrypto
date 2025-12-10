import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button } from 'react-native'; 
import { useAuthUser, useAuthActions } from '../../src/features/auth/store/useAuthStore';

export default function DashboardScreen() {
    const user = useAuthUser();
    const { logout, fetchProfile } = useAuthActions();

    // CORREÇÃO: Chamamos fetchProfile APENAS se ele for uma função definida
    useEffect(() => {
        if (typeof fetchProfile === 'function') {
             fetchProfile();
        }
    }, [fetchProfile]);
    
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Olá, {user.name || 'Usuário'}</Text>
                <Text style={styles.role}>{user.role || 'Trader'}</Text>
            </View>

            <View style={styles.content}>
                <Text style={styles.successText}>✅ LOGIN BEM-SUCEDIDO!</Text>
                <Text style={styles.tipText}>Essa é a rota /dashboard. Agora vamos preencher com o seu saldo.</Text>
            </View>

            <View style={styles.logoutContainer}>
                <Button title="Sair / Testar Logout" onPress={() => logout()} color="#ff6b6b" />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617', // Fundo escuro
        padding: 16,
    },
    header: {
        marginBottom: 20,
        paddingTop: 10,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#F0B90B', // Amarelo
    },
    role: {
        fontSize: 14,
        color: '#9ca3af',
        textTransform: 'uppercase',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#22c55e', // Verde
        marginBottom: 10,
    },
    tipText: {
        color: '#6b7280',
        textAlign: 'center',
        fontSize: 14,
    },
    logoutContainer: {
        paddingVertical: 10,
    }
});