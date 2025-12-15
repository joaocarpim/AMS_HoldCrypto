import React from 'react';
import { LucideIcon } from 'lucide-react';

interface GlassInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
}

export const GlassInput = ({ label, icon: Icon, className, ...props }: GlassInputProps) => (
  <div className="space-y-1.5">
    <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors">
        <Icon size={18} />
      </div>
      <input 
        className={`w-full bg-[#0b0f19] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all font-medium text-sm ${className}`}
        {...props}
      />
    </div>
  </div>
);