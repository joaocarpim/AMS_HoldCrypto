import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  id: string;
  name: string;
  email: string;
}

export async function getUserData(token: string): Promise<User> {
  try {
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data as User; // Tipagem explícita
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    throw new Error('Erro ao buscar dados do usuário.');
  }
}