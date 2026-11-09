'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api, apiRequest } from '../../lib/api';
import {
  DashboardIcon,
  UsersIcon,
  Share2Icon,
  GiftIcon,
  TicketIcon,
  ArrowDownToLineIcon,
  ArrowUpFromLineIcon,
  CreditCardIcon,
  GamepadIcon,
  ActivityIcon,
  MegaphoneIcon,
  SettingsIcon,
  UserCogIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  ExternalLinkIcon,
  MenuIcon,
  CloseIcon,
  LogOutIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '../../components/Icons';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentTime, setCurrentTime] = useState('');

  // Platform Data
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    totalApprovedDeposits: 0,
    totalApprovedWithdrawals: 0,
    grossGamingRevenue: 0,
    vaultBalance: 4892150.0,
  });

  const [users, setUsers] = useState([]);
  const [userTab, setUserTab] = useState('real'); // 'real' | 'demo'
  const [userSearch, setUserSearch] = useState('');

  const [deposits, setDeposits] = useState([]);
  const [depositFilter, setDepositFilter] = useState('pending');

  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawalFilter, setWithdrawalFilter] = useState('pending');

  const [gateways, setGateways] = useState([]);
  const [games, setGames] = useState([]);
  const [selectedGameProvider, setSelectedGameProvider] = useState('all');

  const [liveBets, setLiveBets] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [lotteries, setLotteries] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [settings, setSettings] = useState({
    site_name: 'Betluxa',
    currency_symbol: '৳',
    currency_code: 'BDT',
    min_deposit: 100,
    min_withdrawal: 500,
    maintenance_mode: false,
    support_whatsapp: '+880 1711-888888',
    support_telegram: '@betluxa_support',
  });

  // Modals state
  const [adjustModalUser, setAdjustModalUser] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustAction, setAdjustAction] = useState('credit');
  const [adjustReason, setAdjustReason] = useState('');

  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false);
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('');
  const [newAnnouncementContent, setNewAnnouncementContent] = useState('');
  const [newAnnouncementMarquee, setNewAnnouncementMarquee] = useState(true);

  // Profile Security Form State
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminPin, setNewAdminPin] = useState('');

  // Status Alerts
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    // Live clock ticker
    setCurrentTime(new Date().toLocaleTimeString());
    const clockTimer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

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

    loadAllAdminData(token);
    return () => clearInterval(clockTimer);
  }, []);

  const getAuthHeader = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const loadAllAdminData = async (token) => {
    try {
      setLoading(true);
      const authHeader = getAuthHeader();

      const [
        statsRes,
        depRes,
        withRes,
        usersRes,
        gatewaysRes,
        gamesRes,
        betsRes,
        annRes,
        lottoRes,
        rewardsRes,
        settingsRes,
      ] = await Promise.all([
        apiRequest('/admin/stats', authHeader).catch(() => ({})),
        apiRequest('/admin/deposits/pending', authHeader).catch(() => ({})),
        apiRequest('/admin/withdrawals/pending', authHeader).catch(() => ({})),
        apiRequest('/admin/users', authHeader).catch(() => ({})),
        apiRequest('/admin/gateways', authHeader).catch(() => ({})),
        apiRequest('/admin/games-catalog', authHeader).catch(() => ({})),
        apiRequest('/admin/bets', authHeader).catch(() => ({})),
        apiRequest('/admin/announcements', authHeader).catch(() => ({})),
        apiRequest('/admin/lotteries', authHeader).catch(() => ({})),
        apiRequest('/admin/rewards', authHeader).catch(() => ({})),
        apiRequest('/admin/settings', authHeader).catch(() => ({})),
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (depRes.success) setDeposits(depRes.deposits || []);
      if (withRes.success) setWithdrawals(withRes.withdrawals || []);
      if (usersRes.success) setUsers(usersRes.users || []);
      if (gatewaysRes.success) setGateways(gatewaysRes.gateways || []);
      if (gamesRes.success) setGames(gamesRes.games || []);
      if (betsRes.success) setLiveBets(betsRes.bets || []);
      if (annRes.success) setAnnouncements(annRes.announcements || []);
      if (lottoRes.success) setLotteries(lottoRes.lotteries || []);
      if (rewardsRes.success) setRewards(rewardsRes.rewards || []);
      if (settingsRes.success) setSettings(settingsRes.settings || {});
    } catch (err) {
      console.error('Failed to load admin dataset', err);
    } finally {
      setLoading(false);
    }
  };

  // Actions
  const handleApproveDeposit = async (id) => {
    try {
      const res = await apiRequest(`/admin/deposits/${id}/approve`, {
        method: 'POST',
        ...getAuthHeader(),
      });
      if (res.success) {
        setFeedback({ type: 'success', message: 'Deposit approved and player wallet credited!' });
        loadAllAdminData();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleRejectDeposit = async (id) => {
    const reason = prompt('Enter rejection reason:') || 'Invalid transaction slip / ref';
    try {
      const res = await apiRequest(`/admin/deposits/${id}/reject`, {
        method: 'POST',
        ...getAuthHeader(),
        body: JSON.stringify({ reason }),
      });
      if (res.success) {
        setFeedback({ type: 'success', message: 'Deposit rejected.' });
        loadAllAdminData();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleApproveWithdrawal = async (id) => {
    if (!confirm('Confirm payout dispatch to player? This settles the held balance.')) return;
    try {
      const res = await apiRequest(`/admin/withdrawals/${id}/approve`, {
        method: 'POST',
        ...getAuthHeader(),
      });
      if (res.success) {
        setFeedback({ type: 'success', message: 'Withdrawal approved & funds settled!' });
        loadAllAdminData();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleRejectWithdrawal = async (id) => {
    const reason = prompt('Enter rejection reason:') || 'Invalid destination account details';
    try {
      const res = await apiRequest(`/admin/withdrawals/${id}/reject`, {
        method: 'POST',
        ...getAuthHeader(),
        body: JSON.stringify({ reason }),
      });
      if (res.success) {
        setFeedback({ type: 'success', message: 'Withdrawal rejected & funds refunded to player balance.' });
        loadAllAdminData();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleAdjustBalance = async (e) => {
    e.preventDefault();
    if (!adjustAmount || Number(adjustAmount) <= 0) return;
    try {
      const res = await apiRequest('/admin/users/balance-adjust', {
        method: 'POST',
        ...getAuthHeader(),
        body: JSON.stringify({
          userId: adjustModalUser.id,
          amount: Number(adjustAmount),
          action: adjustAction,
          reason: adjustReason,
        }),
      });
      if (res.success) {
        setFeedback({ type: 'success', message: `Adjusted balance for ${adjustModalUser.username}` });
        setAdjustModalUser(null);
        setAdjustAmount('');
        setAdjustReason('');
        loadAllAdminData();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      const res = await apiRequest(`/admin/users/${userId}/toggle-status`, {
        method: 'POST',
        ...getAuthHeader(),
      });
      if (res.success) {
        setFeedback({ type: 'success', message: `User status changed to ${res.status}` });
        loadAllAdminData();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleToggleGateway = async (gatewayId) => {
    try {
      const res = await apiRequest(`/admin/gateways/${gatewayId}/toggle`, {
        method: 'POST',
        ...getAuthHeader(),
      });
      if (res.success) {
        setFeedback({ type: 'success', message: 'Gateway status updated' });
        loadAllAdminData();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleToggleGame = async (gameId) => {
    try {
      const res = await apiRequest(`/admin/games-catalog/${gameId}/toggle`, {
        method: 'POST',
        ...getAuthHeader(),
      });
      if (res.success) {
        setFeedback({ type: 'success', message: 'Game status toggled' });
        loadAllAdminData();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleDrawLottery = async (lottoId) => {
    try {
      const res = await apiRequest(`/admin/lotteries/${lottoId}/draw`, {
        method: 'POST',
        ...getAuthHeader(),
      });
      if (res.success) {
        alert(`🎉 Winner drawn! Winning Ticket: ${res.winningTicket} (Jackpot: ৳ ${res.jackpot.toLocaleString()})`);
        loadAllAdminData();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const res = await apiRequest('/admin/announcements', {
        method: 'POST',
        ...getAuthHeader(),
        body: JSON.stringify({
          title: newAnnouncementTitle,
          content: newAnnouncementContent,
          is_marquee: newAnnouncementMarquee,
        }),
      });
      if (res.success) {
        setFeedback({ type: 'success', message: 'Announcement published successfully' });
        setAnnouncementModalOpen(false);
        setNewAnnouncementTitle('');
        setNewAnnouncementContent('');
        loadAllAdminData();
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const res = await apiRequest('/admin/settings', {
        method: 'POST',
        ...getAuthHeader(),
        body: JSON.stringify(settings),
      });
      if (res.success) {
        setFeedback({ type: 'success', message: 'Platform settings saved successfully' });
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleUpdateProfileSecurity = async (e) => {
    e.preventDefault();
    try {
      const res = await apiRequest('/admin/profile/security', {
        method: 'POST',
        ...getAuthHeader(),
        body: JSON.stringify({
          newPassword: newAdminPassword,
          newPin: newAdminPin,
        }),
      });
      if (res.success) {
        setFeedback({ type: 'success', message: 'Admin Password & 6-Digit PIN updated successfully' });
        setNewAdminPassword('');
        setNewAdminPin('');
      }
    } catch (err) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin/login');
  };

  // 13 Navigation items matching the reference structure
  const pendingDepCount = deposits.filter((d) => d.status === 'pending').length;
  const pendingWithCount = withdrawals.filter((w) => w.status === 'pending').length;

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'users', label: 'User Management', icon: UsersIcon, badge: users.length ? String(users.length) : undefined },
    { id: 'referrals', label: 'Referrals & Affiliates', icon: Share2Icon },
    { id: 'rewards', label: 'Rewards & Store', icon: GiftIcon },
    { id: 'lottery', label: 'Lottery & Draws', icon: TicketIcon },
    {
      id: 'deposits',
      label: 'Deposit Requests',
      icon: ArrowDownToLineIcon,
      badge: pendingDepCount > 0 ? `${pendingDepCount} new` : undefined,
      badgeColor: 'bg-amber-500 text-black font-black animate-pulse',
    },
    {
      id: 'withdrawals',
      label: 'Withdrawals',
      icon: ArrowUpFromLineIcon,
      badge: pendingWithCount > 0 ? `${pendingWithCount}` : undefined,
      badgeColor: 'bg-rose-500 text-white font-black',
    },
    { id: 'gateways', label: 'Payment Gateways', icon: CreditCardIcon },
    { id: 'games', label: 'Games & Providers', icon: GamepadIcon },
    { id: 'bets', label: 'Live Bets Monitor', icon: ActivityIcon, dot: true },
    { id: 'announcements', label: 'Marquee & Banners', icon: MegaphoneIcon },
    { id: 'settings', label: 'System Settings', icon: SettingsIcon },
    { id: 'profile', label: 'Admin Profile', icon: UserCogIcon },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        isDarkMode ? 'bg-[#0C0C12] text-slate-100' : 'bg-[#F4F6F9] text-gray-900'
      }`}
    >
      {/* Top Header Bar */}
      <header
        className={`sticky top-0 z-30 h-16 border-b backdrop-blur px-3 sm:px-6 flex items-center justify-between transition-colors ${
          isDarkMode ? 'bg-[#12121B]/95 border-[#212130]' : 'bg-white/95 border-gray-200 shadow-sm'
        }`}
      >
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`lg:hidden p-2 rounded-xl transition-colors ${
              isDarkMode ? 'bg-[#1C1C29] text-gray-300 hover:text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-label="Open Navigation"
          >
            <MenuIcon className="h-5 w-5" />
          </button>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-amber-500/20">
              ♠
            </span>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-sm sm:text-base font-black tracking-wider text-amber-500">
                  BETLUXA
                </span>
                <span className="rounded-md bg-amber-400/20 border border-amber-400/30 px-1.5 py-0.2 text-[8px] sm:text-[9px] font-black uppercase text-amber-500">
                  ADMIN
                </span>
              </div>
              <p className={`text-[10px] font-mono hidden md:block ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Control & Governance Center
              </p>
            </div>
          </div>
        </div>

        {/* Header Right Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-3">
          {/* Live Clock with pulsating green dot */}
          <div
            className={`hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono ${
              isDarkMode ? 'bg-[#181824] border-[#262638] text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{currentTime}</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-xl border transition-all ${
              isDarkMode
                ? 'bg-[#181824] border-[#262638] text-amber-400 hover:bg-[#202030]'
                : 'bg-gray-100 border-gray-200 text-amber-600 hover:bg-gray-200 shadow-xs'
            }`}
            title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDarkMode ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
          </button>

          {/* Live Site Link */}
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className={`hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors ${
              isDarkMode
                ? 'bg-[#1F1F2E] hover:bg-amber-500 hover:text-black border-[#2F2F44] text-gray-300'
                : 'bg-gray-100 hover:bg-amber-400 hover:text-black border-gray-200 text-gray-700'
            }`}
          >
            <span>Live Site</span>
            <ExternalLinkIcon className="h-3.5 w-3.5" />
          </a>

          {/* Pending Approvals Bell */}
          <button
            onClick={() => setCurrentTab('deposits')}
            className={`relative p-2 rounded-xl border transition-colors ${
              isDarkMode
                ? 'bg-[#181824] border-[#262638] text-gray-300 hover:text-amber-400'
                : 'bg-gray-100 border-gray-200 text-gray-700 hover:text-amber-600'
            }`}
            title="Pending Approvals"
          >
            <BellIcon className="h-4 w-4" />
            {pendingDepCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-black text-black shadow">
                {pendingDepCount}
              </span>
            )}
          </button>

          {/* Admin Profile Pill */}
          <button
            onClick={() => setCurrentTab('profile')}
            className={`flex items-center space-x-2 pl-2 border-l group transition-all ${
              isDarkMode ? 'border-[#242436]' : 'border-gray-200'
            }`}
          >
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black shadow-md text-xs sm:text-sm group-hover:scale-105 transition-transform">
              AD
            </div>
            <div className="hidden sm:block text-left">
              <p
                className={`text-xs font-bold leading-tight group-hover:text-amber-500 transition-colors ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {adminUser?.username || 'Super Admin'}
              </p>
              <p className="text-[10px] text-emerald-500 font-mono font-semibold">
                Super Admin
              </p>
            </div>
          </button>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex flex-1 relative">
        {/* Mobile Backdrop */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          />
        )}

        {/* Sidebar Navigation */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] border-r flex flex-col justify-between p-4 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:self-start lg:shrink-0 lg:w-64 lg:z-20 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } ${
            isDarkMode ? 'bg-[#101018] border-[#1F1F2E]' : 'bg-white border-gray-200 shadow-xl lg:shadow-none'
          }`}
        >
          {/* Mobile Drawer Close Header */}
          <div className="flex items-center justify-between pb-3 mb-2 border-b lg:hidden border-gray-800">
            <span className="font-black text-amber-500 text-sm">BETLUXA ADMIN</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded-lg text-gray-400 hover:text-white"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>

          {/* 13 Menu Links */}
          <div className="space-y-1 overflow-y-auto flex-1 scrollbar-none pr-1">
            <div
              className={`px-3 py-2 text-[10px] font-black uppercase tracking-wider ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              Management Navigation
            </div>

            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                      : isDarkMode
                      ? 'text-gray-300 hover:bg-[#1A1A26] hover:text-white'
                      : 'text-gray-700 hover:bg-amber-50 hover:text-amber-900'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-amber-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                        isActive
                          ? 'bg-black text-amber-400'
                          : item.badgeColor || (isDarkMode ? 'bg-[#222234] text-gray-300' : 'bg-gray-100 text-gray-700')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {item.dot && (
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Bottom Vault Box & Sign Out */}
          <div className={`pt-4 border-t space-y-2 mt-auto ${isDarkMode ? 'border-[#1C1C2A]' : 'border-gray-200'}`}>
            <div
              className={`rounded-xl border p-3 text-xs ${
                isDarkMode ? 'bg-[#161622] border-[#242436]' : 'bg-amber-50/60 border-amber-200'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Main Vault</span>
                <span className="text-emerald-500 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Online
                </span>
              </div>
              <div className="mt-1 font-mono text-base font-black text-amber-500">
                ৳ 4,892,150.00
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors"
            >
              <LogOutIcon className="h-4 w-4" />
              <span>Sign Out Admin</span>
            </button>
          </div>
        </aside>

        {/* Main Content View Container */}
        <main className="flex-1 min-w-0 overflow-x-hidden p-3 sm:p-6 lg:p-8">
          {/* Feedback Notice Banner */}
          {feedback && (
            <div
              className={`mb-6 p-4 rounded-2xl text-xs font-bold flex items-center justify-between shadow-lg ${
                feedback.type === 'success'
                  ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                  : 'bg-rose-950/80 border border-rose-800 text-rose-300'
              }`}
            >
              <span>{feedback.message}</span>
              <button onClick={() => setFeedback(null)} className="text-sm font-bold ml-4">
                ✕
              </button>
            </div>
          )}

          {/* 1. DASHBOARD VIEW */}
          {currentTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-slate-100">Executive Dashboard</h1>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time gaming operations & financial health</p>
                </div>
                <button
                  onClick={() => loadAllAdminData()}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-amber-400"
                >
                  ↻ Refresh Data
                </button>
              </div>

              {/* Key Metric Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#12121B] border border-[#212130] p-5 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Gross Gaming Revenue</span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    ${Number(stats.grossGamingRevenue).toFixed(2)}
                  </div>
                  <span className="text-[10px] text-slate-500">Player Bets minus Wins</span>
                </div>

                <div className="bg-[#12121B] border border-[#212130] p-5 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Total Approved Deposits</span>
                  <div className="text-2xl font-black text-amber-400 mt-1">
                    ${Number(stats.totalApprovedDeposits).toFixed(2)}
                  </div>
                  <span className="text-[10px] text-slate-500">Credited to player accounts</span>
                </div>

                <div className="bg-[#12121B] border border-[#212130] p-5 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Pending Deposits</span>
                  <div className="text-2xl font-black text-yellow-400 mt-1">
                    {pendingDepCount}
                  </div>
                  <span className="text-[10px] text-slate-500">Awaiting cashier approval</span>
                </div>

                <div className="bg-[#12121B] border border-[#212130] p-5 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Pending Withdrawals</span>
                  <div className="text-2xl font-black text-rose-400 mt-1">
                    {pendingWithCount}
                  </div>
                  <span className="text-[10px] text-slate-500">Funds locked in payout hold</span>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div className="bg-[#12121B] border border-[#212130] p-5 rounded-2xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Quick Navigation</h3>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => setCurrentTab('deposits')}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:brightness-110 transition-all flex items-center gap-1.5"
                  >
                    <ArrowDownToLineIcon className="w-3.5 h-3.5" />
                    Review Pending Deposits ({pendingDepCount})
                  </button>

                  <button
                    onClick={() => setCurrentTab('withdrawals')}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center gap-1.5"
                  >
                    <ArrowUpFromLineIcon className="w-3.5 h-3.5" />
                    Review Withdrawals ({pendingWithCount})
                  </button>

                  <button
                    onClick={() => setCurrentTab('bets')}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center gap-1.5"
                  >
                    <ActivityIcon className="w-3.5 h-3.5 text-emerald-400" />
                    Live Bets Stream
                  </button>

                  <button
                    onClick={() => setAnnouncementModalOpen(true)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all flex items-center gap-1.5"
                  >
                    <MegaphoneIcon className="w-3.5 h-3.5 text-amber-400" />
                    Post Marquee Notice
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. USER MANAGEMENT VIEW */}
          {currentTab === 'users' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-100">User Management</h2>
                  <p className="text-xs text-slate-400">Total {users.length} accounts registered</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setUserTab('real')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                      userTab === 'real'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Real Players ({users.filter((u) => u.role === 'player').length})
                  </button>

                  <button
                    onClick={() => setUserTab('demo')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                      userTab === 'demo'
                        ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Admin / Staff ({users.filter((u) => u.role !== 'player').length})
                  </button>
                </div>
              </div>

              {/* Search */}
              <input
                type="text"
                placeholder="Search players by username or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#12121B] border border-[#212130] rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-400"
              />

              <div className="bg-[#12121B] border border-[#212130] rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#161624] text-slate-400 uppercase font-bold text-[10px] border-b border-[#212130]">
                      <tr>
                        <th className="p-3.5">User</th>
                        <th className="p-3.5">Contact</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">Playable Balance</th>
                        <th className="p-3.5">In Hold</th>
                        <th className="p-3.5">Joined</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#212130]">
                      {users
                        .filter((u) => (userTab === 'real' ? u.role === 'player' : u.role !== 'player'))
                        .filter(
                          (u) =>
                            u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
                            u.email?.toLowerCase().includes(userSearch.toLowerCase())
                        )
                        .map((u) => (
                          <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="p-3.5 font-bold text-slate-200">
                              {u.username}
                              <span className="block text-[10px] text-amber-400/80 uppercase font-mono">{u.role}</span>
                            </td>
                            <td className="p-3.5 text-slate-300">
                              {u.email}
                              <span className="block text-[10px] text-slate-500">{u.phone || 'No phone'}</span>
                            </td>
                            <td className="p-3.5">
                              <span
                                className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                  u.status === 'active'
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                                }`}
                              >
                                {u.status}
                              </span>
                            </td>
                            <td className="p-3.5 font-black text-emerald-400 text-sm">
                              ${Number(u.wallet?.balance || 0).toFixed(2)}
                            </td>
                            <td className="p-3.5 font-bold text-amber-400">
                              ${Number(u.wallet?.locked_balance || 0).toFixed(2)}
                            </td>
                            <td className="p-3.5 text-slate-400 text-[11px]">
                              {new Date(u.created_at).toLocaleDateString()}
                            </td>
                            <td className="p-3.5 text-right space-x-2">
                              <button
                                onClick={() => setAdjustModalUser(u)}
                                className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-black font-bold text-xs transition-colors"
                              >
                                Adjust &plusmn;
                              </button>
                              <button
                                onClick={() => handleToggleUserStatus(u.id)}
                                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors"
                              >
                                {u.status === 'active' ? 'Suspend' : 'Activate'}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. REFERRALS & AFFILIATES VIEW */}
          {currentTab === 'referrals' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-100">Referrals & Affiliate Program</h2>
                  <p className="text-xs text-slate-400">Multi-tier commission distribution & affiliate network</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#12121B] border border-[#212130] p-5 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Level 1 Direct Commission</span>
                  <div className="text-2xl font-black text-amber-400 mt-1">5.0%</div>
                  <span className="text-[10px] text-slate-500">From referred player net losses</span>
                </div>

                <div className="bg-[#12121B] border border-[#212130] p-5 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Level 2 Sub-Affiliate</span>
                  <div className="text-2xl font-black text-yellow-400 mt-1">2.0%</div>
                  <span className="text-[10px] text-slate-500">Secondary referral tier</span>
                </div>

                <div className="bg-[#12121B] border border-[#212130] p-5 rounded-2xl">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Total Commissions Disbursed</span>
                  <div className="text-2xl font-black text-emerald-400 mt-1">৳ 184,250.00</div>
                  <span className="text-[10px] text-slate-500">Paid to 124 registered agents</span>
                </div>
              </div>

              <div className="bg-[#12121B] border border-[#212130] p-5 rounded-2xl">
                <h3 className="font-extrabold text-sm text-slate-200 mb-3">Top Performing Affiliates</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#161624] text-slate-400 uppercase font-bold text-[10px] border-b border-[#212130]">
                      <tr>
                        <th className="p-3">Affiliate Code</th>
                        <th className="p-3">Agent</th>
                        <th className="p-3">Referred Players</th>
                        <th className="p-3">Total Volume</th>
                        <th className="p-3">Total Earned</th>
                        <th className="p-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#212130]">
                      <tr className="hover:bg-slate-800/30">
                        <td className="p-3 font-mono font-bold text-amber-400">LUX-88219</td>
                        <td className="p-3 font-bold text-slate-200">dhaka_master_agent</td>
                        <td className="p-3 font-bold text-slate-300">84 players</td>
                        <td className="p-3 font-black text-emerald-400">৳ 1,240,000</td>
                        <td className="p-3 font-black text-amber-400">৳ 62,000</td>
                        <td className="p-3 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                            Active
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-800/30">
                        <td className="p-3 font-mono font-bold text-amber-400">LUX-11029</td>
                        <td className="p-3 font-bold text-slate-200">chittagong_vip</td>
                        <td className="p-3 font-bold text-slate-300">42 players</td>
                        <td className="p-3 font-black text-emerald-400">৳ 780,000</td>
                        <td className="p-3 font-black text-amber-400">৳ 39,000</td>
                        <td className="p-3 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                            Active
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 4. REWARDS & STORE VIEW */}
          {currentTab === 'rewards' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-100">Rewards & Loyalty Shop</h2>
                  <p className="text-xs text-slate-400">Daily check-in prizes, points redemptions & catalog</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {rewards.map((item) => (
                  <div key={item.id} className="bg-[#12121B] border border-[#212130] p-5 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-950/80 text-amber-400 border border-amber-800/40">
                          {item.category}
                        </span>
                        <span className="text-xs font-bold text-emerald-400">Active</span>
                      </div>
                      <h4 className="font-extrabold text-sm text-slate-100 mt-3">{item.title}</h4>
                      <p className="text-xs font-black text-amber-400 mt-1">{item.points_cost} Reward Points</p>
                    </div>

                    <button className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors">
                      Edit Item
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. LOTTERY & DRAWS VIEW */}
          {currentTab === 'lottery' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-100">Lottery & Weekly Jackpot Draws</h2>
                  <p className="text-xs text-slate-400">Automated provably-fair draw scheduler and winner disbursements</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lotteries.map((lotto) => (
                  <div key={lotto.id} className="bg-[#12121B] border border-[#212130] p-6 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                          Ticket Price: ৳ {lotto.ticket_price}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                          {lotto.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-slate-100 mt-2">{lotto.title}</h3>
                      <div className="my-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Current Jackpot Pool</span>
                        <div className="text-2xl font-black text-amber-400">৳ {lotto.jackpot_pool.toLocaleString()}</div>
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          Total tickets sold: <strong>{lotto.total_tickets}</strong>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDrawLottery(lotto.id)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber-500/20"
                    >
                      Trigger Live Draw & Pick Winner
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. DEPOSIT REQUESTS VIEW */}
          {currentTab === 'deposits' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-100">Deposit Verification Queue</h2>
                  <p className="text-xs text-slate-400">Review submitted transaction slips and credit player wallets</p>
                </div>

                <div className="flex items-center gap-1.5">
                  {['pending', 'approved', 'rejected', 'all'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setDepositFilter(filter)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize border ${
                        depositFilter === filter
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#12121B] border border-[#212130] rounded-2xl overflow-hidden shadow-xl">
                {deposits.length === 0 ? (
                  <div className="p-12 text-center text-xs text-slate-500">No deposit records found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#161624] text-slate-400 uppercase font-bold text-[10px] border-b border-[#212130]">
                        <tr>
                          <th className="p-3.5">Player</th>
                          <th className="p-3.5">Amount</th>
                          <th className="p-3.5">Method</th>
                          <th className="p-3.5">TrxID / Reference</th>
                          <th className="p-3.5">Date</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#212130]">
                        {deposits
                          .filter((d) => (depositFilter === 'all' ? true : d.status === depositFilter))
                          .map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                              <td className="p-3.5 font-bold text-slate-200">
                                {tx.user?.username || 'Player'}
                                <span className="block text-[10px] text-slate-500">{tx.user?.email}</span>
                              </td>
                              <td className="p-3.5 font-black text-emerald-400 text-sm">
                                +${Number(tx.amount).toFixed(2)}
                              </td>
                              <td className="p-3.5 font-bold text-slate-300">{tx.payment_method}</td>
                              <td className="p-3.5 font-mono text-amber-300 font-bold">{tx.transaction_ref}</td>
                              <td className="p-3.5 text-slate-400 text-[11px]">
                                {new Date(tx.created_at).toLocaleString()}
                              </td>
                              <td className="p-3.5">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                    tx.status === 'approved'
                                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                      : tx.status === 'pending'
                                      ? 'bg-amber-950 text-amber-400 border border-amber-800 animate-pulse'
                                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                                  }`}
                                >
                                  {tx.status}
                                </span>
                              </td>
                              <td className="p-3.5 text-right space-x-2">
                                {tx.status === 'pending' ? (
                                  <>
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
                                  </>
                                ) : (
                                  <span className="text-slate-500 text-[10px] italic">Processed</span>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 7. WITHDRAWALS VIEW */}
          {currentTab === 'withdrawals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-100">Withdrawals & Payout Dispatch</h2>
                  <p className="text-xs text-slate-400">Process player payouts and deduct locked balance holds</p>
                </div>

                <div className="flex items-center gap-1.5">
                  {['pending', 'approved', 'rejected', 'all'].map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setWithdrawalFilter(filter)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize border ${
                        withdrawalFilter === filter
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#12121B] border border-[#212130] rounded-2xl overflow-hidden shadow-xl">
                {withdrawals.length === 0 ? (
                  <div className="p-12 text-center text-xs text-slate-500">No withdrawal records found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#161624] text-slate-400 uppercase font-bold text-[10px] border-b border-[#212130]">
                        <tr>
                          <th className="p-3.5">Player</th>
                          <th className="p-3.5">Amount</th>
                          <th className="p-3.5">Payout Method</th>
                          <th className="p-3.5">Destination Account</th>
                          <th className="p-3.5">Date</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#212130]">
                        {withdrawals
                          .filter((w) => (withdrawalFilter === 'all' ? true : w.status === withdrawalFilter))
                          .map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                              <td className="p-3.5 font-bold text-slate-200">
                                {tx.user?.username || 'Player'}
                                <span className="block text-[10px] text-slate-500">{tx.user?.email}</span>
                              </td>
                              <td className="p-3.5 font-black text-rose-400 text-sm">
                                -${Number(tx.amount).toFixed(2)}
                              </td>
                              <td className="p-3.5 font-bold text-slate-300">{tx.payment_method}</td>
                              <td className="p-3.5 font-mono text-amber-300 font-bold">{tx.transaction_ref}</td>
                              <td className="p-3.5 text-slate-400 text-[11px]">
                                {new Date(tx.created_at).toLocaleString()}
                              </td>
                              <td className="p-3.5">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                    tx.status === 'approved'
                                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                      : tx.status === 'pending'
                                      ? 'bg-rose-950 text-rose-400 border border-rose-800 animate-pulse'
                                      : 'bg-slate-800 text-slate-400'
                                  }`}
                                >
                                  {tx.status}
                                </span>
                              </td>
                              <td className="p-3.5 text-right space-x-2">
                                {tx.status === 'pending' ? (
                                  <>
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
                                  </>
                                ) : (
                                  <span className="text-slate-500 text-[10px] italic">Processed</span>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 8. PAYMENT GATEWAYS VIEW */}
          {currentTab === 'gateways' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-100">Payment Gateways & Agent Channels</h2>
                  <p className="text-xs text-slate-400">Configure bKash, Nagad, Rocket, Bank Transfer & USDT</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gateways.map((g) => (
                  <div key={g.id} className="bg-[#12121B] border border-[#212130] p-5 rounded-2xl flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-mono font-bold text-slate-400">{g.type}</span>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            g.is_active
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {g.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </div>

                      <h3 className="font-black text-base text-slate-100 mt-2">{g.name}</h3>
                      <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Destination Account:</span>
                          <span className="font-mono font-bold text-amber-400">{g.account_number}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Limits (Min / Max):</span>
                          <span className="text-slate-300 font-bold">{g.min} / {g.max}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Processing Fee:</span>
                          <span className="text-emerald-400 font-bold">{g.fee}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800">
                      <button
                        onClick={() => handleToggleGateway(g.id)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors ${
                          g.is_active
                            ? 'bg-rose-950/60 text-rose-300 hover:bg-rose-900 border border-rose-800/40'
                            : 'bg-emerald-500 text-slate-950 font-black'
                        }`}
                      >
                        {g.is_active ? 'Disable Channel' : 'Enable Channel'}
                      </button>

                      <button
                        onClick={() => alert(`Simulating test API handshake for ${g.name}... ✅ Status: 200 OK`)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                      >
                        Test API
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. GAMES & PROVIDERS VIEW */}
          {currentTab === 'games' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-100">Games & Provider Management</h2>
                  <p className="text-xs text-slate-400">Total {games.length} titles connected via Seamless Wallet</p>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                  {['all', 'Pragmatic Play', 'Evolution Gaming', 'Spribe', 'NetEnt'].map((prov) => (
                    <button
                      key={prov}
                      onClick={() => setSelectedGameProvider(prov)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border ${
                        selectedGameProvider === prov
                          ? 'bg-amber-500 text-slate-950 border-amber-400 font-black'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {prov}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {games
                  .filter((g) => (selectedGameProvider === 'all' ? true : g.provider === selectedGameProvider))
                  .map((g) => (
                    <div key={g.id} className="bg-[#12121B] border border-[#212130] rounded-xl overflow-hidden flex flex-col justify-between">
                      <div className="relative aspect-[4/3] bg-black">
                        <img src={g.thumbnail_url} alt={g.name} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-slate-950/80 text-amber-400">
                          {g.provider}
                        </span>
                      </div>

                      <div className="p-3">
                        <h4 className="font-bold text-xs text-slate-200 truncate">{g.name}</h4>
                        <span className="text-[10px] text-slate-500 uppercase">{g.category.replace('_', ' ')}</span>

                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800">
                          <button
                            onClick={() => handleToggleGame(g.id)}
                            className={`w-full py-1 rounded text-[10px] font-bold ${
                              g.is_active ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {g.is_active ? 'Active' : 'Disabled'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 10. LIVE BETS MONITOR VIEW */}
          {currentTab === 'bets' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <div>
                    <h2 className="text-xl font-black text-slate-100">Live Bets Monitor</h2>
                    <p className="text-xs text-slate-400">Real-time telemetry stream from connected Seamless Wallet engines</p>
                  </div>
                </div>

                <button
                  onClick={() => loadAllAdminData()}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-amber-400"
                >
                  ↻ Refresh Feed
                </button>
              </div>

              <div className="bg-[#12121B] border border-[#212130] rounded-2xl overflow-hidden shadow-xl">
                {liveBets.length === 0 ? (
                  <div className="p-12 text-center text-xs text-slate-500">
                    No bets placed recently. Spin any game in the lobby to see live telemetry!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#161624] text-slate-400 uppercase font-bold text-[10px] border-b border-[#212130]">
                        <tr>
                          <th className="p-3.5">Round ID</th>
                          <th className="p-3.5">Player</th>
                          <th className="p-3.5">Game</th>
                          <th className="p-3.5">Bet Amount</th>
                          <th className="p-3.5">Win Amount</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-right">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#212130]">
                        {liveBets.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-800/30">
                            <td className="p-3.5 font-mono text-[11px] text-amber-400">{b.provider_round_id}</td>
                            <td className="p-3.5 font-bold text-slate-200">{b.user?.username || 'Player'}</td>
                            <td className="p-3.5 text-slate-300">{b.game?.name || 'Casino Game'}</td>
                            <td className="p-3.5 font-bold text-slate-200">${Number(b.bet_amount).toFixed(2)}</td>
                            <td className="p-3.5 font-black text-emerald-400">${Number(b.win_amount).toFixed(2)}</td>
                            <td className="p-3.5">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                  Number(b.win_amount) > 0
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                    : 'bg-slate-800 text-slate-400'
                                }`}
                              >
                                {Number(b.win_amount) > 0 ? 'WIN' : 'NO WIN'}
                              </span>
                            </td>
                            <td className="p-3.5 text-right text-slate-400 text-[11px]">
                              {new Date(b.created_at).toLocaleTimeString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 11. MARQUEE & BANNERS VIEW */}
          {currentTab === 'announcements' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-100">Marquee & Banners Manager</h2>
                  <p className="text-xs text-slate-400">Broadcast running ticker messages and promotion hero slides</p>
                </div>

                <button
                  onClick={() => setAnnouncementModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber-500/20"
                >
                  + Add New Announcement
                </button>
              </div>

              {/* Running Marquee Preview */}
              <div className="bg-[#12121B] border border-[#212130] p-4 rounded-2xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block mb-2">
                  Active Casino Marquee Preview:
                </span>
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl overflow-hidden whitespace-nowrap">
                  <div className="animate-marquee inline-block font-bold text-xs text-amber-300">
                    {announcements.find((a) => a.is_marquee)?.content || 'Welcome to Betluxa Casino & Live Gaming!'}
                  </div>
                </div>
              </div>

              {/* Announcements list */}
              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div key={ann.id} className="bg-[#12121B] border border-[#212130] p-5 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] uppercase font-black px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {ann.is_marquee ? 'Marquee Ticker' : 'Hero Banner'}
                        </span>
                        <h4 className="font-extrabold text-sm text-slate-100">{ann.title}</h4>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{ann.content}</p>
                    </div>

                    <span className="text-xs font-bold text-emerald-400">Published</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 12. SYSTEM SETTINGS VIEW */}
          {currentTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-100">System Configuration</h2>
                <p className="text-xs text-slate-400">Core platform variables, limits, and maintenance mode</p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-[#12121B] border border-[#212130] p-6 rounded-2xl space-y-4 max-w-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Site Title</label>
                    <input
                      type="text"
                      value={settings.site_name}
                      onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Currency Symbol</label>
                    <input
                      type="text"
                      value={settings.currency_symbol}
                      onChange={(e) => setSettings({ ...settings, currency_symbol: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Min Deposit</label>
                    <input
                      type="number"
                      value={settings.min_deposit}
                      onChange={(e) => setSettings({ ...settings, min_deposit: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Min Withdrawal</label>
                    <input
                      type="number"
                      value={settings.min_withdrawal}
                      onChange={(e) => setSettings({ ...settings, min_withdrawal: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">WhatsApp Support</label>
                    <input
                      type="text"
                      value={settings.support_whatsapp}
                      onChange={(e) => setSettings({ ...settings, support_whatsapp: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Telegram Support</label>
                    <input
                      type="text"
                      value={settings.support_telegram}
                      onChange={(e) => setSettings({ ...settings, support_telegram: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 13. ADMIN PROFILE VIEW */}
          {currentTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-100">Super Admin Profile & Security</h2>
                <p className="text-xs text-slate-400">Manage your administrative credentials, 6-digit security PIN and sub-admins</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                {/* Details Card */}
                <div className="bg-[#12121B] border border-[#212130] p-6 rounded-2xl">
                  <h3 className="font-extrabold text-sm text-slate-200 mb-4">Account Overview</h3>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Username:</span>
                      <span className="font-bold text-slate-200">{adminUser?.username || 'betluxa_admin'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Email:</span>
                      <span className="font-bold text-slate-200">{adminUser?.email || 'admin@betluxa.com'}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-800">
                      <span className="text-slate-400">Assigned Role:</span>
                      <span className="font-bold text-amber-400 uppercase">{adminUser?.role || 'super_admin'}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-400">Security PIN:</span>
                      <span className="font-mono text-emerald-400 font-bold">Enabled (6-digit hash)</span>
                    </div>
                  </div>
                </div>

                {/* Password & PIN Change Form */}
                <form onSubmit={handleUpdateProfileSecurity} className="bg-[#12121B] border border-[#212130] p-6 rounded-2xl space-y-4">
                  <h3 className="font-extrabold text-sm text-slate-200">Update Credentials</h3>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">New Password</label>
                    <input
                      type="password"
                      placeholder="Leave blank to keep unchanged"
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">New 6-Digit Security PIN</label>
                    <input
                      type="password"
                      maxLength={6}
                      placeholder="e.g. 888888"
                      value={newAdminPin}
                      onChange={(e) => setNewAdminPin(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono tracking-widest text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs hover:brightness-110 active:scale-95 transition-all shadow-md shadow-amber-500/20"
                  >
                    Update Security PIN & Password
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Adjust Balance Modal */}
      {adjustModalUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12121B] border border-[#212130] rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#212130] mb-4">
              <h3 className="font-black text-base text-slate-100">
                Adjust Balance: {adjustModalUser.username}
              </h3>
              <button onClick={() => setAdjustModalUser(null)} className="text-slate-400 hover:text-white font-bold">
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
                        : 'border-[#212130] bg-slate-950 text-slate-400'
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
                        : 'border-[#212130] bg-slate-950 text-slate-400'
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
                  className="w-full px-4 py-2.5 bg-slate-950 border border-[#212130] rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Reason / Reference Note</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. VIP Promotion Bonus"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-[#212130] rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400"
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

      {/* Add Announcement Modal */}
      {announcementModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12121B] border border-[#212130] rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#212130] mb-4">
              <h3 className="font-black text-base text-slate-100">Publish New Notice</h3>
              <button onClick={() => setAnnouncementModalOpen(false)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Maintenance or New Game Release"
                  value={newAnnouncementTitle}
                  onChange={(e) => setNewAnnouncementTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-[#212130] rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Announcement Body</label>
                <textarea
                  rows={3}
                  placeholder="Enter notice content..."
                  value={newAnnouncementContent}
                  onChange={(e) => setNewAnnouncementContent(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-[#212130] rounded-xl text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isMarquee"
                  checked={newAnnouncementMarquee}
                  onChange={(e) => setNewAnnouncementMarquee(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-0"
                />
                <label htmlFor="isMarquee" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Display in Casino Live Marquee Ticker
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-xs hover:brightness-110 transition-all shadow-md shadow-amber-500/20"
              >
                Publish Announcement
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
