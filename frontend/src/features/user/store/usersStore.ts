import { create } from 'zustand';
import { userService, User } from '@/features/user/services/userService';
import { UserFormValues } from '../types/UserFormValues';

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  addUser: (userData: UserFormValues) => Promise<boolean>; // Retorna true em sucesso
  updateUser: (id: number, userData: Partial<UserFormValues>) => Promise<boolean>;
  deleteUser: (id: number) => Promise<boolean>;
}

export const useUsersStore = create<UserState>((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const users = await userService.getAll();
      set({ users, loading: false });
    } catch (err) {
      set({ error: 'Falha ao carregar usuários.', loading: false });
    }
  },

  addUser: async (userData) => {
    try {
      // Omit 'id' for creation
      const newUser = await userService.create(userData);
      set((state) => ({ users: [...state.users, newUser] }));
      return true;
    } catch (err) {
      console.error("Erro ao adicionar usuário:", err);
      return false;
    }
  },

  updateUser: async (id, userData) => {
    try {
      const updatedUser = await userService.update(id, userData);
      set((state) => ({
        users: state.users.map((user) => (user.id === id ? updatedUser : user)),
      }));
      return true;
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      return false;
    }
  },

  deleteUser: async (id) => {
    try {
      await userService.delete(id);
      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
      }));
      return true;
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
      return false;
    }
  },
}));