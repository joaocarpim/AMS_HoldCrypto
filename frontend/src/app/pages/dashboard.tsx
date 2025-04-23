'use client';
import { useEffect, useState } from 'react';
import { getWallets } from '@/services/walletService';
import WalletList from '@/services/WalletList';

export interface Wallet {
  id: number;
  currency: string;
  balance: number;
}

export default function DashboardPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const data: Wallet[] = await getWallets();
      setWallets(data);
    } catch (error) {
      console.error('Erro ao buscar carteiras:', error);
    }
  };

  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <WalletList wallets={wallets} />
    </div>
  );
}