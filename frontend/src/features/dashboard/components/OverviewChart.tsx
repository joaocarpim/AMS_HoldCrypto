'use client';
import { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useDashboardSelectedCoin } from '../store/DashboardStore';
import { TrendingUp, TrendingDown, Activity, Calendar } from 'lucide-react';

const formatChartValue = (value: number) => {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
};

const CustomTooltip = ({ active, payload, label, color }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 p-3 rounded-lg shadow-xl min-w-[140px]">
        <p className="text-gray-400 text-[10px] font-mono mb-1 uppercase tracking-wide">{label}</p>
        <div className="flex items-center gap-2">
            <span className="w-1 h-8 rounded-full" style={{ backgroundColor: color }}></span>
            <div>
                <p className="text-white text-sm font-bold font-mono">
                R$ {payload[0].value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                </p>
            </div>
        </div>
      </div>
    );
  }
  return null;
};

// Tipos de Filtro
type TimeRange = '24H' | '7D' | '30D';

export const OverviewChart = () => {
  const selectedCoin = useDashboardSelectedCoin();
  const [timeRange, setTimeRange] = useState<TimeRange>('24H');

  // 1. Preparação e Filtragem dos Dados
  const chartData = useMemo(() => {
    if (!selectedCoin?.histories || selectedCoin.histories.length === 0) return [];
    
    // Data de corte baseada no filtro
    const now = new Date();
    const cutoffDate = new Date();

    if (timeRange === '24H') {
        cutoffDate.setHours(now.getHours() - 24);
    } else if (timeRange === '7D') {
        cutoffDate.setDate(now.getDate() - 7);
    } else if (timeRange === '30D') {
        cutoffDate.setDate(now.getDate() - 30);
    }

    // Filtra e Ordena
    const filteredHistory = selectedCoin.histories
        .filter(h => new Date(h.datetime) >= cutoffDate) // Só pega dados após o corte
        .sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()); // Antigo -> Novo

    // Se o filtro resultar em vazio (ex: não tem dados de 30 dias), mostra tudo ou um fallback
    const finalData = filteredHistory.length > 0 ? filteredHistory : selectedCoin.histories;

    return finalData.map(h => ({
        name: new Date(h.datetime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', day: timeRange !== '24H' ? '2-digit' : undefined }),
        price: Number(h.price),
        rawDate: h.datetime
    }));
  }, [selectedCoin, timeRange]);

  // 2. Lógica de Tendência e Cores
  const { chartColor, isPositive, percentageChange, endPrice } = useMemo(() => {
    if (!chartData || chartData.length === 0) {
        return { chartColor: '#F0B90B', isPositive: true, percentageChange: 0, endPrice: 0 };
    }
    
    const start = chartData[0].price;
    const end = chartData[chartData.length - 1].price;
    const isPos = end >= start;
    const color = isPos ? '#22c55e' : '#ef4444'; 
    const percent = start === 0 ? 0 : ((end - start) / start) * 100;

    return { 
        chartColor: color, 
        isPositive: isPos, 
        endPrice: end,
        percentageChange: percent
    };
  }, [chartData]);

  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  // --- ESTADO VAZIO ---
  if (!selectedCoin || !chartData || chartData.length === 0) {
      return (
        <div className="glass-panel p-6 rounded-3xl h-[400px] flex flex-col items-center justify-center text-center border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f172a]/80 z-0"></div>
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <Activity className="text-gray-600" size={32} />
                </div>
                <h3 className="text-gray-300 font-bold mb-1">Mercado Silencioso</h3>
                <p className="text-gray-600 text-sm max-w-xs">
                    Sem dados suficientes para o período selecionado.
                </p>
            </div>
        </div>
      )
  }

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden group h-[450px] flex flex-col">
        {/* Header do Gráfico */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 z-10 relative">
        
        {/* Info Moeda */}
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-black font-bold text-xl shadow-lg transition-all duration-500"
                 style={{ backgroundColor: chartColor, boxShadow: `0 0 20px ${chartColor}40` }}>
                {selectedCoin?.symbol?.[0] || '$'}
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-white leading-tight">
                        {selectedCoin?.name || 'Mercado'}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded text-black bg-white/90">
                        {selectedCoin?.symbol}
                    </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold flex items-center gap-1" style={{ color: chartColor }}>
                        {isPositive ? '+' : ''}{percentageChange.toFixed(2)}%
                        <TrendIcon size={14} />
                    </span>
                </div>
            </div>
        </div>

        {/* CONTROLES DE FILTRO (NOVO) */}
        <div className="flex bg-black/20 p-1 rounded-xl border border-white/5">
            {(['24H', '7D', '30D'] as TimeRange[]).map((range) => (
                <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        timeRange === range 
                        ? 'bg-white/10 text-white shadow-sm' 
                        : 'text-gray-500 hover:text-white hover:bg-white/5'
                    }`}
                >
                    {range}
                </button>
            ))}
        </div>
        
        {/* Preço Atual */}
        <div className="hidden sm:block text-right">
             <p className="text-2xl font-bold font-mono text-white tracking-tight">
                R$ {endPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
             </p>
        </div>
      </div>

      {/* Área do Gráfico */}
      <div className="flex-1 w-full -ml-2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
            <XAxis 
                dataKey="name" 
                stroke="#525252" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tickMargin={10} 
                minTickGap={30} 
            />
            <YAxis 
                stroke="#525252" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={formatChartValue} 
                domain={['auto', 'auto']} 
                orientation="right" 
                width={40}
            />
            <Tooltip content={<CustomTooltip color={chartColor} />} cursor={{ stroke: '#ffffff20', strokeWidth: 1 }} />
            
            <Area 
                type="monotone" 
                dataKey="price" 
                stroke={chartColor} 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorPrice)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};