'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, Zap, BarChart2, Activity, Info, Wallet, DollarSign, ChevronUp, ChevronDown } from 'lucide-react';
import { useMarketsStore } from '@/features/currency/store/marketsStore'; 
import { LineChart as RechartsLine, Line, ResponsiveContainer, YAxis, AreaChart, Area } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import CoinIcon from '@/features/currency/components/CoinIcon';

// --- DADOS ESTÁTICOS PARA ENRIQUECER A UI (MOCK DE DADOS DA MOEDA) ---
const COIN_DETAILS: Record<string, { desc: string, vol: string, cap: string }> = {
    'BTC': {
        desc: "O Bitcoin é a primeira criptomoeda descentralizada do mundo. Funciona como uma reserva de valor digital e sistema de pagamento peer-to-peer sem intermediários.",
        vol: "R$ 150.5B",
        cap: "R$ 6.2T"
    },
    'ETH': {
        desc: "Ethereum é uma plataforma descentralizada capaz de executar contratos inteligentes e aplicações descentralizadas (dApps), sendo a base para NFTs e DeFi.",
        vol: "R$ 80.2B",
        cap: "R$ 2.8T"
    },
    'SOL': {
        desc: "Solana é uma blockchain de alta performance projetada para hospedar aplicativos descentralizados e criptomoedas, focada em velocidade e baixas taxas.",
        vol: "R$ 12.4B",
        cap: "R$ 450B"
    },
    'USDT': {
        desc: "Tether (USDT) é uma stablecoin indexada ao dólar americano. Oferece a estabilidade da moeda fiduciária com a flexibilidade da tecnologia blockchain.",
        vol: "R$ 220.1B",
        cap: "R$ 520B"
    },
    'ADA': {
        desc: "Cardano é uma plataforma blockchain de prova de participação (PoS) que diz ser a primeira a ser fundada em filosofia científica e pesquisa revisada por pares.",
        vol: "R$ 4.5B",
        cap: "R$ 98B"
    },
    'BRL': {
        desc: "O Real Brasileiro Digital neste sistema representa o saldo fiduciário disponível para negociações e saques diretos para contas bancárias.",
        vol: "N/A",
        cap: "N/A"
    }
};

const DEFAULT_DETAIL = {
    desc: "Ativo digital negociado globalmente. Alta volatilidade pode apresentar riscos e oportunidades.",
    vol: "---",
    cap: "---"
};

// --- TIPO PARA FILTROS ---
type FilterType = 'all' | 'gainers' | 'losers';

// --- COMPONENTE: BARRA DE RANGE DE PREÇO ---
const PriceRangeBar = ({ low, high, current }: { low: number, high: number, current: number }) => {
  const percent = Math.min(100, Math.max(0, ((current - low) / (high - low)) * 100));
  
  return (
    <div className="w-full mt-2">
      <div className="flex justify-between text-[10px] text-gray-500 mb-1.5 font-mono font-bold uppercase tracking-wider">
        <span>Min: R$ {low.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</span>
        <span className="text-white/50">Faixa de 24h</span>
        <span>Máx: R$ {high.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</span>
      </div>
      <div className="h-1.5 w-full bg-white/10 rounded-full relative overflow-hidden">
        <div 
          className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-blue-600 via-purple-500 to-yellow-500 rounded-full transition-all duration-1000"
          style={{ width: `${percent}%` }}
        ></div>
        <div 
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10"
            style={{ left: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
};

// --- COMPONENTE: GRÁFICO RICO ---
const RichChart = ({ data, color }: { data: any[], color: string }) => (
  <div className="h-28 w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <Area 
            type="monotone" 
            dataKey="price" 
            stroke={color} 
            strokeWidth={2} 
            fill={`url(#grad-${color})`} 
            isAnimationActive={true} 
        />
        <YAxis domain={['dataMin', 'dataMax']} hide />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

// --- COMPONENTE: CARTÃO DE DESTAQUE ---
const HighlightCard = ({ title, coin, icon: Icon, type }: any) => {
  if (!coin) return null;
  const color = type === 'gainer' ? 'text-emerald-400' : type === 'hot' ? 'text-orange-400' : 'text-blue-400';
  const bgColor = type === 'gainer' ? 'from-emerald-500/10' : type === 'hot' ? 'from-orange-500/10' : 'from-blue-500/10';
  const strokeColor = type === 'gainer' ? '#34d399' : type === 'hot' ? '#fb923c' : '#60a5fa';

  return (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br ${bgColor} to-[#0b0f19] p-5 flex-1 min-w-[280px] hover:border-white/10 transition-all group`}
    >
        <div className="flex justify-between items-start mb-2 relative z-10">
            <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg bg-[#0b0f19]/50 border border-white/5 ${color}`}>
                    <Icon size={16} />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</span>
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded bg-[#0b0f19]/50 ${coin.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                {coin.isPositive ? '+' : ''}{coin.change.toFixed(2)}%
            </span>
        </div>
        
        <div className="mt-2 relative z-10">
            <div className="flex items-baseline gap-2">
                <h3 className="text-xl font-bold text-white">{coin.symbol}</h3>
                <span className="text-xs text-gray-500">{coin.name}</span>
            </div>
            <p className="text-lg font-mono font-bold text-white mt-0.5">
                R$ {coin.latestPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
        </div>

        <div className="absolute bottom-0 right-0 w-32 h-16 opacity-20 group-hover:opacity-40 transition-opacity translate-y-1 translate-x-1">
             <ResponsiveContainer width="100%" height="100%">
                <RechartsLine data={coin.chartData}>
                    <Line type="monotone" dataKey="price" stroke={strokeColor} strokeWidth={2} dot={false} />
                </RechartsLine>
             </ResponsiveContainer>
        </div>
    </motion.div>
  );
};

// --- COMPONENTE: LINHA DA TABELA ---
const MarketRow = ({ coin }: { coin: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const colorHex = coin.isPositive ? '#10b981' : '#f43f5e';
  const high24h = coin.histories?.length ? Math.max(...coin.histories.map((h: any) => h.price)) : coin.latestPrice * 1.02;
  const low24h = coin.histories?.length ? Math.min(...coin.histories.map((h: any) => h.price)) : coin.latestPrice * 0.98;

  // Busca detalhes específicos ou usa padrão
  const details = COIN_DETAILS[coin.symbol.toUpperCase()] || DEFAULT_DETAIL;

  return (
    <motion.div 
        layout
        className={`border-b border-white/5 transition-all duration-300 ${isExpanded ? 'bg-[#0f172a]/80 shadow-2xl border-l-2 border-l-yellow-500 my-2' : 'hover:bg-white/[0.02]'}`}
    >
        {/* LINHA RESUMIDA */}
        <div 
            onClick={() => setIsExpanded(!isExpanded)}
            className="grid grid-cols-12 gap-4 p-4 items-center cursor-pointer relative overflow-hidden"
        >
            {/* Ativo */}
            <div className="col-span-5 md:col-span-4 flex items-center gap-4 pl-2">
                <div className="relative w-10 h-10 flex items-center justify-center">
                    <CoinIcon symbol={coin.symbol} name={coin.name} size={40} />
                </div>
                <div>
                    <span className={`block font-bold text-sm transition-colors ${isExpanded ? 'text-yellow-500' : 'text-white'}`}>{coin.name}</span>
                    <span className="block text-[10px] text-gray-500 font-mono tracking-wide">{coin.symbol}</span>
                </div>
            </div>

            {/* Preço */}
            <div className="col-span-4 md:col-span-3 text-right">
                <p className="font-mono font-medium text-white text-sm">
                    R$ {coin.latestPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                </p>
                <p className="md:hidden text-[9px] text-gray-600">Preço Atual</p>
            </div>

            {/* Variação */}
            <div className="col-span-3 md:col-span-2 text-right flex justify-end">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-md font-bold text-xs ${coin.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                    {coin.isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(coin.change).toFixed(2)}%
                </div>
            </div>

            {/* Sparkline (Desktop) */}
            <div className="hidden md:flex md:col-span-2 justify-center opacity-60">
                <div className="h-8 w-24">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsLine data={coin.chartData}>
                            <Line type="monotone" dataKey="price" stroke={colorHex} strokeWidth={2} dot={false} isAnimationActive={false} />
                        </RechartsLine>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Seta */}
            <div className="hidden md:flex md:col-span-1 justify-end pr-2 text-gray-600">
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
        </div>

        {/* DETALHES EXPANDIDOS */}
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-[#0b0f19]/80 border-t border-white/5"
                >
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* COLUNA 1: Gráfico & Análise */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-1">
                                        <Activity size={12} className="text-blue-500" /> Análise Técnica
                                    </h4>
                                    <p className="text-white font-bold text-lg">Movimentação de Preço</p>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${coin.isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                        {coin.isPositive ? 'Tendência de Alta 🐂' : 'Correção de Mercado 🐻'}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-[#020617] border border-white/5 rounded-2xl p-4 shadow-inner relative overflow-hidden">
                                <div className="absolute top-4 left-4 z-10 flex gap-2">
                                    <span className="text-[10px] font-bold text-gray-500 bg-white/5 px-2 py-0.5 rounded">24H</span>
                                    <span className="text-[10px] font-bold text-gray-600 px-2 py-0.5">7D</span>
                                </div>
                                <RichChart data={coin.chartData} color={colorHex} />
                            </div>

                            <PriceRangeBar low={low24h} high={high24h} current={coin.latestPrice} />
                        </div>

                        {/* COLUNA 2: Ações & Info */}
                        <div className="flex flex-col gap-4">
                            <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-5">
                                <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-2 uppercase tracking-wide">
                                    <Info size={14} className="text-yellow-500" /> Sobre o Ativo
                                </h4>
                                {/* DESCRIÇÃO DINÂMICA AQUI */}
                                <p className="text-xs text-gray-400 leading-relaxed text-justify">
                                    {details.desc}
                                </p>
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    <div className="bg-black/20 rounded p-2 text-center">
                                        <p className="text-[9px] text-gray-500 uppercase">Vol (24h)</p>
                                        <p className="text-xs font-mono text-white font-bold">{details.vol}</p>
                                    </div>
                                    <div className="bg-black/20 rounded p-2 text-center">
                                        <p className="text-[9px] text-gray-500 uppercase">Mkt Cap</p>
                                        <p className="text-xs font-mono text-white font-bold">{details.cap}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#1e293b]/50 border border-white/10 rounded-2xl p-1 shadow-xl mt-auto">
                                <div className="p-4 space-y-3">
                                    <p className="text-center text-[10px] font-bold text-gray-500 uppercase mb-2">Executar Ordem</p>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link href="/wallet" className="w-full">
                                            <button className="w-full flex flex-col items-center justify-center gap-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-all active:scale-95 shadow-lg shadow-emerald-500/20 group">
                                                <Wallet size={18} className="group-hover:scale-110 transition-transform"/> 
                                                <span className="text-xs">Comprar</span>
                                            </button>
                                        </Link>
                                        <Link href="/wallet" className="w-full">
                                            <button className="w-full flex flex-col items-center justify-center gap-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold transition-all active:scale-95 shadow-lg shadow-rose-500/20 group">
                                                <DollarSign size={18} className="group-hover:scale-110 transition-transform"/> 
                                                <span className="text-xs">Vender</span>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
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
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  const processedData = useMemo(() => {
    const data = currencies.map(coin => {
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
          histories: history
        };
    });
    return data.sort((a, b) => b.latestPrice - a.latestPrice); 
  }, [currencies]);

  const highlights = useMemo(() => {
      if (processedData.length === 0) return { gainer: null, hot: null, vol: null };
      const sortedByChange = [...processedData].sort((a, b) => b.change - a.change);
      return {
          gainer: sortedByChange[0], 
          hot: sortedByChange[1] || sortedByChange[0], 
          vol: processedData[0] 
      };
  }, [processedData]);

  const filteredList = useMemo(() => {
      let list = processedData.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (activeFilter === 'gainers') list = list.filter(c => c.isPositive);
      if (activeFilter === 'losers') list = list.filter(c => !c.isPositive);
      return list;
  }, [processedData, searchTerm, activeFilter]);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-10 pb-20 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HERO SECTION --- */}
        {!loading && processedData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <HighlightCard title="Top Gainer (24h)" coin={highlights.gainer} icon={TrendingUp} type="gainer" />
                <HighlightCard title="Em Alta (Trending)" coin={highlights.hot} icon={Zap} type="hot" />
                <HighlightCard title="Maior Valor (Ref)" coin={highlights.vol} icon={BarChart2} type="vol" />
            </div>
        )}

        {/* --- CONTROLES --- */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex bg-[#0f172a] p-1 rounded-xl border border-white/10">
                {(['all', 'gainers', 'losers'] as FilterType[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveFilter(tab)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                            activeFilter === tab ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        {tab === 'all' ? 'Todos' : tab === 'gainers' ? 'Ganhadores' : 'Perdedores'}
                    </button>
                ))}
            </div>

            <div className="relative group w-full md:w-64">
                <Search className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-yellow-500 transition-colors" size={16} />
                <input 
                    type="text" 
                    placeholder="Pesquisar..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#0f172a] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-yellow-500/50 transition-all"
                />
            </div>
        </div>

        {/* --- TABELA --- */}
        <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl min-h-[400px]">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-black/20 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                <div className="col-span-5 md:col-span-4 pl-2">Ativo</div>
                <div className="col-span-4 md:col-span-3 text-right">Preço</div>
                <div className="col-span-3 md:col-span-2 text-right">Variação</div>
                <div className="hidden md:block md:col-span-2 text-center">Tendência</div>
                <div className="hidden md:block md:col-span-1 text-right pr-4"></div>
            </div>

            <div className="divide-y divide-white/5">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Activity className="animate-spin text-yellow-500 mb-4" size={32} />
                        <p className="text-gray-500 text-xs animate-pulse">Carregando dados...</p>
                    </div>
                ) : filteredList.length === 0 ? (
                    <div className="py-20 text-center text-gray-500 text-sm">Nenhum ativo encontrado.</div>
                ) : (
                    filteredList.map((coin, idx) => (
                        <MarketRow key={coin.id} coin={coin} />
                    ))
                )}
            </div>
        </div>

      </div>
    </div>
  );
}