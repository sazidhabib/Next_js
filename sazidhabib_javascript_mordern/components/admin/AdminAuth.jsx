'use client';

import { useState } from 'react';

const AdminAuth = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('sazid_portfolio_admin_token', data.token);
        onSuccess(data.token);
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[80px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-accent-dark/5 blur-[80px]" />

      <div className="w-full max-w-md glass-card rounded-2xl p-8 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Sazid<span className="text-accent">.</span>Habib
          </h2>
          <p className="text-slate-400 text-sm mt-2">Admin Dashboard Authentication</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col">
            <span className="text-white font-medium mb-2 text-sm">Admin Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secure password"
              className="bg-white/5 border border-white/10 py-3 px-5 placeholder:text-slate-500 text-white rounded-lg outline-none focus:border-accent/40 transition-colors font-medium text-sm disabled:opacity-50"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-accent hover:bg-accent-dark text-white py-3 px-8 rounded-lg outline-none font-medium text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.97] mt-2 shadow-glow"
          >
            {loading ? 'Verifying...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAuth;
