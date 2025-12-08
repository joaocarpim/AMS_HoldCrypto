'use client';
import { Box, Typography, Button, Stack } from '@mui/material';
import { Wallet } from '@/features/wallet/services/walletService';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import CoinIcon from '@/features/currency/components/CoinIcon'; // Importação do novo componente

// Função de formatação de valores grandes
const formatCurrencyValue = (value: number | undefined | null): string => {
    const numericValue = Number(value);
    if (isNaN(numericValue) || value === undefined || value === null) return "R$ --";
    
    // Se for pequeno, mostra com precisão
    if (numericValue < 1000 && numericValue > -1000) {
        return numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
    }
    
    // Abreviações para valores grandes
    const prefix = "R$ ";
    if (numericValue >= 1_000_000_000_000) return prefix + (numericValue / 1_000_000_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + " T";
    if (numericValue >= 1_000_000_000) return prefix + (numericValue / 1_000_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + " B";
    if (numericValue >= 1_000_000) return prefix + (numericValue / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + " M";
    
    return numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

interface WalletCardProps {
    wallet: Wallet;
    currencySymbol?: string;
    valueBRL: number | undefined;
    onDepositClick: () => void;
}

export const WalletCard = ({ wallet, currencySymbol, valueBRL, onDepositClick }: WalletCardProps) => {
    const displayValueBRL = valueBRL;
    const displayAmount = Number(wallet.balance);
    const displayName = wallet.name;
    // Habilita ações apenas para Spot e Funding
    const showActions = wallet.category === 'Spot' || wallet.category === 'Funding';

    return (
        <div className="glass-panel p-5 rounded-2xl relative group hover:bg-white/5 transition-all duration-300 border border-white/5 hover:border-yellow-500/20">
            {/* Topo do Card */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    {/* NOVO ÍCONE DINÂMICO */}
                    <div className="w-10 h-10 flex items-center justify-center filter drop-shadow-lg">
                        <CoinIcon symbol={currencySymbol || '?'} name={displayName} size={40} />
                    </div>
                    
                    <div>
                        <h4 className="font-bold text-white leading-tight">{displayName}</h4>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest bg-black/30 px-1.5 py-0.5 rounded">
                            {wallet.category}
                        </span>
                    </div>
                </div>

                {/* Quantidade (Se não for BRL) */}
                {currencySymbol !== 'BRL' && (
                    <div className="text-right">
                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Saldo</p>
                        <p className="text-sm font-mono text-gray-300 font-medium">
                            {displayAmount.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 8 })} <span className="text-xs text-yellow-500/80">{currencySymbol}</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Valor Principal em BRL */}
            <div className="mb-6">
                <p className="text-2xl font-bold text-white tracking-tight font-mono">
                    {formatCurrencyValue(displayValueBRL)}
                </p>
            </div>

            {/* Botões de Ação (Aparecem suaves) */}
            {showActions && (
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={onDepositClick}
                        disabled={wallet.currencySymbol !== 'BRL'}
                        className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all
                            ${wallet.currencySymbol === 'BRL' 
                                ? 'bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/20' 
                                : 'bg-white/5 text-gray-500 cursor-not-allowed opacity-50'}`}
                        title={wallet.currencySymbol !== 'BRL' ? "Depósito direto apenas em BRL (Use Trade para cripto)" : "Depositar BRL"}
                    >
                        <ArrowDownLeft size={16} /> Depositar
                    </button>
                    
                    <button 
                        disabled 
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all cursor-not-allowed opacity-70"
                    >
                        <ArrowUpRight size={16} /> Sacar
                    </button>
                </div>
            )}
        </div>
    );
};