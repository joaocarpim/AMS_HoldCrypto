'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useAuthUser } from '@/features/auth/store/useAuthStore';
import { Plus, Wallet as WalletIcon, History, Eye, EyeOff, PieChart, TrendingUp } from 'lucide-react';
import { useNotification } from '@/shared/context/NotificationContext';

// Imports da Store
import { 
  useDashboardLoading, 
  useDashboardActions, 
  useDashboardCurrencies,
  useDashboardWallets 
} from '@/features/dashboard/store/DashboardStore';

// Componentes
import CreateWalletModal from '../components/CreateWalletModal';
import DepositModal from '../components/DepositModal'; 
import WithdrawModal from '../components/WithdrawModal';
import TransactionsTable from '@/features/wallet/components/TransactionsTable';
import { WalletGrid } from '@/features/dashboard/components/WalletGrid';
import { WalletSkeleton } from '../components/WalletSkeleton';
import { Wallet } from '../services/walletService'; 

export default function WalletPage() {
  const user = useAuthUser();
  const { fetchDashboardData } = useDashboardActions();
  const loading = useDashboardLoading();
  const wallets = useDashboardWallets();
  const currencies = useDashboardCurrencies();
  
  // Estados dos Modais
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  
  const [hideBalance, setHideBalance] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Handlers para passar ao Grid
  const handleDeposit = (wallet: Wallet) => {
      setSelectedWallet(wallet);
      setIsDepositOpen(true);
  };

  const handleWithdraw = (wallet: Wallet) => {
      setSelectedWallet(wallet);
      setIsWithdrawOpen(true);
  };

  const handleCloseModals = () => {
      setIsCreateOpen(false);
      setIsDepositOpen(false);
      setIsWithdrawOpen(false);
      setSelectedWallet(null);
      fetchDashboardData(); // Atualiza dados após operação
  };

  // Cálculo de Patrimônio e Distribuição (CORRIGIDO)
  const { totalBalanceBRL, allocation } = useMemo(() => {
    let total = 0;
    const items = wallets.map(wallet => {
        const balance = Number(wallet.balance);
        let valueInBRL = 0;

        if (wallet.currencySymbol === 'BRL') {
            valueInBRL = balance;
        } else {
            const currency = currencies.find(c => c.symbol === wallet.currencySymbol);
            
            // --- CORREÇÃO DE LÓGICA DE PREÇO (IGUAL AO DASHBOARD) ---
            let price = 0;
            if (currency?.histories && currency.histories.length > 0) {
                // Ordena do MAIS NOVO para o MAIS ANTIGO para pegar o preço atual no índice 0
                const sortedHistory = [...currency.histories].sort((a, b) => 
                    new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
                );
                price = sortedHistory[0].price;
            }
            // ---------------------------------------------------------

            valueInBRL = balance * price;
        }
        
        total += valueInBRL;
        return { 
            symbol: wallet.currencySymbol, 
            value: valueInBRL,
            color: wallet.currencySymbol === 'BTC' ? 'bg-orange-500' : 
                   wallet.currencySymbol === 'ETH' ? 'bg-blue-500' : 
                   wallet.currencySymbol === 'USDT' ? 'bg-green-500' : 
                   wallet.currencySymbol === 'BRL' ? 'bg-green-600' : 'bg-purple-500'
        };
    });

    const sortedAllocation = items
        .filter(i => i.value > 0)
        .sort((a, b) => b.value - a.value)
        .map(i => ({
            ...i,
            percent: total === 0 ? 0 : (i.value / total) * 100
        }));

    return { totalBalanceBRL: total, allocation: sortedAllocation.slice(0, 4) };
  }, [wallets, currencies]);

  // Histórico
  useEffect(() => {
      const loadTx = async () => {
          if(!user.id) return;
          const { default: walletService } = await import('@/features/wallet/services/walletService');
          try {
              const data = await walletService.getHistory(user.id);
              setTransactions(data);
          } catch(e) { console.error(e); }
      };
      loadTx();
  }, [user.id]);

  if (loading) return <div className="p-6 md:p-10"><WalletSkeleton /></div>;

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-10 pb-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                    <WalletIcon className="text-yellow-500" size={32} />
                    Minhas Carteiras
                </h1>
                <p className="text-gray-400 text-sm">Visão consolidada do seu patrimônio.</p>
            </div>
            <button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(240,185,11,0.3)] active:scale-95">
                <Plus size={20} strokeWidth={3} /> Nova Carteira
            </button>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
            <div className="lg:col-span-2 relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-[#0f172a] to-[#1e293b] border border-white/10 shadow-2xl group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-yellow-500/10 transition-all duration-700"></div>
                
                <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <span className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest bg-black/20 px-3 py-1 rounded-lg">
                            <TrendingUp size={16} className="text-emerald-500" /> Patrimônio Estimado
                        </span>
                        <button onClick={() => setHideBalance(!hideBalance)} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
                            {hideBalance ? <Eye size={20} /> : <EyeOff size={20} />}
                        </button>
                    </div>
                    <div className="mt-6 mb-4">
                        <h2 className="text-4xl md:text-6xl font-mono font-bold text-white tracking-tight">
                            {hideBalance ? 'R$ ••••••••' : totalBalanceBRL.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </h2>
                    </div>
                </div>
            </div>
            
            <div className="lg:col-span-1 bg-[#0b0f19] border border-white/5 rounded-3xl p-6 flex flex-col justify-center">
                <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                    <PieChart size={14} /> Distribuição da Carteira
                </h4>
                <div className="space-y-4">
                    {allocation.length > 0 ? allocation.map((item) => (
                        <div key={item.symbol}>
                            <div className="flex justify-between text-xs mb-1">
                                <span className="font-bold text-white">{item.symbol}</span>
                                <span className="text-gray-400">{item.percent.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                                <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.percent}%` }}></div>
                            </div>
                        </div>
                    )) : (<p className="text-xs text-gray-500 text-center py-4">Sem ativos.</p>)}
                </div>
            </div>
        </div>

        {/* Grid de Carteiras */}
        <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-yellow-500 rounded-full"></span> Ativos Disponíveis
                </h3>
            </div>
            
            <WalletGrid 
                onDeposit={handleDeposit} 
                onWithdraw={handleWithdraw} 
            />
        </div>

        {/* Histórico */}
        <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <History className="text-gray-400" size={24} /> Últimas Movimentações
            </h3>
            <TransactionsTable transactions={transactions} />
        </div>

      </div>

      <CreateWalletModal open={isCreateOpen} onClose={handleCloseModals} currencies={currencies} />
      <DepositModal open={isDepositOpen} onClose={handleCloseModals} wallet={selectedWallet} />
      <WithdrawModal open={isWithdrawOpen} onClose={handleCloseModals} wallet={selectedWallet} />
    </div>
  );
}