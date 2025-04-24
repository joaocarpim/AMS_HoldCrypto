
'use client';

import { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '@/services/userService';
import UserList from '@/components/common/UserList';

export interface User {
  id: string;
  name: string;
  email: string;
}

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <UserList users={users} onDelete={handleDelete} />
    </div>
  );
}