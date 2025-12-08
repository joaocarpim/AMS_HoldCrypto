'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, ArrowRightLeft, LineChart, ChevronDown, ChevronUp, Info, Activity } from 'lucide-react';
import { useMarketsStore } from '../store/marketsStore';
import { LineChart as RechartsLine, Line, ResponsiveContainer, YAxis } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Currency } from '../types/Currency';

// --- Componente Sparkline (Mini Gráfico) ---
const Sparkline = ({ data, color }: { data: any[], color: string }) => {
  if (!data || data.length < 2) return <div className="h-10 w-24 bg-white/5 rounded flex items-center justify-center text-[10px] text-gray-600">--</div>;
  
  return (
    <div className="h-12 w-32">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLine data={data}>
          <Line type="monotone" dataKey="price" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
          <YAxis domain={['dataMin', 'dataMax']} hide />
        </RechartsLine>
      </ResponsiveContainer>
    </div>
  );
};

// --- Componente de Linha Expansível (MarketRow) ---
const MarketRow = ({ coin }: { coin: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calcula maior e menor preço do histórico para exibir nos detalhes
  const high24h = coin.histories?.length ? Math.max(...coin.histories.map((h: any) => h.price)) : 0;
  const low24h = coin.histories?.length ? Math.min(...coin.histories.map((h: any) => h.price)) : 0;

  return (
    <motion.div 
      layout 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`border-b border-white/5 transition-colors duration-300 ${isExpanded ? 'bg-white/[0.03]' : 'hover:bg-white/[0.02]'}`}
    >
      {/* Linha Principal (Clicável) */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="grid grid-cols-12 gap-4 p-5 items-center cursor-pointer group"
      >
        {/* Coluna 1: Nome e Ícone */}
        <div className="col-span-5 md:col-span-3 flex items-center gap-4 pl-2">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-black font-bold shadow-lg transition-all duration-300 group-hover:scale-110 ${isExpanded ? 'bg-yellow-500 shadow-yellow-500/30' : 'bg-white/10 text-white'}`}>
            {coin.symbol[0]}
          </div>
          <div>
            <span className={`block font-bold transition-colors ${isExpanded ? 'text-yellow-500' : 'text-white'}`}>{coin.name}</span>
            <span className="block text-xs text-gray-500 font-mono">{coin.symbol}</span>
          </div>
        </div>

        {/* Coluna 2: Preço */}
        <div className="col-span-4 md:col-span-2 text-right font-mono font-medium text-white">
          R$ {coin.latestPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
        </div>

        {/* Coluna 3: Variação */}
        <div className="col-span-3 md:col-span-2 text-right flex justify-end items-center gap-1">
          <span className={`flex items-center gap-1 text-sm font-bold ${coin.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {coin.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(coin.change).toFixed(2)}%
          </span>
        </div>

        {/* Coluna 4: Sparkline (Desktop) */}
        <div className="hidden md:flex md:col-span-3 justify-center items-center opacity-70">
          <Sparkline data={coin.chartData} color={coin.isPositive ? '#34d399' : '#fb7185'} />
        </div>

        {/* Coluna 5: Ícone de Expandir */}
        <div className="hidden md:flex md:col-span-2 justify-end pr-4 text-gray-500">
          {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {/* Detalhes Expansíveis */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[#0a0f1e]/50"
          >
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-white/5 mx-4">
              
              {/* Esquerda: Info & Stats */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Info className="text-yellow-500 mt-1" size={18} />
                  <div>
                    <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wide mb-1">Sobre {coin.name}</h4>
                    <p className="text-sm text-gray-400 leading-relaxed max-w-md">
                      {coin.description || "Uma criptomoeda descentralizada operando em blockchain global."}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-6 mt-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Máxima (24h)</p>
                    <p className="font-mono text-white font-bold">R$ {high24h.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Mínima (24h)</p>
                    <p className="font-mono text-white font-bold">R$ {low24h.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase">Backing</p>
                    <span className="inline-block px-2 py-0.5 rounded bg-white/10 text-xs text-white font-bold border border-white/10">
                      {coin.backing}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direita: Ações */}
              <div className="flex flex-col justify-center items-end gap-3">
                <Link href="/dashboard" className="w-full md:w-auto">
                  <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition-all shadow-[0_0_20px_rgba(240,185,11,0.2)] hover:shadow-[0_0_30px_rgba(240,185,11,0.4)] active:scale-95">
                    <ArrowRightLeft size={18} /> Negociar {coin.symbol} Agora
                  </button>
                </Link>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Activity size={12} className="animate-pulse text-green-500" /> Mercado Aberto • Alta Liquidez
                </p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default function MarketsPage() {
  const { currencies, loading, fetchCurrencies } = useMarketsStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  const filteredCurrencies = useMemo(() => {
    return currencies
      .filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(coin => {
        const history = coin.histories ? [...coin.histories].sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()) : [];
        const latestPrice = history.length > 0 ? history[history.length - 1].price : 0;
        const startPrice = history.length > 0 ? history[0].price : 0;
        const change = startPrice === 0 ? 0 : ((latestPrice - startPrice) / startPrice) * 100;
        
        return {
          ...coin,
          latestPrice,
          change,
          isPositive: change >= 0,
          chartData: history.map(h => ({ price: h.price })),
          histories: history // Passando histórico ordenado
        };
      });
  }, [currencies, searchTerm]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-10 pb-20">
      
      {/* Header da Página */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3 tracking-tight">
            <LineChart className="text-yellow-500" size={36} />
            Mercados
          </h1>
          <p className="text-gray-400 text-lg">Visão geral dos ativos e oportunidades em tempo real.</p>
        </div>

        {/* Barra de Pesquisa "Glass" */}
        <div className="relative w-full md:w-96 group">
          <div className="absolute inset-0 bg-yellow-500/20 rounded-xl blur-lg opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
          <div className="relative">
            <Search className="absolute left-4 top-3.5 text-gray-500 group-focus-within:text-yellow-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar moeda (ex: Bitcoin, ETH)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0f172a]/80 backdrop-blur border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Tabela de Mercados */}
      <div className="max-w-7xl mx-auto">
        <div className="glass-panel rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-[#0f172a]/40 backdrop-blur-xl">
          
          {/* Cabeçalho da Tabela */}
          <div className="grid grid-cols-12 gap-4 p-5 border-b border-white/5 bg-black/20 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <div className="col-span-5 md:col-span-3 pl-2">Ativo</div>
            <div className="col-span-4 md:col-span-2 text-right">Preço</div>
            <div className="col-span-3 md:col-span-2 text-right">24h %</div>
            <div className="hidden md:block md:col-span-3 text-center">Tendência (7D)</div>
            <div className="hidden md:block md:col-span-2 text-right pr-4"></div>
          </div>

          {/* Lista */}
          <div>
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 border-b border-white/5 bg-white/[0.01] animate-pulse flex items-center px-6">
                   <div className="h-10 w-10 bg-white/5 rounded-full mr-4"></div>
                   <div className="h-4 w-32 bg-white/5 rounded"></div>
                </div>
              ))
            ) : filteredCurrencies.length === 0 ? (
              <div className="p-16 text-center">
                <div className="inline-flex p-4 rounded-full bg-white/5 mb-4">
                    <Search size={32} className="text-gray-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-300">Nenhuma moeda encontrada</h3>
                <p className="text-gray-500 mt-2">Tente buscar por outro nome ou símbolo.</p>
              </div>
            ) : (
              filteredCurrencies.map((coin) => (
                <MarketRow key={coin.id} coin={coin} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}