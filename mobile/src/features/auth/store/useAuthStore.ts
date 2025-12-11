// mobile/src/features/auth/store/useAuthStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../services/AuthServices'; 

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

// O Estado agora só tem DADOS. Nada de funções aqui dentro.
interface AuthState {
  token: string | null;
  user: AuthUser;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  _hasHydrated: boolean; 
}

const initialStateData: AuthState = {
  token: null,
  user: { 
    id: null, name: null, email: null, role: null, 
    photo: null, phone: null, address: null 
  },
  isAuthenticated: false,
  isLoading: false,
  error: null,
  _hasHydrated: false,
};

// --- Store Principal (Apenas Dados) ---
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialStateData,
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage as StateStorage),
      // Importante: Só persistimos os dados que importam
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => {
        // Ao terminar de carregar, marcamos a flag
        if (state) {
            useAuthStore.setState({ _hasHydrated: true });
        }
      }
    }
  )
);

// --- AÇÕES (Definidas FORA da store para evitar bugs) ---

const setHasHydrated = (state: boolean) => {
    useAuthStore.setState({ _hasHydrated: state });
};

const setToken = (token: string | null) => {
    useAuthStore.setState({ token });
};

const logout = () => {
    useAuthStore.setState({ ...initialStateData, _hasHydrated: true });
    AsyncStorage.removeItem('auth-storage');
};

const fetchProfile = async () => {
    // Acessa o estado atual diretamente
    const token = useAuthStore.getState().token;
    if (!token) {
        useAuthStore.setState({ isLoading: false });
        return;
    }

    try {
        const profile = await authService.getProfile();
        // Tratamento seguro do nome
        const userName = profile.name || profile.user || (profile as any).fullName || null;
        
        useAuthStore.setState({
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
        logout();
    }
};

const login = async (email: string, password: string) => {
    useAuthStore.setState({ isLoading: true, error: null });
    try {
        const response = await authService.login(email, password);
        const token = response.token; 
        
        useAuthStore.setState({ token });
        
        // Chama o fetchProfile definido acima
        await fetchProfile();
        
        return true; 
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || "Erro no login.";
        console.error("Login Error:", errorMessage);
        useAuthStore.setState({ isLoading: false, error: errorMessage });
        return false; 
    }
};

// --- Hooks Seletores ---
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useAuthStoreIsHydrated = () => useAuthStore((state) => state._hasHydrated);

// --- Hook de Ações (Compatibilidade) ---
// Retornamos um objeto fixo com as funções. Isso NUNCA será undefined.
export const useAuthActions = () => ({
    login,
    logout,
    fetchProfile,
    setToken,
    setHasHydrated
});