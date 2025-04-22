import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  id: string;
  name: string;
  email: string;
}

export async function getUsers(): Promise<User[]> {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data as User[]; 
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw new Error('Erro ao buscar usuários.');
  }
}

export async function deleteUser(id: string): Promise<void> {
  try {
    await axios.delete(`${API_URL}/users/${id}`);
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw new Error('Erro ao deletar usuário.');
  }
}