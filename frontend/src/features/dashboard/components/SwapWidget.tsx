// Caminho: frontend/src/features/dashboard/components/SwapWidget.tsx
'use client';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { CircularProgress } from '@mui/material';
import { ArrowDownUp, Wallet, RefreshCw, ArrowRight } from 'lucide-react';
import { useDashboardWallets, useDashboardCurrencies, useDashboardActions } from '../store/DashboardStore';
import { useAuthUser } from '@/features/auth/store/useAuthStore';
import { useNotification } from '@/shared/context/NotificationContext';
import walletService, { TradeRequestDTO } from '@/features/wallet/services/walletService';
import { GlassSelect } from '@/shared/components/GlassSelect';

export const SwapWidget = () => {
    const { showNotification } = useNotification();
    const { fetchDashboardData } = useDashboardActions();
    const wallets = useDashboardWallets();
    const currencies = useDashboardCurrencies();
    const user = useAuthUser();
    
    const [fromWalletId, setFromWalletId] = useState<number | string>('');
    const [toCurrencySymbol, setToCurrencySymbol] = useState<string>('');
    const [amountToSpend, setAmountToSpend] = useState<string>('');
    const [estimatedReceive, setEstimatedReceive] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(false);

    // Filtra apenas carteiras com saldo positivo
    const spendableWallets = useMemo(() => wallets.filter(w => Number(w.balance) > 0), [wallets]);
    
    // Encontra a carteira selecionada
    const selectedWallet = useMemo(() => 
        wallets.find(w => w.id === Number(fromWalletId)), 
    [fromWalletId, wallets]);

    // =================================================================================
    // 🚨 CORREÇÃO: Auto-selecionar a primeira carteira disponível (BRL) ao carregar
    // =================================================================================
    useEffect(() => {
        // Se ainda não selecionou nada, e tem carteiras com saldo...
        if (!fromWalletId && spendableWallets.length > 0) {
            // Tenta achar a de BRL primeiro, senão pega a primeira da lista
            const brlWallet = spendableWallets.find(w => w.currencySymbol === 'BRL');
            const defaultWallet = brlWallet || spendableWallets[0];
            
            setFromWalletId(defaultWallet.id);
        }
    }, [spendableWallets, fromWalletId]);

    const getPrice = useCallback((symbol: string) => {
        if (!symbol) return 0;
        if (symbol === 'BRL' || symbol === 'USD') return 1; 
        
        const currency = currencies.find(c => c.symbol === symbol);
        if (!currency || !currency.histories || currency.histories.length === 0) return 0;
        
        const latest = currency.histories.reduce((prev, current) => 
            (new Date(prev.datetime) > new Date(current.datetime)) ? prev : current
        );
        
        return latest.price;
    }, [currencies]);

    // Cálculo em tempo real
    useEffect(() => {
        if (!amountToSpend || !selectedWallet || !toCurrencySymbol) {
            setEstimatedReceive(0);
            return;
        }

        const amount = parseFloat(amountToSpend);
        if (isNaN(amount) || amount <= 0) {
            setEstimatedReceive(0);
            return;
        }

        const priceFrom = getPrice(selectedWallet.currencySymbol);
        const priceTo = getPrice(toCurrencySymbol);

        if (priceTo === 0 || priceFrom === 0) {
            setEstimatedReceive(0);
            return;
        }

        // Fórmula de Triangulação: (Qtd * PrecoOrigem) / PrecoDestino
        const estimated = (amount * priceFrom) / priceTo;
        setEstimatedReceive(estimated);

    }, [amountToSpend, selectedWallet, toCurrencySymbol, getPrice]);

    const handleMaxClick = () => {
        if (selectedWallet) {
            setAmountToSpend(selectedWallet.balance.toString());
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user.id || !selectedWallet || !toCurrencySymbol || !amountToSpend) return;

        setIsLoading(true);
        const tradeRequest: TradeRequestDTO = {
            userId: user.id,
            fromWalletId: selectedWallet.id,
            toCurrencySymbol: toCurrencySymbol,
            amountToSpend: Number(amountToSpend),
        };

        try {
            await walletService.trade(tradeRequest);
            
            showNotification(
                `Troca realizada! Você recebeu aprox. ${estimatedReceive.toLocaleString('pt-BR', { maximumFractionDigits: 8 })} ${toCurrencySymbol}`, 
                "success"
            );
            
            setAmountToSpend('');
            setEstimatedReceive(0);
            await fetchDashboardData(); 
            
        } catch (error: any) {
            console.error("Erro no Trade:", error);
            const msg = error.response?.data?.message || "Erro ao realizar troca. Tente novamente.";
            showNotification(msg, "error");
        } finally {
            setIsLoading(false);
        }
    };

    const fromOptions = spendableWallets.map(w => ({
        value: w.id,
        label: `${w.currencySymbol} - Saldo: ${Number(w.balance).toLocaleString('pt-BR', { maximumFractionDigits: 4 })}`
    }));

    const toOptions = currencies
        .filter(c => c.symbol !== selectedWallet?.currencySymbol)
        .map(c => ({
            value: c.symbol,
            label: c.name
        }));

    return (
        <form onSubmit={handleSubmit} className="relative h-full flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white flex items-center gap-2 text-lg">
                    <RefreshCw className="text-yellow-500" size={20} />
                    Swap Rápido
                </h3>
            </div>

            <div className="space-y-4">
                {/* DE: Carteira de Origem */}
                <div className="bg-[#0b0f19] border border-white/10 rounded-2xl p-4 relative group hover:border-yellow-500/30 transition-all">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase">Vender / Pagar</span>
                        {selectedWallet && (
                            <button 
                                type="button" 
                                onClick={handleMaxClick}
                                className="text-[10px] font-bold text-black bg-yellow-500 px-2 py-0.5 rounded hover:bg-yellow-400"
                            >
                                USAR MÁX
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-5 gap-4 items-end">
                        <div className="col-span-3">
                            <input 
                                type="number"
                                placeholder="0.00"
                                value={amountToSpend}
                                onChange={(e) => setAmountToSpend(e.target.value)}
                                className="bg-transparent text-2xl font-bold text-white placeholder-gray-700 w-full focus:outline-none font-mono"
                                min="0"
                                step="any"
                                // AQUI ESTAVA O PROBLEMA: Agora fromWalletId será preenchido automaticamente
                                disabled={isLoading || !fromWalletId}
                            />
                        </div>
                        <div className="col-span-2">
                            <GlassSelect 
                                label=""
                                icon={Wallet}
                                name="fromWallet"
                                value={fromWalletId}
                                onChange={(e) => setFromWalletId(e.target.value)}
                                options={fromOptions}
                                className="!py-2 !text-xs"
                            />
                        </div>
                    </div>
                </div>

                {/* Ícone Central */}
                <div className="flex justify-center -my-3 relative z-10">
                    <div className="bg-[#1E293B] p-2 rounded-full border-4 border-[#0f172a] text-yellow-500 shadow-lg">
                        <ArrowDownUp size={18} />
                    </div>
                </div>

                {/* PARA: Moeda de Destino */}
                <div className="bg-[#0b0f19] border border-white/10 rounded-2xl p-4 relative group hover:border-emerald-500/30 transition-all">
                    <div className="mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase">Receber (Estimado)</span>
                    </div>
                    <div className="grid grid-cols-5 gap-4 items-center">
                        <div className="col-span-3">
                            <div className={`text-2xl font-bold font-mono truncate ${estimatedReceive > 0 ? 'text-emerald-400' : 'text-gray-600'}`}>
                                {estimatedReceive > 0 
                                    ? estimatedReceive.toLocaleString('pt-BR', { maximumFractionDigits: 8 }) 
                                    : '0.00'}
                            </div>
                        </div>
                        <div className="col-span-2">
                            <GlassSelect 
                                label=""
                                icon={RefreshCw}
                                name="toCurrency"
                                value={toCurrencySymbol}
                                onChange={(e) => setToCurrencySymbol(e.target.value)}
                                options={toOptions}
                                disabled={!fromWalletId}
                                className="!py-2 !text-xs"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading || !fromWalletId || !toCurrencySymbol || !amountToSpend || Number(amountToSpend) <= 0}
                className="w-full mt-6 py-4 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : (
                    <>
                        <span>Confirmar Troca</span>
                        <ArrowRight size={20} />
                    </>
                )}
            </button>
        </form>
    );
};