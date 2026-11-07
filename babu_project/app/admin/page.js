'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, apiRequest } from '../../lib/api';
import { ShieldIcon, CoinsIcon, ArrowDownLeftIcon, ArrowUpRightIcon, CheckCircleIcon, XCircleIcon, LogOutIcon } from '../../components/Icons';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState('deposits');
  const [loading, setLoading] = useState(true);

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    totalApprovedDeposits: 0,
    totalApprovedWithdrawals: 0,
    grossGamingRevenue: 0,
  });

  // Data lists
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState([]);
  const [users, setUsers] = useState([]);

  // Balance adjustment modal
  const [adjustModalUser, setAdjustModalUser] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustAction, setAdjustAction] = useState('credit');
  const [adjustReason, setAdjustReason] = useState('');

  // Status banners
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user');

    if (!token || !userStr) {
      router.push('/admin/login');
      return;
    }

    try {
      setAdminUser(JSON.parse(userStr));
    } catch (e) {
      router.push('/admin/login');
      return;
    }

    loadDashboardData(token);
  }, []);

  const loadDashboardData = async (token) => {
    try {
      setLoading(true);
      const authHeader = { headers: { Authorization: `Bearer ${token || localStorage.getItem('admin_token')}` } };

      const [statsRes, depRes, withRes, usersRes] = await Promise.all([
        apiRequest('/admin/stats', authHeader),
        apiRequest('/admin/deposits/pending', authHeader),
        apiRequest('/admin/withdrawals/pending', authHeader),
        apiRequest('/admin/users', authHeader),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (depRes.success) setPendingDeposits(depRes.deposits || []);
      if (withRes.success) setPendingWithdrawals(withRes.withdrawals || []);
      if (usersRes.success) setUsers(usersRes.users || []);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDeposit = async (id) => {
    try {
      const token = localStorage.getItem('admin_token');
      const res = await apiRequest(`/admin/deposits/${id}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.success) {
        setFeedback({ type: 'success', message: 'Deposit successfully approved & player wallet credited!' });
        loadDashboardData(token);
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleRejectDeposit = async (id) => {
    const reason = prompt('Enter rejection reason:') || 'Invalid transaction receipt';
    try {
      const token = localStorage.getItem('admin_token');
      const res = await apiRequest(`/admin/deposits/${id}/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason }),
      });

      if (res.success) {
        setFeedback({ type: 'success', message: 'Deposit marked as rejected.' });
        loadDashboardData(token);
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleApproveWithdrawal = async (id) => {
    if (!confirm('Confirm payout dispatch to player? This will deduct the locked amount.')) return;
    try {
      const token = localStorage.getItem('admin_token');
      const res = await apiRequest(`/admin/withdrawals/${id}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.success) {
        setFeedback({ type: 'success', message: 'Withdrawal approved & finalized!' });
        loadDashboardData(token);
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleRejectWithdrawal = async (id) => {
    const reason = prompt('Enter rejection reason:') || 'Payout details incorrect';
    try {
      const token = localStorage.getItem('admin_token');
      const res = await apiRequest(`/admin/withdrawals/${id}/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reason }),
      });

      if (res.success) {
        setFeedback({ type: 'success', message: 'Withdrawal rejected & funds refunded to player balance.' });
        loadDashboardData(token);
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleAdjustBalance = async (e) => {
    e.preventDefault();
    if (!adjustAmount || Number(adjustAmount) <= 0) return;

    try {
      const token = localStorage.getItem('admin_token');
      const res = await apiRequest('/admin/users/balance-adjust', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          userId: adjustModalUser.id,
          amount: Number(adjustAmount),
          action: adjustAction,
          reason: adjustReason,
        }),
      });

      if (res.success) {
        setFeedback({ type: 'success', message: `Successfully adjusted balance for ${adjustModalUser.username}` });
        setAdjustModalUser(null);
        setAdjustAmount('');
        setAdjustReason('');
        loadDashboardData(token);
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center font-black text-lg">
              ♠
            </span>
            <span className="font-black text-lg tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400">
              BETLUXA SUPER ADMIN
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400">
            ROLE: {adminUser?.role}
          </span>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors"
          >
            Go to Casino Front &rarr;
          </Link>

          <button
            onClick={handleAdminLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-300 text-xs font-bold transition-colors"
          >
            <LogOutIcon className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full">
        
        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mb-6 p-4 rounded-2xl text-xs font-bold flex items-center justify-between ${
              feedback.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-800/80 text-emerald-300'
                : 'bg-rose-950/80 border border-rose-800/80 text-rose-300'
            }`}
          >
            <span>{feedback.message}</span>
            <button onClick={() => setFeedback(null)} className="text-sm font-bold ml-4">✕</button>
          </div>
        )}

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Gross Gaming Revenue</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              ${Number(stats.grossGamingRevenue).toFixed(2)}
            </div>
            <span className="text-[10px] text-slate-500">Player Bets minus Wins</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Deposits Approved</span>
            <div className="text-2xl font-black text-amber-400 mt-1">
              ${Number(stats.totalApprovedDeposits).toFixed(2)}
            </div>
            <span className="text-[10px] text-slate-500">Credited to player accounts</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Pending Deposits</span>
            <div className="text-2xl font-black text-yellow-400 mt-1">
              {pendingDeposits.length}
            </div>
            <span className="text-[10px] text-slate-500">Awaiting cashier approval</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Pending Withdrawals</span>
            <div className="text-2xl font-black text-rose-400 mt-1">
              {pendingWithdrawals.length}
            </div>
            <span className="text-[10px] text-slate-500">Funds locked in payout hold</span>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-6">
          <button
            onClick={() => setActiveTab('deposits')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'deposits'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <ArrowDownLeftIcon className="w-3.5 h-3.5" />
            Deposit Queue ({pendingDeposits.length})
          </button>

          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'withdrawals'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <ArrowUpRightIcon className="w-3.5 h-3.5" />
            Withdrawal Queue ({pendingWithdrawals.length})
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'users'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <CoinsIcon className="w-3.5 h-3.5" />
            Registered Players ({users.length})
          </button>
        </div>

        {/* TAB 1: PENDING DEPOSITS */}
        {activeTab === 'deposits' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-200">Pending Deposit Requests</h3>
              <span className="text-xs text-slate-400 font-semibold">{pendingDeposits.length} requests awaiting verification</span>
            </div>

            {pendingDeposits.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                All deposits have been reviewed. No pending requests.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Player</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Payment Method</th>
                      <th className="p-3.5">TrxID / Reference</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {pendingDeposits.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-bold text-slate-200">
                          {tx.user?.username || 'Player'}
                          <span className="block text-[10px] text-slate-400 font-normal">{tx.user?.email}</span>
                        </td>
                        <td className="p-3.5 font-black text-emerald-400 text-sm">
                          +${Number(tx.amount).toFixed(2)}
                        </td>
                        <td className="p-3.5 font-bold text-slate-300">
                          {tx.payment_method}
                        </td>
                        <td className="p-3.5 font-mono text-amber-300 font-bold">
                          {tx.transaction_ref}
                        </td>
                        <td className="p-3.5 text-slate-400 text-[11px]">
                          {new Date(tx.created_at).toLocaleString()}
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleApproveDeposit(tx.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors"
                          >
                            Approve & Credit
                          </button>
                          <button
                            onClick={() => handleRejectDeposit(tx.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 font-bold text-xs border border-rose-800/60 transition-colors"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PENDING WITHDRAWALS */}
        {activeTab === 'withdrawals' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-200">Pending Withdrawal & Payout Requests</h3>
              <span className="text-xs text-slate-400 font-semibold">{pendingWithdrawals.length} payouts pending</span>
            </div>

            {pendingWithdrawals.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                All payout requests have been fulfilled. No pending withdrawals.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Player</th>
                      <th className="p-3.5">Amount</th>
                      <th className="p-3.5">Payout Method</th>
                      <th className="p-3.5">Player Destination Account</th>
                      <th className="p-3.5">Date</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {pendingWithdrawals.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-bold text-slate-200">
                          {tx.user?.username || 'Player'}
                          <span className="block text-[10px] text-slate-400 font-normal">{tx.user?.email}</span>
                        </td>
                        <td className="p-3.5 font-black text-rose-400 text-sm">
                          -${Number(tx.amount).toFixed(2)}
                        </td>
                        <td className="p-3.5 font-bold text-slate-300">
                          {tx.payment_method}
                        </td>
                        <td className="p-3.5 font-mono text-amber-300 font-bold">
                          {tx.transaction_ref}
                        </td>
                        <td className="p-3.5 text-slate-400 text-[11px]">
                          {new Date(tx.created_at).toLocaleString()}
                        </td>
                        <td className="p-3.5 text-right space-x-2">
                          <button
                            onClick={() => handleApproveWithdrawal(tx.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors"
                          >
                            Mark Paid & Settle
                          </button>
                          <button
                            onClick={() => handleRejectWithdrawal(tx.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 font-bold text-xs border border-rose-800/60 transition-colors"
                          >
                            Reject & Refund
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: REGISTERED PLAYERS */}
        {activeTab === 'users' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-200">User Accounts & Balances</h3>
              <span className="text-xs text-slate-400 font-semibold">{users.length} total accounts</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">User</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Playable Balance</th>
                    <th className="p-3.5">In Payout Hold</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-bold text-slate-200">
                        {u.username}
                        <span className="block text-[10px] text-slate-400 font-normal">{u.email}</span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full ${
                            u.role === 'super_admin'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-[10px] font-bold text-emerald-400">
                          {u.status}
                        </span>
                      </td>
                      <td className="p-3.5 font-black text-emerald-400 text-sm">
                        ${Number(u.wallet?.balance || 0).toFixed(2)}
                      </td>
                      <td className="p-3.5 font-bold text-amber-400">
                        ${Number(u.wallet?.locked_balance || 0).toFixed(2)}
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setAdjustModalUser(u)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-colors"
                        >
                          Adjust Balance &plusmn;
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Adjust Balance Modal */}
      {adjustModalUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-black text-base text-slate-100">
                Adjust Balance for {adjustModalUser.username}
              </h3>
              <button
                onClick={() => setAdjustModalUser(null)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdjustBalance} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Action</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustAction('credit')}
                    className={`py-2 rounded-xl text-xs font-bold border ${
                      adjustAction === 'credit'
                        ? 'border-emerald-500 bg-emerald-950/60 text-emerald-400'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    + Credit Funds
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustAction('debit')}
                    className={`py-2 rounded-xl text-xs font-bold border ${
                      adjustAction === 'debit'
                        ? 'border-rose-500 bg-rose-950/60 text-rose-400'
                        : 'border-slate-800 bg-slate-950 text-slate-400'
                    }`}
                  >
                    - Debit Funds
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Amount ($)</label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Reason / Note</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. VIP Promo / Correction"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors"
              >
                Apply Balance Adjustment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

