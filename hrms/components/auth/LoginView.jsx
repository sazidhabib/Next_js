'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function LoginView({ settings: propSettings }) {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSettings, setActiveSettings] = useState(() => {
    if (propSettings && propSettings.appName) return propSettings;
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('hrms_public_settings');
        if (cached) return JSON.parse(cached);
      } catch (e) {}
    }
    return propSettings || null;
  });

  useEffect(() => {
    if (propSettings) {
      setActiveSettings(propSettings);
    }
  }, [propSettings]);

  // Always ensure current system branding and settings are fetched on login page mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && data?.success && data?.settings) {
          setActiveSettings(data.settings);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  const appName = activeSettings?.appName || propSettings?.appName || 'HRMS';
  const appSubtitle = activeSettings?.appSubtitle || propSettings?.appSubtitle || 'Enterprise Compliance';
  const companyName = activeSettings?.companyName || propSettings?.companyName || 'The Royal Kitchen Hospitality Ltd';
  const appLogo = activeSettings?.appLogo || propSettings?.appLogo;

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

  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-radial from-slate-900 via-zinc-950 to-black text-slate-100 p-4 sm:p-6 relative overflow-hidden select-none">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[500px] h-96 sm:h-[500px] bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Centered Login Card */}
      <div className="w-full max-w-md mx-auto z-10">
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Brand Header at the Top */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-2">
              {appLogo ? (
                <div className="w-14 h-14 flex items-center justify-center shrink-0">
                  <img src={appLogo} alt="Logo" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-xl shadow-blue-500/25">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              )}

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">{appName}</h1>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              {appSubtitle}
            </p>
          </div>

          <div className="border-t border-slate-800/80 pt-5 mb-5 text-center">
            <h2 className="text-lg font-bold text-white tracking-tight">Sign In to Your Workspace</h2>
            <p className="text-xs text-slate-400 mt-0.5">Enter your username or company email to proceed</p>
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
              <label className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Password</span>
              </label>
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition cursor-pointer"
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
  );
}
