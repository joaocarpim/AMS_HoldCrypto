// mobile/src/features/dashboard/store/useDashboardStore.ts

import { create } from 'zustand';
import currencyService, { Currency } from '../../currency/services/currencyService';
import walletService, { Wallet } from '../../wallet/services/walletService';
import { useAuthStore } from '../../auth/store/useAuthStore';

interface DashboardState {
  currencies: Currency[];
  wallets: Wallet[];
  selectedCoin: Currency | null;
  loading: boolean;
  error: string | null;
  
  // Ações
  fetchDashboardData: () => Promise<void>;
  setSelectedCoin: (coin: Currency | null) => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  currencies: [],
  wallets: [],
  selectedCoin: null,
  loading: false, 
  error: null,

  fetchDashboardData: async () => {
    const { user, isAuthenticated } = useAuthStore.getState();
    const userId = user?.id;

    if (!isAuthenticated || !userId) {
      console.warn("DashboardStore: User not authenticated.");
      return;
    }

    set({ loading: true, error: null });

    try {
      console.log("DashboardStore: Buscando dados...");
      const [currencyData, walletData] = await Promise.all([
        currencyService.getAll(),
        walletService.getUserWallets(userId)
      ]);

      set({
        currencies: currencyData,
        wallets: walletData,
        selectedCoin: currencyData.find(c => c.symbol === 'BTC') || currencyData[0] || null,
        loading: false,
        error: null,
      });
      console.log("DashboardStore: Dados atualizados!", walletData);

    } catch (error: any) {
      console.error("DashboardStore Error:", error);
      const msg = error.response?.data?.message || "Erro ao carregar dashboard.";
      set({ loading: false, error: msg });
    }
  },

  setSelectedCoin: (coin) => {
    set({ selectedCoin: coin });
  }
}));

// Hooks Seletores
export const useDashboardCurrencies = () => useDashboardStore(state => state.currencies);
export const useDashboardWallets = () => useDashboardStore(state => state.wallets);
export const useDashboardSelectedCoin = () => useDashboardStore(state => state.selectedCoin);
export const useDashboardLoading = () => useDashboardStore(state => state.loading);
export const useDashboardActions = () => {
    const fetch = useDashboardStore(state => state.fetchDashboardData);
    const setCoin = useDashboardStore(state => state.setSelectedCoin);
    return { fetchDashboardData: fetch, setSelectedCoin: setCoin };
};