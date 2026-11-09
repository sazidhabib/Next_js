'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import QuickNavPills from '../components/QuickNavPills';
import HeroSlider from '../components/HeroSlider';
import MarqueeTicker from '../components/MarqueeTicker';
import MainCategoryTabs from '../components/MainCategoryTabs';
import LiveCricketSection from '../components/LiveCricketSection';
import RecentWinnersTicker from '../components/RecentWinnersTicker';
import GameCard from '../components/GameCard';
import TrustFooter from '../components/TrustFooter';
import MobileNav from '../components/MobileNav';

// Modals
import GameModal from '../components/GameModal';
import WalletModal from '../components/WalletModal';
import AuthModal from '../components/AuthModal';
import LuckyWheelModal from '../components/LuckyWheelModal';
import DailyCheckinModal from '../components/DailyCheckinModal';

import { api } from '../lib/api';

export default function Home() {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedProvider, setSelectedProvider] = useState('all');
  const [activePill, setActivePill] = useState(null);
  const [loadingGames, setLoadingGames] = useState(true);

  // Notification Toast
  const [toast, setToast] = useState(null);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [walletInitialTab, setWalletInitialTab] = useState('deposit');
  const [wheelModalOpen, setWheelModalOpen] = useState(false);
  const [checkinModalOpen, setCheckinModalOpen] = useState(false);

  // Active Game Launcher Modal State
  const [activeGame, setActiveGame] = useState(null);
  const [launchUrl, setLaunchUrl] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  useEffect(() => {
    // Check existing stored user session
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        refreshProfile();
      } catch (e) {
        localStorage.removeItem('user');
      }
    }

    loadGames('all');
  }, []);

  // Filter games when selectedProvider or games changes
  useEffect(() => {
    if (selectedProvider === 'all') {
      setFilteredGames(games);
    } else {
      setFilteredGames(games.filter((g) => g.provider.toLowerCase().includes(selectedProvider.toLowerCase())));
    }
  }, [games, selectedProvider]);

  const refreshProfile = async () => {
    try {
      const res = await api.getProfile();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('user', JSON.stringify(res.user));
      }
    } catch (err) {
      console.error('Failed to sync profile', err);
    }
  };

  const loadGames = async (cat) => {
    try {
      setLoadingGames(true);
      // Map frontend category slugs to backend category keys
      let backendCat = cat;
      if (cat === 'live-casino') backendCat = 'live_casino';
      if (cat === 'cricket' || cat === 'sportsbook') backendCat = 'all';

      const res = await api.getGames(backendCat);
      if (res.success) {
        let list = res.games || [];
        if (cat === 'cricket') {
          list = list.filter((g) => g.name.toLowerCase().includes('cricket') || g.category === 'crash');
        }
        setGames(list);
      }
    } catch (err) {
      console.error('Failed to fetch games', err);
    } finally {
      setLoadingGames(false);
    }
  };

  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    setSelectedProvider('all');
    loadGames(catId);
  };

  const handleSelectPill = (pillId) => {
    setActivePill(pillId);
    if (pillId === 'wheel') {
      setWheelModalOpen(true);
    } else if (pillId === 'rewards') {
      setCheckinModalOpen(true);
    } else if (pillId === 'promotions') {
      showToast('🎁 200% Welcome Bonus is automatically applied on your first deposit!', 'info');
    } else if (pillId === 'referral') {
      if (!user) {
        setAuthMode('login');
        setAuthModalOpen(true);
      } else {
        navigator.clipboard?.writeText?.(`https://betluxa.com/register?ref=${user.username || 'vip'}`);
        showToast('🔗 Referral link copied to clipboard! Share and earn 5% commission.');
      }
    } else if (pillId === 'lottery') {
      showToast('🎟️ Betluxa Weekly Mega Draw: Prize pool ৳ 250,000! Drawing this Sunday.');
    } else if (pillId === 'vip') {
      showToast('👑 VIP Tier: Bronze Member. Upgrade by placing bets to earn exclusive cashback!');
    } else if (pillId === 'affiliate') {
      showToast('💼 Betluxa Master Agent Program: Contact Telegram @BetluxaAffiliate for revenue share.');
    }
  };

  const handlePlayGame = async (game) => {
    if (!user) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }

    try {
      const res = await api.launchGame(game.id);
      if (res.success && res.launchUrl) {
        setActiveGame(game);
        setLaunchUrl(res.launchUrl);
      }
    } catch (err) {
      showToast(err.message || 'Could not launch game', 'error');
    }
  };

  const handlePlaceCricketBet = (match, selection) => {
    if (!user) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }
    showToast(`🏏 Bet slip registered on ${selection} @ odds! Good luck!`);
  };

  const handleRewardClaimed = (prize) => {
    showToast(`🎉 Congratulations! You received ${prize.label}!`);
    refreshProfile();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    showToast('Logged out successfully');
  };

  const handleOpenAuth = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleOpenWallet = (tab = 'deposit') => {
    if (!user) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }
    setWalletInitialTab(tab);
    setWalletModalOpen(true);
  };

  const providersList = [
    { id: 'all', name: 'All Providers' },
    { id: 'pragmatic', name: 'Pragmatic Play' },
    { id: 'evolution', name: 'Evolution' },
    { id: 'spribe', name: 'Spribe' },
    { id: 'jili', name: 'JILI Games' },
    { id: 'bgaming', name: 'BGaming' },
    { id: 'smartsoft', name: 'SmartSoft' },
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-gray-900 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 pb-20 md:pb-0">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 max-w-sm px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md border flex items-center gap-3 animate-bounce transition-all bg-white/95 border-amber-300 text-gray-900 shadow-amber-500/10">
          <span className="text-lg">⚡</span>
          <p className="text-xs font-bold leading-snug">{toast.message}</p>
        </div>
      )}

      {/* Reference-Matching Top Header (Light Theme) */}
      <Header
        user={user}
        onOpenAuth={handleOpenAuth}
        onOpenWallet={handleOpenWallet}
        onLogout={handleLogout}
        onOpenWheel={() => setWheelModalOpen(true)}
        onOpenCheckin={() => setCheckinModalOpen(true)}
      />

      {/* Quick Access Top Pills Bar */}
      <QuickNavPills
        activePill={activePill}
        onSelectPill={handleSelectPill}
        onOpenWheel={() => setWheelModalOpen(true)}
        onOpenCheckin={() => setCheckinModalOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex-1 w-full">
        {/* Promotional Hero Carousel & Live Global Jackpot */}
        <HeroSlider
          onOpenAuth={handleOpenAuth}
          onOpenWallet={handleOpenWallet}
          isLoggedIn={!!user}
        />

        {/* Real-time Notice Marquee Ticker */}
        <MarqueeTicker />

        {/* Main Category Tabs */}
        <MainCategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* Live Cricket Exchange Section (Shown on All or Cricket) */}
        {(activeCategory === 'all' || activeCategory === 'cricket' || activeCategory === 'sportsbook') && (
          <LiveCricketSection onPlaceBet={handlePlaceCricketBet} />
        )}

        {/* Provider Filter Chips Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none text-xs">
          <span className="text-gray-500 font-bold shrink-0 mr-1 text-[11px] uppercase tracking-wider">
            Provider:
          </span>
          {providersList.map((p) => {
            const isSelected = selectedProvider === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProvider(p.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-500 font-black shadow-xs'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-amber-400 hover:text-gray-950 shadow-2xs'
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="text-lg font-black tracking-tight uppercase text-gray-950">
              {activeCategory === 'all'
                ? 'Featured Casino Lobby'
                : activeCategory.replace('-', ' ').replace('_', ' ')}
            </h2>
          </div>
          <span className="text-xs text-gray-500 font-bold">
            {filteredGames.length} titles available
          </span>
        </div>

        {/* Games Grid */}
        {loadingGames ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 py-6">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-2xl bg-white animate-pulse border border-gray-200 shadow-2xs"
              />
            ))}
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 p-8 my-4 shadow-sm">
            <div className="text-3xl mb-2">🎰</div>
            <p className="text-gray-800 text-sm font-bold">
              No games found matching the selected filter.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedProvider('all');
                loadGames('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs shadow-xs cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 mb-10">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onPlay={handlePlayGame}
              />
            ))}
          </div>
        )}

        {/* Live Recent Winners Feed */}
        <RecentWinnersTicker />
      </main>

      {/* Trust & Payment Gateways Footer */}
      <TrustFooter />

      {/* Fixed Responsive Mobile Bottom Navigation */}
      <MobileNav
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        onOpenWallet={handleOpenWallet}
        onOpenWheel={() => setWheelModalOpen(true)}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
          refreshProfile();
          showToast(`Welcome back, ${loggedUser.username || 'Player'}!`);
        }}
      />

      {/* Cashier / Seamless Wallet Modal */}
      <WalletModal
        isOpen={walletModalOpen}
        initialTab={walletInitialTab}
        onClose={() => setWalletModalOpen(false)}
        user={user}
        onRefreshProfile={refreshProfile}
      />

      {/* Provably Fair Game Launcher Modal */}
      <GameModal
        game={activeGame}
        launchUrl={launchUrl}
        onClose={() => {
          setActiveGame(null);
          setLaunchUrl(null);
          refreshProfile();
        }}
        userBalance={user?.wallet?.balance}
        onRefreshBalance={refreshProfile}
      />

      {/* Lucky Wheel Modal */}
      <LuckyWheelModal
        isOpen={wheelModalOpen}
        onClose={() => setWheelModalOpen(false)}
        onRewardClaimed={handleRewardClaimed}
      />

      {/* 7-Day Check-in Modal */}
      <DailyCheckinModal
        isOpen={checkinModalOpen}
        onClose={() => setCheckinModalOpen(false)}
        onClaimReward={(bonus) => {
          showToast(`🎁 Claimed ৳ ${bonus} daily check-in bonus!`);
          refreshProfile();
        }}
      />
    </div>
  );
}
