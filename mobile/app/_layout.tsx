// mobile/app/_layout.tsx

import { Stack, Redirect, useSegments } from 'expo-router';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import React from 'react';
import { useAuthStoreIsHydrated, useIsAuthenticated } from '../src/features/auth/store/useAuthStore';
import { useInitializeAuth } from '../hooks/useInitializeAuth'; 

export default function RootLayout() {
    // 1. Inicializa a store
    useInitializeAuth(); 

    const isAuthenticated = useIsAuthenticated();
    const isHydrated = useAuthStoreIsHydrated();
    const segments = useSegments();

    // 2. Tela de Carregamento (Bloqueante)
    if (!isHydrated) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F0B90B" />
            </View>
        );
    }

    // 3. Lógica de Redirecionamento (Auth Gate)
    // Verifica em qual grupo de rotas estamos: (auth) ou (tabs)
    const inAuthGroup = segments[0] === '(auth)';

    // CASO A: Usuário NÃO logado tentando acessar área privada
    if (!isAuthenticated && !inAuthGroup) {
        // CORRIGIDO: Removida a barra do final. De "/(auth)/" para "/(auth)"
        return <Redirect href="/(auth)" />;
    }

    // CASO B: Usuário LOGADO tentando acessar login/registro
    if (isAuthenticated && inAuthGroup) {
        return <Redirect href="/(tabs)/dashboard" />;
    }

    // 4. Renderização do App
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#020617' }
            }}
        >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> 
            <Stack.Screen name="(auth)" options={{ headerShown: false }} /> 
            <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: true }} />
        </Stack>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: '#020617'
    }
});