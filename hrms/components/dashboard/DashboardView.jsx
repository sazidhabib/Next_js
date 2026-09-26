'use client';

import React from 'react';
import {
  Users,
  UserCheck,
  Building2,
  Briefcase,
  AlertTriangle,
  CalendarDays,
  ShieldCheck,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { Badge, Card } from '../ui';

export default function DashboardView({ stats, alerts, onNavigate }) {
  const statCards = [
    {
      title: 'Total Employees',
      value: stats?.totalEmployees ?? 0,
      icon: Users,
      bgGradient: 'from-blue-600 to-blue-700 text-white',
      accent: 'bg-blue-500/30',
      action: () => onNavigate('employees'),
    },
    {
      title: 'Active Employees',
      value: stats?.activeEmployees ?? 0,
      icon: UserCheck,
      bgGradient: 'from-emerald-600 to-emerald-700 text-white',
      accent: 'bg-emerald-500/30',
      action: () => onNavigate('employees'),
    },
    {
      title: 'Total Departments',
      value: stats?.totalDepartments ?? 0,
      icon: Building2,
      bgGradient: 'from-purple-600 to-purple-700 text-white',
      accent: 'bg-purple-500/30',
      action: () => onNavigate('departments'),
    },
    {
      title: 'Total Positions',
      value: stats?.totalPositions ?? 0,
      icon: Briefcase,
      bgGradient: 'from-amber-700 to-amber-800 text-white',
      accent: 'bg-amber-600/30',
      action: () => onNavigate('roles'),
    },
    {
      title: 'Visas Expiring (90d)',
      value: stats?.expiringVisasCount ?? 0,
      icon: AlertTriangle,
      bgGradient: 'from-amber-500 to-orange-600 text-white',
      accent: 'bg-amber-400/30',
      action: () => onNavigate('immigration'),
      isWarning: stats?.expiringVisasCount > 0,
    },
    {
      title: 'Pending Leaves',
      value: stats?.pendingLeavesCount ?? 0,
      icon: CalendarDays,
      bgGradient: 'from-cyan-600 to-blue-600 text-white',
      accent: 'bg-cyan-400/30',
      action: () => onNavigate('leave'),
    },
  ];

  return (
    <div className="space-y-5 sm:space-y-6 pb-10">
      {/* Top Stat Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={card.action}
              className={`p-3.5 sm:p-5 rounded-2xl bg-gradient-to-br ${card.bgGradient} shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between transform hover:-translate-y-0.5 active:scale-[0.98]`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-white/90 truncate mr-1">
                  {card.title}
                </span>
                <div className={`p-1.5 sm:p-2 rounded-xl ${card.accent} shrink-0`}>
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-baseline justify-between">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">{card.value}</span>
                <span className="text-[10px] sm:text-[11px] text-white/80 font-medium flex items-center space-x-0.5">
                  <span>View</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compliance Action Board & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* Compliance Action Center */}
        <div className="lg:col-span-2 space-y-4">
          <Card
            title="🛡️ UK Compliance & Visa Expiry Action Center"
            subtitle="Automated 90/60/30-day monitoring for Home Office audit readiness"
            action={
              <button
                onClick={() => onNavigate('immigration')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
              >
                <span>View All Visas</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            {alerts?.immigration?.length === 0 && alerts?.rtw?.length === 0 ? (
              <div className="py-8 text-center flex flex-col items-center justify-center">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-500 mb-2" />
                <h4 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100">100% Compliant</h4>
                <p className="text-xs text-zinc-500 max-w-sm mt-1 px-4">
                  All employee right to work checks and visa expiration dates are currently up to date.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {alerts?.immigration?.map((rec) => {
                  const today = new Date();
                  const expDate = new Date(rec.expiryDate);
                  const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
                  const isCritical = diffDays <= 30;

                  return (
                    <div
                      key={rec.id}
                      className={`p-3 sm:p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition ${
                        isCritical
                          ? 'bg-rose-50/70 border-rose-200 dark:bg-rose-950/30 dark:border-rose-900/60'
                          : 'bg-amber-50/70 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/60'
                      }`}
                    >
                      <div className="flex items-start sm:items-center space-x-3">
                        <div
                          className={`p-2 rounded-xl shrink-0 mt-0.5 sm:mt-0 ${
                            isCritical ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'
                          }`}
                        >
                          <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <h5 className="font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                              {rec.employee?.firstName} {rec.employee?.lastName}
                            </h5>
                            <span className="text-[11px] text-zinc-500 font-mono">({rec.employee?.employeeCode})</span>
                            <Badge variant={isCritical ? 'danger' : 'warning'}>
                              {diffDays > 0 ? `Expires in ${diffDays}d` : 'EXPIRED'}
                            </Badge>
                          </div>
                          <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                            <span className="font-medium">{rec.visaType?.name}</span> • Share Code:{' '}
                            <code className="bg-white/80 dark:bg-zinc-800 px-1 py-0.5 rounded font-mono text-[10px] sm:text-[11px]">
                              {rec.shareCode || 'N/A'}
                            </code>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onNavigate('immigration')}
                        className="self-end sm:self-auto px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 text-zinc-800 dark:text-zinc-200 shadow-2xs"
                      >
                        Renew / Edit
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Quick Launchpad */}
        <div className="space-y-4">
          <Card title="⚡ Quick Actions" subtitle="Fast-track administrative operations">
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
              <button
                onClick={() => onNavigate('employees')}
                className="p-3 sm:p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 text-left transition group"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1.5 sm:mb-2 group-hover:scale-105 transition">
                  <Plus className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Add Employee</h5>
                <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-0.5">Onboard new hire</p>
              </button>

              <button
                onClick={() => onNavigate('rtw')}
                className="p-3 sm:p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 text-left transition group"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1.5 sm:mb-2 group-hover:scale-105 transition">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Verify RTW</h5>
                <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-0.5">Share code check</p>
              </button>

              <button
                onClick={() => onNavigate('immigration')}
                className="p-3 sm:p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 text-left transition group"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-100 dark:bg-purple-900/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1.5 sm:mb-2 group-hover:scale-105 transition">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Record Visa</h5>
                <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-0.5">Track CoS & dates</p>
              </button>

              <button
                onClick={() => onNavigate('leave')}
                className="p-3 sm:p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-cyan-500 hover:bg-cyan-50/50 dark:hover:bg-cyan-950/30 text-left transition group"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-1.5 sm:mb-2 group-hover:scale-105 transition">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Leave Approvals</h5>
                <p className="text-[10px] sm:text-[11px] text-zinc-500 mt-0.5">Review requests</p>
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
