import apiClient from '@/shared/api/apiClient';
import { walletAPI } from '@/shared/api/api';

// --- Interfaces ---

export type WalletCategory = "Overview" | "Spot" | "Funding";

export interface Wallet {
  id: number;
  userId: number;
  name: string;
  category: WalletCategory;
  currencySymbol: string;
  balance: number;
  createdAt: string;
}

export interface WalletTransaction {
  id: number;
  createdAt: string;
  type: number; // 0: Deposit, 1: Withdraw, 2: Transfer
  amount: number;
  walletId: number;
  currencySymbol: string;
  notes: string;
}

export interface CreateWalletDTO {
  userId: number;
  name: string;
  category: WalletCategory;
  currencySymbol: string;
  balance: number;
}

export interface DepositWithdrawDTO {
  amount: number;
}

export interface TransferDTO {
  fromWalletId: number;
  toWalletId: number;
  amount: number;
}

export interface TradeRequestDTO {
  userId: number;
  fromWalletId: number;
  toCurrencySymbol: string;
  amountToSpend: number;
}

export interface TradeResponseDTO {
  status: string;
  newBalances: Record<string, number>;
}

// --- Serviço ---
const walletService = {
  getUserWallets: async (userId: number): Promise<Wallet[]> => {
    if (!userId || userId <= 0) throw new Error("ID de usuário inválido.");
    const response = await apiClient.get<Wallet[]>(walletAPI.getUserWallets(userId));
    return response.data;
  },

  createWallet: async (walletData: any): Promise<Wallet> => {
    const response = await apiClient.post<Wallet>(walletAPI.createWallet(), walletData);
    return response.data;
  },

  // --- NOVA FUNÇÃO PARA DELETAR CARTEIRA ---
  deleteWallet: async (walletId: number): Promise<void> => {
    // Assume que a rota é DELETE /wallet/{id}
    await apiClient.delete(`/wallet/${walletId}`);
  },
  // -----------------------------------------

  deposit: async (walletId: number, data: DepositWithdrawDTO): Promise<{ balance: number }> => {
    const response = await apiClient.post<{ balance: number }>(walletAPI.deposit(walletId), data);
    return response.data;
  },

  withdraw: async (walletId: number, data: DepositWithdrawDTO): Promise<{ balance: number }> => {
    const response = await apiClient.post<{ balance: number }>(walletAPI.withdraw(walletId), data);
    return response.data;
  },

  transfer: async (data: TransferDTO): Promise<{ fromBalance: number, toBalance: number }> => {
    const response = await apiClient.post<{ fromBalance: number, toBalance: number }>(walletAPI.transfer(), data);
    return response.data;
  },

  trade: async (data: TradeRequestDTO): Promise<TradeResponseDTO> => {
    const response = await apiClient.post<TradeResponseDTO>(walletAPI.trade(), data);
    return response.data;
  },

  getHistory: async (userId: number): Promise<WalletTransaction[]> => {
    const response = await apiClient.get<WalletTransaction[]>(`/wallet/history?userId=${userId}`);
    return response.data;
  },
};

export default walletService;