'use client';

import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Container, Grid } from '@mui/material';
import { useAuthUser } from '@/features/auth/store/useAuthStore';
import { Plus, Calendar, Clock } from 'lucide-react';

// Imports da Arquitetura
// 1. ADICIONE useDashboardCurrencies AQUI
import { 
  useDashboardLoading, 
  useDashboardError, 
  useDashboardActions, 
  useDashboardCurrencies 
} from '@/features/dashboard/store/DashboardStore';

import { StatsCards } from '@/features/dashboard/components/StatsCards';
import { OverviewChart } from '@/features/dashboard/components/OverviewChart';
import { HotList } from '@/features/dashboard/components/HotList';
import { WalletGrid } from '@/features/dashboard/components/WalletGrid';
import { SwapWidget } from '@/features/dashboard/components/SwapWidget';
import CreateWalletModal from '@/features/wallet/components/CreateWalletModal';
import TransactionsTable from '@/features/wallet/components/TransactionsTable';
import walletService, { WalletTransaction } from '@/features/wallet/services/walletService';

export default function DashboardPage() {
    const user = useAuthUser();
    const loading = useDashboardLoading();
    const error = useDashboardError();
    const { fetchDashboardData } = useDashboardActions();
    
    // 2. PEGUE AS MOEDAS DO STORE
    const currencies = useDashboardCurrencies(); 
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    
    // Estado para data/hora
    const [currentDate, setCurrentDate] = useState<string>("");
    const [currentTime, setCurrentTime] = useState<string>("");

    // Atualiza relógio
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentDate(now.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
            setCurrentTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
        };
        updateTime();
        const timer = setInterval(updateTime, 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    useEffect(() => {
        const loadHistory = async () => {
            if (user.id) {
                try {
                    const data = await walletService.getHistory(user.id);
                    setTransactions(data);
                } catch (e) {
                    console.error("Erro histórico:", e);
                }
            }
        };
        if (!loading) loadHistory();
    }, [user.id, loading]); 

    if (error) {
       return (
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
            <span className="text-red-500 font-bold text-lg mb-2">Erro de Conexão</span>
            <span className="text-gray-400">{error}</span>
         </Box>
      );
    }

    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <div className="flex flex-col items-center gap-4">
             <CircularProgress sx={{ color: '#F0B90B' }} />
             <span className="text-yellow-500 font-mono text-sm animate-pulse">SINCRONIZANDO BLOCKCHAIN...</span>
          </div>
        </Box>
      );
    }

   return (
        <Container maxWidth="xl" sx={{ p: 0 }}>
            {/* Header da Página - Estilo "Welcome" */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1">
                        Olá, <span className="text-yellow-500">{user.name?.split(' ')[0]}</span> 👋
                    </h1>
                    <div className="flex items-center gap-4 text-gray-400 text-sm font-medium">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-yellow-500" />
                            <span className="capitalize">{currentDate}</span>
                        </div>
                        <div className="hidden md:block h-1 w-1 rounded-full bg-gray-600"></div>
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-yellow-500" />
                            <span>{currentTime}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(240,185,11,0.3)] hover:shadow-[0_0_25px_rgba(240,185,11,0.5)] active:scale-95"
                >
                    <Plus size={20} strokeWidth={3} />
                    Nova Carteira
                </button>
            </div>

            {/* Cards de Estatísticas */}
            <div className="mb-8">
                <StatsCards />
            </div>

            {/* Grid Principal */}
            <Grid container spacing={4}>
                {/* Coluna Principal (Esquerda) */}
                <Grid item xs={12} xl={8}>
                    <div className="space-y-8">
                        {/* Gráfico */}
                        <div className="glass-panel p-1 rounded-3xl overflow-hidden">
                            <OverviewChart />
                        </div>
                        
                        {/* Carteiras */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-yellow-500 rounded-full"></span>
                                    Ativos em Carteira
                                </h3>
                            </div>
                            <WalletGrid />
                        </div>

                        {/* Histórico */}
                        <TransactionsTable transactions={transactions} />
                    </div>
                </Grid>

                {/* Coluna Lateral (Direita) */}
                <Grid item xs={12} xl={4}>
                    <div className="space-y-8 sticky top-6">
                        {/* Swap Widget */}
                        <div className="glass-panel p-6 rounded-3xl border border-yellow-500/20 shadow-[0_0_30px_rgba(240,185,11,0.05)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <SwapWidget />
                        </div>

                        {/* Hot List */}
                        <div className="glass-panel p-6 rounded-3xl">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                🔥 Tendências de Mercado
                            </h3>
                            <HotList />
                        </div>
                    </div>
                </Grid>
            </Grid>

            {/* 3. PASSE AS MOEDAS PARA O MODAL */}
            <CreateWalletModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                currencies={currencies} 
            />
        </Container>
    );
}