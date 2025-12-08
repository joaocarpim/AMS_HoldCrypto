// Caminho: frontend/src/features/auth/services/AuthServices.ts

import apiClient from "@/shared/api/apiClient";
import { authAPI } from "@/shared/api/api";

// Interface para a resposta do login
interface LoginResponse {
  token: string;
}

// Interface ATUALIZADA para o perfil do usuário
export interface UserProfile {
  id: number;
  user: string;       // O backend retorna 'user' como nome
  name?: string;      // Fallback opcional caso mude para 'name'
  email: string;
  
  // --- NOVOS CAMPOS ADICIONADOS ---
  role: string;       // Essencial para o Admin
  photo?: string;     // Opcional
  phone?: string;     // Opcional
  address?: string;   // Opcional
}

const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post(authAPI.login(), { email, password });
    return response.data; // Retorna { token: "..." }
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get<UserProfile>(authAPI.getProfile());
    return response.data;
  },
};

export default authService;