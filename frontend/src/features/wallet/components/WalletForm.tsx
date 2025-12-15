'use client';

import React, { useState, useEffect } from 'react';
import { WalletCategory } from '../services/walletService';
import { GlassInput } from '@/shared/components/GlassInput';
import { GlassSelect } from '@/shared/components/GlassSelect';
import { Wallet, Globe, Tag, Loader2, Save } from 'lucide-react';
import { Currency } from '@/features/currency/types/Currency'; // Importe o tipo

export interface WalletFormValues {
  name: string;
  category: WalletCategory;
  currencySymbol: string;
}

interface WalletFormProps {
  onSubmit: (values: WalletFormValues & { balance: 0 }) => Promise<void>;
  isLoading?: boolean;
  onCancel?: () => void;
  currencies: Currency[]; // <--- NOVO: Recebe a lista de moedas
}

const categoryOptions = [
    { value: "Spot", label: "Spot (Principal)" },
    { value: "Funding", label: "Funding (Investimentos)" },
    { value: "Overview", label: "Overview" }
];

const WalletForm: React.FC<WalletFormProps> = ({ onSubmit, isLoading, onCancel, currencies }) => {
  // Removido: const availableCurrencies = useDashboardCurrencies();

  const [values, setValues] = useState<WalletFormValues>({
    name: '',
    category: 'Spot',
    currencySymbol: '',
  });

  // Define moeda padrão ao carregar
  useEffect(() => {
    if (currencies.length > 0 && !values.currencySymbol) {
        setValues(prev => ({ ...prev, currencySymbol: currencies[0].symbol }));
    }
  }, [currencies, values.currencySymbol]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.name || !values.currencySymbol) return;
    await onSubmit({ ...values, balance: 0 });
  };

  // Prepara as opções para o GlassSelect usando a prop
  const currencyOptions = currencies.map(c => ({
      value: c.symbol,
      label: `${c.name} (${c.symbol})`
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-5 mt-2">
      
      {/* Input de Texto */}
      <GlassInput 
        label="Nome da Carteira" 
        icon={Wallet} 
        name="name" 
        value={values.name} 
        onChange={handleChange} 
        placeholder='Ex: Minha Bitcoin Principal' 
        required 
        fullWidth
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Select de Moedas */}
        <GlassSelect 
            label="Moeda"
            icon={Globe}
            name="currencySymbol"
            value={values.currencySymbol}
            onChange={handleChange}
            options={currencyOptions}
            disabled={currencies.length === 0}
        />

        {/* Select de Categoria */}
        <GlassSelect 
            label="Categoria"
            icon={Tag}
            name="category"
            value={values.category}
            onChange={handleChange}
            options={categoryOptions}
        />
      </div>

      <div className="pt-4 flex justify-end gap-3 border-t border-white/5 mt-6">
        {onCancel && (
            <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-xl transition-all text-sm"
            >
                Cancelar
            </button>
        )}
        <button
          type="submit"
          disabled={isLoading || currencies.length === 0}
          className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Criar Carteira
        </button>
      </div>
    </form>
  );
};

export default WalletForm;