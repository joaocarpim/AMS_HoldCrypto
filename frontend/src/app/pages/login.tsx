'use client';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login: handleLogin } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      await handleLogin(formData.email, formData.password);
      router.push('/dashboard');
    } catch (error) {
      setError('Email ou senha inválidos.');
      console.error('Erro ao fazer login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-black-primary text-yellow-primary min-h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 p-8 bg-black-primary rounded-lg shadow-lg border border-yellow-primary">
        <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Email"
          className="input"
        />
        <input
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          placeholder="Senha"
          className="input"
        />
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className={`btn w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}