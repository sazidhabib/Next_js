'use client';

import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { ArrowDownLeftIcon, ArrowUpRightIcon, CheckCircleIcon, XCircleIcon } from './Icons';

export default function WalletModal({ isOpen, initialTab = 'deposit', onClose, user, onRefreshProfile }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Deposit Form State
  const [depositMethod, setDepositMethod] = useState('bKash');
  const [depositAmount, setDepositAmount] = useState('');
  const [trxId, setTrxId] = useState('');

  // Withdraw Form State
  const [withdrawMethod, setWithdrawMethod] = useState('bKash');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAccount, setWithdrawAccount] = useState('');

  // Transactions list
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (isOpen && activeTab === 'history') {
      loadTransactions();
    }
  }, [isOpen, activeTab]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const res = await api.getTransactions();
      if (res.success) {
        setTransactions(res.transactions);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!depositAmount || Number(depositAmount) <= 0) {
      setError('Please enter a valid deposit amount');
      return;
    }
    if (!trxId) {
      setError('Transaction Reference / TrxID is required');
      return;
    }

    try {
      setLoading(true);
      const res = await api.submitDeposit({
        amount: Number(depositAmount),
        paymentMethod: depositMethod,
        transactionRef: trxId,
      });

      if (res.success) {
        setMessage('Deposit request submitted! Cashier will verify and credit your balance.');
        setDepositAmount('');
        setTrxId('');
        if (onRefreshProfile) onRefreshProfile();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const amt = Number(withdrawAmount);
    if (!amt || amt <= 0) {
      setError('Please enter a valid withdrawal amount');
      return;
    }
    if (amt > (user?.wallet?.balance || 0)) {
      setError('Amount exceeds your playable balance');
      return;
    }
    if (!withdrawAccount) {
      setError('Please specify your payout account number or USDT address');
      return;
    }

    try {
      setLoading(true);
      const res = await api.submitWithdrawal({
        amount: amt,
        paymentMethod: withdrawMethod,
        transactionRef: withdrawAccount,
      });

      if (res.success) {
        setMessage('Withdrawal request placed! Funds are now in hold until cashier completes payout.');
        setWithdrawAmount('');
        setWithdrawAccount('');
        if (onRefreshProfile) onRefreshProfile();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-100">Casino Cashier & Wallet</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-400 font-semibold">Playable:</span>
              <span className="text-xs font-black text-emerald-400">
                ${Number(user?.wallet?.balance || 0).toFixed(2)}
              </span>
              <span className="text-xs text-slate-600">&bull;</span>
              <span className="text-xs text-slate-400 font-semibold">In Payout Hold:</span>
              <span className="text-xs font-bold text-amber-400">
                ${Number(user?.wallet?.locked_balance || 0).toFixed(2)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 bg-slate-950 p-1.5 border-b border-slate-800">
          <button
            onClick={() => { setActiveTab('deposit'); setMessage(null); setError(null); }}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'deposit'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownLeftIcon className="w-3.5 h-3.5" />
            Deposit
          </button>

          <button
            onClick={() => { setActiveTab('withdraw'); setMessage(null); setError(null); }}
            className={`py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'withdraw'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRightIcon className="w-3.5 h-3.5" />
            Withdraw
          </button>

          <button
            onClick={() => { setActiveTab('history'); setMessage(null); setError(null); }}
            className={`py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Transactions
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {message && (
            <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-rose-950/60 border border-rose-800/60 rounded-xl text-rose-400 text-xs font-semibold flex items-center gap-2">
              <XCircleIcon className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: DEPOSIT */}
          {activeTab === 'deposit' && (
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['bKash Agent', 'Nagad Agent', 'Bank Transfer', 'USDT (TRC-20)'].map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setDepositMethod(method)}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                        depositMethod === method
                          ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Agent Details Box */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Agent Transfer Instructions:
                </span>
                <p className="text-slate-300 mb-2">
                  Send funds to official agent number: <strong className="text-amber-400 font-mono">+880 1711-888888</strong> (or TRC20: <strong className="text-amber-400 font-mono">TLuX...8888</strong>).
                </p>
                <p className="text-slate-500 text-[11px]">
                  After sending, enter the exact Amount and Transaction ID (TrxID) below to submit for instant admin credit.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Deposit Amount ($)
                </label>
                <input
                  type="number"
                  min="5"
                  step="any"
                  placeholder="e.g. 50"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Transaction Reference / TrxID
                </label>
                <input
                  type="text"
                  placeholder="e.g. 9J4K829L0"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-slate-950 font-black text-sm transition-all shadow-lg shadow-amber-500/20 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Deposit Slip'}
              </button>
            </form>
          )}

          {/* TAB 2: WITHDRAW */}
          {activeTab === 'withdraw' && (
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-2">
                  Payout Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['bKash', 'Nagad', 'Bank Transfer', 'USDT (TRC-20)'].map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setWithdrawMethod(method)}
                      className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                        withdrawMethod === method
                          ? 'border-amber-400 bg-amber-500/10 text-amber-300'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Withdrawal Amount ($)
                </label>
                <input
                  type="number"
                  min="10"
                  step="any"
                  max={user?.wallet?.balance || 0}
                  placeholder="Min $10"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                  Account Number / Wallet Address
                </label>
                <input
                  type="text"
                  placeholder="Enter phone number, bank IBAN, or USDT address"
                  value={withdrawAccount}
                  onChange={(e) => setWithdrawAccount(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl text-xs text-slate-400">
                Notice: When you request a payout, the requested funds are safely moved to <strong>Hold Balance</strong> so you cannot accidentally gamble them while pending cashier dispatch.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-black text-sm transition-all disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Request Payout'}
              </button>
            </form>
          )}

          {/* TAB 3: HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              {loading && <p className="text-center text-xs text-slate-500 py-6">Loading transactions...</p>}
              {!loading && transactions.length === 0 && (
                <p className="text-center text-xs text-slate-500 py-6">No transactions recorded yet.</p>
              )}

              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                        tx.type === 'deposit'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                          : 'bg-rose-950/80 text-rose-400 border border-rose-800/40'
                      }`}
                    >
                      {tx.type === 'deposit' ? '↓' : '↑'}
                    </span>
                    <div>
                      <span className="font-bold text-slate-200 uppercase block">
                        {tx.type} ({tx.payment_method})
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Ref: {tx.transaction_ref || 'N/A'} &bull; {new Date(tx.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-black block text-sm ${
                        tx.type === 'deposit' ? 'text-emerald-400' : 'text-slate-200'
                      }`}
                    >
                      {tx.type === 'deposit' ? '+' : '-'}${Number(tx.amount).toFixed(2)}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block ${
                        tx.status === 'approved'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                          : tx.status === 'pending'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800/60'
                          : 'bg-rose-950 text-rose-400 border border-rose-800/60'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

