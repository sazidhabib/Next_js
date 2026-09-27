'use client';

import React from 'react';
import { Package, Clock, CheckCircle2, AlertCircle, Layers } from 'lucide-react';
import { ProductItem } from '@/lib/types';

interface StatsOverviewProps {
  products: ProductItem[];
}

export function StatsOverview({ products }: StatsOverviewProps) {
  const total = products.length;
  const pending = products.filter((p) => p.status === 'pending').length;
  const approved = products.filter((p) => p.status === 'approved').length;
  const synced = products.filter((p) => p.status === 'synced').length;
  const failed = products.filter((p) => p.status === 'failed').length;

  const stats = [
    {
      label: 'Total Scraped',
      value: total,
      icon: Layers,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
      borderColor: 'border-indigo-500/20',
    },
    {
      label: 'Pending Review',
      value: pending,
      icon: Clock,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
    },
    {
      label: 'Approved & Ready',
      value: approved,
      icon: Package,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
      borderColor: 'border-sky-500/20',
    },
    {
      label: 'Synced to Admin',
      value: synced,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
    },
    {
      label: 'Failed / Errors',
      value: failed,
      icon: AlertCircle,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl bg-slate-900/60 border ${stat.borderColor} backdrop-blur-sm transition-all hover:bg-slate-900/90`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">{stat.label}</span>
              <div className={`w-7 h-7 rounded-lg ${stat.bgColor} ${stat.color} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold text-white tracking-tight">{stat.value}</div>
          </div>
        );
      })}
    </div>
  );
}
