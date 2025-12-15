// mobile/src/features/currency/services/currencyService.ts

import api from '../../../services/api';

export interface History {
    id: number;
    price: number;
    datetime: string;
}

export interface Currency {
    id: number;
    symbol: string;
    name: string;
    histories?: History[];
}

const currencyService = {
    getAll: async (): Promise<Currency[]> => {
        // CORREÇÃO: Vamos direto para a rota base '/currency'
        // A rota '/currency/history' estava sendo confundida com '/currency/{id}' pelo backend
        try {
            const response = await api.get('/currency');
            return response.data;
        } catch (error) {
            console.error("Erro ao buscar moedas:", error);
            throw error;
        }
    },
};

export default currencyService;