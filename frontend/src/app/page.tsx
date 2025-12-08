'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Importação do componente otimizado
import { ArrowRight, ShieldCheck, Zap, Globe, TrendingUp, ChevronRight } from 'lucide-react';
import Header from '@/shared/components/Header';
import Footer from '@/shared/components/Footer';
import currencyService from '@/features/currency/services/currencyService';
import { Currency } from '@/features/currency/types/Currency';

// --- Componentes Visuais (Internos para simplificar) ---

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-yellow-500/30 transition-all duration-300 group">
    <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
      <Icon className="text-yellow-500" size={24} />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
  </div>
);

const MarketTickerItem = ({ coin }: { coin: Currency }) => {
  const latestPrice = coin.histories?.[0]?.price || 0;
  // Lógica simples de variação (pode ser refinada com dados reais de 24h)
  const prevPrice = coin.histories?.[1]?.price || latestPrice;
  const change = prevPrice === 0 ? 0 : ((latestPrice - prevPrice) / prevPrice) * 100;
  const isPositive = change >= 0;

  return (
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all cursor-default min-w-[240px]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-xs">
          {coin.symbol[0]}
        </div>
        <div>
          <p className="font-bold text-white text-sm">{coin.symbol}</p>
          <p className="text-xs text-gray-400">{coin.name}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-mono text-sm font-medium text-white">
          R$ {latestPrice.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}
        </p>
        <p className={`text-xs font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
          {isPositive ? '+' : ''}{change.toFixed(2)}%
        </p>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await currencyService.getAll();
        setCurrencies(data);
      } catch (error) {
        console.error("Erro ao carregar mercado:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrencies();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden selection:bg-yellow-500/30">
      
      {/* Background Effects (Luzes de fundo) */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[800px] h-[600px] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none" />

      <Header />

      <main className="relative z-10">
        
        {/* --- HERO SECTION --- */}
        <section className="pt-20 pb-32 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Texto Principal */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-yellow-400 text-xs font-bold uppercase tracking-wider animate-fade-in">
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
                Segurança institucional, taxas transparentes e ferramentas profissionais 
                para traders e investidores.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(240,185,11,0.3)] hover:shadow-[0_0_30px_rgba(240,185,11,0.5)] active:scale-95 flex items-center gap-2">
                  Criar Conta Grátis <ArrowRight size={20} />
                </Link>
                <Link href="/currency" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all flex items-center gap-2">
                  Ver Mercados <TrendingUp size={20} />
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <p className="text-2xl font-bold text-white">50k+</p>
                  <p className="text-sm text-gray-500">Usuários</p>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div>
                  <p className="text-2xl font-bold text-white">R$ 10M+</p>
                  <p className="text-sm text-gray-500">Negociados</p>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div>
                  <p className="text-2xl font-bold text-white">24/7</p>
                  <p className="text-sm text-gray-500">Suporte</p>
                </div>
              </div>
            </div>

            {/* Elemento Visual (Dashboard Preview) */}
            <div className="relative hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/20 to-purple-500/20 rounded-3xl blur-2xl transform rotate-3"></div>
              <div className="relative glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-hidden p-8 flex items-center justify-center">
                 {/* CORREÇÃO: Caminho apontando para /img/logo.jpg dentro de public */}
                 <Image 
                   src="/img/logo.jpg" 
                   alt="Dashboard Preview" 
                   width={800} 
                   height={600}
                   className="rounded-xl w-auto h-auto max-h-[500px] hover:scale-105 transition-transform duration-500 object-contain"
                   unoptimized // Importante para imagens locais recém-adicionadas
                 />
              </div>
            </div>

          </div>
        </section>

        {/* --- MARKET TICKER (Destaques) --- */}
        <section className="border-y border-white/5 bg-black/20 backdrop-blur-sm overflow-hidden py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="text-yellow-500" /> Tendências de Hoje
              </h2>
              <Link href="/currency" className="text-sm text-yellow-500 hover:text-yellow-400 font-medium flex items-center gap-1">
                Ver todos <ChevronRight size={16} />
              </Link>
            </div>
            
            {loading ? (
              <div className="flex gap-4 animate-pulse">
                {[1,2,3,4].map(i => <div key={i} className="h-20 w-60 bg-white/5 rounded-xl"></div>)}
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {currencies.slice(0, 5).map(coin => (
                  <MarketTickerItem key={coin.id} coin={coin} />
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
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-yellow-500 to-orange-600 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6 relative z-10">
              Pronto para começar sua jornada?
            </h2>
            <p className="text-black/80 text-lg mb-8 max-w-xl mx-auto relative z-10 font-medium">
              Junte-se a milhares de investidores que já estão construindo o futuro financeiro.
            </p>
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-900 transition-all shadow-xl relative z-10">
              Criar Conta Agora <ArrowRight size={20} />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}