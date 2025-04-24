// Arquivo: src/app/pages/register.tsx
import { useRouter } from 'next/router';
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
    <div className="p-8 bg-black-primary text-yellow-primary min-h-screen flex justify-center items-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 p-8 bg-black-primary rounded-lg shadow-lg border border-yellow-primary">
        <h1 className="text-3xl font-bold mb-6 text-center">Registrar</h1>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Nome"
          className="input"
        />
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
        <button type="submit" className="btn w-full">
          Registrar
        </button>
      </form>
    </div>
  );
}