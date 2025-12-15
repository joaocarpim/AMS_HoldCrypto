'use client';
import { Grid, Box } from '@mui/material';
import { StatCard } from './StatCard';
import { Wallet, TrendingUp, TrendingDown, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDashboardWallets, useDashboardCurrencies } from '../store/DashboardStore';
import { useMemo } from 'react';

// --- NOVA FUNÇÃO formatCurrencyValue ---
const formatCurrencyValue = (value: number | undefined | null): string => {
    const numericValue = Number(value);
    if (isNaN(numericValue) || value === undefined || value === null) {
        return "R$ --";
    }

    const prefix = "R$ ";
    
    // Lógica de Abreviação
    if (numericValue >= 1_000_000_000_000) { // Trilhão (T)
        return prefix + (numericValue / 1_000_000_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " T";
    }
    if (numericValue >= 1_000_000_000) { // Bilhão (B)
        return prefix + (numericValue / 1_000_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " B";
    }
    if (numericValue >= 1_000_000) { // Milhão (M)
        return prefix + (numericValue / 1_000_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " M";
    }
    if (numericValue >= 1_000) { // Mil (K)
        return prefix + (numericValue / 1_000).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " K";
    }
    
    // Para valores menores, usa a formatação padrão completa
    return numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 });
};
// ------------------------------------

const formatPercentValue = (value: number | undefined | null): number | undefined => {
    if (value === undefined || value === null || isNaN(value)) {
        return undefined;
    }
    return value;
};

// --- Variantes de Animação ---
const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

export const StatsCards = () => {
    const wallets = useDashboardWallets();
    const currencies = useDashboardCurrencies();

    // Lógica de cálculo OTIMIZADA E CORRIGIDA
    const calculatedStats = useMemo(() => {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).getTime();
        const priceDataMap = new Map<string, { now: number, twentyFourHoursAgoPrice: number | null, change: number }>();
        let bestPerformer = { symbol: '---', change: -Infinity };

        // 1. Mapeia preços das CRIPTOS
        for (const currency of currencies) {
            if (!currency.histories || currency.histories.length === 0 || !currency.symbol) continue;
            
            const sortedHistories = [...currency.histories].sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
            const priceNow = sortedHistories[0]?.price;
            if (!priceNow) continue;

            let price24hAgo: number | null = null;
            
            // Busca o preço mais próximo de 24h atrás
            for (const history of sortedHistories) {
                if (new Date(history.datetime).getTime() <= twentyFourHoursAgo) {
                    price24hAgo = history.price;
                    break;
                }
            }
            // Se não tiver histórico antigo, assume o preço atual (variação 0)
            if (price24hAgo === null) price24hAgo = priceNow;

            const change = (price24hAgo === 0) ? 0 : ((priceNow - price24hAgo) / price24hAgo) * 100;
            priceDataMap.set(currency.symbol.toUpperCase(), { now: priceNow, twentyFourHoursAgoPrice: price24hAgo, change });
            
            if (change > bestPerformer.change) {
                bestPerformer = { symbol: currency.symbol, change };
            }
        }
        
        // 2. Calcula Saldo Total (CORREÇÃO PARA BRL)
        let totalBalanceNow = 0;
        let totalBalance24hAgo = 0;

        for (const wallet of wallets) {
            const balance = Number(wallet.balance);
            if (isNaN(balance)) continue;

            // SE FOR BRL, PREÇO É SEMPRE 1 E SEMPRE SOMA
            if (wallet.currencySymbol === 'BRL') {
                totalBalanceNow += balance;
                totalBalance24hAgo += balance; // BRL não varia valor nominalmente
            } 
            // SE FOR CRIPTO, PEGA DO MAPA DE PREÇOS
            else if (wallet.currencySymbol) {
                const prices = priceDataMap.get(wallet.currencySymbol.toUpperCase());
                if (prices) {
                    totalBalanceNow += balance * prices.now;
                    totalBalance24hAgo += balance * (prices.twentyFourHoursAgoPrice ?? prices.now);
                }
            }
        }

        const profitBRL = totalBalanceNow - totalBalance24hAgo;
        const profitPercent = (totalBalance24hAgo === 0 || totalBalanceNow === 0) ? 0 : (profitBRL / totalBalance24hAgo) * 100;

        return { totalBalanceBRL: totalBalanceNow, profitBRL, profitPercent, bestPerformer };
    }, [wallets, currencies]);

    // Montar os dados
    const statsData = [
        {
            title: 'Balanço Total (BRL)',
            value: formatCurrencyValue(calculatedStats.totalBalanceBRL),
            Icon: Wallet,
            change: undefined,
        },
        {
            title: 'Lucro/Prejuízo (24h)',
            value: formatCurrencyValue(calculatedStats.profitBRL),
            change: formatPercentValue(calculatedStats.profitPercent),
            Icon: (calculatedStats.profitBRL ?? 0) >= 0 ? TrendingUp : TrendingDown,
        },
        {
            title: 'Melhor Ativo (24h)',
            value: calculatedStats.bestPerformer.symbol !== '---' ? calculatedStats.bestPerformer.symbol : 'N/A',
            change: calculatedStats.bestPerformer.symbol !== '---' ? formatPercentValue(calculatedStats.bestPerformer.change) : undefined,
            Icon: TrendingUp,
        },
        {
            title: 'Total de Carteiras',
            value: wallets.length.toString(),
            Icon: Award,
            change: undefined,
        },
    ];

    return (
        <Box
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{ mb: 4 }}
        >
            <Grid container spacing={3}>
                {statsData.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <motion.div variants={itemVariants}>
                            <StatCard 
                                title={stat.title}
                                value={stat.value}
                                Icon={stat.Icon}
                                {...(stat.change !== undefined && { change: stat.change })}
                            />
                        </motion.div>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};