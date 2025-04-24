// src/app/users/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
  photo: string;
}

export default function ListUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Chama o endpoint real para listar usuários
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao carregar usuários:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja deletar este usuário?")) {
      try {
        const res = await fetch(`/api/user/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setUsers(users.filter((user) => user.id !== id));
        } else {
          console.error("Erro ao deletar usuário");
        }
      } catch (err) {
        console.error("Falha na requisição de deletar:", err);
      }
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Usuários</h1>
      <Link
        href="/users/create"
        className="bg-black text-yellow-500 px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        Criar Novo Usuário
      </Link>
      <table className="w-full mt-4 border-collapse">
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
            <tr key={user.id} className="text-center">
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.phone}</td>
              <td className="border p-2">{user.address}</td>
              <td className="border p-2 space-x-2">
                <Link
                  href={`/users/edit/${user.id}`}
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
  );
}