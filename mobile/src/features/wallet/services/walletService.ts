// mobile/src/features/wallet/services/WalletService.ts

import api from '../../../services/api';

export type WalletCategory = "Overview" | "Spot" | "Funding";

export interface Wallet {
    id: number;
    userId: number;
    name: string;
    category: WalletCategory;
    currencySymbol: string;
    balance: number;
}

export interface WalletTransaction {
    id: number;
    walletId: number;
    amount: number;
    type: number;
    currencySymbol: string;
    notes?: string;
    createdAt: string;
}

const walletService = {
    // BUSCAR TODAS
    getUserWallets: async (userId: number): Promise<Wallet[]> => {
        try {
            // CORREÇÃO: Passando userId na Query String
            // O Backend deve estar esperando algo como: GET /api/Wallet?userId=1
            const response = await api.get('/wallet', {
                params: { userId: userId }
            });
            
            console.log("💰 DADOS CARTEIRA:", response.data);

            return response.data.map((w: any) => ({
                id: w.id || w.Id,
                userId: w.userId || w.UserId,
                name: w.name || w.Name || 'Carteira',
                category: w.category || w.Category || 'Spot',
                currencySymbol: w.currencySymbol || w.CurrencySymbol || w.currency?.symbol || '???',
                // Tratamento blindado para o saldo
                balance: Number(w.balance !== undefined ? w.balance : w.Balance),
            }));
        } catch (error) {
            console.error("Erro ao buscar carteiras:", error);
            throw error;
        }
    },

    // HISTÓRICO
    getHistory: async (userId: number): Promise<WalletTransaction[]> => {
        // Também passamos o userId aqui para garantir
        const response = await api.get('/wallet/history', {
            params: { userId: userId }
        });
        return response.data;
    },

    // CRIAR
    createWallet: async (data: { userId: number; name: string; currencySymbol: string; category: number }) => {
        const response = await api.post('/wallet', data);
        return response.data;
    },

    // DEPOSITAR
    deposit: async (walletId: number, amount: number) => {
        const response = await api.post(`/wallet/${walletId}/deposit`, { amount });
        return response.data;
    },

    // SACAR
    withdraw: async (walletId: number, amount: number) => {
        const response = await api.post(`/wallet/${walletId}/withdraw`, { amount });
        return response.data;
    }
};

export default walletService;