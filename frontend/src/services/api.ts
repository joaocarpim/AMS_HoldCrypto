const BASE_URL = 'http://localhost:5294'; // URL base do backend

// Função genérica para criar rotas CRUD com métodos HTTP
const crudAPI = (basePath: string) => ({
  create: async (data: any) => {
    const response = await fetch(`${basePath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create resource');
    return response.json();
  },
  getAll: async () => {
    const response = await fetch(`${basePath}`);
    if (!response.ok) throw new Error('Failed to fetch resources');
    return response.json();
  },
  edit: async (id: string | number, data: any) => {
    const response = await fetch(`${basePath}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update resource');
    return response.json();
  },
  delete: async (id: string | number) => {
    const response = await fetch(`${basePath}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete resource');
    return response.json();
  },
  getById: async (id: string | number) => {
    const response = await fetch(`${basePath}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch resource by ID');
    return response.json();
  },
});

// API para operações relacionadas a usuários
const userAPI = crudAPI(`${BASE_URL}/User`);

// API para operações de autenticação
const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },
  logout: async () => {
    const response = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Logout failed');
    return response.json();
  },
  refreshToken: async () => {
    const response = await fetch(`${BASE_URL}/auth/refreshToken`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to refresh token');
    return response.json();
  },
};

export { userAPI, authAPI };