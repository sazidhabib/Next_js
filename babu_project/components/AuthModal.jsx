'use client';

import { useState } from 'react';
import { api } from '../lib/api';

export default function AuthModal({ isOpen, initialMode = 'login', onClose, onLoginSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form inputs
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const res = await api.login({ emailOrUsername, password });
      if (res.success) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        onLoginSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const res = await api.register({ username, email, password, phone });
      if (res.success) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        onLoginSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = () => {
    setEmailOrUsername('demoplayer@gmail.com');
    setPassword('demoplayer@123');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-base">
              ♠
            </span>
            <h2 className="text-xl font-black text-slate-100">
              {mode === 'login' ? 'Player Login' : 'Create Casino Account'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Quick Demo Helper */}
        {mode === 'login' && (
          <div className="bg-amber-950/40 border-b border-amber-900/40 px-6 py-2.5 flex items-center justify-between">
            <span className="text-[11px] text-amber-300 font-semibold">
              Want to test instantly?
            </span>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-[11px] font-black text-amber-400 hover:text-amber-200 underline"
            >
              Fill Demo Player Info
            </button>
          </div>
        )}

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800/60 rounded-xl text-rose-400 text-xs font-semibold">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Email or Username
                </label>
                <input
                  type="text"
                  placeholder="demoplayer@gmail.com"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Password
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-400">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => { setMode('register'); setError(null); }}
                  className="text-xs font-bold text-amber-400 hover:underline"
                >
                  Register here
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Username</label>
                <input
                  type="text"
                  placeholder="luckyplayer"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Email</label>
                <input
                  type="email"
                  placeholder="player@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Phone (Optional)</label>
                <input
                  type="tel"
                  placeholder="+123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50 mt-2"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'}
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-slate-400">Already registered? </span>
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(null); }}
                  className="text-xs font-bold text-amber-400 hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

