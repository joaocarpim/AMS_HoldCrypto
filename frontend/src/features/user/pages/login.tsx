'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/shared/components/Header';
import Footer from '@/shared/components/Footer';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      router.push('/users');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 transition-all duration-500 hover:shadow-yellow-400/40 hover:scale-[1.025]">
          <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-10 tracking-tight drop-shadow">
            Faça seu Login
          </h2>
          <form onSubmit={handleLogin} className="space-y-8" aria-label="Login Form">
            <div>
              <label htmlFor="email" className="block text-base font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-black bg-gray-50 transition-all duration-300"
                required
                aria-required="true"
                aria-label="Email"
                disabled={loading}
              />
            </div>
<div className="relative flex flex-col gap-1">
  <label htmlFor="password" className="block text-base font-semibold text-gray-700">
    Senha
  </label>
  <input
    type={showPassword ? "text" : "password"}
    id="password"
    autoComplete="current-password"
    value={password}
    onChange={e => setPassword(e.target.value)}
    className="w-full h-12 px-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 text-black bg-gray-50 transition-all duration-300 pr-12"
    required
    aria-required="true"
    aria-label="Senha"
    disabled={loading}
  />
  <button
  type="button"
  tabIndex={-1}
className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center text-gray-500 hover:text-yellow-500 transition"  onClick={() => setShowPassword(v => !v)}
  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
  disabled={loading}
  style={{ pointerEvents: loading ? "none" : "auto" }}
>
  {showPassword ? (
    // Olho aberto
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    // Olho fechado
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m1.414-1.414A9.956 9.956 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.043 5.197M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6.364 6.364L6 18m12-12l-1.636 1.636" />
    </svg>
  )}
</button>
</div>
            {error && (
              <p className="text-red-600 text-center text-base font-semibold bg-red-50 border border-red-200 rounded-lg py-2 px-3 shadow-sm animate-pulse">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 active:scale-95 text-black font-bold py-3 rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              disabled={loading}
              aria-busy={loading}
            >
              {loading && (
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              )}
              Entrar
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}