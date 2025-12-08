'use client';

import React, { useState } from 'react';
import Modal from '@/shared/components/Modal';
import WalletForm, { WalletFormValues } from './WalletForm';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import walletService from '../services/walletService';
import { useDashboardActions } from '@/features/dashboard/store/DashboardStore';
import { useNotification } from '@/shared/context/NotificationContext';
import { Currency } from '@/features/currency/types/Currency';

interface CreateWalletModalProps {
  open: boolean;
  onClose: () => void;
  currencies: Currency[];
}

const CreateWalletModal: React.FC<CreateWalletModalProps> = ({ open, onClose, currencies }) => {
  const { user } = useAuthStore();
  const { fetchDashboardData } = useDashboardActions();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: WalletFormValues & { balance: 0 }) => {
    if (!user.id) {
        showNotification("Erro: ID do usuário não encontrado. Faça login novamente.", "error");
        return;
    }
    
    // --- TENTATIVA 1: Enviando Categoria como NÚMERO (Padrão C#) ---
    const categoryMap: Record<string, number> = {
        "Spot": 0,     
        "Funding": 1,
        "Overview": 2
    };

    // Payload montado manualmente
    const walletDataToSend = { 
        userId: Number(user.id), // Garante que é número
        name: values.name,
        currencySymbol: values.currencySymbol, // Ex: "BTC"
        balance: 0,
        category: categoryMap[values.category] ?? 0 
    };
    
    console.log("🚀 ENVIANDO PAYLOAD:", JSON.stringify(walletDataToSend, null, 2));

    setIsLoading(true);
    try {
        // @ts-ignore
        await walletService.createWallet(walletDataToSend);
        
        showNotification(`Carteira "${values.name}" criada com sucesso!`, "success");
        fetchDashboardData(); 
        onClose(); 
    } catch (error: any) {
        console.error("❌ ERRO COMPLETO:", error);
        
        const serverResponse = error.response?.data;
        let errorMsg = "Erro desconhecido ao criar carteira.";

        // Lógica para extrair a mensagem de erro exata do .NET
        if (serverResponse) {
            console.log("🔍 DETALHES DO ERRO:", JSON.stringify(serverResponse, null, 2));

            if (serverResponse.errors) {
                // Erro de Validação (Ex: "Category is invalid")
                const errors = serverResponse.errors;
                const firstErrorKey = Object.keys(errors)[0];
                errorMsg = `${firstErrorKey}: ${errors[firstErrorKey][0]}`;
            } 
            else if (typeof serverResponse === 'string') {
                errorMsg = serverResponse;
            }
            else if (serverResponse.message) {
                errorMsg = serverResponse.message;
            }
            else if (serverResponse.title) {
                errorMsg = serverResponse.title; // Ex: "One or more validation errors occurred."
            }
        }

        showNotification(`Falha: ${errorMsg}`, "error");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Criar Nova Carteira">
      <WalletForm
          onSubmit={handleSubmit} 
          isLoading={isLoading}
          onCancel={onClose}
          currencies={currencies}
      />
    </Modal>
  );
};

export default CreateWalletModal;