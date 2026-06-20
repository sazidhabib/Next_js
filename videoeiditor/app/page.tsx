'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/dashboard/Header';
import Sidebar from '../components/dashboard/Sidebar';
import RecentProjects from '../components/dashboard/RecentProjects';
import CloudSync from '../components/dashboard/CloudSync';
import QuickShortcuts from '../components/dashboard/QuickShortcuts';
import { editorStore } from '../store/editorStore';

export default function DashboardPage() {
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateNewProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    
    editorStore.createNewProject(newProjectName);
    setNewProjectName('');
    setShowCreateModal(false);
    router.push('/editor');
  };

  const handleTemplateClick = (templateName: string) => {
    editorStore.createNewProject(`${templateName} Project`);
    // Pre-populate some clips for high-fidelity templates
    if (templateName === 'YouTube Intro') {
      editorStore.addTextClip(2);
      editorStore.updateClip('c_txt_1', { text: 'YOUTUBE INTRO', startTime: 2, duration: 6 });
    }
    router.push('/editor');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col">
      {/* Header */}
      <Header />

      <div className="flex flex-1 pt-toolbar-height">
        {/* Navigation Sidebar */}
        <Sidebar activeTab="home" />

        {/* Main Content Area */}
        <main className="ml-16 flex-1 p-panel-padding pb-20">
          {/* Welcome & Create Actions */}
          <section className="mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 mt-4">
              <div>
                <h1 className="font-headline-lg text-headline-lg font-bold mb-1">
                  Welcome back, Editor
                </h1>
                <p className="text-on-surface-variant font-body-md text-body-md">
                  Ready to start your next masterpiece?
                </p>
              </div>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-[#3B82F6] text-white px-6 py-3 rounded-lg font-bold hover:brightness-110 transition-all active:scale-95 shadow-lg shrink-0 cursor-pointer"
              >
                <span className="material-symbols-outlined block">add</span>
                <span>Create New Project</span>
              </button>
            </div>

            {/* Templates Slider */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-label-caps text-label-caps uppercase tracking-widest text-on-surface-variant">
                Start from Template
              </h3>
              <div className="flex gap-2">
                <button className="p-1 border border-outline-variant rounded hover:bg-surface-container-high cursor-pointer">
                  <span className="material-symbols-outlined text-sm block">chevron_left</span>
                </button>
                <button className="p-1 border border-outline-variant rounded hover:bg-surface-container-high cursor-pointer">
                  <span className="material-symbols-outlined text-sm block">chevron_right</span>
                </button>
              </div>
            </div>

            {/* Templates Cards Horizontal scroll */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-1 px-1">
              {/* Template Card 1 */}
              <div 
                onClick={() => handleTemplateClick('YouTube Intro')}
                className="min-w-[280px] w-[280px] group cursor-pointer"
              >
                <div className="relative h-40 rounded-xl overflow-hidden bento-card mb-3">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="YouTube Intro template"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVvbQ8ulunx2o9yhRzmeeJuNdkHsQuyfsNauirUgidbhO7wgTLKuUeiFVSy3MhAnpd29KwsyI685p68lSYbe-ewIo0Qrp3worQ-MzMcqGC5zb3FPAVZ7ykpeTSOGqGEQhTqF14vtXK53iMR6UNZi0HUh8pT8ZlibmJJT-b-QB_GyNWaOZM8Q4ui2vxhJxSFzr3Oit21KbmQSjnVFuigselbNLRJ8GBNpzB6ZH9R__C9ASWG9WUkPtfUuK4MQEeVFG2PntqxuSTPvpW"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-xs font-bold bg-[#3B82F6] px-2 py-1 rounded">16:9</span>
                  </div>
                </div>
                <span className="font-body-md text-body-md font-semibold block group-hover:text-primary transition-colors">
                  YouTube Intro
                </span>
                <p className="text-xs text-on-surface-variant">4K • 60fps • 15s</p>
              </div>

              {/* Template Card 2 */}
              <div 
                onClick={() => handleTemplateClick('TikTok Vertical')}
                className="min-w-[220px] w-[220px] group cursor-pointer"
              >
                <div className="relative h-40 rounded-xl overflow-hidden bento-card mb-3">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="TikTok Vertical template"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiNR_Hjvu-yepqXdzSMU-jX9-C6N6mXxW0BkBKgKLzv-LFDd4TkkZl6evTuUTj_dO0fnZmkl04qf8Cv41aG1VOa13rktyE4t21X_V_P02NX3OPBFf8KhSkIko-0WUmnrG_YCaSbjkPflvFT4HkZ_r-qkfnX73W9N-0_rOPCVxQgSIQHdo0NUtfLEedeLkIVhyjIHbuo-10w4QiNbZloAfnM2usreCWG58y7j5MUrAE0QyiGbQUGtvCB3uRTjkVpERFQRw3u_0nxa7z"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-xs font-bold bg-[#3B82F6] px-2 py-1 rounded">9:16</span>
                  </div>
                </div>
                <span className="font-body-md text-body-md font-semibold block group-hover:text-primary transition-colors">
                  TikTok Vertical
                </span>
                <p className="text-xs text-on-surface-variant">1080p • 30fps • 60s</p>
              </div>

              {/* Template Card 3 */}
              <div 
                onClick={() => handleTemplateClick('Cinematic Wedding')}
                className="min-w-[280px] w-[280px] group cursor-pointer"
              >
                <div className="relative h-40 rounded-xl overflow-hidden bento-card mb-3">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="Cinematic Wedding template"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcWjwm6GIQcM6aw2px7zqJawnfWKsVroLl5Fdp1HG_EA9HyvjU9RnX2Fi73zTPXVJNjgD8wdOSQ2MjsKaLN9P5RJGc5LHUubMbxJQYEyhXS5hAwHcWUVOlfmHQSEofGrEaDPzwecTImL_gdZKbqmtiH6LKRFsIRkgw5QtA5SowZUn-B5lNYIHelI1ooFXR64NHtGh8qQnOQhmJ1Jt0zUbK2JbuRsrPrrJ2Gl1uitTXF_mGje5FOiMToDNB26G8Pfi4cvOrTJHS9mp9"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-xs font-bold bg-[#3B82F6] px-2 py-1 rounded">2.35:1</span>
                  </div>
                </div>
                <span className="font-body-md text-body-md font-semibold block group-hover:text-primary transition-colors">
                  Cinematic Wedding
                </span>
                <p className="text-xs text-on-surface-variant">4K • 24fps • Multi-scene</p>
              </div>

              {/* Template Card 4 */}
              <div 
                onClick={() => handleTemplateClick('Product Ad')}
                className="min-w-[280px] w-[280px] group cursor-pointer"
              >
                <div className="relative h-40 rounded-xl overflow-hidden bento-card mb-3">
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="Product Ad template"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuACuCliCA4HeNc-Wti44zV5_1Ht2o73rpO3kiJXysCldKjtcsAEFr0FijEd0C-mqmnvcwhblSImSTsHmbiEFGyfFUUV67FzT7QC4-Y0skS5l5YhMLYWz3LAIHpK-ZkVW9bqQu4mOHT-6kMx61efgvAEJLGduQAxWGuBnPR1dB3y2zyCSEDY-Zy9GFDHFgplnNLEdZiXdaTP8wmHDpqVvJhQoKNSYSKL6aDuDO167il_dYEK4tW0QenwP86BBlqg7nuL4gNtqbWsIQB0"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-xs font-bold bg-[#3B82F6] px-2 py-1 rounded">1:1</span>
                  </div>
                </div>
                <span className="font-body-md text-body-md font-semibold block group-hover:text-primary transition-colors">
                  Product Ad
                </span>
                <p className="text-xs text-on-surface-variant">4K • 120fps • 30s</p>
              </div>
            </div>
          </section>

          {/* Recent Projects Section */}
          <RecentProjects onCreateNewClick={() => setShowCreateModal(true)} />

          {/* Cloud Sync & Activity Bento grids */}
          <section className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CloudSync />
            </div>
            <div>
              <QuickShortcuts />
            </div>
          </section>
        </main>
      </div>

      {/* Floating Action Button (FAB) */}
      <button 
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 cursor-pointer"
        title="Create New Project"
      >
        <span className="material-symbols-outlined text-3xl block">add</span>
      </button>

      {/* Bottom Nav for Mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container border-t border-outline-variant flex items-center justify-around px-4 z-50">
        <button className="flex flex-col items-center text-primary">
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-label-caps">Home</span>
        </button>
        <button className="flex flex-col items-center text-on-surface-variant" onClick={() => router.push('/editor')}>
          <span className="material-symbols-outlined">auto_fix_high</span>
          <span className="text-[10px] font-label-caps">Editor</span>
        </button>
        <button className="flex flex-col items-center text-on-surface-variant" onClick={() => router.push('/editor')}>
          <span className="material-symbols-outlined">perm_media</span>
          <span className="text-[10px] font-label-caps">Media</span>
        </button>
        <button className="flex flex-col items-center text-on-surface-variant">
          <span className="material-symbols-outlined">group</span>
          <span className="text-[10px] font-label-caps">Team</span>
        </button>
      </nav>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface-container border border-outline-variant rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="font-headline-md text-headline-md font-bold mb-4 text-primary">
              Create New Project
            </h3>
            <form onSubmit={handleCreateNewProject} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-on-surface-variant font-label-caps uppercase">
                  Project Name
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="e.g. My Cinematic Vibe"
                  className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none text-on-surface"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-label-caps text-on-surface-variant hover:text-on-surface border border-outline-variant rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-label-caps bg-primary text-on-primary font-bold rounded-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
