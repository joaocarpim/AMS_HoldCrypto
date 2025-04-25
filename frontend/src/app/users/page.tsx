// src/app/users/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import userService, { User } from "D:\\AMS_HoldCryptoB.O2\\AMS_HoldCrypto\\frontend\\src\\services\\apis\\userService";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function ListUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const data = await userService.getAll();
        setUsers(data);
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 401) {
          router.push('/login');
        } else {
          setError('Erro ao carregar usuários.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);


  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      try {
        await userService.delete(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } catch (err) {
        console.error(err);
        alert('Falha ao deletar usuário.');
      }
    }
  };

  if (loading) {
    return <p className="p-8 text-center">Carregando usuários...</p>;
  }

  if (error) {
    return <p className="p-8 text-center text-red-500">{error}</p>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <button
          onClick={() => router.push('/create-user')}
          className="bg-black text-yellow-500 px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          Criar Novo
        </button>
      </div>

      {users.length === 0 ? (
        <p>Nenhum usuário encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-black text-yellow-500">
                <th className="border p-2">ID</th>
                <th className="border p-2">Nome</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Telefone</th>
                <th className="border p-2">Endereço</th>
                <th className="border p-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="text-center hover:bg-gray-100">
                  <td className="border p-2">{user.id}</td>
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.phone}</td>
                  <td className="border p-2">{user.address}</td>
                  <td className="border p-2 space-x-2">
                    <Link
                      href={`/edit-user/${user.id}`}
                      className="bg-yellow-500 text-black px-2 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Editar
                    </Link>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                    >
                      Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}