import apiClient from '@/shared/api/apiClient';
import { userAPI } from '@/shared/api/api';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  photo: string;
  phone: string;
  address: string;
}

const userServiceObject = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get(userAPI.getAll());
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    if (!id || typeof id !== "number" || isNaN(id) || id <= 0) {
      throw new Error("ID de usuário inválido.");
    }
    const response = await apiClient.get(userAPI.getById(id));
    return response.data;
  },

  create: async (user: Omit<User, 'id'>): Promise<User> => {
    const response = await apiClient.post(userAPI.create(), user);
    return response.data;
  },

  update: async (id: number, user: Partial<User>): Promise<User> => {
    if (!id || typeof id !== "number" || isNaN(id) || id <= 0) {
      throw new Error("ID de usuário inválido.");
    }
    const response = await apiClient.put(userAPI.update(id), user);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    if (!id || typeof id !== "number" || isNaN(id) || id <= 0) {
      throw new Error("ID de usuário inválido.");
    }
    await apiClient.delete(userAPI.delete(id));
  },
};

// CORREÇÃO: Usando exportação nomeada em vez de default
export const userService = userServiceObject;
