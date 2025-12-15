'use client';
import React, { useMemo, useState } from 'react';
import { Wallet, TrendingUp, Eye, EyeOff, PieChart } from 'lucide-react';
import { Wallet as WalletType } from '../services/walletService';

interface PortfolioHeroProps {
  wallets: WalletType[];
  priceMap: Record<string, number>;
}

// Cores oficiais das moedas para o gráfico
const COIN_COLORS: Record<string, string> = {
    BTC: '#F7931A', // Laranja Bitcoin
    ETH: '#627EEA', // Azul Ethereum
    USDT: '#26A17B', // Verde Tether
    SOL: '#9945FF', // Roxo Solana
    BRL: '#009c3b', // Verde Brasil
    ADA: '#0033AD', // Azul Cardano
    DEFAULT: '#718096' // Cinza para desconhecidos
};

export const PortfolioHero = ({ wallets, priceMap }: PortfolioHeroProps) => {
  const [isVisible, setIsVisible] = useState(true);

  // 1. Calcula a alocação do portfólio
  const allocation = useMemo(() => {
    let total = 0;
    
    // Mapeia cada carteira para seu valor em BRL
    const items = wallets.map(w => {
        const price = w.currencySymbol === 'BRL' ? 1 : (priceMap[w.currencySymbol] || 0);
        const value = Number(w.balance) * price;
        total += value;
        return { 
            symbol: w.currencySymbol, 
            value, 
            color: COIN_COLORS[w.currencySymbol] || COIN_COLORS.DEFAULT 
        };
    });

    // Agrupa por símbolo (caso tenha 2 carteiras de BTC, soma elas)
    const grouped = items.reduce((acc, curr) => {
        const existing = acc.find(i => i.symbol === curr.symbol);
        if (existing) { existing.value += curr.value; } 
        else { acc.push({ ...curr }); }
        return acc;
    }, [] as typeof items);

    // Ordena do maior para o menor valor e calcula a %
    return {
        total,
        items: grouped
            .sort((a, b) => b.value - a.value)
            .map(i => ({ ...i, percent: total === 0 ? 0 : (i.value / total) * 100 }))
    };
  }, [wallets, priceMap]);

  return (
    <div className="relative overflow-hidden rounded-3xl p-8 mb-10 border border-white/10 group bg-[#0f172a]">
      {/* Efeitos de Fundo */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-yellow-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
        
        {/* Lado Esquerdo: Saldo Total */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-3 text-gray-400 text-xs font-bold uppercase tracking-widest">
            <div className="p-1.5 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <Wallet size={14} className="text-yellow-500" />
            </div>
            Patrimônio Total
            <button onClick={() => setIsVisible(!isVisible)} className="hover:text-white transition-colors ml-2">
                {isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
          
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-gray-500 text-2xl font-bold">R$</span>
            <h1 className="text-5xl md:text-6xl font-mono font-bold text-white tracking-tighter">
              {isVisible 
                ? allocation.total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : '••••••••••'}
            </h1>
          </div>
        </div>

        {/* Lado Direito: Distribuição Visual (Barra + Legenda) */}
        <div className="lg:col-span-1">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-gray-400 font-bold uppercase flex items-center gap-2">
                        <PieChart size={14} /> Alocação
                    </p>
                    <span className="text-xs text-gray-500">{wallets.length} Carteiras</span>
                </div>

                {/* Barra de Progresso Multi-Colorida */}
                <div className="flex h-3 w-full rounded-full overflow-hidden bg-black/40 mb-4">
                    {allocation.items.length > 0 ? (
                        allocation.items.map((item) => (
                            <div 
                                key={item.symbol}
                                style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                                className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500 hover:opacity-80"
                                title={`${item.symbol}: ${item.percent.toFixed(1)}%`}
                            ></div>
                        ))
                    ) : (
                        <div className="h-full w-full bg-white/5"></div>
                    )}
                </div>

                {/* Legenda (Top 3 + Outros) */}
                <div className="space-y-2">
                    {allocation.items.slice(0, 3).map((item) => (
                        <div key={item.symbol} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                                <span className="text-gray-300 font-bold">{item.symbol}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-gray-500">{item.percent.toFixed(1)}%</span>
                                <span className="text-white font-mono">
                                    {isVisible ? `R$ ${item.value.toLocaleString('pt-BR', { notation: 'compact', compactDisplay: 'short', maximumFractionDigits: 1 })}` : '•••'}
                                </span>
                            </div>
                        </div>
                    ))}
                    {allocation.items.length === 0 && (
                        <p className="text-center text-xs text-gray-600 italic">Sem ativos para exibir.</p>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};