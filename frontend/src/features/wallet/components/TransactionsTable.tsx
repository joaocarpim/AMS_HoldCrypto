import React from 'react';
import { WalletTransaction } from '@/features/wallet/services/walletService';
import { ArrowDownLeft, ArrowUpRight, RefreshCw, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface Props {
  transactions: WalletTransaction[];
}

const getTxTypeConfig = (type: number) => {
    switch (type) {
        case 0: return { label: 'Depósito', icon: ArrowDownLeft, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
        case 1: return { label: 'Saque', icon: ArrowUpRight, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
        case 2: return { label: 'Trade', icon: RefreshCw, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
        default: return { label: 'Outro', icon: AlertCircle, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-gray-500/20' };
    }
};

const TransactionsTable: React.FC<Props> = ({ transactions }) => {
  
  if (!transactions || transactions.length === 0) {
    return (
      <div className="mt-4 p-6 text-center bg-[#0f172a]/40 rounded-2xl border border-white/5 border-dashed">
        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-2">
            <Clock size={20} className="text-gray-600" />
        </div>
        <p className="text-gray-500 text-xs">Nenhuma transação encontrada.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-[#0f172a]/40 rounded-2xl border border-white/5 shadow-xl overflow-hidden backdrop-blur-sm">
      {/* Scroll interno se passar de 350px */}
      <div className="overflow-x-auto max-h-[350px] overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 z-10 bg-[#0b0f19] shadow-sm">
            <tr className="text-gray-500 text-[10px] font-bold uppercase tracking-widest border-b border-white/5">
              <th className="py-3 pl-6">Operação</th>
              <th className="py-3">Data</th>
              <th className="py-3">Detalhes</th>
              <th className="py-3 text-center">Status</th>
              <th className="py-3 pr-6 text-right">Valor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {transactions.map((tx) => {
              const config = getTxTypeConfig(tx.type);
              const Icon = config.icon;
              const date = new Date(tx.createdAt);

              return (
                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors group">
                  
                  <td className="py-2.5 pl-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg border ${config.bg} ${config.border} ${config.color}`}>
                        <Icon size={14} />
                      </div>
                      <span className={`font-bold text-xs ${config.color}`}>{config.label}</span>
                    </div>
                  </td>

                  <td className="py-2.5">
                    <div className="flex flex-col">
                        <span className="text-gray-300 text-xs font-medium">{date.toLocaleDateString('pt-BR')}</span>
                        <span className="text-gray-600 text-[9px] font-mono">{date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </td>

                  <td className="py-2.5">
                    <span className="text-gray-400 text-xs font-medium block max-w-[150px] truncate" title={tx.notes}>
                        {tx.notes || 'Movimentação'}
                    </span>
                    <span className="text-[9px] text-gray-700 font-mono uppercase">#{tx.id}</span>
                  </td>

                  <td className="py-2.5 text-center">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-emerald-500 text-[9px] font-bold uppercase">
                        <CheckCircle2 size={10} /> Ok
                    </div>
                  </td>

                  <td className="py-2.5 pr-6 text-right">
                    <span className={`text-sm font-mono font-bold ${tx.type === 1 ? 'text-white' : 'text-emerald-400'}`}>
                      {tx.type === 1 ? '-' : '+'}{Number(tx.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                    </span>
                    <span className="text-gray-600 text-[9px] font-bold ml-1">{tx.currencySymbol}</span>
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

export default TransactionsTable;