import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface LoginResponse {
  token: string;
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data as LoginResponse; // Tipagem explícita
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw new Error('Erro ao fazer login. Verifique suas credenciais.');
  }
}

export async function register(name: string, email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
    return response.data as LoginResponse; // Tipagem explícita
  } catch (error) {
    console.error('Erro ao registrar:', error);
    throw new Error('Erro ao registrar usuário. Verifique os dados informados.');
  }
}