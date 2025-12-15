// mobile/app/(tabs)/_layout.tsx

import React from 'react';
import { Tabs } from 'expo-router';
import { User, DollarSign, TrendingUp, LayoutDashboard } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true, // Mantemos o cabeçalho da aba
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
          height: 90, // Altura ajustada para iOS/Android modernos
          paddingBottom: 15,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#F0B90B', // Amarelo (Ativo)
        tabBarInactiveTintColor: '#64748b', // Cinza (Inativo)
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Visão Geral',
          tabBarIcon: ({ color }) => <LayoutDashboard color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: 'Carteira',
          tabBarIcon: ({ color }) => <DollarSign color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Mercados',
          tabBarIcon: ({ color }) => <TrendingUp color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
      
      {/* REMOVIDO: index e register não existem mais nesta pasta! */}
      
    </Tabs>
  );
}