// Arquivo: src/app/components/Dashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { getUserById } from '../services/userService';
import { User } from '../types/user'; // Importe o tipo User aqui

const Dashboard = () => {
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const fetchUser = async () => {
      try {
        if (token && userId) {
          const userData = await getUserById(userId, token);
          setUserData(userData);
        } else {
          alert('Você precisa estar logado para acessar o dashboard.');
          window.location.href = '/login';
        }
      } catch (error) {
        console.error(error);
        alert('Erro ao carregar os dados do usuário. Por favor, faça login novamente.');
        window.location.href = '/login';
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-binance-blue mb-8">Dashboard</h1>
      {userData ? (
        <div className="bg-binance-gray p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-white mb-2">Bem-vindo, {userData.name}</h2>
          <p className="text-sm text-white">Email: {userData.email}</p>
        </div>
      ) : (
        <p className="text-center text-white">Carregando...</p>
      )}
    </div>
  );
};

export default Dashboard;