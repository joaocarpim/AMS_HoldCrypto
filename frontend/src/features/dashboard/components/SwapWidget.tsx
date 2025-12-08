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

    // Filtra carteiras com saldo
    const spendableWallets = useMemo(() => wallets.filter(w => Number(w.balance) > 0), [wallets]);
    
    const selectedWallet = useMemo(() => 
        wallets.find(w => w.id === Number(fromWalletId)), 
    [fromWalletId, wallets]);

    const getPrice = useCallback((symbol: string) => {
        if (!symbol) return 0;
        if (symbol === 'BRL') return 1; 
        
        const currency = currencies.find(c => c.symbol === symbol);
        if (!currency || !currency.histories || currency.histories.length === 0) return 0;

        const sortedHistory = [...currency.histories].sort((a, b) => 
            new Date(b.datetime).getTime() - new Date(a.datetime).getTime()
        );
        return sortedHistory[0].price;
    }, [currencies]);

    // --- CÁLCULO MÁGICO EM TEMPO REAL ---
    useEffect(() => {
        if (!amountToSpend || !selectedWallet || !toCurrencySymbol) {
            setEstimatedReceive(0);
            return;
        }

        const amount = Number(amountToSpend);
        const priceFrom = getPrice(selectedWallet.currencySymbol);
        const priceTo = getPrice(toCurrencySymbol);

        if (priceTo === 0) {
            setEstimatedReceive(0);
            return;
        }

        const estimated = (amount * priceFrom) / priceTo;
        setEstimatedReceive(estimated);

    }, [amountToSpend, selectedWallet, toCurrencySymbol, getPrice]);

    // --- CORREÇÃO DO BOTÃO MÁX (Arredondamento Seguro) ---
    const handleMaxClick = () => {
        if (selectedWallet) {
            const rawBalance = Number(selectedWallet.balance);
            
            // CORREÇÃO: Arredonda para baixo na 8ª casa decimal.
            // Isso evita erros de float tipo 0.00000000001 a mais que o saldo real.
            const safeBalance = Math.floor(rawBalance * 100000000) / 100000000; 
            
            setAmountToSpend(safeBalance.toString());
        }
    };

    const fromOptions = spendableWallets.map(w => ({
        value: w.id,
        label: `${w.currencySymbol} - ${w.name}`
    }));

    const toOptions = currencies
        .filter(c => c.symbol !== selectedWallet?.currencySymbol)
        .map(c => ({
            value: c.symbol,
            label: `${c.name} (${c.symbol})`
        }));

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
            showNotification(`Sucesso! Você recebeu ~${estimatedReceive.toLocaleString('pt-BR', { maximumFractionDigits: 6 })} ${toCurrencySymbol}`, "success");
            
            setAmountToSpend('');
            setEstimatedReceive(0);
            
            // Atualiza os dados imediatamente
            await fetchDashboardData(); 
            
        } catch (error: any) {
            console.error("Erro no Trade:", error);
            
            // --- TRATAMENTO DE ERRO DETALHADO ---
            const serverError = error.response?.data;
            let errorMsg = "Erro ao processar trade.";

            if (serverError) {
                if (typeof serverError === 'string') errorMsg = serverError;
                else if (serverError.errors) {
                    const firstKey = Object.keys(serverError.errors)[0];
                    errorMsg = `${firstKey}: ${serverError.errors[firstKey][0]}`;
                }
                else if (serverError.message) errorMsg = serverError.message;
            }

            showNotification(errorMsg, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative h-full flex flex-col justify-between">
            
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-white flex items-center gap-2 text-lg">
                    <RefreshCw className="text-yellow-500" size={20} />
                    Troca Rápida
                </h3>
                {selectedWallet && toCurrencySymbol && (
                    <div className="text-[10px] text-gray-400 bg-white/5 px-2 py-1 rounded border border-white/10 flex items-center gap-1">
                        <span className="text-yellow-500 font-bold">1 {toCurrencySymbol}</span> 
                        ≈ 
                        <span>
                            {(getPrice(toCurrencySymbol) / getPrice(selectedWallet.currencySymbol)).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} {selectedWallet.currencySymbol}
                        </span>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                
                {/* BLOCO: VENDER */}
                <div className="bg-[#0b0f19] border border-white/10 rounded-2xl p-4 relative group hover:border-yellow-500/30 transition-all">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase">Vender</span>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Wallet size={12} />
                            <span>Saldo: {selectedWallet ? Number(selectedWallet.balance).toLocaleString('pt-BR', { maximumFractionDigits: 8 }) : '0.00'}</span>
                            {selectedWallet && (
                                <button 
                                    type="button" 
                                    onClick={handleMaxClick}
                                    className="text-[10px] font-bold text-black hover:bg-yellow-400 uppercase bg-yellow-500 px-1.5 rounded transition-colors"
                                >
                                    MÁX
                                </button>
                            )}
                        </div>
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

                {/* ÍCONE DE TROCA */}
                <div className="flex justify-center -my-2 relative z-10">
                    <div className="bg-[#1E293B] p-2 rounded-full border-4 border-[#0f172a] text-yellow-500 shadow-lg hover:rotate-180 transition-transform duration-500 cursor-pointer">
                        <ArrowDownUp size={20} />
                    </div>
                </div>

                {/* BLOCO: RECEBER (ESTIMADO) */}
                <div className="bg-[#0b0f19] border border-white/10 rounded-2xl p-4 relative group hover:border-emerald-500/30 transition-all">
                    <div className="mb-2 flex justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase">Receber (Estimado)</span>
                    </div>

                    <div className="grid grid-cols-5 gap-4 items-center">
                        <div className="col-span-3">
                            <div className={`text-2xl font-bold font-mono truncate ${estimatedReceive > 0 ? 'text-emerald-400' : 'text-gray-600'}`}>
                                {estimatedReceive > 0 
                                    ? estimatedReceive.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 }) 
                                    : '---'}
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
                className="w-full mt-6 py-4 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold text-lg shadow-[0_0_20px_rgba(240,185,11,0.3)] hover:shadow-[0_0_30px_rgba(240,185,11,0.5)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
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