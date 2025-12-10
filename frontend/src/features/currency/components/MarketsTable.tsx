'use client';
import React from 'react';
import { Currency } from '../types/Currency';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface MarketTableProps {
  currencies: Currency[];
}

// Estilização dos ícones das moedas
const getCoinStyle = (symbol: string) => {
    switch(symbol) {
        case 'BTC': return { bg: 'bg-orange-500/10', text: 'text-orange-500' };
        case 'ETH': return { bg: 'bg-blue-600/10', text: 'text-blue-500' };
        case 'SOL': return { bg: 'bg-purple-600/10', text: 'text-purple-500' };
        case 'USDT': return { bg: 'bg-emerald-500/10', text: 'text-emerald-500' };
        default: return { bg: 'bg-gray-500/10', text: 'text-gray-400' };
    }
};

export const MarketTable = ({ currencies }: MarketTableProps) => {
  const router = useRouter();

  return (
    <div className="bg-[#0f172a]/60 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-xl shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-gray-500 text-[10px] font-bold uppercase tracking-widest bg-black/20">
              <th className="p-5 pl-8">Ativo</th>
              <th className="p-5 text-right">Preço (BRL)</th>
              <th className="p-5 text-right">Variação (24h)</th>
              <th className="p-5 w-[180px] hidden md:table-cell">Tendência (7d)</th>
              <th className="p-5 text-right pr-8">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {currencies.map((coin) => {
              const style = getCoinStyle(coin.symbol);
              
              // Ordena histórico por data
              const history = coin.histories?.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()) || [];
              
              // Pega preço atual e preço de abertura (primeiro registro disponível)
              const currentPrice = history.length > 0 ? history[history.length - 1].price : 0;
              const openPrice = history.length > 0 ? history[0].price : 0;
              
              // Calcula variação
              const change = openPrice === 0 ? 0 : ((currentPrice - openPrice) / openPrice) * 100;
              const isPositive = change >= 0;

              // Prepara dados para o gráfico (Recharts)
              const chartData = history.map(h => ({ value: h.price }));

              return (
                <tr key={coin.id} className="hover:bg-white/[0.02] transition-colors group">
                  
                  {/* Coluna 1: Nome e Símbolo */}
                  <td className="p-5 pl-8">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${style.bg} ${style.text}`}>
                        {coin.symbol[0]}
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">{coin.name}</h4>
                        <span className="text-[10px] text-gray-500 font-bold uppercase">{coin.symbol}</span>
                      </div>
                    </div>
                  </td>

                  {/* Coluna 2: Preço Atual */}
                  <td className="p-5 text-right">
                    <p className="text-white font-mono font-bold text-sm">
                        {currentPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </td>

                  {/* Coluna 3: Variação % */}
                  <td className="p-5 text-right">
                    <div className={`inline-flex items-center gap-1 font-bold text-xs ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                        {Math.abs(change).toFixed(2)}%
                    </div>
                  </td>

                  {/* Coluna 4: Gráfico Sparkline */}
                  <td className="p-2 hidden md:table-cell">
                    <div className="h-10 w-32 ml-auto opacity-70 group-hover:opacity-100 transition-opacity">
                        {chartData.length > 1 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <Line 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke={isPositive ? '#34d399' : '#f43f5e'} 
                                        strokeWidth={2} 
                                        dot={false} 
                                    />
                                    <YAxis domain={['dataMin', 'dataMax']} hide />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-[10px] text-gray-600">Sem dados</div>
                        )}
                    </div>
                  </td>

                  {/* Coluna 5: Botão de Ação */}
                  <td className="p-5 pr-8 text-right">
                    <button 
                        onClick={() => router.push('/dashboard')}
                        className="flex items-center gap-2 ml-auto px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black text-xs font-bold transition-all active:scale-95 shadow-[0_0_10px_rgba(240,185,11,0.2)]"
                    >
                        <RefreshCw size={14} /> Negociar
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};