'use client';
import { useEffect, useState } from 'react';
import { getWallets, deleteWallet } from '@/services/walletService';
import WalletForm from '@/services/WalletForm';

export interface Wallet {
  id: number;
  currency: string;
  balance: number;
}

interface WalletListProps {
  wallets: Wallet[];
}

export default function WalletList({ wallets }: WalletListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingWallet, setEditingWallet] = useState<Wallet | null>(null);

  const handleDelete = async (id: number) => {
    try {
      await deleteWallet(id);
      window.location.reload();
    } catch (error) {
      console.error('Erro ao excluir carteira:', error);
    }
  };

  return (
    <div>
      <button onClick={() => setShowForm(true)}>Adicionar Carteira</button>
      {showForm && (
        <WalletForm
          id={editingWallet?.id}
          currency={editingWallet?.currency}
          balance={editingWallet?.balance}
          onClose={() => setShowForm(false)}
        />
      )}
      <table>
        <thead>
          <tr>
            <th>Moeda</th>
            <th>Saldo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {wallets.map((wallet) => (
            <tr key={wallet.id}>
              <td>{wallet.currency}</td>
              <td>{wallet.balance}</td>
              <td>
                <button onClick={() => handleDelete(wallet.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}