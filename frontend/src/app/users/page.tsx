// Arquivo: src/app/users/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getUsers } from '../services/userService';
import UserItem from '../components/UserItem';
import useAuth from '../api/auth';

const UsersPage = () => {
  const [users, setUsers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useAuth(); // Hook para proteger a rota

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUsers = async () => {
      try {
        const response = await getUsers(token!); // Certifique-se de que token não é undefined
        setUsers(response);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    } else {
      alert('Você precisa estar logado para acessar a lista de usuários.');
      window.location.href = '/login';
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center text-binance-blue mb-8">Lista de Usuários</h1>
      {loading ? (
        <p className="text-center text-white">Carregando...</p>
      ) : (
        <ul className="space-y-4">
          {users.map((user) => (
            <UserItem key={user.id} user={user} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default UsersPage;