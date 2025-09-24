import apiClient from "@/shared/api/apiClient";
import { authAPI } from "@/shared/api/api";

// Interface para a resposta do login
interface LoginResponse {
  token: string;
}

// Interface para o perfil do usuário
interface UserProfile {
  user: string;
  email: string;
}

const authService = {
  // CORREÇÃO: Adicionamos os tipos 'string' aos parâmetros
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post(authAPI.login(), { email, password });
    return response.data;
  },

  getProfile: async (): Promise<UserProfile> => {
    const response = await apiClient.get(authAPI.getProfile());
    return response.data;
  },
};

export default authService;

