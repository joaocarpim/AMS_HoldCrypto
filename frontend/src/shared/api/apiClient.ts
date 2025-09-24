import axios from 'axios';

// 1. Definimos a URL base do seu Gateway API.
// Todas as requisições do frontend web sairão daqui.
const API_BASE_URL = 'http://localhost:5026';

// 2. Criamos uma instância do axios com a configuração base.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 3. (A Mágica Acontece Aqui)
// Usamos um "interceptor" para adicionar o token JWT em TODAS as requisições autenticadas, automaticamente.
apiClient.interceptors.request.use(
  (config) => {
    // Apenas executa no lado do navegador (não no servidor do Next.js)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        // Se um token existir, ele é adicionado ao cabeçalho de autorização.
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
