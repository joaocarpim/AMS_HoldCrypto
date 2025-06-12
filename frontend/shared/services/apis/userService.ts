import api from './api';
import { UserFormValues } from 'shared/types/types/UserFormValues';

export interface User extends UserFormValues {
  id: number;
}

const userService = {
  async getById(id: number): Promise<User> {
    const response = await api.get<User>(`/User/${id}`);
    return response.data;
  },
  async update(id: number, data: UserFormValues): Promise<void> {
    await api.put(`/User/${id}`, data);
  },
  async create(data: UserFormValues): Promise<void> {
    await api.post('/User', data);
  },
  async getAll(): Promise<User[]> {
    const response = await api.get<User[]>('/User');
    return response.data;
  },
  async delete(id: number): Promise<void> {
    await api.delete(`/User/${id}`);
  },
};

export default userService;
export type { UserFormValues };