// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';
import React from 'react';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Esconde o cabeçalho para as telas de login/registro
        contentStyle: {
            backgroundColor: '#020617', // Cor de fundo consistente
        }
      }}
    >
      {/* A tela 'index' do grupo (auth) é a rota padrão / (o Login) */}
      <Stack.Screen name="index" /> 
      
      {/* A tela 'register' */}
      <Stack.Screen name="register" /> 
    </Stack>
  );
}