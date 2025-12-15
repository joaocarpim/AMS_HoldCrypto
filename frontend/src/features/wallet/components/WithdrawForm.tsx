'use client';

import React, { useState } from 'react';
import { GlassInput } from '@/shared/components/GlassInput';
import { DollarSign, ArrowUpRight, Loader2, AlertCircle } from 'lucide-react';

export interface WithdrawFormValues {
  amount: number;
}

interface WithdrawFormProps {
  onSubmit: (values: WithdrawFormValues) => Promise<void>;
  isLoading?: boolean;
  onCancel: () => void;
  currencySymbol: string;
  maxBalance: number; // Precisamos saber quanto o usuário tem
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({ onSubmit, isLoading, onCancel, currencySymbol, maxBalance }) => {
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);

    if (!amount || numAmount <= 0) {
        setError("Digite um valor válido.");
        return;
    }

    if (numAmount > maxBalance) {
        setError("Saldo insuficiente para realizar este saque.");
        return;
    }

    await onSubmit({ amount: numAmount });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      
      {/* Aviso de Saldo */}
      <div className="flex justify-between items-center px-2">
        <span className="text-xs font-bold text-gray-500 uppercase">Disponível para saque</span>
        <span className="text-sm font-mono text-white font-bold">
            {maxBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 })} {currencySymbol}
        </span>
      </div>

      <div className="relative">
        <GlassInput 
            label={`Valor do Saque (${currencySymbol})`} 
            icon={DollarSign} 
            value={amount} 
            onChange={handleChange} 
            placeholder="0.00" 
            required 
            autoFocus
            fullWidth
            className={error ? "!border-red-500/50 focus:!ring-red-500/20" : ""}
        />
        {error && (
            <div className="absolute -bottom-6 left-0 flex items-center gap-1 text-red-400 text-xs mt-1">
                <AlertCircle size={12} /> {error}
            </div>
        )}
      </div>

      {/* Botão de "Max" para facilitar */}
      <div className="flex justify-end">
        <button 
            type="button"
            onClick={() => setAmount(maxBalance.toString())}
            className="text-xs text-yellow-500 hover:text-yellow-400 font-bold uppercase tracking-wider"
        >
            USAR MÁXIMO
        </button>
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-white/5">
        <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl transition-all text-sm border border-white/5"
        >
            Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading || !amount || Number(amount) <= 0 || Number(amount) > maxBalance}
          className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <ArrowUpRight size={18} />}
          Confirmar Saque
        </button>
      </div>
    </form>
  );
};

export default WithdrawForm;