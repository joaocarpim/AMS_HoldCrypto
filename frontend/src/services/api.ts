const BASE_URL = 'http://localhost:5294/api';

// Função genérica para criar rotas CRUD
const crudAPI = (basePath: string) => ({
  create: () => `${basePath}`,
  getAll: () => `${basePath}`,
  edit: (id: string | number) => `${basePath}/${id}`,
  delete: (id: string | number) => `${basePath}/${id}`,
  getById: (id: string | number) => `${basePath}/${id}`,
});

// API para operações relacionadas a usuários
const userAPI = crudAPI(`${BASE_URL}/User`);

// API para operações de autenticação
const authAPI = {
  login: () => `${BASE_URL}/auth/Login`,
  logout: () => `${BASE_URL}/auth/Logout`,
  refreshToken: () => `${BASE_URL}/auth/RefreshToken`,
};

// Exporta as APIs para uso em outros arquivos
export { userAPI, authAPI };