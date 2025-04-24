import { BASE_URL, API_ROUTES } from "./constants";

// Função genérica para requisições
export const apiRequest = async (url: string, method: string, body?: any) => {
    try {
      const response = await fetch(`${BASE_URL}${url}`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro na requisição");
      }
  
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Erro na requisição:", error.message);
        throw error;
      } else {
        console.error("Erro desconhecido:", error);
        throw new Error("Erro desconhecido na requisição.");
      }
    }
  };

// Requisição para registrar um usuário
export const registerUser = async (userData: any) => {
  return apiRequest(API_ROUTES.REGISTER, "POST", userData);
};

// Requisição para login
export const loginUser = async (loginData: any) => {
  return apiRequest(API_ROUTES.LOGIN, "POST", loginData);
};

// Requisição para buscar o perfil
export const getProfile = async () => {
  return apiRequest(API_ROUTES.GET_PROFILE, "GET");
};