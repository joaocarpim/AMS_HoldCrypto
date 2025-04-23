// Arquivo: app/pages/login.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login: handleLogin } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleLogin(formData.email, formData.password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-md w-96 space-y-4">
        <h1 className="text-2xl font-bold text-center">Login</h1>
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
        <button type="submit" className="w-full bg-blue-500 py-2 rounded-md text-white font-semibold hover:bg-blue-600">
          Entrar
        </button>
      </form>
    </div>
  );
}