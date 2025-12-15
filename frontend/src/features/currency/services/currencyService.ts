import apiClient from "@/shared/api/apiClient";
import { currencyAPI } from "@/shared/api/api";
import { Currency } from "../types/Currency";

const currencyService = {
  getAll: async (): Promise<Currency[]> => {
    const response = await apiClient.get(currencyAPI.getAll());
    return response.data;
  },

  getById: async (id: number): Promise<Currency> => {
    const response = await apiClient.get(currencyAPI.getById(id));
    return response.data;
  },

  create: async (currency: Omit<Currency, "id" | "histories">): Promise<Currency> => {
    const response = await apiClient.post(currencyAPI.create(), currency);
    return response.data;
  },

  update: async (id: number, currency: Partial<Currency>): Promise<Currency> => {
    const response = await apiClient.put(currencyAPI.update(id), currency);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(currencyAPI.delete(id));
  },
};

export default currencyService;

