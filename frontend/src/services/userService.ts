// Arquivo: src/services/userService.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface User {
  id: string;
  name: string;
  email: string;
}

// Função para buscar todos os usuários
export async function getUsers(): Promise<User[]> {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data as User[];
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw new Error('Erro ao buscar usuários.');
  }
}

// Função para excluir um usuário
export async function deleteUser(id: string): Promise<void> {
  try {
    await axios.delete(`${API_URL}/users/${id}`);
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    throw new Error('Erro ao excluir usuário.');
  }
}

// Função para buscar um usuário pelo ID
export async function getUserById(id: string): Promise<User> {
  try {
    const response = await axios.get(`${API_URL}/users/${id}`);
    return response.data as User;
  } catch (error) {
    console.error('Erro ao buscar usuário:', error);
    throw new Error('Erro ao buscar usuário.');
  }
}

// Função para atualizar um usuário
export async function updateUser(id: string, user: Partial<User>): Promise<void> {
  try {
    await axios.put(`${API_URL}/users/${id}`, user);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw new Error('Erro ao atualizar usuário.');
  }
}