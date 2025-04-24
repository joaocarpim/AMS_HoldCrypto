// Arquivo: src/app/components/RegisterForm.tsx
'use client';

import React from 'react';
import { useState } from 'react';
import { registerUser } from '../services/userService';
import { useRouter } from 'next/navigation';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await registerUser({ name, email, password });
      alert('Usuário registrado com sucesso!');
      router.push('/login');
    } catch (error) {
      console.error(error);
      alert('Erro ao registrar usuário');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-6 bg-binance-gray rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Registrar</h2>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-white">
          Nome
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-white">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="block text-sm font-medium text-white">
          Senha
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          required
        />
      </div>
      <button type="submit" className="btn w-full">
        Registrar
      </button>
    </form>
  );
};

export default RegisterForm;