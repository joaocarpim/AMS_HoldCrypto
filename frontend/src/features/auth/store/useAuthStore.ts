import { create } from 'zustand';
import authService from '../services/AuthServices'; 

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
  actions: {
    fetchProfile: () => Promise<void>;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    setToken: (token: string | null) => void;
  };
}

const initialState = {
  token: null,
  user: { 
    id: null, 
    name: null, 
    email: null, 
    role: null, 
    photo: null, 
    phone: null, 
    address: null 
  },
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const useAuthStore = create<AuthState>((set, get) => ({
  ...initialState,
  actions: {
    fetchProfile: async () => {
      // Tenta pegar do state ou do localStorage
      const currentToken = get().token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
      
      if (!currentToken) {
        set({ ...initialState, isLoading: false });
        return;
      }

      set({ isLoading: true, error: null });
      
      try {
        const profile = await authService.getProfile();
        
        set({
          token: currentToken,
          user: { 
            id: profile.id, 
            // Conversão segura de undefined para null
            name: profile.user || profile.name || null, 
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
      } catch (error: any) {
        console.error("Failed to fetch profile:", error);
        get().actions.logout(); 
        set({
          isLoading: false,
          error: "Sessão inválida.",
        });
      }
    },

    login: async (email, password) => {
      set({ isLoading: true, error: null });
      try {
        const response = await authService.login(email, password);
        const token = response.token; 
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', token); 
        }
        
        set({ token: token }); 
        // Chama fetchProfile para preencher os dados do usuário (role, foto, etc)
        await get().actions.fetchProfile(); 
        
        return get().isAuthenticated; 
      } catch (error: any) {
        const errorMessage = error.response?.data?.message || "Erro no login.";
        set({ isLoading: false, error: errorMessage });
        return false;
      }
    },

    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token'); 
      }
      set({ ...initialState, isLoading: false }); 
    },

    setToken: (token) => {
       set({ token });
       if (token && typeof window !== 'undefined') {
           localStorage.setItem('token', token);
       } else if (!token && typeof window !== 'undefined') {
           localStorage.removeItem('token');
       }
    }
  },
}));

export const useAuthUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useAuthActions = () => useAuthStore((state) => state.actions);