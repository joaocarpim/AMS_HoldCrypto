// mobile/src/services/api.ts

import axios from 'axios';

// Confirme se o IP continua este
export const API_URL = 'http://192.168.0.11:5026/api'; 

const api = axios.create({
  baseURL: API_URL,
});

// --- INTERCEPTOR DE REQUEST (Injeta o Token) ---
api.interceptors.request.use(async (config) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useAuthStore } = require('../features/auth/store/useAuthStore');
    
    // Pega o token da Store
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // console.log(`🔑 Token anexado para: ${config.url}`); // Descomente se quiser ver sempre
    } else {
      console.warn(`⚠️ AVISO: Tentando acessar ${config.url} SEM TOKEN.`);
    }
  } catch (error) {
    console.error("Erro ao recuperar token:", error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// --- INTERCEPTOR DE RESPONSE (Trata Erros) ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Se for 401 (Não autorizado), o token venceu ou não existe
      if (error.response.status === 401) {
        console.error("⛔ ERRO 401: Sessão inválida ou expirada.");
        // Opcional: Aqui poderíamos forçar um logout automático
      }

      console.error("❌ ERRO API DETALHADO:", {
        url: error.config.url,
        status: error.response.status,
        data: JSON.stringify(error.response.data, null, 2), 
      });
    } else {
      console.error("❌ ERRO DE REDE:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;