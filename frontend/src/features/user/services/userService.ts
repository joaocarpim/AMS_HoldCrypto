import axios from 'axios';
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

const authHeader = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await axios.get(userAPI.getAll(), {
      headers: authHeader(),
    });
    return response.data;
  },

  getById: async (id: number): Promise<User> => {
    // Validação robusta do ID
    if (!id || typeof id !== "number" || isNaN(id) || id <= 0) {
      console.error("userService.getById chamado com ID inválido:", id);
      throw new Error("ID de usuário inválido.");
    }
    const response = await axios.get(userAPI.getById(id), {
      headers: authHeader(),
    });
    return response.data;
  },

  create: async (user: Omit<User, 'id'>) => {
    const response = await axios.post(userAPI.create(), user, {
      headers: authHeader(),
    });
    return response.data;
  },

  update: async (id: number, user: Partial<User>) => {
    if (!id || typeof id !== "number" || isNaN(id) || id <= 0) {
      console.error("userService.update chamado com ID inválido:", id);
      throw new Error("ID de usuário inválido.");
    }
    const response = await axios.put(userAPI.update(id), user, {
      headers: authHeader(),
    });
    return response.data;
  },

  delete: async (id: number) => {
    if (!id || typeof id !== "number" || isNaN(id) || id <= 0) {
      console.error("userService.delete chamado com ID inválido:", id);
      throw new Error("ID de usuário inválido.");
    }
    const response = await axios.delete(userAPI.delete(id), {
      headers: authHeader(),
    });
    return response.data;
  },
};

export default userService;