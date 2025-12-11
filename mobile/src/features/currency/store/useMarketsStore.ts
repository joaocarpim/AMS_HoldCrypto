// mobile/src/features/currency/store/useMarketsStore.ts

import { create } from 'zustand';
// CORREÇÃO: 'currencyService' com 'c' minúsculo para bater com o nome do arquivo
import currencyService, { Currency } from '../services/currencyService';

interface MarketsState {
  currencies: Currency[];
  loading: boolean;
  error: string | null;
  fetchCurrencies: () => Promise<void>;
}

export const useMarketsStore = create<MarketsState>((set) => ({
  currencies: [],
  loading: false,
  error: null,

  fetchCurrencies: async () => {
    set({ loading: true, error: null });
    try {
      const data = await currencyService.getAll();
      set({ currencies: data, loading: false });
    } catch (error: any) {
      console.error("Erro ao buscar moedas:", error);
      const msg = error.response?.data?.message || 'Falha ao carregar dados do mercado.';
      set({ error: msg, loading: false });
    }
  },
}));