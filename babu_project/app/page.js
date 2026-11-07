'use client';

import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import HeroBanner from '../components/HeroBanner';
import CategoryTabs from '../components/CategoryTabs';
import GameCard from '../components/GameCard';
import GameModal from '../components/GameModal';
import WalletModal from '../components/WalletModal';
import AuthModal from '../components/AuthModal';
import MobileNav from '../components/MobileNav';
import { api } from '../lib/api';

export default function Home() {
  const [user, setUser] = useState(null);
  const [games, setGames] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loadingGames, setLoadingGames] = useState(true);

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [walletInitialTab, setWalletInitialTab] = useState('deposit');

  // Active Game Launcher Modal State
  const [activeGame, setActiveGame] = useState(null);
  const [launchUrl, setLaunchUrl] = useState(null);

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
      const res = await api.getGames(cat);
      if (res.success) {
        setGames(res.games || []);
      }
    } catch (err) {
      console.error('Failed to fetch games', err);
    } finally {
      setLoadingGames(false);
    }
  };

  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    loadGames(catId);
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
      alert(err.message || 'Could not launch game');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col pb-20 md:pb-8 selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar */}
      <Navbar
        user={user}
        onOpenAuth={handleOpenAuth}
        onOpenWallet={handleOpenWallet}
        onLogout={handleLogout}
        onRefreshProfile={refreshProfile}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex-1 w-full">
        {/* Promotional Banner */}
        <HeroBanner
          onOpenAuth={handleOpenAuth}
          isLoggedIn={!!user}
          onOpenWallet={handleOpenWallet}
        />

        {/* Categories Tab Navigation */}
        <CategoryTabs
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
        />

        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <h2 className="text-xl font-extrabold tracking-tight capitalize">
              {activeCategory === 'all' ? 'Featured Casino Games' : activeCategory.replace('_', ' ')}
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {games.length} titles available
          </span>
        </div>

        {/* Games Grid */}
        {loadingGames ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 py-8">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800"
              />
            ))}
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/80 p-8 my-4">
            <p className="text-slate-400 text-sm font-semibold">
              No games found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onPlay={handlePlayGame}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 py-8 bg-slate-950/80 text-center text-xs text-slate-400 max-w-7xl mx-auto px-4 w-full">
        <p className="font-semibold text-slate-300 mb-2">
          &copy; {new Date().getFullYear()} BetLuxa Gaming Platform. All Rights Reserved.
        </p>
        <p className="text-[11px] text-slate-400 max-w-md mx-auto">
          Licensed and regulated. Play responsibly 18+. Standard Seamless Wallet API and Provably Fair Integration enabled.
        </p>
      </footer>

      {/* Responsive Mobile Bottom Nav */}
      <MobileNav
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        onOpenWallet={handleOpenWallet}
      />

      {/* Interactive Modals */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
          refreshProfile();
        }}
      />

      <WalletModal
        isOpen={walletModalOpen}
        initialTab={walletInitialTab}
        onClose={() => setWalletModalOpen(false)}
        user={user}
        onRefreshProfile={refreshProfile}
      />

      {/* Game Launcher iFrame Modal */}
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
    </div>
  );
}
