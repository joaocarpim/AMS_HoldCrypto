import axios from 'axios';
import { userAPI } from './api';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  photo: string;
  phone: string;
  address: string;
}

const authHeader = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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
    const response = await axios.put(userAPI.update(id), user, {
      headers: authHeader(),
    });
    return response.data;
  },

  delete: async (id: number) => {
    const response = await axios.delete(userAPI.delete(id), {
      headers: authHeader(),
    });
    return response.data;
  },
};

export default userService;
