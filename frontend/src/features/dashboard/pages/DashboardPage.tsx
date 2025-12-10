'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Grid } from '@mui/material';
import { useAuthUser } from '@/features/auth/store/useAuthStore';
import { Plus, Calendar, Clock } from 'lucide-react';

import { 
  useDashboardLoading, 
  useDashboardError, 
  useDashboardActions, 
  useDashboardCurrencies 
} from '@/features/dashboard/store/DashboardStore';

// IMPORT DO SKELETON
import { DashboardSkeleton } from '@/features/dashboard/components/DashboardSkeleton';

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
    const currencies = useDashboardCurrencies(); 
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
    const [currentDate, setCurrentDate] = useState<string>("");
    const [currentTime, setCurrentTime] = useState<string>("");

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

    useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

    useEffect(() => {
        const loadHistory = async () => {
            if (user.id && !loading) {
                try {
                    const data = await walletService.getHistory(user.id);
                    setTransactions(data);
                } catch (e) { console.error("Erro histórico:", e); }
            }
        };
        loadHistory();
    }, [user.id, loading]); 

    if (error) {
       return (
         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', flexDirection: 'column' }}>
            <span className="text-red-500 font-bold text-lg mb-2">Erro de Conexão</span>
            <span className="text-gray-400 text-center px-4">{error}</span>
         </Box>
      );
    }

    // CORREÇÃO: Uso do Skeleton Screen em vez de Spinner
    if (loading) {
      return (
        <Container maxWidth="xl" sx={{ p: 0 }}>
           <DashboardSkeleton />
        </Container>
      );
    }

   return (
        <Container maxWidth="xl" sx={{ p: 0 }}>
            {/* Header Responsivo */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                        Olá, <span className="text-yellow-500">{user.name?.split(' ')[0]}</span> 👋
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-gray-400 text-xs md:text-sm font-medium">
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
                    className="w-full md:w-auto flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(240,185,11,0.3)] hover:shadow-[0_0_25px_rgba(240,185,11,0.5)] active:scale-95"
                >
                    <Plus size={20} strokeWidth={3} />
                    Nova Carteira
                </button>
            </div>

            <div className="mb-8">
                <StatsCards />
            </div>

            {/* Grid Principal */}
            <Grid container spacing={4}>
                {/* Coluna Principal */}
                <Grid item xs={12} lg={8}>
                    <div className="space-y-8">
                        <div className="glass-panel p-1 rounded-3xl overflow-hidden h-[300px] md:h-auto">
                            <OverviewChart />
                        </div>
                        
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-yellow-500 rounded-full"></span>
                                    Ativos em Carteira
                                </h3>
                            </div>
                            <WalletGrid />
                        </div>

                        <TransactionsTable transactions={transactions} />
                    </div>
                </Grid>

                {/* Coluna Lateral */}
                <Grid item xs={12} lg={4}>
                    <div className="space-y-8 sticky top-6">
                        <div className="glass-panel p-6 rounded-3xl border border-yellow-500/20 shadow-[0_0_30px_rgba(240,185,11,0.05)] relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <SwapWidget />
                        </div>

                        <div className="glass-panel p-6 rounded-3xl">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                🔥 Tendências de Mercado
                            </h3>
                            <HotList />
                        </div>
                    </div>
                </Grid>
            </Grid>

            <CreateWalletModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                currencies={currencies} 
            />
        </Container>
    );
}