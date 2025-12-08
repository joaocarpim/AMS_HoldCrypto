// Caminho: frontend/src/shared/api/apiClient.ts

import axios from 'axios';
// 1. Importar o store diretamente (NÃO o hook)
import { useAuthStore } from '@/features/auth/store/useAuthStore'; // Ajuste o caminho se necessário

// 2. Definimos a URL base do seu Gateway API.
const API_BASE_URL = 'http://localhost:5026';

// 3. Criamos a instância do axios.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 4. Interceptor de REQUISIÇÃO (Este você já tinha)
// Adiciona o token JWT em TODAS as requisições
apiClient.interceptors.request.use(
  (config) => {
    // Pega o token diretamente do store Zustand ou do localStorage
    // Usar o store é melhor caso o token seja atualizado em memória
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

// 5. NOVO: Interceptor de RESPOSTA (A Solução para o 401)
// Observa todas as respostas que chegam da API
apiClient.interceptors.response.use(
  (response) => {
    // Se a resposta for 2xx (Sucesso), apenas a repassa
    return response;
  },
  (error) => {
    // Se a API retornar um erro
    const { response } = error;

    // Verifica se o erro é um 401 (Não Autorizado / Token Expirado)
    if (response && response.status === 401) {
      console.warn("apiClient Interceptor: Erro 401 (Não Autorizado) detetado. Token expirado ou inválido. Executando logout...");

      // Pega a ação de logout DIRETAMENTE do store (não podemos usar hooks aqui)
      const { logout } = useAuthStore.getState().actions;
      
      // Chama a ação de logout
      // Isso limpará o token do localStorage e resetará o estado do Zustand
      logout();

      // Redireciona o usuário para a página de login
      if (typeof window !== 'undefined') {
        // Usamos replace para não adicionar a página "morta" ao histórico do navegador
        // Verificamos se já não estamos no login para evitar loops
        if (window.location.pathname !== '/login') {
          window.location.replace('/login?sessionExpired=true'); // Adiciona um parâmetro (opcional)
        }
      }
    }

    // Repassa o erro original para que a função que fez a chamada (ex: o handleSubmit)
    // ainda possa recebê-lo e tratar (ex: parar o loading, mostrar notificação)
    return Promise.reject(error);
  }
);

export default apiClient;