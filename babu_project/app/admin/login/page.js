'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../lib/api';
import { ShieldIcon, KeyIcon } from '../../../components/Icons';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [securityPin, setSecurityPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fillDemoAdmin = () => {
    setEmail('admin@betluxa.com');
    setPassword('betluxasuperadmin');
    setSecurityPin('888888');
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !securityPin) {
      setError('Email, Password, and 6-Digit Security PIN are all required');
      return;
    }

    try {
      setLoading(true);
      const res = await api.adminLogin({ email, password, securityPin });
      if (res.success && res.token) {
        localStorage.setItem('admin_token', res.token);
        localStorage.setItem('admin_user', JSON.stringify(res.admin));
        router.push('/admin');
      }
    } catch (err) {
      setError(err.message || 'Invalid admin credentials or security PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-amber-500 selection:text-slate-950">
      
      {/* Return to Casino */}
      <div className="absolute top-6 left-6">
        <Link href="/" className="text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1.5">
          &larr; Back to Casino Lobby
        </Link>
      </div>

      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center font-black text-2xl mx-auto mb-3 shadow-lg shadow-amber-500/20">
            ♠
          </div>
          <h1 className="text-2xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500">
            BETLUXA ADMIN
          </h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            Super Admin & Cashier Authentication Portal
          </p>
        </div>

        {/* Quick-fill helper for demo credentials */}
        <div className="mb-6 p-3 bg-amber-950/40 border border-amber-900/60 rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-amber-300 block">Demo Admin Credentials:</span>
            <span className="text-[10px] text-amber-400/80 font-mono">admin@betluxa.com &bull; PIN: 888888</span>
          </div>
          <button
            type="button"
            onClick={fillDemoAdmin}
            className="px-2.5 py-1 bg-amber-500 text-slate-950 font-black rounded-lg text-[10px] hover:brightness-110 active:scale-95"
          >
            Auto Fill
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-rose-950/60 border border-rose-800/80 rounded-xl text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Admin Email
            </label>
            <input
              type="email"
              placeholder="admin@betluxa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
              Admin Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1 flex items-center justify-between">
              <span>6-Digit Security PIN</span>
              <span className="text-[10px] text-amber-400 lowercase font-normal flex items-center gap-1">
                <KeyIcon className="w-3 h-3" /> required for admin ops
              </span>
            </label>
            <input
              type="password"
              maxLength={6}
              placeholder="888888"
              value={securityPin}
              onChange={(e) => setSecurityPin(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm font-mono tracking-widest text-center focus:outline-none focus:border-amber-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:brightness-110 text-slate-950 font-black text-sm transition-all shadow-xl shadow-yellow-500/20 disabled:opacity-50 active:scale-95 mt-2"
          >
            {loading ? 'Validating 3-Factor Credentials...' : 'Sign In To Admin Portal'}
          </button>
        </form>

        <div className="mt-6 text-center text-[11px] text-slate-500">
          Secured with SHA-256 + bcrypt & Session Security Verification.
        </div>
      </div>
    </div>
  );
}

