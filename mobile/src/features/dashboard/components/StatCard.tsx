'use client';
import { Box, Typography } from '@mui/material';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  Icon: LucideIcon;
}

export const StatCard = ({ title, value, change, Icon }: StatCardProps) => {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div className="glass-panel p-5 rounded-2xl h-full flex flex-col justify-between relative overflow-hidden group hover:border-yellow-500/30 transition-all duration-300">
      {/* Background Glow Effect */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl group-hover:bg-yellow-500/10 transition-all"></div>

      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-300">
            <Icon size={22} />
        </div>
        
        {change !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
            isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
          }`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(change).toFixed(2)}%
          </div>
        )}
      </div>

      <div>
        <Typography variant="body2" className="text-gray-400 font-medium mb-1">
          {title}
        </Typography>
        <Typography variant="h5" className="text-white font-bold tracking-tight font-mono">
          {value}
        </Typography>
      </div>
    </div>
  );
};