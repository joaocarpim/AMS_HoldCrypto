import { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '@/services/userService';

interface User {
  id: string;
  name: string;
  email: string;
}

// Definindo as propriedades do componente
interface UserListProps {
  users: User[];
  onDelete: (id: string) => Promise<void>;
}

const UserList = ({ users, onDelete }: UserListProps) => {
  return (
    <div>
      <h1>Lista de Usuários</h1>
      <table className="min-w-full mt-4">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button
                  onClick={() => onDelete(user.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;