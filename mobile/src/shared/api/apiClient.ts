// Caminho: frontend/src/shared/api/apiClient.ts

import axios from 'axios';
// Importar o store diretamente
import { useAuthStore } from '@/features/auth/store/useAuthStore'; 

// --- CORREÇÃO AQUI ---
// Adicionamos '/api' ao final. Agora o axios montará URLs como:
// http://localhost:5026/api/auth/login
const API_BASE_URL = 'http://localhost:5026/api';

// Criamos a instância do axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de REQUISIÇÃO
// Adiciona o token JWT em TODAS as requisições
apiClient.interceptors.request.use(
  (config) => {
    // Pega o token do store Zustand ou localStorage
    const token = useAuthStore.getState().token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de RESPOSTA
// Lida com erros globais, principalmente o 401 (Token Expirado)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    // Verifica se o erro é um 401 (Não Autorizado)
    if (response && response.status === 401) {
      console.warn("apiClient: Sessão expirada (401). Realizando logout...");

      const { logout } = useAuthStore.getState().actions;
      
      // Limpa estado e storage
      logout();

      // Redireciona para login
      if (typeof window !== 'undefined') {
        if (window.location.pathname !== '/login') {
          window.location.replace('/login?sessionExpired=true');
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;