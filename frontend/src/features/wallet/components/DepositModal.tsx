// Caminho: frontend/src/features/wallet/components/DepositModal.tsx
'use client';

import React, { useState } from 'react';
import Modal from '@/shared/components/Modal';
import DepositForm, { DepositFormValues } from './DepositForm';
import { Wallet } from '../services/walletService'; // Importar a interface Wallet
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import walletService from '../services/walletService';
import { useDashboardActions } from '@/features/dashboard/store/DashboardStore';
import { useNotification } from '@/shared/context/NotificationContext';
import { Typography } from '@mui/material';

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
  wallet: Wallet | null; // A carteira na qual depositar
}

const DepositModal: React.FC<DepositModalProps> = ({ open, onClose, wallet }) => {
  const { fetchDashboardData } = useDashboardActions();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: DepositFormValues) => {
    if (!wallet) {
        showNotification("Erro: Carteira não selecionada.", "error");
        return;
    }
    
    setIsLoading(true);
    console.log(`DepositModal: Attempting to deposit ${values.amount} into wallet ${wallet.id}`);
    try {
        await walletService.deposit(wallet.id, { amount: values.amount });
        
        showNotification(`Depósito de ${values.amount} ${wallet.currencySymbol} realizado com sucesso!`, "success");
        fetchDashboardData(); // Rebusca dados do dashboard (atualiza saldos)
        onClose(); // Fecha o modal
    } catch (error: any) {
        console.error("Failed to deposit:", error);
        showNotification(error.response?.data?.message || "Erro desconhecido ao realizar depósito.", "error");
    } finally {
        setIsLoading(false);
    }
  };

  // Se 'wallet' for nulo, não renderiza nada (segurança)
  if (!wallet) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Depositar em ${wallet.name} (${wallet.currencySymbol})`}>
       <DepositForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={onClose}
          currencySymbol={wallet.currencySymbol} // Passa o símbolo para o formulário
      />
    </Modal>
  );
};

export default DepositModal;