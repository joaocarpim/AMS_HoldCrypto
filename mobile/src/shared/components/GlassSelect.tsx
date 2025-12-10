import React from 'react';
import { LucideIcon, ChevronDown } from 'lucide-react';

interface GlassSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  icon: LucideIcon;
  options: { value: string | number; label: string }[];
}

export const GlassSelect = ({ label, icon: Icon, options, className, ...props }: GlassSelectProps) => (
  <div className="space-y-1.5 w-full">
    <label className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-500 transition-colors pointer-events-none">
        <Icon size={18} />
      </div>
      
      <select 
        className={`w-full bg-[#0b0f19] border border-white/10 rounded-xl py-3.5 pl-12 pr-10 text-white focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 transition-all font-medium text-sm appearance-none cursor-pointer ${className}`}
        {...props}
      >
        {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0b0f19] text-white py-2">
                {opt.label}
            </option>
        ))}
      </select>

      {/* Ícone da Seta Customizado */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
        <ChevronDown size={16} />
      </div>
    </div>
  </div>
);