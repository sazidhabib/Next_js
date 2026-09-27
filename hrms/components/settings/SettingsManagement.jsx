'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Upload,
  Image as ImageIcon,
  Save,
  RotateCcw,
  Building2,
  Globe2,
  Mail,
  Coins,
  Bell,
  Sparkles,
  Lock,
  UserCheck,
  CheckCircle2,
  X,
  Database,
} from 'lucide-react';
import { Card, Badge } from '../ui';
import MediaPickerModal from '../media/MediaPickerModal';

export default function SettingsManagement({
  settings: initialSettings,
  onSettingsUpdated,
  onSeedData,
  isSeeding,
}) {
  const [settings, setSettings] = useState(
    initialSettings || {
      appName: 'HRMS Pro',
      appSubtitle: 'Enterprise Compliance',
      companyName: 'The Royal Kitchen Hospitality Ltd',
      appLogo: '',
      sponsorLicenceNo: '0W01ABC89',
      complianceOfficer: 'James Wilson',
      complianceEmail: 'compliance@hrms.local',
      currencySymbol: '£',
      visaWarningDays: 90,
      rtwWarningDays: 30,
    }
  );

  const [currentUserRole, setCurrentUserRole] = useState('Super Admin'); // Simulating role authorization
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialSettings) {
      setSettings(initialSettings);
    } else {
      fetchSettings();
    }
  }, [initialSettings]);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Fetch settings error:', err);
    } finally {
      setLoading(false);
    }
  };

  const isSuperAdmin = currentUserRole === 'Super Admin' || currentUserRole === 'Admin';

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please upload a smaller image.');
      return;
    }

    try {
      // 1. Upload file to server /api/upload endpoint
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setSettings((prev) => ({ ...prev, appLogo: data.url }));
        return;
      }
    } catch (err) {
      console.warn('Server upload failed, falling back to local optimization:', err);
    }

    // 2. Fallback: compress using canvas to avoid truncated base64 strings
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 240;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/png', 0.85);
        setSettings((prev) => ({ ...prev, appLogo: dataUrl }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isSuperAdmin) {
      alert('Unauthorized: Only Super Admin can modify system settings.');
      return;
    }

    setLoading(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': currentUserRole,
        },
        body: JSON.stringify({
          ...settings,
          requesterRole: currentUserRole,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        if (onSettingsUpdated) {
          onSettingsUpdated(data.settings);
        }
        setTimeout(() => setSaveSuccess(false), 3500);
      } else {
        alert('Error saving settings: ' + data.error);
      }
    } catch (err) {
      alert('Save failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetToDefault = () => {
    if (!confirm('Reset all branding and application settings to system default?')) return;
    setSettings({
      appName: 'HRMS Pro',
      appSubtitle: 'Enterprise Compliance',
      companyName: 'The Royal Kitchen Hospitality Ltd',
      appLogo: '',
      sponsorLicenceNo: '0W01ABC89',
      complianceOfficer: 'James Wilson',
      complianceEmail: 'compliance@hrms.local',
      currencySymbol: '£',
      visaWarningDays: 90,
      rtwWarningDays: 30,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Access Role Context Bar */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
              <SettingsIcon className="w-5 h-5 text-indigo-600" />
              <span>System & Application Settings</span>
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Custom application branding, logo customization, Home Office sponsor compliance and system defaults
            </p>
          </div>

          {/* Role Status Indicator */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-zinc-500">Access Level:</span>
            <select
              value={currentUserRole}
              onChange={(e) => setCurrentUserRole(e.target.value)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 focus:outline-none"
            >
              <option value="Super Admin">Super Admin (Full Access)</option>
              <option value="Admin">Admin</option>
              <option value="HR Manager">HR Manager (Restricted)</option>
              <option value="Manager">Manager (Restricted)</option>
              <option value="Employee">Employee (Restricted)</option>
            </select>
          </div>
        </div>

        {/* Access Warning if non-admin */}
        {!isSuperAdmin ? (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start space-x-3 text-xs text-rose-800 dark:text-rose-200">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Super Admin Privileges Required</p>
              <p className="mt-0.5 text-rose-700 dark:text-rose-300">
                You are currently viewing this section with <strong>{currentUserRole}</strong> permissions. Only
                authorized <strong>Super Admins</strong> can alter system branding, logos, and compliance thresholds.
              </p>
              <button
                type="button"
                onClick={() => setCurrentUserRole('Super Admin')}
                className="mt-2 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-[11px] transition shadow-xs"
              >
                Switch to Super Admin
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex items-center space-x-2 text-xs text-emerald-700 dark:text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Super Admin authorization confirmed. You have full permission to modify system configuration.</span>
          </div>
        )}
      </div>

      {/* Main Settings Form */}
      {isSuperAdmin && (
        <form onSubmit={handleSave} className="space-y-6">
          {saveSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 flex items-center space-x-2 text-xs text-emerald-800 dark:text-emerald-200 font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Settings updated and applied across the system successfully!</span>
            </div>
          )}

          {/* Section 1: Application Branding & Visual Identity */}
          <Card>
            <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-zinc-100 dark:border-zinc-800">
              <Sparkles className="w-4.5 h-4.5 text-indigo-600" />
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Application Branding & Identity
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
              {/* Left Form Inputs */}
              <div className="lg:col-span-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Application Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. HRMS Pro / Curry Lounge HRMS"
                      value={settings.appName}
                      onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <p className="text-[11px] text-zinc-400 mt-1">Displayed in the sidebar, header, and browser tab.</p>
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Application Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Enterprise Compliance / Workforce Management"
                      value={settings.appSubtitle}
                      onChange={(e) => setSettings({ ...settings, appSubtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <p className="text-[11px] text-zinc-400 mt-1">Sidebar tagline shown under the application name.</p>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Company / Organization Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. The Royal Kitchen Hospitality Ltd"
                    value={settings.companyName}
                    onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-zinc-400 mt-1">The legal sponsoring employer or corporate entity name.</p>
                </div>
              </div>

              {/* Right Logo Upload & Live Preview */}
              <div className="lg:col-span-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">
                    Application Logo:
                  </label>
                  {settings.appLogo && (
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, appLogo: '' })}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Reset to Default
                    </button>
                  )}
                </div>

                {/* Logo Preview Area */}
                <div className="w-full h-36 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 flex flex-col items-center justify-center p-3 relative overflow-hidden group">
                  {settings.appLogo ? (
                    <>
                      <img
                        src={settings.appLogo}
                        alt="Application Logo Preview"
                        className="max-h-24 max-w-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, appLogo: '' })}
                        className="absolute top-2 right-2 p-1 rounded-full bg-rose-600 text-white shadow hover:bg-rose-700 transition"
                        title="Remove custom logo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center flex flex-col items-center">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-400 flex items-center justify-center shadow-md mb-2">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[11px] text-zinc-400">Default Sparkle Brand Icon</span>
                    </div>
                  )}
                </div>

                {/* Media Library & Upload Action */}
                <button
                  type="button"
                  onClick={() => setIsMediaModalOpen(true)}
                  className="w-full py-2 px-3 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-semibold text-xs flex items-center justify-center space-x-1.5 transition shadow-xs"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Choose / Upload from Media Library</span>
                </button>
              </div>
            </div>
          </Card>

          {/* Section 2: Home Office & Sponsorship Compliance */}
          <Card>
            <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-zinc-100 dark:border-zinc-800">
              <Globe2 className="w-4.5 h-4.5 text-blue-600" />
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Home Office Sponsorship & Compliance Settings
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Sponsor Licence No
                </label>
                <input
                  type="text"
                  placeholder="e.g. 0W01ABC89"
                  value={settings.sponsorLicenceNo}
                  onChange={(e) => setSettings({ ...settings, sponsorLicenceNo: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Primary Compliance Officer
                </label>
                <input
                  type="text"
                  placeholder="e.g. James Wilson"
                  value={settings.complianceOfficer}
                  onChange={(e) => setSettings({ ...settings, complianceOfficer: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Compliance Contact Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. compliance@hrms.local"
                  value={settings.complianceEmail}
                  onChange={(e) => setSettings({ ...settings, complianceEmail: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Visa Expiry Warning (Days)
                </label>
                <input
                  type="number"
                  min="7"
                  max="365"
                  value={settings.visaWarningDays}
                  onChange={(e) => setSettings({ ...settings, visaWarningDays: parseInt(e.target.value, 10) || 90 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
                <p className="text-[11px] text-zinc-400 mt-1">Alert triggered when visa has fewer days remaining.</p>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  RTW Follow-up Alert (Days)
                </label>
                <input
                  type="number"
                  min="7"
                  max="180"
                  value={settings.rtwWarningDays}
                  onChange={(e) => setSettings({ ...settings, rtwWarningDays: parseInt(e.target.value, 10) || 30 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                />
                <p className="text-[11px] text-zinc-400 mt-1">Advance notice for upcoming statutory excuse reviews.</p>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  System Currency Symbol
                </label>
                <input
                  type="text"
                  maxLength={5}
                  value={settings.currencySymbol}
                  onChange={(e) => setSettings({ ...settings, currencySymbol: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <p className="text-[11px] text-zinc-400 mt-1">Used for salaries and financial figures (£, $, €, etc.).</p>
              </div>
            </div>
          </Card>

          {/* Section 3: Database & Maintenance Actions */}
          <Card>
            <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-zinc-100 dark:border-zinc-800">
              <Database className="w-4.5 h-4.5 text-cyan-600" />
              <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                Database Operations & Maintenance
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <p className="font-semibold text-zinc-800 dark:text-zinc-200">Re-seed Demo Compliance Database</p>
                <p className="text-zinc-500 mt-0.5">
                  Populate demo employees, Home Office visas, RTW statutory audit checks, and users.
                </p>
              </div>

              <button
                type="button"
                onClick={onSeedData}
                disabled={isSeeding}
                className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition disabled:opacity-50 shrink-0"
              >
                {isSeeding ? 'Syncing Database...' : 'Run Demo Database Seed'}
              </button>
            </div>
          </Card>

          {/* Bottom Form Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition text-xs font-semibold flex items-center space-x-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition flex items-center space-x-2 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving Settings...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Centralized Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(url) => setSettings((prev) => ({ ...prev, appLogo: url }))}
        initialUrl={settings.appLogo}
        title="Select Application Logo"
        preferredCategory="LOGO"
      />
    </div>
  );
}
