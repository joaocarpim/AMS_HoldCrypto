import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- CONFIGURAÇÃO DE CONEXÃO ---
// O IP 192.168.0.11 é o endereço do seu PC na rede Wi-Fi.
// O celular precisa estar no MESMO Wi-Fi para funcionar.
export const API_URL = 'http://192.168.0.11:5026/api'; // Use o IP do seu ipconfig
console.log(`🔌 Conectando ao Backend em: ${API_URL}`);

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Timeout de 10s para não travar o app se a rede cair
  timeout: 10000, 
});

// --- INTERCEPTOR DE REQUISIÇÃO (Injeta o Token) ---
api.interceptors.request.use(
  async (config) => {
    try {
      // Busca o token salvo pelo Zustand no AsyncStorage
      const storageData = await AsyncStorage.getItem('auth-storage');
      
      if (storageData) {
        const parsedData = JSON.parse(storageData);
        // O Zustand salva no formato: { state: { token: '...', user: ... }, version: 0 }
        const token = parsedData?.state?.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Erro ao recuperar token de autenticação:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- INTERCEPTOR DE RESPOSTA (Tratamento de Erros) ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout: O servidor demorou muito para responder. Verifique sua conexão.');
    } else if (error.message === 'Network Error' || !error.response) {
      console.error(`Erro de Rede: Não foi possível conectar em ${API_URL}.`);
      console.error('DICAS:');
      console.error('1. Confirme se o Backend (Gateway) está rodando na porta 5026.');
      console.error('2. Confirme se o Celular e o PC estão no mesmo Wi-Fi.');
      console.error('3. Desative o Firewall do Windows temporariamente se necessário.');
    } else {
        // Erros da API (400, 401, 500)
        console.error(`Erro API [${error.response.status}]:`, error.response.data);
    }
    return Promise.reject(error);
  }
);