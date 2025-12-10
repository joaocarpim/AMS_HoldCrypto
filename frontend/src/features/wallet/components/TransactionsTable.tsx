'use client';
import React from 'react';
import { WalletTransaction } from '@/features/wallet/services/walletService';
import { ArrowDownLeft, ArrowUpRight, RefreshCw, CheckCircle2, Clock, AlertCircle, SearchX } from 'lucide-react';

interface Props {
  transactions: WalletTransaction[];
}

// Configuração visual baseada no tipo de transação
const getTxConfig = (type: number) => {
    switch (type) {
        case 0: // Depósito
            return { 
                label: 'Depósito', 
                icon: ArrowDownLeft, 
                color: 'text-emerald-400', 
                bg: 'bg-emerald-500/10', 
                border: 'border-emerald-500/20' 
            };
        case 1: // Saque
            return { 
                label: 'Saque', 
                icon: ArrowUpRight, 
                color: 'text-rose-400', 
                bg: 'bg-rose-500/10', 
                border: 'border-rose-500/20' 
            };
        case 2: // Trade
            return { 
                label: 'Swap', 
                icon: RefreshCw, 
                color: 'text-yellow-400', 
                bg: 'bg-yellow-500/10', 
                border: 'border-yellow-500/20' 
            };
        default: 
            return { 
                label: 'Outro', 
                icon: AlertCircle, 
                color: 'text-gray-400', 
                bg: 'bg-gray-500/10', 
                border: 'border-gray-500/20' 
            };
    }
};

const TransactionsTable: React.FC<Props> = ({ transactions }) => {
  
  // ESTADO VAZIO: Bonito e centralizado
  if (!transactions || transactions.length === 0) {
    return (
      <div className="mt-4 flex flex-col items-center justify-center p-12 bg-[#0b0f19]/50 rounded-3xl border border-dashed border-white/5">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <SearchX size={32} className="text-gray-600" />
        </div>
        <h4 className="text-gray-400 font-bold mb-1">Sem movimentações</h4>
        <p className="text-gray-600 text-xs max-w-xs text-center">
            Suas transações de depósito, saque e trade aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 relative">
      {/* CSS INJETADO PARA A BARRA DE ROLAGEM
          Isso remove a barra branca feia e coloca uma dark slim.
      */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>

      <div className="bg-[#0b0f19] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto max-h-[450px] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            
            {/* CABEÇALHO STICKY (Fixo no topo ao rolar) */}
            <thead className="sticky top-0 z-20 bg-[#0b0f19] shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <tr className="text-gray-500 text-[10px] font-bold uppercase tracking-widest border-b border-white/5">
                <th className="py-4 pl-6">Tipo</th>
                <th className="py-4">Data & Hora</th>
                <th className="py-4 hidden md:table-cell">Descrição</th>
                <th className="py-4 text-center hidden sm:table-cell">Status</th>
                <th className="py-4 pr-6 text-right">Valor</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/[0.03]">
              {transactions.map((tx) => {
                const config = getTxConfig(tx.type);
                const Icon = config.icon;
                const date = new Date(tx.createdAt);

                return (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors duration-200 group">
                    
                    {/* COLUNA 1: Ícone + Tipo */}
                    <td className="py-4 pl-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${config.bg} ${config.border} ${config.color} shadow-sm`}>
                          <Icon size={18} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-sm">{config.label}</span>
                            <span className="text-[10px] text-gray-500 font-mono uppercase">ID: {tx.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* COLUNA 2: Data */}
                    <td className="py-4">
                      <div className="flex flex-col">
                          <span className="text-gray-300 text-xs font-bold font-mono">{date.toLocaleDateString('pt-BR')}</span>
                          <span className="text-gray-600 text-[10px] font-mono">{date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>

                    {/* COLUNA 3: Descrição (Esconde no Mobile) */}
                    <td className="py-4 hidden md:table-cell">
                      <span className="text-gray-400 text-xs font-medium block max-w-[200px] truncate" title={tx.notes}>
                          {tx.notes || 'Movimentação de carteira'}
                      </span>
                    </td>

                    {/* COLUNA 4: Status (Badge) */}
                    <td className="py-4 text-center hidden sm:table-cell">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0f172a] border border-white/5">
                          <CheckCircle2 size={12} className="text-emerald-500" />
                          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wide">Concluído</span>
                      </div>
                    </td>

                    {/* COLUNA 5: Valor (Destaque) */}
                    <td className="py-4 pr-6 text-right">
                      <div className="flex flex-col items-end">
                          <span className={`text-sm font-mono font-bold tracking-tight ${tx.type === 1 ? 'text-white' : 'text-emerald-400'}`}>
                            {tx.type === 1 ? '-' : '+'}{Number(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
                          </span>
                          <span className="text-[10px] font-bold text-gray-600 bg-white/5 px-1.5 rounded uppercase">
                            {tx.currencySymbol}
                          </span>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionsTable;