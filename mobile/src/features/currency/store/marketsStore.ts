import { create } from 'zustand';
import currencyService from '@/features/currency/services/currencyService';
import { Currency } from '../types/Currency';

// Função para carregar os favoritos do localStorage
const loadFavorites = (): string[] => {
  if (typeof window === 'undefined') return [];
  const favorites = localStorage.getItem('cryptoFavorites');
  return favorites ? JSON.parse(favorites) : [];
};

interface MarketsState {
  currencies: Currency[];
  favorites: string[]; // Armazenaremos os símbolos das moedas favoritas (ex: 'BTC', 'ETH')
  loading: boolean;
  error: string | null;
  fetchCurrencies: () => Promise<void>;
  toggleFavorite: (symbol: string) => void;
}

export const useMarketsStore = create<MarketsState>((set) => ({
  currencies: [],
  favorites: loadFavorites(),
  loading: false,
  error: null,

  fetchCurrencies: async () => {
    set({ loading: true, error: null });
    try {
      // Usando o seu currencyService existente!
      const data = await currencyService.getAll();
      set({ currencies: data, loading: false });
    } catch (error) {
      console.error("Erro ao buscar moedas:", error);
      set({ error: 'Falha ao carregar dados do mercado.', loading: false });
    }
  },

  toggleFavorite: (symbol: string) => {
    set((state) => {
      const newFavorites = state.favorites.includes(symbol)
        ? state.favorites.filter((fav) => fav !== symbol)
        : [...state.favorites, symbol];
      
      localStorage.setItem('cryptoFavorites', JSON.stringify(newFavorites));
      return { favorites: newFavorites };
    });
  },
}));