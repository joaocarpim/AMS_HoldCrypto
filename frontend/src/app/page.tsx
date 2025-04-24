// Arquivo: src/app/page.tsx
'use client'; // Adicione esta linha no topo

import { useEffect, useState } from 'react';
import { getUsers } from '@/services/userService';

interface User {
  id: string;
  name: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.log('Erro ao buscar usuários', error);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Lista de Usuários</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}