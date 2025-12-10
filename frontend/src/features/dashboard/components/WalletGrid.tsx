'use client';
import { useState } from 'react';
import { Grid } from '@mui/material';
import { ArrowUpRight, ArrowDownLeft, ShieldCheck, Eye, EyeOff, RefreshCw } from 'lucide-react'; // Adicionei RefreshCw
import { motion } from 'framer-motion';
import { useDashboardWallets, useDashboardCurrencies } from '../store/DashboardStore';
import { useRouter } from 'next/navigation';
import { Wallet } from '@/features/wallet/services/walletService';
import CoinIcon from '@/features/currency/components/CoinIcon'; // Importe o ícone

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const getCoinStyle = (symbol: string) => {
    switch(symbol) {
        case 'BTC': return { bg: 'bg-orange-500/20', text: 'text-orange-500', border: 'border-orange-500/20' };
        case 'ETH': return { bg: 'bg-blue-600/20', text: 'text-blue-500', border: 'border-blue-500/20' };
        case 'SOL': return { bg: 'bg-purple-600/20', text: 'text-purple-500', border: 'border-purple-500/20' };
        case 'USDT': return { bg: 'bg-emerald-500/20', text: 'text-emerald-500', border: 'border-emerald-500/20' };
        case 'BRL': return { bg: 'bg-green-600/20', text: 'text-green-500', border: 'border-green-500/20' };
        default: return { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/20' };
    }
};

interface WalletGridProps {
    onDeposit?: (wallet: Wallet) => void;
    onWithdraw?: (wallet: Wallet) => void;
}

export const WalletGrid = ({ onDeposit, onWithdraw }: WalletGridProps) => {
  const router = useRouter();
  const wallets = useDashboardWallets();
  const currencies = useDashboardCurrencies();
  const [hideBalance, setHideBalance] = useState(false);

  const getPrice = (symbol: string) => {
      if (symbol === 'BRL') return 1;
      const currency = currencies.find(c => c.symbol === symbol);
      
      // Lógica segura para pegar preço
      let price = 0;
      if (currency?.histories && currency.histories.length > 0) {
          const sorted = [...currency.histories].sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
          price = sorted[0].price;
      }
      return price;
  };

  const handleAction = (action: 'deposit' | 'withdraw' | 'trade', wallet: Wallet) => {
      if (action === 'deposit' && onDeposit) return onDeposit(wallet);
      if (action === 'withdraw' && onWithdraw) return onWithdraw(wallet);
      if (action === 'trade') router.push('/dashboard'); // Vai para o Swap
  };

  if (!wallets || wallets.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
        <p className="text-gray-500 text-sm">Nenhuma carteira encontrada.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex justify-end mb-4">
         <button 
           onClick={() => setHideBalance(!hideBalance)}
           className="flex items-center gap-2 text-[10px] uppercase font-bold text-gray-500 hover:text-white transition-colors bg-white/5 px-2 py-1 rounded-lg border border-white/5 hover:border-white/10"
         >
            {hideBalance ? <Eye size={14} /> : <EyeOff size={14} />}
            {hideBalance ? 'Mostrar Saldos' : 'Ocultar Saldos'}
         </button>
      </div>

      <Grid container spacing={3}>
        {wallets.map((wallet, index) => {
          const style = getCoinStyle(wallet.currencySymbol);
          const price = getPrice(wallet.currencySymbol);
          const balance = Number(wallet.balance);
          const balanceInBRL = balance * price;
          const hasBalance = balance > 0;
          const isBRL = wallet.currencySymbol === 'BRL';

          const cardContainerClass = `relative p-5 rounded-2xl border transition-all group overflow-hidden h-full flex flex-col justify-between
            ${hasBalance 
                ? 'bg-[#0b0f19] border-white/10 hover:border-yellow-500/30 hover:shadow-lg hover:-translate-y-1' 
                : 'bg-[#0b0f19]/60 border-white/5 opacity-80 hover:opacity-100'
            }`;
          
          const glowClass = `absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 transition-opacity duration-500
            ${hasBalance ? 'opacity-20 group-hover:opacity-40' : 'opacity-0'} ${style.bg.replace('/20', '')}`;
          
          return (
            <Grid item xs={12} sm={6} md={4} key={wallet.id}>
              <motion.div 
                variants={itemVariants} 
                initial="hidden" 
                animate="visible" 
                transition={{ delay: index * 0.05 }}
                className="h-full"
              >
                <div className={cardContainerClass}>
                  <div className={glowClass}></div>

                  <div>
                      <div className="flex justify-between items-center mb-4 relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="filter drop-shadow-md">
                             <CoinIcon symbol={wallet.currencySymbol} name={wallet.name} size={40} />
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-sm leading-tight">{wallet.name}</h4>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{wallet.category} • {wallet.currencySymbol}</span>
                          </div>
                        </div>
                        {wallet.category === 'Spot' && <ShieldCheck size={14} className="text-emerald-500" />}
                      </div>

                      <div className="mb-4 relative z-10">
                          <p className="text-gray-500 text-[10px] font-bold uppercase mb-0.5">Saldo Disponível</p>
                          <h3 className="text-xl font-mono font-bold text-white tracking-tight truncate">
                              {hideBalance 
                                  ? '••••••••' 
                                  : (balance === 0 ? '0.00' : balance.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 }))
                              }
                              <span className={`text-xs ml-1.5 ${style.text}`}>{wallet.currencySymbol}</span>
                          </h3>
                          <p className="text-xs text-gray-600 font-medium mt-1">
                              {hideBalance 
                                ? 'R$ ••••' 
                                : `≈ ${balanceInBRL.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
                              }
                          </p>
                      </div>
                  </div>

                  <div className="flex gap-2 relative z-10 mt-auto">
                    {/* LOGICA DE NEGÓCIO: Se for BRL, deposita. Se for Cripto, Compra. */}
                    {isBRL ? (
                        <button 
                            onClick={() => handleAction('deposit', wallet)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase transition-colors border border-emerald-500/20 hover:border-emerald-500/30"
                        >
                            <ArrowDownLeft size={12} /> Depositar
                        </button>
                    ) : (
                        <button 
                            onClick={() => handleAction('trade', wallet)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase transition-colors border border-yellow-500/20 hover:border-yellow-500/30"
                        >
                            <RefreshCw size={12} /> Comprar
                        </button>
                    )}

                    <button 
                      onClick={() => handleAction('withdraw', wallet)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold uppercase transition-colors border border-white/5 hover:border-red-500/30 hover:text-red-400"
                    >
                      <ArrowUpRight size={12} /> Sacar
                    </button>
                  </div>

                </div>
              </motion.div>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};