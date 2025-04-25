'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Header() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setIsLoggedIn(true);
          setUserName(res.data.user); // ajuste conforme a resposta real
        })
        .catch((err) => {
          console.error('Erro ao buscar perfil:', err);
          setIsLoggedIn(false);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserName('');
    router.push('/login');
  };

  return (
    <header className="bg-black text-yellow-400 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-6 md:px-8">
        <Link href="/">
          <h1 className="text-4xl font-bold uppercase tracking-wide hover:text-yellow-500 transition duration-300 cursor-pointer">
            AMS HoldCrypto
          </h1>
        </Link>

        <nav className="flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              <span className="text-lg font-semibold text-yellow-400">
                Olá, {userName}
              </span>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 text-white font-medium rounded-lg shadow hover:bg-red-700 transition duration-300"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <button className="px-6 py-2 bg-yellow-400 text-black font-medium rounded-lg shadow hover:bg-yellow-500 transition duration-300">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="px-6 py-2 bg-yellow-400 text-black font-medium rounded-lg shadow hover:bg-yellow-500 transition duration-300">
                  Registrar-se
                </button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
