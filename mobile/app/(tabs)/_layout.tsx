import React from 'react';
import { Tabs } from 'expo-router';
import { User, DollarSign, TrendingUp, LayoutDashboard } from 'lucide-react-native';

// Este layout define a navegação por abas que só é vista APÓS o login.

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0f172a', // Cor do cabeçalho
          borderBottomColor: '#1e293b',
        },
        headerTitleStyle: {
          color: 'white',
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: '#0f172a', // Cor da barra de navegação inferior
          borderTopColor: '#1e293b',
          height: 90, // Altura ajustada para iOS
          paddingBottom: 15, // Espaçamento para o nome
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#F0B90B', // Amarelo (Ativo)
        tabBarInactiveTintColor: '#64748b', // Cinza (Inativo)
      }}
    >
      <Tabs.Screen
        name="dashboard" // Corresponde a dashboard.tsx
        options={{
          title: 'Visão Geral',
          tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="wallet" // Corresponde a wallet.tsx (Vamos criar depois)
        options={{
          title: 'Carteira',
          tabBarIcon: ({ color }) => <DollarSign color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="explore" // Rota que existia no template, vamos manter por enquanto
        options={{
          title: 'Mercados',
          tabBarIcon: ({ color }) => <TrendingUp color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile" // Exemplo de rota, para seu 'Meu Perfil'
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
      
      {/* O arquivo index.tsx (Login) e register.tsx NÃO DEVEM ser mostrados nas tabs após o login */}
      <Tabs.Screen name="index" options={{ href: null }} />
      <Tabs.Screen name="register" options={{ href: null }} />
      
    </Tabs>
  );
}