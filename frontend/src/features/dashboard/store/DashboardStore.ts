// Caminho: frontend/src/features/dashboard/store/DashboardStore.ts

import { create } from 'zustand';
import { Currency } from '@/features/currency/types/Currency';
import currencyService from '@/features/currency/services/currencyService';
import walletService, { Wallet } from '@/features/wallet/services/walletService'; // Ajuste o caminho se necessário
import { useAuthStore } from '@/features/auth/store/useAuthStore'; // Ajuste o caminho se necessário

interface DashboardState {
  currencies: Currency[];
  wallets: Wallet[];
  selectedCoin: Currency | null;
  loading: boolean;
  error: string | null;
  fetchDashboardData: () => Promise<void>;
  setSelectedCoin: (coin: Currency | null) => void;
  // Adicionado 'actions' ao estado para seleção estável
  actions: {
      fetchDashboardData: () => Promise<void>;
      setSelectedCoin: (coin: Currency | null) => void;
  };
}

const initialState = {
  currencies: [],
  wallets: [],
  selectedCoin: null,
  loading: true,
  error: null,
};

export const useDashboardStore = create<DashboardState>((set, get) => ({
  ...initialState,
  fetchDashboardData: async () => {
    const { isAuthenticated, user } = useAuthStore.getState();
    const userId = user.id;

    if (!isAuthenticated || !userId) {
      console.warn("DashboardStore: User not authenticated or userId not available. Skipping data fetch.");
      // Limpa dados e para o loading, define erro
      set({ ...initialState, loading: false, error: "Usuário não autenticado." });
      return;
    }

    console.log(`DashboardStore: Fetching data for userId: ${userId}`);
    set({ loading: true, error: null });

    try {
      const [currencyData, walletData] = await Promise.all([
        currencyService.getAll(),
        walletService.getUserWallets(userId)
      ]);

      console.log("DashboardStore: Currencies fetched:", currencyData);
      console.log("DashboardStore: Wallets fetched:", walletData);

      set({
        currencies: currencyData,
        wallets: walletData,
          // Tenta achar o BTC. Se não achar, pega o primeiro da lista. Se a lista for vazia, null.
          selectedCoin: currencyData.find(c => c.symbol === 'BTC') || currencyData[0] || null,     
          loading: false,
        error: null,
      });
      console.log("DashboardStore: State updated successfully.");

    } catch (error: any) {
      console.error("DashboardStore: Error fetching data:", error);
      const errorMessage = error.response?.data?.message || "Falha ao carregar dados do dashboard.";
      set({
        ...initialState, // Reseta dados em caso de erro
        loading: false,
        error: errorMessage
       });
    }
  },

  setSelectedCoin: (coin) => {
    set({ selectedCoin: coin });
  },

  // Popula o objeto 'actions' com as funções definidas acima
  // Isso garante que a referência ao objeto 'actions' seja estável
  actions: {
      fetchDashboardData: () => get().fetchDashboardData(),
      setSelectedCoin: (coin) => get().setSelectedCoin(coin),
  }
}));

// Hooks de conveniência
export const useDashboardCurrencies = () => useDashboardStore((state) => state.currencies);
export const useDashboardWallets = () => useDashboardStore((state) => state.wallets);
export const useDashboardSelectedCoin = () => useDashboardStore((state) => state.selectedCoin);
export const useDashboardLoading = () => useDashboardStore((state) => state.loading);
export const useDashboardError = () => useDashboardStore((state) => state.error);

// Hook de ações corrigido para selecionar o objeto 'actions' estável
export const useDashboardActions = () => useDashboardStore((state) => state.actions);