import { api } from '../../../services/api';

// Interface para a resposta do login
interface LoginResponse {
  token: string;
  expiration?: string; 
}

// Interface para o perfil do usuário
export interface UserProfile {
  id: number;
  user: string;
  name?: string;
  email: string;
  role: string;      
  photo?: string;     
  phone?: string;     
  address?: string;   
}

const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    // Endpoints do seu Gateway
    const response = await api.post('/api/auth/login', { email, password });
    return response.data; 
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/api/auth/profile');
    return response.data;
  },
};

export default authService;