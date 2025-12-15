'use client';
import { Box, Typography, Stack, Avatar } from '@mui/material';
import { useDashboardStore } from '../store/DashboardStore';
import { Currency, History } from '@/features/currency/types/Currency';
import { TrendingUp, TrendingDown } from 'lucide-react';
import CoinIcon from '@/features/currency/components/CoinIcon'; // Importe o CoinIcon

const formatPrice = (price: number) => {
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 });
};

// Lógica de cálculo UNIFICADA com o gráfico (Importante!)
const calculateTrend = (histories: History[] | undefined) => {
    if (!histories || histories.length < 2) return 0;

    // Ordena do mais antigo [0] para o mais recente [length-1]
    const sorted = [...histories].sort((a, b) => 
        new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );

    const priceStart = sorted[0].price; // Preço inicial
    const priceNow = sorted[sorted.length - 1].price; // Preço final
    
    if (priceStart === 0) return 0;
    return ((priceNow - priceStart) / priceStart) * 100;
};

const HotListItem = ({ coin, isSelected, onSelect }: { coin: Currency, isSelected: boolean, onSelect: () => void }) => {
    const change = calculateTrend(coin.histories);
    const isPositive = change >= 0;
    
    // Pega o preço mais recente
    const latestPrice = coin.histories && coin.histories.length > 0 
        ? coin.histories.sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime())[0].price 
        : 0;

    return (
        <div 
            onClick={onSelect}
            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all duration-200 group border
                ${isSelected 
                    ? 'bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_15px_rgba(240,185,11,0.1)]' 
                    : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/5'
                }`}
        >
            <div className="flex items-center gap-3">
                {/* ÍCONE */}
                <div className="w-9 h-9 flex items-center justify-center">
                    <CoinIcon symbol={coin.symbol} name={coin.name} size={36} />
                </div>

                <div>
                    <p className={`font-bold text-sm transition-colors ${isSelected ? 'text-white' : 'text-gray-200 group-hover:text-yellow-500'}`}>
                        {coin.symbol}
                    </p>
                    <p className="text-xs text-gray-500">{coin.name}</p>
                </div>
            </div>
            
            <div className="text-right">
                <p className="font-mono text-sm font-medium text-white">{formatPrice(latestPrice)}</p>
                <div className={`flex items-center justify-end gap-1 text-xs font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(change).toFixed(2)}%
                </div>
            </div>
        </div>
    );
};

export const HotList = () => {
    const { currencies, selectedCoin, setSelectedCoin } = useDashboardStore();

    return (
        <div className="glass-panel p-5 rounded-3xl h-full border border-white/5">
            <div className="flex items-center justify-between mb-4 px-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp size={14} /> Tendências
                </h3>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider bg-white/5 px-2 py-1 rounded">
                    Global
                </h3>
            </div>
            <Stack spacing={1}>
                {currencies.slice(0, 6).map((coin) => (
                    <HotListItem 
                        key={coin.id ?? coin.symbol} 
                        coin={coin}
                        isSelected={selectedCoin?.id === coin.id}
                        onSelect={() => setSelectedCoin(coin)}
                    />
                ))}
            </Stack>
        </div>
    );
};