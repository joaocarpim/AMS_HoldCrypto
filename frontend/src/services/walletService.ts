
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Wallet {
  id: number;
  currency: string;
  balance: number;
}

export const getWallets = async (): Promise<Wallet[]> => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/api/wallets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data as Wallet[]; 
};

export const createWallet = async (currency: string, balance: number): Promise<Wallet> => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_URL}/api/wallets`,
    { currency, balance },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data as Wallet; 
};

export const updateWallet = async (id: number, balance: number): Promise<Wallet> => {
  const token = localStorage.getItem('token');
  const response = await axios.put(
    `${API_URL}/api/wallets/${id}`,
    { balance },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data as Wallet; 
};

export const deleteWallet = async (id: number): Promise<void> => {
  const token = localStorage.getItem('token');
  await axios.delete(`${API_URL}/api/wallets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};