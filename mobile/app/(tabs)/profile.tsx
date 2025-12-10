// mobile/app/(tabs)/profile.tsx

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native'; 

export default function ProfileScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Página de Perfil (Em Desenvolvimento)</Text>
                <Text style={styles.subtitle}>Esta aba está configurada corretamente no Layout.</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F0B90B',
        marginBottom: 10,
    },
    subtitle: {
        color: '#9ca3af',
        fontSize: 14,
    }
});