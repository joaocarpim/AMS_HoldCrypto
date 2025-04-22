import React, { useEffect, useState } from 'react';
import { getWallets, deleteWallet } from '@/services/walletService';
import WalletForm from './WalletForm';

const WalletList = () => {
  const [wallets, setWallets] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingWallet, setEditingWallet] = useState<any | null>(null);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const data = await getWallets();
      setWallets(data);
    } catch (error) {
      console.error('Erro ao buscar carteiras:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteWallet(id);
      fetchWallets();
    } catch (error) {
      console.error('Erro ao excluir carteira:', error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Minhas Carteiras</h1>
      <button
        onClick={() => {
          setEditingWallet(null);
          setShowForm(true);
        }}
        className="px-4 py-2 bg-green-500 text-white rounded mb-4"
      >
        Adicionar Carteira
      </button>
      {showForm && (
        <WalletForm
          id={editingWallet?.id}
          currency={editingWallet?.currency}
          balance={editingWallet?.balance}
          onClose={() => {
            setShowForm(false);
            setEditingWallet(null);
            fetchWallets();
          }}
        />
      )}
      <table className="min-w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Moeda</th>
            <th className="border p-2">Saldo</th>
            <th className="border p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {wallets.map((wallet) => (
            <tr key={wallet.id}>
              <td className="border p-2">{wallet.currency}</td>
              <td className="border p-2">{wallet.balance}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => {
                    setEditingWallet(wallet);
                    setShowForm(true);
                  }}
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(wallet.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WalletList;