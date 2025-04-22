'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as loginService, register as registerService } from '@/app/api/auth';
import { getUserData } from '@/app/api/user';

// Definição do tipo User
type User = {
  id: string;
  name: string;
  email: string;
};

// Definição do tipo AuthContextType
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

// Criação do contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar o contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provedor do contexto
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Função de login
  const login = async (email: string, password: string) => {
    try {
      const data = await loginService(email, password); // Assume que retorna { token: string }
      localStorage.setItem('token', data.token);
      const userData = await getUserData(data.token); // Assume que retorna User
      setUser(userData);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw new Error('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  // Função de registro
  const register = async (name: string, email: string, password: string) => {
    try {
      const data = await registerService(name, email, password); // Assume que retorna { token: string }
      localStorage.setItem('token', data.token);
      const userData = await getUserData(data.token); // Assume que retorna User
      setUser(userData);
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      throw new Error('Erro ao registrar usuário. Verifique os dados informados.');
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // Carregar usuário autenticado ao iniciar
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await getUserData(token); // Assume que retorna User
          setUser(userData);
        } catch (error) {
          console.error('Erro ao carregar usuário autenticado:', error);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Valor fornecido pelo contexto
  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};