// Arquivo: src/components/common/UserList.tsx
import React from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserListProps {
  users: User[];
  onDelete: (id: string) => Promise<void>;
}

const UserList = ({ users, onDelete }: UserListProps) => {
  return (
    <table className="min-w-full mt-4">
      <thead>
        <tr>
          <th className="border p-2 text-yellow-primary">Nome</th>
          <th className="border p-2 text-yellow-primary">Email</th>
          <th className="border p-2 text-yellow-primary">Ações</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td className="border p-2 text-yellow-primary">{user.name}</td>
            <td className="border p-2 text-yellow-primary">{user.email}</td>
            <td className="border p-2">
              <button
                onClick={() => onDelete(user.id)}
                className="btn bg-red-500 text-white"
              >
                Excluir
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserList;