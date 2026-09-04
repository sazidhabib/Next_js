'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAdmin } from '@/lib/adminContext';
import {
  Code,
  Copy,
  Check,
  ExternalLink,
  Globe,
  Smartphone,
  Monitor,
  Sparkles,
  ShoppingBag,
  UtensilsCrossed,
  Eye,
  Layers,
  Palette,
  QrCode,
  ArrowRight,
  Play,
  Share2,
  Building2,
  Info,
  CheckCircle2,
  X,
  Flame,
  Star,
  Clock,
} from 'lucide-react';

export default function AdminWidgetPage() {
  const { user, selectedRestaurant, selectRestaurant } = useAdmin();
  const [restaurants, setRestaurants] = useState([]);
  const [activeRestaurant, setActiveRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  // Widget customizer states
  const [buttonText, setButtonText] = useState('Order Online');
  const [buttonColor, setButtonColor] = useState('#ea580c'); // Orange
  const [buttonShape, setButtonShape] = useState('pill'); // 'pill' | 'rounded' | 'sharp'
  const [buttonIcon, setButtonIcon] = useState('bag'); // 'bag' | 'utensils' | 'sparkles' | 'none'
  const [buttonSize, setButtonSize] = useState('md'); // 'sm' | 'md' | 'lg'
  const [embedMode, setEmbedMode] = useState('button'); // 'button' | 'existing' | 'floating' | 'iframe'
  const [floatingPosition, setFloatingPosition] = useState('bottom-right');

  // Preview device state
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'
  const [isSimulatedModalOpen, setIsSimulatedModalOpen] = useState(false);

  // Code tab state
  const [activeCodeTab, setActiveCodeTab] = useState('button');
  const [copiedKey, setCopiedKey] = useState('');

  // Guide CMS tab
  const [activeCmsTab, setActiveCmsTab] = useState('wordpress');

  // Origin URL detection
  const [originUrl, setOriginUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOriginUrl(window.location.origin);
    }
  }, []);

  // Fetch available restaurants
  useEffect(() => {
    async function loadRestaurants() {
      try {
        setLoading(true);
        const res = await fetch('/api/admin/restaurants');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data?.length > 0) {
            setRestaurants(json.data);
            if (selectedRestaurant) {
              const matched = json.data.find((r) => r.id === selectedRestaurant.id);
              setActiveRestaurant(matched || json.data[0]);
            } else {
              setActiveRestaurant(json.data[0]);
            }
          }
        } else if (selectedRestaurant) {
          setActiveRestaurant(selectedRestaurant);
          setRestaurants([selectedRestaurant]);
        }
      } catch (err) {
        console.error('Failed to load restaurants for widget panel:', err);
        if (selectedRestaurant) {
          setActiveRestaurant(selectedRestaurant);
        }
      } finally {
        setLoading(false);
      }
    }
    loadRestaurants();
  }, [selectedRestaurant]);

  const currentSlug = activeRestaurant?.slug || selectedRestaurant?.slug || 'bellavista-pizza';
  const directMenuUrl = `${originUrl}/menu/${currentSlug}`;
  const directEmbedUrl = `${originUrl}/embed/${currentSlug}`;
  const widgetScriptUrl = `${originUrl}/widget.js`;

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedKey(''), 3000);
  };

  // Color preset options
  const colorPresets = [
    { name: 'Flame Orange', hex: '#ea580c' },
    { name: 'Fresh Emerald', hex: '#10b981' },
    { name: 'Midnight Charcoal', hex: '#0f172a' },
    { name: 'Crimson Berry', hex: '#e11d48' },
    { name: 'Royal Indigo', hex: '#6366f1' },
    { name: 'Amber Glow', hex: '#f59e0b' },
  ];

  // Generate code snippet based on options
  const getButtonClass = () => {
    let shapeClass = 'border-radius: 9999px;';
    if (buttonShape === 'rounded') shapeClass = 'border-radius: 12px;';
    if (buttonShape === 'sharp') shapeClass = 'border-radius: 6px;';

    let sizePadding = 'padding: 12px 24px; font-size: 15px;';
    if (buttonSize === 'sm') sizePadding = 'padding: 8px 16px; font-size: 13px;';
    if (buttonSize === 'lg') sizePadding = 'padding: 16px 32px; font-size: 17px;';

    return `display: inline-flex; align-items: center; justify-content: center; gap: 8px; background-color: ${buttonColor}; color: #ffffff; ${sizePadding} ${shapeClass} font-weight: 700; text-decoration: none; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.15); transition: transform 0.2s ease, opacity 0.2s ease;`;
  };

  // Snippet 1: Button + Script (Recommended)
  const buttonSnippet = `<!-- Food Ordering System Modal Button -->
<button
  type="button"
  data-restaurant="${currentSlug}"
  class="gl-order-btn"
  style="${getButtonClass()}"
>
  ${
    buttonIcon === 'bag'
      ? '🛍️ '
      : buttonIcon === 'utensils'
      ? '🍴 '
      : buttonIcon === 'sparkles'
      ? '✨ '
      : ''
  }${buttonText}
</button>

<!-- Ordering Modal Script (Include once before </body>) -->
<script src="${widgetScriptUrl}" async></script>`;

  // Snippet 2: Connect to Any Existing Button or Link
  const existingButtonSnippet = `<!-- Option A: Connect an existing link to open in modal -->
<a href="${directMenuUrl}" data-order-modal="${currentSlug}" class="my-website-btn">
  ${buttonText}
</a>

<!-- Option B: Connect an existing button -->
<button data-restaurant="${currentSlug}" class="my-existing-button">
  ${buttonText}
</button>

<!-- Include this script anywhere on your page or footer -->
<script src="${widgetScriptUrl}" async></script>`;

  // Snippet 3: Floating Sticky Button
  const floatingSnippet = `<!-- Floating Corner Ordering Widget (Sticks to bottom of screen) -->
<script
  src="${widgetScriptUrl}"
  data-restaurant="${currentSlug}"
  data-floating="${floatingPosition}"
  data-text="${buttonText}"
  data-color="${buttonColor}"
  async
></script>`;

  // Snippet 4: Full Inline Iframe
  const iframeSnippet = `<!-- Direct Inline Ordering Menu (Responsive Full Page Iframe) -->
<iframe
  src="${directEmbedUrl}"
  width="100%"
  height="900"
  frameborder="0"
  style="border: none; border-radius: 16px; width: 100%; min-height: 850px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);"
  allow="payment *; camera *; geolocation *"
></iframe>`;

  return (
    <div className="p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto text-slate-100">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-orange-600/20 text-orange-400 border border-orange-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Website Integration Studio
            </span>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
              v2.0 Modal Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Online Ordering Widget & Modal Embed
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
            Add a link or button to your existing restaurant website (WordPress, Wix, Squarespace, Webflow). When customers click the button, your ordering system appears as a sleek, fast modal popup without leaving your site!
          </p>
        </div>

        {/* Restaurant Selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl shrink-0">
          <Building2 className="w-4 h-4 text-orange-400 ml-2" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">Target Restaurant:</span>
            <select
              value={activeRestaurant?.id || ''}
              onChange={(e) => {
                const found = restaurants.find((r) => String(r.id) === e.target.value);
                if (found) {
                  setActiveRestaurant(found);
                  if (user?.role === 'SUPER_ADMIN') {
                    selectRestaurant(found);
                  }
                }
              }}
              className="bg-transparent text-xs font-black text-white focus:outline-none cursor-pointer pr-4"
            >
              {restaurants.map((resto) => (
                <option key={resto.id} value={resto.id} className="bg-slate-900 text-white">
                  {resto.name} (/{resto.slug})
                </option>
              ))}
            </select>
          </div>
          <a
            href="/demo.html"
            target="_blank"
            rel="noreferrer"
            className="ml-2 px-3 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-orange-600/30 shrink-0"
            title="Open standalone static restaurant test website"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Test Demo Site</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Quick Direct Links Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Direct Menu Link */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600/20 text-orange-400 flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white">Direct Customer Ordering Link</h3>
                <p className="text-[11px] text-slate-400">Share on social media, Google Business Profile, or email</p>
              </div>
            </div>
            <a
              href={directMenuUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Open storefront in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-xs font-mono text-orange-400 truncate flex-1 select-all">
              {directMenuUrl}
            </span>
            <button
              onClick={() => copyToClipboard(directMenuUrl, 'direct-link')}
              className="px-3 py-1.5 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              {copiedKey === 'direct-link' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Modal Embed URL */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3 relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white">Modal Direct Embed URL</h3>
                <p className="text-[11px] text-slate-400">Target URL for modal popups, iframes, and mobile in-app views</p>
              </div>
            </div>
            <a
              href={directEmbedUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Open embed view in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-xs font-mono text-emerald-400 truncate flex-1 select-all">
              {directEmbedUrl}
            </span>
            <button
              onClick={() => copyToClipboard(directEmbedUrl, 'embed-link')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 border border-slate-700"
            >
              {copiedKey === 'embed-link' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Customizer (Left) & Live Simulator (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Widget Customization Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-orange-400" />
                <h2 className="text-base font-black text-white">Customize Button & Widget</h2>
              </div>
              <span className="text-[11px] text-slate-400">Live Configurator</span>
            </div>

            {/* Mode Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Integration Type
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setEmbedMode('button')}
                  className={`p-2.5 rounded-xl font-bold border transition-all text-left cursor-pointer ${
                    embedMode === 'button'
                      ? 'bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-600/30'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="block font-black">🔘 In-Page Button</span>
                  <span className="text-[10px] opacity-80">Place anywhere on site</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEmbedMode('existing')}
                  className={`p-2.5 rounded-xl font-bold border transition-all text-left cursor-pointer ${
                    embedMode === 'existing'
                      ? 'bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-600/30'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="block font-black">🔗 Existing Button</span>
                  <span className="text-[10px] opacity-80">Link your current button</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEmbedMode('floating')}
                  className={`p-2.5 rounded-xl font-bold border transition-all text-left cursor-pointer ${
                    embedMode === 'floating'
                      ? 'bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-600/30'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="block font-black">📍 Floating Widget</span>
                  <span className="text-[10px] opacity-80">Fixed corner button</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEmbedMode('iframe')}
                  className={`p-2.5 rounded-xl font-bold border transition-all text-left cursor-pointer ${
                    embedMode === 'iframe'
                      ? 'bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-600/30'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span className="block font-black">🖼️ Inline Iframe</span>
                  <span className="text-[10px] opacity-80">Full embedded menu</span>
                </button>
              </div>
            </div>

            {/* Button Text */}
            {embedMode !== 'iframe' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Button Label
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={buttonText}
                    onChange={(e) => setButtonText(e.target.value)}
                    placeholder="Order Online"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => setButtonText('🍕 Order Online')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 cursor-pointer"
                    title="Quick preset"
                  >
                    🍕
                  </button>
                  <button
                    type="button"
                    onClick={() => setButtonText('See Menu & Order')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-300 cursor-pointer"
                    title="Quick preset"
                  >
                    Menu
                  </button>
                </div>
              </div>
            )}

            {/* Button Color Preset */}
            {embedMode !== 'iframe' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Button Theme Color
                  </label>
                  <span className="text-xs font-mono text-slate-400">{buttonColor}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => setButtonColor(preset.hex)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                        buttonColor === preset.hex ? 'scale-125 border-white shadow-lg' : 'border-transparent hover:scale-110'
                      }`}
                      style={{ backgroundColor: preset.hex }}
                      title={preset.name}
                    />
                  ))}
                  <input
                    type="color"
                    value={buttonColor}
                    onChange={(e) => setButtonColor(e.target.value)}
                    className="w-7 h-7 rounded-full border-none cursor-pointer bg-transparent"
                    title="Pick custom color"
                  />
                </div>
              </div>
            )}

            {/* Button Shape & Size */}
            {embedMode === 'button' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Shape</label>
                  <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setButtonShape('pill')}
                      className={`flex-1 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        buttonShape === 'pill' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Pill
                    </button>
                    <button
                      type="button"
                      onClick={() => setButtonShape('rounded')}
                      className={`flex-1 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        buttonShape === 'rounded' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Rounded
                    </button>
                    <button
                      type="button"
                      onClick={() => setButtonShape('sharp')}
                      className={`flex-1 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        buttonShape === 'sharp' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Sharp
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 uppercase">Icon</label>
                  <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setButtonIcon('bag')}
                      className={`flex-1 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        buttonIcon === 'bag' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Bag
                    </button>
                    <button
                      type="button"
                      onClick={() => setButtonIcon('utensils')}
                      className={`flex-1 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        buttonIcon === 'utensils' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Dine
                    </button>
                    <button
                      type="button"
                      onClick={() => setButtonIcon('none')}
                      className={`flex-1 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        buttonIcon === 'none' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      None
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Floating Position */}
            {embedMode === 'floating' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase">
                  Floating Position on Screen
                </label>
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setFloatingPosition('bottom-right')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      floatingPosition === 'bottom-right'
                        ? 'bg-orange-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Bottom Right (Standard)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFloatingPosition('bottom-left')}
                    className={`flex-1 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      floatingPosition === 'bottom-left'
                        ? 'bg-orange-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Bottom Left
                  </button>
                </div>
              </div>
            )}

            {/* Live Button Preview Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-2">
              <span className="text-[10px] font-extrabold uppercase text-slate-500">
                Live Button Preview
              </span>
              <div className="py-3 flex justify-center items-center">
                <button
                  type="button"
                  onClick={() => setIsSimulatedModalOpen(true)}
                  style={{
                    backgroundColor: buttonColor,
                    borderRadius:
                      buttonShape === 'pill'
                        ? '9999px'
                        : buttonShape === 'rounded'
                        ? '12px'
                        : '6px',
                  }}
                  className="px-6 py-3 text-white font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-black/40 hover:scale-105 transition-all cursor-pointer"
                >
                  {buttonIcon === 'bag' && <ShoppingBag className="w-4 h-4" />}
                  {buttonIcon === 'utensils' && <UtensilsCrossed className="w-4 h-4" />}
                  {buttonIcon === 'sparkles' && <Sparkles className="w-4 h-4" />}
                  <span>{buttonText}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Click this button or the one in the simulator to test the modal popup!
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Live Website Simulator */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            {/* Browser Window Header */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800 text-[11px] text-slate-400 font-mono ml-3">
                  <span>🔒 https://www.your-restaurant-website.com</span>
                </div>
              </div>

              {/* Device Toggle */}
              <div className="flex items-center gap-2">
                <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      previewDevice === 'desktop'
                        ? 'bg-orange-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      previewDevice === 'mobile'
                        ? 'bg-orange-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Mobile</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsSimulatedModalOpen(true)}
                  className="bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-orange-600/30"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Test Modal</span>
                </button>
              </div>
            </div>

            {/* Mock Website Canvas */}
            <div className="relative min-h-[460px] bg-slate-950 flex flex-col justify-between overflow-hidden">
              {/* Mock Nav */}
              <div className="bg-slate-900/95 backdrop-blur-md px-6 py-3.5 border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center font-black text-white text-xs">
                    🍴
                  </div>
                  <span className="font-extrabold text-sm text-white tracking-wide">
                    {activeRestaurant?.name || 'Artisan Trattoria'}
                  </span>
                </div>
                <div className="hidden sm:flex items-center gap-6 text-xs font-semibold text-slate-300">
                  <span className="hover:text-white cursor-pointer">About Us</span>
                  <span className="hover:text-white cursor-pointer">Our Menus</span>
                  <span className="hover:text-white cursor-pointer">Locations</span>
                  <span className="hover:text-white cursor-pointer">Contact</span>
                </div>

                {/* Navbar Button Trigger */}
                <button
                  type="button"
                  onClick={() => setIsSimulatedModalOpen(true)}
                  style={{
                    backgroundColor: buttonColor,
                    borderRadius:
                      buttonShape === 'pill'
                        ? '9999px'
                        : buttonShape === 'rounded'
                        ? '10px'
                        : '4px',
                  }}
                  className="px-4 py-1.5 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-black/30 hover:scale-105 transition-all cursor-pointer"
                >
                  {buttonIcon === 'bag' && <ShoppingBag className="w-3.5 h-3.5" />}
                  {buttonIcon === 'utensils' && <UtensilsCrossed className="w-3.5 h-3.5" />}
                  <span>{buttonText}</span>
                </button>
              </div>

              {/* Mock Hero Section */}
              <div className="relative flex-1 p-8 sm:p-14 flex flex-col justify-center items-center text-center space-y-4">
                {/* Background image overlay */}
                <div className="absolute inset-0 opacity-25 mix-blend-luminosity bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format&fit=crop&q=80')" }}></div>
                <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/80 to-transparent"></div>

                <div className="relative space-y-3 max-w-xl z-10">
                  <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                    Wood-Fired • Fresh Ingredients • Artisanal
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                    Authentic Italian Dining & Fast Delivery
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Welcome to our official website. Click the button below to browse our live digital menu and order direct with zero commission fees!
                  </p>

                  {/* Primary Hero Order Button */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsSimulatedModalOpen(true)}
                      style={{
                        backgroundColor: buttonColor,
                        borderRadius:
                          buttonShape === 'pill'
                            ? '9999px'
                            : buttonShape === 'rounded'
                            ? '12px'
                            : '6px',
                      }}
                      className="px-7 py-3 text-white font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-orange-600/30 hover:scale-105 transition-all cursor-pointer"
                    >
                      {buttonIcon === 'bag' && <ShoppingBag className="w-4 h-4" />}
                      {buttonIcon === 'utensils' && <UtensilsCrossed className="w-4 h-4" />}
                      {buttonIcon === 'sparkles' && <Sparkles className="w-4 h-4" />}
                      <span>{buttonText}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Widget Position in Simulator if floating mode selected */}
              {embedMode === 'floating' && (
                <div
                  className={`absolute bottom-5 ${
                    floatingPosition === 'bottom-left' ? 'left-5' : 'right-5'
                  } z-20`}
                >
                  <button
                    type="button"
                    onClick={() => setIsSimulatedModalOpen(true)}
                    style={{ backgroundColor: buttonColor }}
                    className="px-5 py-3 rounded-full text-white font-black text-xs flex items-center gap-2 shadow-2xl hover:scale-110 transition-all cursor-pointer border-2 border-white/20 animate-bounce"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{buttonText}</span>
                  </button>
                </div>
              )}

              {/* Simulated Interactive Modal Popup */}
              {isSimulatedModalOpen && (
                <div className="absolute inset-0 z-50 bg-slate-950/20 backdrop-blur-[1px] flex items-center justify-center p-3 sm:p-5 transition-all animate-in fade-in">
                  <div
                    className={`bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
                      previewDevice === 'mobile'
                        ? 'w-full max-w-[340px] h-[430px]'
                        : 'w-full h-full max-h-[430px]'
                    }`}
                  >
                    {/* Simulated Modal Top Bar */}
                    <div className="bg-slate-950 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-orange-600 flex items-center justify-center text-[10px] text-white font-bold">
                          🍴
                        </div>
                        <span className="text-xs font-bold text-white truncate max-w-[180px]">
                          {activeRestaurant?.name || 'Ordering Modal'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md hidden sm:inline">
                          Active Live Menu
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsSimulatedModalOpen(false)}
                          className="w-6 h-6 flex items-center justify-center bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Iframe Loading Real Live Menu */}
                    <div className="flex-1 bg-slate-50 relative">
                      <iframe
                        src={directEmbedUrl}
                        className="w-full h-full border-none"
                        title="Live Embedded Menu Preview"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Status bar */}
            <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 text-xs text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Zero-iframe-blocking CSP configured (`frame-ancestors *`)</span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span>SSL Encrypted</span>
                <span>•</span>
                <span>Mobile Responsive</span>
                <span>•</span>
                <span>Instant Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ready-to-Copy Embed Snippets Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-orange-400" />
              <h2 className="text-base sm:text-lg font-black text-white">
                Ready-to-Use Website Embed Snippets
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Copy and paste the snippet below into your website HTML, theme template, or CMS code block.
            </p>
          </div>

          {/* Snippet Tabs */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveCodeTab('button')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCodeTab === 'button'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1. Modal Button (Recommended)
            </button>
            <button
              type="button"
              onClick={() => setActiveCodeTab('existing')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCodeTab === 'existing'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Existing Site Button
            </button>
            <button
              type="button"
              onClick={() => setActiveCodeTab('floating')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCodeTab === 'floating'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3. Floating Widget
            </button>
            <button
              type="button"
              onClick={() => setActiveCodeTab('iframe')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeCodeTab === 'iframe'
                  ? 'bg-orange-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              4. Inline Iframe
            </button>
          </div>
        </div>

        {/* Code Snippet Box */}
        <div className="space-y-3">
          <div className="relative">
            <pre className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-72">
              <code>
                {activeCodeTab === 'button' && buttonSnippet}
                {activeCodeTab === 'existing' && existingButtonSnippet}
                {activeCodeTab === 'floating' && floatingSnippet}
                {activeCodeTab === 'iframe' && iframeSnippet}
              </code>
            </pre>

            <button
              type="button"
              onClick={() => {
                const code =
                  activeCodeTab === 'button'
                    ? buttonSnippet
                    : activeCodeTab === 'existing'
                    ? existingButtonSnippet
                    : activeCodeTab === 'floating'
                    ? floatingSnippet
                    : iframeSnippet;
                copyToClipboard(code, 'snippet-' + activeCodeTab);
              }}
              className="absolute top-4 right-4 bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md shadow-orange-600/30 flex items-center gap-1.5 cursor-pointer"
            >
              {copiedKey === 'snippet-' + activeCodeTab ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Snippet</span>
                </>
              )}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-orange-400 shrink-0" />
              <span>
                {activeCodeTab === 'button' && 'Place the button in your navbar or header, and script before </body>.'}
                {activeCodeTab === 'existing' && 'Add data-order-modal to any link or button on your existing site.'}
                {activeCodeTab === 'floating' && 'Just add this one line before </body> and the floating button appears automatically.'}
                {activeCodeTab === 'iframe' && 'Embeds the entire menu directly inside a container on your web page.'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const code =
                  activeCodeTab === 'button'
                    ? buttonSnippet
                    : activeCodeTab === 'existing'
                    ? existingButtonSnippet
                    : activeCodeTab === 'floating'
                    ? floatingSnippet
                    : iframeSnippet;
                copyToClipboard(code, 'snippet-' + activeCodeTab);
              }}
              className="text-orange-400 hover:underline font-bold text-left cursor-pointer"
            >
              Copy To Clipboard
            </button>
          </div>
        </div>
      </div>

      {/* Step-by-Step CMS Guides */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <h2 className="text-base font-black text-white">
              Platform-Specific Installation Guides
            </h2>
            <p className="text-xs text-slate-400">
              Simple 2-minute steps to add the ordering modal to popular website builders.
            </p>
          </div>

          {/* CMS selector pills */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto no-scrollbar">
            {['wordpress', 'wix', 'squarespace', 'shopify', 'html'].map((cms) => (
              <button
                key={cms}
                type="button"
                onClick={() => setActiveCmsTab(cms)}
                className={`px-3 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  activeCmsTab === cms
                    ? 'bg-orange-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cms === 'html' ? 'Custom HTML' : cms}
              </button>
            ))}
          </div>
        </div>

        {/* CMS Step by Step Content */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-300">
          {activeCmsTab === 'wordpress' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-orange-600/20 text-orange-400 font-black flex items-center justify-center text-xs">
                  1
                </span>
                <h4 className="font-extrabold text-white text-sm">Add HTML Block / Widget</h4>
                <p className="text-slate-400 text-xs">
                  In your WordPress editor (Gutenberg, Elementor, or Divi), drag and drop a <strong>"Custom HTML"</strong> or <strong>"Code"</strong> block into your page or header.
                </p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-orange-600/20 text-orange-400 font-black flex items-center justify-center text-xs">
                  2
                </span>
                <h4 className="font-extrabold text-white text-sm">Paste Modal Snippet</h4>
                <p className="text-slate-400 text-xs">
                  Paste the <strong>Modal Button</strong> snippet generated above into the block. Customize the button text if desired.
                </p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-orange-600/20 text-orange-400 font-black flex items-center justify-center text-xs">
                  3
                </span>
                <h4 className="font-extrabold text-white text-sm">Publish & Test</h4>
                <p className="text-slate-400 text-xs">
                  Click <strong>Publish / Update</strong>. Visit your website and click the button—your ordering system will open instantly in a modal popup!
                </p>
              </div>
            </div>
          )}

          {activeCmsTab === 'wix' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-orange-600/20 text-orange-400 font-black flex items-center justify-center text-xs">
                  1
                </span>
                <h4 className="font-extrabold text-white text-sm">Add Embed Element</h4>
                <p className="text-slate-400 text-xs">
                  Open Wix Editor → Click <strong>"+" (Add Elements)</strong> → Select <strong>Embed Code</strong> → Choose <strong>Embed HTML</strong>.
                </p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-orange-600/20 text-orange-400 font-black flex items-center justify-center text-xs">
                  2
                </span>
                <h4 className="font-extrabold text-white text-sm">Paste Widget Code</h4>
                <p className="text-slate-400 text-xs">
                  Click <strong>Enter Code</strong>, paste the copied snippet into the box, and click <strong>Apply</strong>.
                </p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-orange-600/20 text-orange-400 font-black flex items-center justify-center text-xs">
                  3
                </span>
                <h4 className="font-extrabold text-white text-sm">Position & Publish</h4>
                <p className="text-slate-400 text-xs">
                  Position the element wherever you like in your header or page, then click <strong>Publish</strong>.
                </p>
              </div>
            </div>
          )}

          {activeCmsTab === 'squarespace' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-orange-600/20 text-orange-400 font-black flex items-center justify-center text-xs">
                  1
                </span>
                <h4 className="font-extrabold text-white text-sm">Add Code Block</h4>
                <p className="text-slate-400 text-xs">
                  Edit your Squarespace page → Click <strong>Add Block</strong> → Choose <strong>Code</strong>.
                </p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-orange-600/20 text-orange-400 font-black flex items-center justify-center text-xs">
                  2
                </span>
                <h4 className="font-extrabold text-white text-sm">Paste HTML Snippet</h4>
                <p className="text-slate-400 text-xs">
                  Select <strong>HTML</strong> mode and ensure <strong>Display Source</strong> is turned OFF. Paste your button snippet.
                </p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-orange-600/20 text-orange-400 font-black flex items-center justify-center text-xs">
                  3
                </span>
                <h4 className="font-extrabold text-white text-sm">Save & Enjoy</h4>
                <p className="text-slate-400 text-xs">
                  Click <strong>Save</strong> and exit preview mode. Your button is now active with modal popups!
                </p>
              </div>
            </div>
          )}

          {activeCmsTab === 'shopify' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-orange-600/20 text-orange-400 font-black flex items-center justify-center text-xs">
                  1
                </span>
                <h4 className="font-extrabold text-white text-sm">Add Custom Liquid</h4>
                <p className="text-slate-400 text-xs">
                  In Shopify Theme Customizer, click <strong>Add section</strong> → Select <strong>Custom Liquid</strong> or Custom HTML.
                </p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-orange-600/20 text-orange-400 font-black flex items-center justify-center text-xs">
                  2
                </span>
                <h4 className="font-extrabold text-white text-sm">Paste Code</h4>
                <p className="text-slate-400 text-xs">
                  Paste the snippet inside the Custom Liquid editor and adjust section padding if desired.
                </p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-orange-600/20 text-orange-400 font-black flex items-center justify-center text-xs">
                  3
                </span>
                <h4 className="font-extrabold text-white text-sm">Save Theme</h4>
                <p className="text-slate-400 text-xs">
                  Save your theme changes. Your store visitors can now order food directly through the modal!
                </p>
              </div>
            </div>
          )}

          {activeCmsTab === 'html' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-orange-600/20 text-orange-400 font-black flex items-center justify-center text-xs">
                  1
                </span>
                <h4 className="font-extrabold text-white text-sm">Place Button HTML</h4>
                <p className="text-slate-400 text-xs">
                  Place the <code>&lt;button&gt;</code> element anywhere in your page structure (navbar, hero, footer).
                </p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-orange-600/20 text-orange-400 font-black flex items-center justify-center text-xs">
                  2
                </span>
                <h4 className="font-extrabold text-white text-sm">Include widget.js</h4>
                <p className="text-slate-400 text-xs">
                  Add <code>&lt;script src="{widgetScriptUrl}" async&gt;&lt;/script&gt;</code> right before closing <code>&lt;/body&gt;</code>.
                </p>
              </div>
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <span className="w-6 h-6 rounded-full bg-orange-600/20 text-orange-400 font-black flex items-center justify-center text-xs">
                  3
                </span>
                <h4 className="font-extrabold text-white text-sm">Programmatic API (Optional)</h4>
                <p className="text-slate-400 text-xs">
                  You can also trigger it from any JS script with: <code>window.FoodOrderingModal.open('{currentSlug}')</code>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
