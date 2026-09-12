'use client';

import { useState, useEffect } from 'react';
import AdminAuth from './AdminAuth';
import AdminLayout from './AdminLayout';
import SkillsManager from './SkillsManager';
import ExperienceManager from './ExperienceManager';
import ProjectsManager from './ProjectsManager';
import MessagesView from './MessagesView';
import MediaLibrary from './MediaLibrary';

const AdminPanel = () => {
  const [token, setToken] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ skills: 0, experiences: 0, projects: 0, messages: 0 });
  const [loadingStats, setLoadingStats] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('sazid_portfolio_admin_token');
      if (savedToken) setToken(savedToken);
    }
  }, []);

  useEffect(() => {
    if (token && activeTab === 'dashboard') {
      fetchStats();
    }
  }, [token, activeTab]);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      
      const [skillsRes, expRes, projRes, msgRes] = await Promise.all([
        fetch('/api/admin/skills'),
        fetch('/api/admin/experiences'),
        fetch('/api/admin/projects'),
        fetch('/api/admin/messages', { headers: { 'Authorization': `Bearer ${token}` } })
      ]);

      const skills = skillsRes.ok ? await skillsRes.json() : [];
      const experiences = expRes.ok ? await expRes.json() : [];
      const projects = projRes.ok ? await projRes.json() : [];
      const messages = msgRes.ok ? await msgRes.json() : [];

      setStats({
        skills: skills.length,
        experiences: experiences.length,
        projects: projects.length,
        messages: messages.length
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sazid_portfolio_admin_token');
    setToken(null);
  };

  const handleSeedDatabase = async () => {
    if (!window.confirm('This will seed initial portfolio data into the database. Are you sure?')) return;
    setSeeding(true);
    setSeedResult('');

    try {
      const res = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setSeedResult('Database seeded successfully!');
        fetchStats();
      } else {
        setSeedResult(`Failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      setSeedResult('Connection error seeding database.');
    } finally {
      setSeeding(false);
    }
  };

  if (!token) {
    return <AdminAuth onSuccess={setToken} />;
  }

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
      {activeTab === 'dashboard' && (
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
            <p className="text-slate-400 text-sm mt-1">Status overview of your portfolio data models and contacts inbox</p>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-card p-6 rounded-xl flex items-center justify-between border border-white/5 shadow-card">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Skills</span>
                <span className="text-3xl font-extrabold text-white mt-1 block">
                  {loadingStats ? '...' : stats.skills}
                </span>
              </div>
              <div className="p-3 bg-accent/10 border border-accent/20 text-accent rounded-xl">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl flex items-center justify-between border border-white/5 shadow-card">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Experience Roles</span>
                <span className="text-3xl font-extrabold text-white mt-1 block">
                  {loadingStats ? '...' : stats.experiences}
                </span>
              </div>
              <div className="p-3 bg-accent/10 border border-accent/20 text-accent rounded-xl">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4.674 12a3 3 0 000-4H9.326a3 3 0 000 4h5.348z" />
                </svg>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl flex items-center justify-between border border-white/5 shadow-card">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Featured Projects</span>
                <span className="text-3xl font-extrabold text-white mt-1 block">
                  {loadingStats ? '...' : stats.projects}
                </span>
              </div>
              <div className="p-3 bg-accent/10 border border-accent/20 text-accent rounded-xl">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl flex items-center justify-between border border-white/5 shadow-card">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Inbox Messages</span>
                <span className="text-3xl font-extrabold text-white mt-1 block">
                  {loadingStats ? '...' : stats.messages}
                </span>
              </div>
              <div className="p-3 bg-accent/10 border border-accent/20 text-accent rounded-xl">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Migration Tools */}
          <div className="glass-card p-6 rounded-xl border border-white/5 mt-4 max-w-xl">
            <h3 className="text-lg font-bold text-white mb-2">Initial Setup & Migration</h3>
            <p className="text-slate-400 text-sm mb-5 leading-relaxed">
              If your database tables (Skills, Experiences, Projects) are currently empty, you can seed them with the default hardcoded data from the Constants files. This will clear existing tables and import default ones.
            </p>
            
            {seedResult && (
              <div className={`mb-5 p-4 border rounded-xl text-sm ${seedResult.includes('successfully') ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                {seedResult}
              </div>
            )}

            <button
              onClick={handleSeedDatabase}
              disabled={seeding}
              className="py-2.5 px-5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg text-sm font-semibold transition-all flex items-center gap-2 active:scale-[0.97] disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3 3L22 4" />
              </svg>
              {seeding ? 'Seeding Data...' : 'Seed Initial Database Data'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'skills' && <SkillsManager token={token} />}
      {activeTab === 'experience' && <ExperienceManager token={token} />}
      {activeTab === 'projects' && <ProjectsManager token={token} />}
      {activeTab === 'media' && <MediaLibrary token={token} />}
      {activeTab === 'messages' && <MessagesView token={token} />}
    </AdminLayout>
  );
};

export default AdminPanel;
