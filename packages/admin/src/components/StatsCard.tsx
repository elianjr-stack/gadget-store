import React from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
}

export default function StatsCard({
  title,
  value,
  change,
  isPositive = true,
  icon,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {title}
        </p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          {value}
        </h3>
        {change && (
          <p className={`text-xs font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
            {change}
          </p>
        )}
      </div>

      <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 text-slate-700">
        {icon}
      </div>
    </div>
  );
}
