'use client';
import { Grid } from '@mui/material';
import { ArrowUpRight, ArrowDownLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDashboardWallets, useDashboardCurrencies } from '../store/DashboardStore';
import { useRouter } from 'next/navigation';

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

export const WalletGrid = () => {
  const router = useRouter();
  const wallets = useDashboardWallets();
  const currencies = useDashboardCurrencies();

  const getPrice = (symbol: string) => {
      if (symbol === 'BRL') return 1;
      const currency = currencies.find(c => c.symbol === symbol);
      return currency?.histories?.[0]?.price || 0;
  };

  if (!wallets || wallets.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
        <p className="text-gray-500 text-sm">Nenhuma carteira encontrada.</p>
      </div>
    );
  }

  return (
    <Grid container spacing={3}>
      {wallets.map((wallet, index) => {
        const style = getCoinStyle(wallet.currencySymbol);
        const price = getPrice(wallet.currencySymbol);
        const balanceInBRL = Number(wallet.balance) * price;

        // Limpeza de estilos para garantir zero conflitos
        const cardContainerClass = "relative p-5 rounded-2xl bg-[#0b0f19] border border-white/5 hover:border-white/10 transition-all group overflow-hidden";
        const glowClass = `absolute top-0 right-0 w-24 h-24 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-40 transition-opacity ${style.bg.replace('/20', '')}`;
        const iconClass = `w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${style.bg} ${style.text} ${style.border} border`;
        
        return (
          <Grid item xs={12} sm={6} md={4} key={wallet.id}>
            <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: index * 0.1 }}>
              
              <div className={cardContainerClass}>
                
                {/* Glow Effect */}
                <div className={glowClass}></div>

                {/* Cabeçalho do Card */}
                {/* AQUI: Removi quebras de linha e garantimos apenas um 'items-center' */}
                <div className="flex justify-between items-center mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className={iconClass}>
                      {wallet.currencySymbol[0]}
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm leading-tight">{wallet.name}</h4>
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{wallet.category} • {wallet.currencySymbol}</span>
                    </div>
                  </div>
                  {wallet.category === 'Spot' && <ShieldCheck size={14} className="text-emerald-500" />}
                </div>

                {/* Saldo Principal */}
                <div className="mb-4 relative z-10">
                    {/* AQUI: 'font-bold' aparece apenas uma vez */}
                    <p className="text-gray-500 text-[10px] font-bold uppercase mb-0.5">Saldo Disponível</p>
                    
                    <h3 
                        className="text-xl font-mono font-bold text-white tracking-tight truncate" 
                        title={wallet.balance.toString()}
                    >
                        {Number(wallet.balance) === 0 
                            ? '0.00' 
                            : Number(wallet.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                        <span className={`text-xs ml-1.5 ${style.text}`}>{wallet.currencySymbol}</span>
                    </h3>
                    
                    <p className="text-xs text-gray-600 font-medium mt-1">
                        ≈ {balanceInBRL.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                </div>

                {/* Botões */}
                <div className="grid grid-cols-2 gap-2 relative z-10">
                  <button 
                    onClick={() => router.push('/wallet')}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold uppercase transition-colors border border-white/5"
                  >
                    <ArrowDownLeft size={12} /> Depositar
                  </button>
                  <button 
                    onClick={() => router.push('/wallet')}
                    className="flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-[10px] font-bold uppercase transition-colors border border-white/5"
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
  );
};