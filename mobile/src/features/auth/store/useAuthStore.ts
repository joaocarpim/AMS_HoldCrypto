// mobile/src/features/auth/store/useAuthStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/AuthServices'; 
import { Alert } from 'react-native';

// --- Tipagens ---
interface AuthUser {
  id: number | null;
  name: string | null;
  email: string | null;
  role: string | null;
  photo: string | null;
  phone: string | null;
  address: string | null;
}

interface AuthState {
  token: string | null;
  user: AuthUser;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean; // Flag de controle de hidratação
  
  // As ações ficam aqui dentro
  actions: {
    fetchProfile: () => Promise<void>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    setToken: (token: string | null) => void;
    setHasHydrated: (state: boolean) => void;
  };
}

// Estado inicial limpo
const initialStateData = {
  token: null,
  user: { 
    id: null, name: null, email: null, role: null, 
    photo: null, phone: null, address: null 
  },
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// --- Store Principal ---
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialStateData,
      isLoading: true, // Começa carregando
      _hasHydrated: false,
      
      actions: {
        // Ação para liberar o app após hidratação
        setHasHydrated: (state: boolean) => {
          set({ _hasHydrated: state });
        },
        
        // LOGIN (A função que estava dando erro)
        login: async (email, password) => {
          set({ isLoading: true, error: null });
          try {
            // Chama o serviço
            const response = await authService.login(email, password);
            const token = response.token; 
            
            // Salva o token
            set({ token }); 
            
            // Busca o perfil imediatamente
            await get().actions.fetchProfile(); 
            
            return true; // Retorna sucesso
          } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Erro no login.";
            console.error("Login Error na Store:", errorMessage);
            set({ isLoading: false, error: errorMessage });
            return false; // Retorna falha
          }
        },

        // FETCH PROFILE
        fetchProfile: async () => {
          const currentToken = get().token;
          if (!currentToken) {
            set({ isLoading: false });
            return;
          }

          try {
            const profile = await authService.getProfile();
            const userName = profile.name || profile.user || (profile as any).fullName || null;
            
            set({
              user: { 
                id: profile.id, 
                name: userName,
                email: profile.email,
                role: profile.role ? profile.role.trim() : null,  
                photo: profile.photo || null,   
                phone: profile.phone || null,
                address: profile.address || null
              },
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            console.error("Failed to fetch profile:", error);
            get().actions.logout(); // Logout se o perfil falhar
          }
        },

        // LOGOUT
        logout: () => {
          set({ ...initialStateData, _hasHydrated: true }); 
          AsyncStorage.removeItem('auth-storage'); 
        },

        setToken: (token) => set({ token })
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage as StateStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.actions.setHasHydrated(true);
      }
    }
  )
);

// --- Hooks Seletores (Cruciais para funcionar no componente) ---
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useAuthStoreIsHydrated = () => useAuthStore((state) => state._hasHydrated);

// AQUI ESTA O SEGREDO: O seletor deve retornar o objeto actions corretamente
export const useAuthActions = () => useAuthStore((state) => state.actions);