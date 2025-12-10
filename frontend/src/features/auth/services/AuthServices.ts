// Caminho: frontend/src/features/auth/services/AuthServices.ts

import apiClient from "@/shared/api/apiClient";
import { authAPI } from "@/shared/api/api"; 

// Interface para a resposta do login
interface LoginResponse {
  token: string;
  // Adicionei campos extras que geralmente vêm no login, caso precise no futuro
  expiration?: string; 
}

// Interface para o perfil do usuário
export interface UserProfile {
  id: number;
  user: string;       // O backend retorna 'user' como nome
  name?: string;      // Fallback
  email: string;
  
  // Campos adicionais
  role: string;       
  photo?: string;     
  phone?: string;     
  address?: string;   
}

const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    // O apiClient já tem a base '.../api', então aqui ele chama '.../api/auth/login'
    // Supondo que authAPI.login() retorne a string endpoint correta (ex: '/auth/login')
    const response = await apiClient.post(authAPI.login(), { email, password });
    return response.data; 
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>(authAPI.getProfile());
    return response.data;
  },
};

export default authService;