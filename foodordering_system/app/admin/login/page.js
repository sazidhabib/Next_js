'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { ChefHat, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        const errMsg = data.error || 'Invalid credentials';
        setError(errMsg);
        toast.error(errMsg);
      } else {
        toast.success('Signed in successfully!');
        // Redirect to admin overview page
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-orange-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-amber-600/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-xl shadow-orange-600/30">
            <ChefHat className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">Admin Operations Portal</h1>
            <p className="text-xs text-slate-400 mt-1">
              Sign in to manage your menu, zones, settings, and orders
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 flex gap-2.5 text-xs font-semibold text-red-400 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@foodplatform.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm font-medium text-slate-200 placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Demo Credentials Alert */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-orange-400 font-bold uppercase tracking-wider text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Developer / Seed Credentials</span>
          </div>
          <div className="space-y-1 text-slate-400">
            <div>
              <span className="font-semibold text-slate-300">Super Admin:</span> admin@foodplatform.com
            </div>
            <div>
              <span className="font-semibold text-slate-300">Restaurant Admin:</span> owner@bellavista.com
            </div>
            <div>
              <span className="font-semibold text-slate-300">Password:</span> password123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
