'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  ShieldCheck,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  Building2,
  Users,
  Briefcase,
  UserCheck,
  Crown,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export default function LoginView({ settings }) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const appName = settings?.appName || 'HRMS Pro';
  const appSubtitle = settings?.appSubtitle || 'Enterprise Compliance & Workforce Management';
  const companyName = settings?.companyName || 'The Royal Kitchen Hospitality Ltd';
  const appLogo = settings?.appLogo;

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!identifier || !password) {
      setError('Please provide both username/email and password.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    const result = await login(identifier, password);
    if (!result.success) {
      setError(result.message || 'Login failed. Please check credentials.');
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (demoIdentifier, demoPassword) => {
    setIdentifier(demoIdentifier);
    setPassword(demoPassword);
    setError('');
    setIsSubmitting(true);
    login(demoIdentifier, demoPassword).then((result) => {
      if (!result.success) {
        setError(result.message || 'Quick login failed');
        setIsSubmitting(false);
      }
    });
  };

  const demoAccounts = [
    {
      role: 'Admin',
      name: 'Obi Kazi',
      username: 'admin',
      desc: 'Full system control & all 11 modules',
      icon: Crown,
      color: 'from-purple-500 to-indigo-600',
      badge: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
    },
    {
      role: 'HR Manager',
      name: 'James Wilson',
      username: 'hrmanager',
      desc: 'Employees, Visas, RTW & Leave Approvals',
      icon: Users,
      color: 'from-blue-500 to-cyan-600',
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300',
    },
    {
      role: 'Manager',
      name: 'Bishnu Hari',
      username: 'manager',
      desc: 'Store team roster & leave sign-offs',
      icon: Briefcase,
      color: 'from-emerald-500 to-teal-600',
      badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    },
    {
      role: 'Employee',
      name: 'Tariq Ahmed',
      username: 'employee',
      desc: 'Self-Service: My Leaves, Visa & RTW',
      icon: UserCheck,
      color: 'from-amber-500 to-orange-600',
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    },
  ];

  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-radial from-slate-900 via-zinc-950 to-black text-slate-100 p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-5xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Brand Narrative & Demo Role Quick Switch */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>UK Home Office Compliance & HR Portal</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center lg:justify-start space-x-3">
              {appLogo ? (
                <div className="w-12 h-12 rounded-2xl bg-white/10 p-1 border border-white/20 shadow-xl">
                  <img src={appLogo} alt="Logo" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-xl shadow-blue-500/25">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              )}
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">{appName}</h1>
            </div>
            <p className="text-sm sm:text-base text-slate-400 font-normal max-w-md mx-auto lg:mx-0">
              {appSubtitle}
            </p>
          </div>

          {/* Quick Demo Switcher Cards */}
          <div className="pt-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-center lg:justify-start space-x-2">
              <span>Quick Login by Role</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-mono">1-Click</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {demoAccounts.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.username}
                    type="button"
                    onClick={() => handleQuickLogin(item.username, 'admin123')}
                    disabled={isSubmitting}
                    className="p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 transition duration-150 text-left group flex items-start space-x-3 cursor-pointer disabled:opacity-50 shadow-md"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 shadow-md text-white group-hover:scale-105 transition-transform`}
                    >
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {item.role}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">@{item.username}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Login Form Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-white tracking-tight">Sign In to Your Workspace</h2>
              <p className="text-xs text-slate-400 mt-1">Enter your username or company email to proceed</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start space-x-2.5 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span className="leading-tight font-medium">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Identifier Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Username or Email</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. admin or employee@example.com"
                    required
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Password</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">Default: admin123</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3.5 py-2.5 pr-10 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all active:scale-98 disabled:opacity-60 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <p className="text-[11px] text-slate-500">
                Authorized for <span className="text-slate-400 font-medium">{companyName}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
