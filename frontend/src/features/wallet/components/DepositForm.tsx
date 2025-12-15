'use client';

import React, { useState } from 'react';
import { GlassInput } from '@/shared/components/GlassInput'; // <--- Importe o novo input
import { DollarSign, ArrowDownCircle, Loader2, Info } from 'lucide-react';

export interface DepositFormValues {
  amount: number;
}

interface DepositFormProps {
  onSubmit: (values: DepositFormValues) => Promise<void>;
  isLoading?: boolean;
  onCancel: () => void;
  currencySymbol: string;
}

const DepositForm: React.FC<DepositFormProps> = ({ onSubmit, isLoading, onCancel, currencySymbol }) => {
  const [amount, setAmount] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    await onSubmit({ amount: Number(amount) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      
      {/* Aviso Amigável */}
      <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-start gap-3">
        <div className="p-2 bg-emerald-500/20 rounded-full text-emerald-400">
            <ArrowDownCircle size={20} />
        </div>
        <div>
            <h4 className="text-emerald-400 font-bold text-sm">Depósito Simulado</h4>
            <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                Como este é um ambiente de teste, o valor será creditado <strong>imediatamente</strong> na sua carteira. 
                <br/>Sem taxas, sem espera de blockchain.
            </p>
        </div>
      </div>

      <GlassInput 
        label={`Valor a Depositar (${currencySymbol})`} 
        icon={DollarSign} 
        value={amount} 
        onChange={handleChange} 
        placeholder="0.00" 
        required 
        autoFocus
        fullWidth
      />

      <div className="pt-2 flex justify-end gap-3">
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
          disabled={isLoading || !amount || Number(amount) <= 0}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <ArrowDownCircle size={18} />}
          Confirmar Depósito
        </button>
      </div>
    </form>
  );
};

export default DepositForm;