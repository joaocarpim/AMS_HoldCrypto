'use client';
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine, Area, AreaChart } from 'recharts';
import { useDashboardSelectedCoin } from '../store/DashboardStore';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';

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

export const OverviewChart = () => {
  const selectedCoin = useDashboardSelectedCoin();

  // 1. Preparação dos Dados
  const chartData = useMemo(() => {
    // Se não tiver histórico, retorna array vazio
    if (!selectedCoin?.histories || selectedCoin.histories.length === 0) return [];
    
    const sortedAll = [...selectedCoin.histories].sort((a, b) => 
        new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );

    // Pega os últimos 50 registros para não poluir o gráfico
    const recentHistory = sortedAll.slice(-50);

    return recentHistory.map(h => ({
        name: new Date(h.datetime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        price: Number(h.price),
    }));
  }, [selectedCoin]);

  // 2. Lógica de Tendência e Cores
  const { chartColor, isPositive, startPrice, endPrice, percentageChange } = useMemo(() => {
    // Valores padrão para quando não tem dados
    if (!chartData || chartData.length === 0) {
        return { chartColor: '#F0B90B', isPositive: true, startPrice: 0, endPrice: 0, percentageChange: 0 };
    }
    
    // Se tiver apenas 1 ponto de dado (acabou de criar a moeda)
    if (chartData.length === 1) {
        const price = chartData[0].price;
        return { chartColor: '#F0B90B', isPositive: true, startPrice: price, endPrice: price, percentageChange: 0 };
    }
    
    const start = chartData[0].price;
    const end = chartData[chartData.length - 1].price;
    const isPos = end >= start;
    
    const color = isPos ? '#22c55e' : '#ef4444'; // Verde ou Vermelho
    const percent = start === 0 ? 0 : ((end - start) / start) * 100;

    return { 
        chartColor: color, 
        isPositive: isPos, 
        startPrice: start, 
        endPrice: end,
        percentageChange: percent
    };
  }, [chartData]);

  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  // --- ESTADO VAZIO (Nenhuma moeda selecionada ou sem dados) ---
  if (!selectedCoin || !chartData || chartData.length === 0) {
      return (
        <div className="glass-panel p-6 rounded-3xl h-[400px] flex flex-col items-center justify-center text-center border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f172a]/80 z-0"></div>
            <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <Activity className="text-gray-600" size={32} />
                </div>
                <h3 className="text-gray-300 font-bold mb-1">Mercado Silencioso</h3>
                {/* CORREÇÃO AQUI: Trocamos " por &quot; */}
                <p className="text-gray-600 text-sm max-w-xs">
                    Selecione uma moeda na lista &quot;Tendências&quot; para ver o gráfico detalhado.
                </p>
            </div>
        </div>
      )
  }

  return (
    <div className="glass-panel p-6 rounded-3xl border border-white/5 relative overflow-hidden group h-[450px] flex flex-col">
        {/* Header do Gráfico */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4 z-10 relative">
        
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
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider">Nas últimas 24h</span>
                </div>
            </div>
        </div>
        
        {/* Preço Atual */}
        <div className="text-right">
             <p className="text-3xl font-bold font-mono text-white tracking-tight drop-shadow-md">
                R$ {endPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
             </p>
             <div className="flex items-center justify-end gap-2 text-[10px] text-gray-400 mt-1 uppercase font-bold tracking-widest">
                <span className={`w-2 h-2 rounded-full animate-pulse`} style={{ backgroundColor: chartColor }}></span>
                Ao vivo
             </div>
        </div>
      </div>

      {/* Área do Gráfico */}
      <div className="flex-1 w-full -ml-2 relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
            <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" vertical={false} />
            <XAxis dataKey="name" stroke="#525252" fontSize={10} tickLine={false} axisLine={false} tickMargin={10} minTickGap={50} />
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
                animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};