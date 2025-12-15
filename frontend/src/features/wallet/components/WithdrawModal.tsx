'use client';

import React, { useState } from 'react';
import Modal from '@/shared/components/Modal';
import WithdrawForm, { WithdrawFormValues } from './WithdrawForm';
import { Wallet } from '../services/walletService';
import walletService from '../services/walletService';
import { useDashboardActions } from '@/features/dashboard/store/DashboardStore';
import { useNotification } from '@/shared/context/NotificationContext';

interface WithdrawModalProps {
  open: boolean;
  onClose: () => void;
  wallet: Wallet | null;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ open, onClose, wallet }) => {
  const { fetchDashboardData } = useDashboardActions();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: WithdrawFormValues) => {
    if (!wallet) return;
    
    setIsLoading(true);
    try {
        await walletService.withdraw(wallet.id, { amount: values.amount });
        
        showNotification(`Saque de ${values.amount} ${wallet.currencySymbol} realizado!`, "success");
        fetchDashboardData(); 
        onClose(); 
    } catch (error: any) {
        console.error("Failed to withdraw:", error);
        showNotification(error.response?.data?.message || "Erro ao realizar saque.", "error");
    } finally {
        setIsLoading(false);
    }
  };

  if (!wallet) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Sacar de ${wallet.name}`}>
       <WithdrawForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onCancel={onClose}
          currencySymbol={wallet.currencySymbol}
          maxBalance={Number(wallet.balance)} // Passa o saldo atual para validação
      />
    </Modal>
  );
};

export default WithdrawModal;