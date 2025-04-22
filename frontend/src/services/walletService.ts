import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Obter todas as carteiras do usuário
export const getWallets = async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(`${API_URL}/api/wallets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Criar uma nova carteira
export const createWallet = async (currency: string, balance: number) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_URL}/api/wallets`,
    { currency, balance },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Atualizar o saldo de uma carteira
export const updateWallet = async (id: number, balance: number) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(
    `${API_URL}/api/wallets/${id}`,
    { balance },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

// Excluir uma carteira
export const deleteWallet = async (id: number) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/api/wallets/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};