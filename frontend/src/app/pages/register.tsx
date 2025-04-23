// Arquivo: app/pages/register.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register: handleRegister } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleRegister(formData.name, formData.email, formData.password);
      router.push('/login');
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-md w-96 space-y-4">
        <h1 className="text-2xl font-bold text-center">Registrar</h1>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nome"
          className="w-full p-2 bg-gray-700 text-white rounded"
        />
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
          className="w-full p-2 bg-gray-700 text-white rounded"
        />
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Senha"
          className="w-full p-2 bg-gray-700 text-white rounded"
        />
        <button type="submit" className="w-full bg-green-500 py-2 rounded-md text-white font-semibold hover:bg-green-600">
          Registrar
        </button>
      </form>
    </div>
  );
}