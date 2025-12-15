'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Zap, Globe, TrendingUp, TrendingDown, ChevronRight, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer } from 'recharts'; // Para os mini gráficos

import Header from '@/shared/components/Header';
import Footer from '@/shared/components/Footer';
import currencyService from '@/features/currency/services/currencyService';
import { Currency } from '@/features/currency/types/Currency';
import CoinIcon from '@/features/currency/components/CoinIcon';

// --- CONFIGURAÇÃO DE CORES POR MOEDA (Para o efeito de luz) ---
const COIN_COLORS: Record<string, string> = {
  BTC: '#F7931A', // Laranja Bitcoin
  ETH: '#627EEA', // Azul Ethereum
  SOL: '#14F195', // Verde Solana
  USDT: '#26A17B', // Verde Tether
  ADA: '#0033AD', // Azul Cardano
  BRL: '#009C3B', // Verde Brasil
  DEFAULT: '#F0B90B' // Amarelo Padrão
};

// --- COMPONENTE: CARD DE MERCADO PREMIUM ---
const MarketCard = ({ coin, onHover }: { coin: Currency, onHover: (color: string) => void }) => {
  // Dados simulados para o mini gráfico se não tiver histórico
  const history = coin.histories && coin.histories.length > 0 
    ? coin.histories.map(h => ({ price: h.price }))
    : Array.from({ length: 10 }).map((_, i) => ({ price: Math.random() * 100 }));

  const latestPrice = coin.histories?.[0]?.price || 0;
  const prevPrice = coin.histories?.[1]?.price || latestPrice;
  const change = prevPrice === 0 ? 0 : ((latestPrice - prevPrice) / prevPrice) * 100;
  const isPositive = change >= 0;
  const coinColor = COIN_COLORS[coin.symbol] || COIN_COLORS.DEFAULT;

  return (
    <motion.div 
      whileHover={{ y: -10, scale: 1.02 }}
      onMouseEnter={() => onHover(coinColor)}
      className="relative flex-shrink-0 w-[280px] h-[180px] rounded-3xl overflow-hidden cursor-pointer group"
    >
      {/* Vidro e Borda */}
      <div className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-xl border border-white/5 group-hover:border-white/20 transition-all rounded-3xl z-10"></div>
      
      {/* Conteúdo */}
      <div className="relative z-20 p-6 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            {/* ÍCONE GRANDE */}
            <div className="filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
                <CoinIcon symbol={coin.symbol} name={coin.name} size={48} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg leading-none">{coin.symbol}</h3>
              <span className="text-xs text-gray-400 font-medium">{coin.name}</span>
            </div>
          </div>
          
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg border ${isPositive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change).toFixed(2)}%
          </div>
        </div>

        <div>
          <p className="text-2xl font-mono font-bold text-white tracking-tight">
            R$ {latestPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Mini Gráfico no Fundo (Ambient) */}
      <div className="absolute bottom-0 left-0 right-0 h-24 z-0 opacity-30 group-hover:opacity-50 transition-opacity">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id={`grad-${coin.symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={coinColor} stopOpacity={0.5}/>
                <stop offset="100%" stopColor={coinColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={coinColor} 
              strokeWidth={2} 
              fill={`url(#grad-${coin.symbol})`} 
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-yellow-500/30 transition-all duration-300 group bg-white/[0.02]">
    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon className="text-yellow-500" size={24} />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default function HomePage() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estado para a cor de fundo dinâmica
  const [ambientColor, setAmbientColor] = useState('#F0B90B'); 

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await currencyService.getAll();
        setCurrencies(data);
        // Define a cor inicial baseada na primeira moeda (geralmente BTC)
        if (data.length > 0) setAmbientColor(COIN_COLORS[data[0].symbol] || '#F0B90B');
      } catch (error) {
        console.error("Erro ao carregar mercado:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrencies();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden selection:bg-yellow-500/30 font-sans">
      
      {/* Background Effects */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[800px] h-[600px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />

      <Header />

      <main className="relative z-10">
        
        {/* --- HERO SECTION --- */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-in slide-in-from-left-10 duration-700 fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-yellow-400 text-xs font-bold uppercase tracking-wider">
                <Zap size={14} /> Nova Plataforma 2.0
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                Domine o Futuro <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                  Digital.
                </span>
              </h1>
              <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
                A plataforma mais completa para gerenciar seus ativos digitais. 
                Segurança institucional, taxas transparentes e ferramentas profissionais.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(240,185,11,0.3)] hover:shadow-[0_0_30px_rgba(240,185,11,0.5)] active:scale-95 flex items-center gap-2">
                  Criar Conta Grátis <ArrowRight size={20} />
                </Link>
                <Link href="/currency" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all flex items-center gap-2">
                  Ver Mercados <TrendingUp size={20} />
                </Link>
              </div>
            </div>

            <div className="relative hidden lg:block animate-in slide-in-from-right-10 duration-1000 fade-in">
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/20 to-purple-500/20 rounded-3xl blur-3xl transform rotate-3"></div>
              <div className="relative glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-hidden p-2 bg-black/40">
                 <div className="relative w-full h-[400px] bg-[#0b0f19] rounded-xl flex items-center justify-center overflow-hidden group">
                    <Image 
                        src="/img/logo.jpg" 
                        alt="Dashboard Preview" 
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- MARKET SPOTLIGHT (O Carrossel Interativo) --- */}
        <section className="relative py-16 border-y border-white/5 bg-black/40 backdrop-blur-md overflow-hidden">
            
            {/* LUZ AMBIENTE DINÂMICA (Muda com o hover) */}
            <motion.div 
                animate={{ backgroundColor: ambientColor }}
                transition={{ duration: 0.8 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[300px] rounded-full blur-[150px] opacity-20 pointer-events-none"
            />

            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Activity className="text-yellow-500" size={24} /> Tendências em Tempo Real
                    </h2>
                    <Link href="/currency" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1 group">
                        Ver todos os ativos <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* CSS INJETADO PARA MATAR A BARRA DE ROLAGEM */}
                <style jsx>{`
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                `}</style>

                {loading ? (
                    <div className="flex gap-6 overflow-hidden">
                        {[1,2,3,4].map(i => <div key={i} className="flex-shrink-0 w-[280px] h-[180px] bg-white/5 rounded-3xl animate-pulse"></div>)}
                    </div>
                ) : (
                    <div className="flex gap-6 overflow-x-auto pb-4 pt-4 px-2 no-scrollbar snap-x cursor-grab active:cursor-grabbing">
                        {currencies.slice(0, 8).map(coin => (
                            <MarketCard 
                                key={coin.id} 
                                coin={coin} 
                                onHover={(color) => setAmbientColor(color)} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>

        {/* --- FEATURES SECTION --- */}
        <section className="py-24 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Por que escolher a HoldCrypto?</h2>
              <p className="text-gray-400">
                Construímos uma infraestrutura robusta para que você possa focar no que importa: seus investimentos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard 
                icon={ShieldCheck}
                title="Segurança de Ponta"
                desc="Seus ativos protegidos com criptografia de nível bancário e autenticação multifator."
              />
              <FeatureCard 
                icon={Globe}
                title="Acesso Global"
                desc="Opere de qualquer lugar do mundo, 24 horas por dia, com alta disponibilidade."
              />
              <FeatureCard 
                icon={Zap}
                title="Execução Rápida"
                desc="Motor de trading otimizado para garantir o melhor preço em milissegundos."
              />
            </div>
          </div>
        </section>

        {/* --- CTA FINAL --- */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-yellow-500 to-orange-600 rounded-3xl p-12 text-center relative overflow-hidden shadow-[0_0_50px_rgba(240,185,11,0.2)]">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 relative z-10">
              Pronto para começar sua jornada?
            </h2>
            <p className="text-black/80 text-lg mb-8 max-w-xl mx-auto relative z-10 font-medium">
              Junte-se a milhares de investidores que já estão construindo o futuro financeiro.
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition-all shadow-xl relative z-10 hover:-translate-y-1">
              Criar Conta Agora <ArrowRight size={20} />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}