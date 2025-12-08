'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useAuthUser } from '@/features/auth/store/useAuthStore';
import walletService, { Wallet, WalletTransaction } from '../services/walletService';
import currencyService from '@/features/currency/services/currencyService';
import { Plus, Loader2, ArrowUpRight, ArrowDownLeft, ShieldCheck, Search, SlidersHorizontal, RefreshCw, Trash2 } from 'lucide-react';
import { useNotification } from '@/shared/context/NotificationContext';
import { useRouter } from 'next/navigation';

// Components
import CreateWalletModal from '../components/CreateWalletModal';
import DepositModal from '../components/DepositModal';
import WithdrawModal from '../components/WithdrawModal';
import TransactionsTable from '../components/TransactionsTable';
import { PortfolioHero } from '../components/PortfolioHero';
import { Currency } from '@/features/currency/types/Currency';

export default function WalletPage() {
  const user = useAuthUser();
  const router = useRouter();
  const { showNotification } = useNotification();
  
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modais
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

  const fetchData = useCallback(async () => {
    if (!user.id) return;
    try {
      setIsLoading(true);
      const [walletsData, historyData, currenciesData] = await Promise.all([
        walletService.getUserWallets(user.id),
        walletService.getHistory(user.id),
        currencyService.getAll()
      ]);
      setWallets(walletsData);
      setTransactions(historyData);
      setCurrencies(currenciesData);
    } catch (error) {
      console.error("Erro ao carregar:", error);
      showNotification("Erro de sincronização.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [user.id, showNotification]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const priceMap = useMemo(() => {
    return currencies.reduce((acc, curr) => {
        const latestPrice = curr.histories?.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())[0]?.price || 0;
        acc[curr.symbol] = latestPrice;
        return acc;
    }, {} as Record<string, number>);
  }, [currencies]);

  // Handlers
  const handleDepositClick = (wallet: Wallet) => { setSelectedWallet(wallet); setIsDepositOpen(true); };
  const handleWithdrawClick = (wallet: Wallet) => { setSelectedWallet(wallet); setIsWithdrawOpen(true); };
  const handleModalClose = () => {
    setIsCreateOpen(false); setIsDepositOpen(false); setIsWithdrawOpen(false);
    setSelectedWallet(null); fetchData();
  };

  // --- HANDLER DE DELETAR CARTEIRA ---
  const handleDeleteWallet = async (id: number, name: string) => {
    if (confirm(`ATENÇÃO: Tem certeza que deseja excluir a carteira "${name}"? Todo o histórico e saldo serão perdidos permanentemente.`)) {
        try {
            setIsLoading(true);
            await walletService.deleteWallet(id);
            showNotification("Carteira excluída com sucesso.", "success");
            fetchData(); 
        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || "Erro ao excluir carteira.";
            showNotification(msg, "error");
        } finally {
            setIsLoading(false);
        }
    }
  };

  const totalBalanceBRL = useMemo(() => {
    return wallets.reduce((acc, w) => {
        const price = w.currencySymbol === 'BRL' ? 1 : (priceMap[w.currencySymbol] || 0);
        return acc + (Number(w.balance) * price);
    }, 0);
  }, [wallets, priceMap]);

  const getGlowColor = (symbol: string) => {
      switch(symbol) {
          case 'BTC': return 'bg-yellow-500/10 group-hover:bg-yellow-500/20';
          case 'ETH': return 'bg-blue-500/10 group-hover:bg-blue-500/20';
          case 'USDT': return 'bg-green-500/10 group-hover:bg-green-500/20';
          case 'BRL': return 'bg-emerald-500/10 group-hover:bg-emerald-500/20';
          default: return 'bg-white/5 group-hover:bg-white/10';
      }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-10 pb-20">
      
      <div className="max-w-7xl mx-auto">
        
        <PortfolioHero wallets={wallets} priceMap={priceMap} />

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span className="w-1.5 h-6 bg-yellow-500 rounded-full"></span>
                Minhas Carteiras
                <span className="text-xs font-normal text-gray-500 bg-white/5 px-2 py-1 rounded-full">{wallets.length}</span>
            </h3>
            
            <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                    <input type="text" placeholder="Filtrar..." className="bg-[#0f172a] border border-white/10 rounded-xl py-2 pl-9 pr-4 text-sm text-white focus:outline-none w-full md:w-48" />
                </div>
                <button 
                    onClick={() => setIsCreateOpen(true)}
                    className="flex items-center gap-2 px-5 py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(240,185,11,0.2)] active:scale-95 text-sm"
                >
                    <Plus size={18} strokeWidth={3} /> Nova Carteira
                </button>
            </div>
        </div>

        {/* 3. GRID DE CARTEIRAS */}
        {isLoading ? (
            <div className="flex justify-center p-20"><Loader2 className="animate-spin text-yellow-500" size={40}/></div>
        ) : wallets.length === 0 ? (
            <div className="p-16 border-2 border-dashed border-white/10 rounded-3xl text-center bg-white/[0.02]">
                <p className="text-gray-400 mb-4 text-lg">Sua coleção de ativos começa aqui.</p>
                <button onClick={() => setIsCreateOpen(true)} className="text-yellow-500 font-bold hover:underline">Criar a primeira carteira</button>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {wallets.map(wallet => {
                    const price = wallet.currencySymbol === 'BRL' ? 1 : (priceMap[wallet.currencySymbol] || 0);
                    const valueInBRL = Number(wallet.balance) * price;
                    const glowClass = getGlowColor(wallet.currencySymbol);

                    return (
                        <div key={wallet.id} className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-all group relative overflow-hidden shadow-xl">
                            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2 transition-all ${glowClass}`}></div>

                            {/* BOTÃO DE EXCLUIR */}
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteWallet(wallet.id, wallet.name);
                                }}
                                className="absolute top-4 right-4 p-2 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all z-20 opacity-0 group-hover:opacity-100"
                                title="Excluir Carteira"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-[#1e293b] flex items-center justify-center text-lg font-bold text-white border border-white/5 shadow-inner">
                                        {wallet.currencySymbol[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white leading-tight text-lg">{wallet.name}</h3>
                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold flex items-center gap-1">
                                            {wallet.category} • {wallet.currencySymbol}
                                        </span>
                                    </div>
                                </div>
                                {wallet.category === 'Spot' && <div className="bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20"><ShieldCheck size={16} className="text-emerald-500" /></div>}
                            </div>

                            <div className="mb-8 relative z-10">
                                <p className="text-3xl font-mono font-bold text-white tracking-tight">
                                    {Number(wallet.balance).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 })} 
                                </p>
                                <p className="text-sm text-gray-500 mt-1 font-medium">
                                    ≈ {valueInBRL.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </p>
                            </div>

                            <div className="flex gap-3 relative z-10">
                                {wallet.currencySymbol === 'BRL' ? (
                                    <button 
                                        onClick={() => handleDepositClick(wallet)} 
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-xl border border-emerald-500/20 transition-all active:scale-95"
                                    >
                                        <ArrowDownLeft size={14} /> Depositar
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => router.push('/dashboard')} 
                                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 text-xs font-bold uppercase tracking-wider rounded-xl border border-yellow-500/20 transition-all active:scale-95"
                                    >
                                        <RefreshCw size={14} /> Comprar
                                    </button>
                                )}

                                <button 
                                    onClick={() => handleWithdrawClick(wallet)} 
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-xl border border-white/5 transition-all"
                                >
                                    <ArrowUpRight size={14} className="text-red-400" /> Sacar
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}

        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                    Últimas Atividades
                </h3>
                <button className="text-sm text-gray-500 hover:text-white transition-colors flex items-center gap-1">
                    <SlidersHorizontal size={14} /> Filtrar
                </button>
            </div>
            <TransactionsTable transactions={transactions} />
        </div>

      </div>

      <CreateWalletModal open={isCreateOpen} onClose={handleModalClose} currencies={currencies} />
      <DepositModal open={isDepositOpen} onClose={handleModalClose} wallet={selectedWallet} />
      <WithdrawModal open={isWithdrawOpen} onClose={handleModalClose} wallet={selectedWallet} />

    </div>
  );
}