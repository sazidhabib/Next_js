'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import {
  MapPin,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Save,
  Check,
  Circle as CircleIcon,
  Hexagon,
  Sparkles,
  Info,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';

// Dynamic import with SSR disabled to prevent Leaflet window reference errors
const DeliveryZoneMap = dynamic(
  () => import('@/components/DeliveryZoneMap'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[550px] bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-medium">Loading interactive delivery map...</span>
      </div>
    ),
  }
);

const PRESET_COLORS = [
  '#ea580c', // Orange
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#3b82f6', // Blue
  '#14b8a6', // Teal
];

import { useAdmin } from '@/lib/adminContext';

export default function AdminZonesPage() {
  const { selectedRestaurant, selectRestaurant } = useAdmin();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enableDelivery, setEnableDelivery] = useState(true);
  const [restaurantLocation, setRestaurantLocation] = useState({
    lat: 51.5133,
    lng: -0.1362,
    address: '42 Dean Street, Soho, London W1D 4PG, UK',
    name: 'Bella Vista Gourmet Kitchen & Pizzeria',
    slug: 'bellavista-pizza',
  });
  const [allLocations, setAllLocations] = useState([]);
  const [currency, setCurrency] = useState('GBP');
  const [currencySymbol, setCurrencySymbol] = useState('£');
  const [zones, setZones] = useState([]);
  const [selectedZoneId, setSelectedZoneId] = useState(null);
  const [expandedZoneId, setExpandedZoneId] = useState(null);

  const activeSlug = selectedRestaurant?.slug || 'bellavista-pizza';

  // Load zones data
  const loadData = async (slugToLoad = activeSlug) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/zones?slug=${slugToLoad}`);
      const json = await res.json();
      if (json.success && json.data) {
        setEnableDelivery(json.data.enableDelivery ?? true);
        if (json.data.restaurantLocation) {
          setRestaurantLocation(json.data.restaurantLocation);
        }
        if (Array.isArray(json.data.allLocations)) {
          setAllLocations(json.data.allLocations);
        }
        if (json.data.currency) setCurrency(json.data.currency);
        if (json.data.currencySymbol) setCurrencySymbol(json.data.currencySymbol);

        const loadedZones = (json.data.deliveryZones || []).map((z, idx) => {
          let polygon = z.polygon;
          if (typeof polygon === 'string') {
            try {
              polygon = JSON.parse(polygon);
            } catch (e) {
              polygon = null;
            }
          }
          if (polygon && polygon.coordinates && Array.isArray(polygon.coordinates[0])) {
            polygon = polygon.coordinates[0].map(([lng, lat]) => [lat, lng]);
          }

          const isShape = z.zoneType === 'SHAPE' || z.zoneType === 'POLYGON';

          return {
            ...z,
            zoneType: isShape ? 'SHAPE' : 'CIRCLE',
            polygon: isShape ? polygon : null,
            color: z.color || PRESET_COLORS[idx % PRESET_COLORS.length],
            isHidden: !!z.isHidden,
            radiusKm: z.radiusKm || 1.0,
            minOrderAmount: z.minOrderAmount ?? 15.0,
            deliveryFee: z.deliveryFee ?? 2.5,
          };
        });

        setZones(loadedZones);
        if (loadedZones.length > 0) {
          setSelectedZoneId(loadedZones[0].id);
          setExpandedZoneId(loadedZones[0].id);
        }
      }
    } catch (err) {
      console.error('Error loading zones:', err);
      toast.error('Failed to load delivery zones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(activeSlug);
  }, [activeSlug]);

  // Update specific zone properties in state
  const handleUpdateZone = (zoneId, updates) => {
    setZones((prev) =>
      prev.map((zone) => {
        if (zone.id === zoneId) {
          return { ...zone, ...updates };
        }
        return zone;
      })
    );
  };

  // Switch Zone Type between CIRCLE and SHAPE
  const handleSwitchZoneType = (zoneId, newType) => {
    setZones((prev) =>
      prev.map((zone) => {
        if (zone.id === zoneId) {
          if (newType === 'CIRCLE') {
            return {
              ...zone,
              zoneType: 'CIRCLE',
              polygon: null,
              radiusKm: zone.radiusKm || 1.5,
            };
          }
          if (newType === 'SHAPE' && (!zone.polygon || zone.polygon.length < 3)) {
            // Create default polygon box around current center/restaurant with 1km scale
            const cLat = zone.center?.lat || restaurantLocation.lat || 51.5133;
            const cLng = zone.center?.lng || restaurantLocation.lng || -0.1362;
            const offset = (zone.radiusKm || 1.0) * 0.007;

            return {
              ...zone,
              zoneType: 'SHAPE',
              polygon: [
                [cLat + offset, cLng - offset],
                [cLat + offset, cLng + offset],
                [cLat - offset, cLng + offset],
                [cLat - offset, cLng - offset],
              ],
            };
          }
          return { ...zone, zoneType: newType };
        }
        return zone;
      })
    );
  };

  // Toggle Zone Visibility (Hide / Show)
  const handleToggleHide = (zoneId, e) => {
    if (e) e.stopPropagation();
    setZones((prev) =>
      prev.map((z) => {
        if (z.id === zoneId) {
          const nextHidden = !z.isHidden;
          toast.info(
            nextHidden
              ? `"${z.name}" is now hidden from customer view.`
              : `"${z.name}" is now visible to customers.`
          );
          return { ...z, isHidden: nextHidden };
        }
        return z;
      })
    );
  };

  // Delete Zone
  const handleDeleteZone = (zoneId, e) => {
    if (e) e.stopPropagation();
    if (zones.length <= 1) {
      toast.warning('You must keep at least one delivery zone.');
      return;
    }
    const filtered = zones.filter((z) => z.id !== zoneId);
    setZones(filtered);
    if (selectedZoneId === zoneId) {
      setSelectedZoneId(filtered[0]?.id || null);
      setExpandedZoneId(filtered[0]?.id || null);
    }
    toast.info('Zone removed from draft.');
  };

  // Add Another Zone - Initial radius starts at 1.0 km
  const handleAddZone = () => {
    const nextIdx = zones.length + 1;
    const newColor = PRESET_COLORS[(nextIdx - 1) % PRESET_COLORS.length];
    const prevMaxRadius = zones.reduce((max, z) => Math.max(max, z.radiusKm || 0), 0);
    const newRadius = prevMaxRadius > 0 ? parseFloat((prevMaxRadius + 1.0).toFixed(1)) : 1.0;

    const newZone = {
      id: `zone-${Date.now()}`,
      name: `Zone ${nextIdx}`,
      zoneType: 'CIRCLE',
      radiusKm: newRadius,
      minOrderAmount: 15.0 + (nextIdx - 1) * 5,
      deliveryFee: 2.0 + (nextIdx - 1) * 1.5,
      freeDeliveryThreshold: 40.0 + (nextIdx - 1) * 10,
      estimatedTimeMin: 20 + (nextIdx - 1) * 10,
      color: newColor,
      isHidden: false,
      isActive: true,
      center: {
        lat: restaurantLocation.lat || 51.5133,
        lng: restaurantLocation.lng || -0.1362,
      },
    };

    setZones((prev) => [...prev, newZone]);
    setSelectedZoneId(newZone.id);
    setExpandedZoneId(newZone.id);
    toast.success(`Created ${newZone.name}. Adjust its boundaries on the map!`);
  };

  // Save all changes to backend
  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/admin/zones', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: selectedRestaurant?.id || null,
          slug: activeSlug,
          enableDelivery,
          deliveryZones: zones,
        }),
      });
      const json = await res.json();
      if (json.success) {
        if (json.data && json.data.deliveryZones) {
          const reloaded = json.data.deliveryZones.map((z, idx) => {
            let polygon = z.polygon;
            if (typeof polygon === 'string') {
              try {
                polygon = JSON.parse(polygon);
              } catch (e) {
                polygon = null;
              }
            }
            if (polygon && polygon.coordinates && Array.isArray(polygon.coordinates[0])) {
              polygon = polygon.coordinates[0].map(([lng, lat]) => [lat, lng]);
            }

            const isShape = z.zoneType === 'SHAPE' || z.zoneType === 'POLYGON';

            return {
              ...z,
              zoneType: isShape ? 'SHAPE' : 'CIRCLE',
              polygon: isShape ? polygon : null,
              color: z.color || PRESET_COLORS[idx % PRESET_COLORS.length],
              isHidden: !!z.isHidden,
              radiusKm: z.radiusKm || 1.0,
              minOrderAmount: z.minOrderAmount ?? 15.0,
              deliveryFee: z.deliveryFee ?? 2.5,
            };
          });
          setZones(reloaded);
        }
        toast.success('All delivery zones and settings saved successfully!');
      } else {
        toast.error(json.error || 'Failed to save delivery zones');
      }
    } catch (err) {
      console.error('Error saving zones:', err);
      toast.error('Error saving delivery zones');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading delivery engine & zones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 max-w-[1600px] w-full mx-auto space-y-5 text-slate-100">
      {/* Top Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-md">
              SETUP &bull; SERVICES
            </span>
            <span className="text-xs text-slate-400">
              {restaurantLocation.city || 'Store Location'}
            </span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">
            Delivery Zones & Multi-Location Map
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configuring zones for <strong className="text-orange-400 font-bold">{restaurantLocation.name}</strong>. Switch branches or click on map pins to edit.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Branch Switcher Dropdown */}
          {allLocations.length > 1 && (
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
              <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <select
                value={activeSlug}
                onChange={(e) => {
                  const found = allLocations.find((l) => l.slug === e.target.value);
                  if (found) {
                    selectRestaurant(found);
                  }
                }}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                {allLocations.map((loc) => (
                  <option key={loc.id || loc.slug} value={loc.slug} className="bg-slate-900 text-white">
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Split Layout: Map (Left) + Zone Configuration Sidebar (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Center Map Section (7 cols on lg, 8 cols on xl) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 sm:p-3 shadow-xl">
            <div className="h-[550px] lg:h-[720px] w-full">
              <DeliveryZoneMap
                restaurantLocation={restaurantLocation}
                allLocations={allLocations}
                onSelectLocation={(loc) => {
                  selectRestaurant(loc);
                  toast.info(`Switched active context to ${loc.name}`);
                }}
                zones={zones}
                selectedZoneId={selectedZoneId}
                onSelectZone={(id) => {
                  setSelectedZoneId(id);
                  setExpandedZoneId(id);
                }}
                onUpdateZone={handleUpdateZone}
              />
            </div>
          </div>

          {/* Quick Map Tips */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-orange-400 shrink-0" />
              <span>
                <strong>Tip:</strong> Click on any zone circle or shape on the map to inspect its pricing.
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Circle = Center + Radius
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Shape = Custom Polygon
              </span>
            </div>
          </div>
        </div>

        {/* Right Configuration Sidebar (5 cols on lg, 4 cols on xl) */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
          {/* Master Delivery Status Toggle */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  enableDelivery
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Delivery status</h3>
                <p className="text-xs text-slate-400">
                  {enableDelivery ? 'Accepting online delivery orders' : 'Delivery service is paused'}
                </p>
              </div>
            </div>

            {/* Toggle Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableDelivery}
                onChange={(e) => setEnableDelivery(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Zones Accordion List */}
          <div className="space-y-3">
            {zones.map((zone, idx) => {
              const isSelected = selectedZoneId === zone.id;
              const isExpanded = expandedZoneId === zone.id;
              const zoneColor = zone.color || PRESET_COLORS[idx % PRESET_COLORS.length];

              return (
                <div
                  key={zone.id}
                  className={`bg-slate-900 border rounded-2xl transition-all shadow-md overflow-hidden ${
                    isSelected
                      ? 'border-orange-500 ring-2 ring-orange-500/20'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Zone Accordion Header */}
                  <div
                    onClick={() => {
                      setSelectedZoneId(zone.id);
                      setExpandedZoneId(isExpanded ? null : zone.id);
                    }}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {/* Color Circle Indicator */}
                      <span
                        className="w-4 h-4 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: zoneColor }}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-white">{zone.name}</h4>
                          {zone.isHidden && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {zone.zoneType === 'CIRCLE'
                            ? `Radius: ${zone.radiusKm || 0} km (${((zone.radiusKm || 0) * 0.621371).toFixed(2)} mi)`
                            : `Custom Polygon (${zone.polygon?.length || 4} points)`}
                          {' • '}
                          Fee: {currencySymbol}{Number(zone.deliveryFee || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-300" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Expanded Zone Form */}
                  {isExpanded && (
                    <div className="p-4 pt-0 border-t border-slate-800/80 space-y-4 mt-2">
                      {/* Shape Type Selector: [ Circle ] | [ Shape ] */}
                      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                        <button
                          type="button"
                          onClick={() => handleSwitchZoneType(zone.id, 'CIRCLE')}
                          className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                            zone.zoneType === 'CIRCLE'
                              ? 'bg-white text-slate-950 shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <CircleIcon className="w-3.5 h-3.5" />
                          <span>Circle</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSwitchZoneType(zone.id, 'SHAPE')}
                          className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                            zone.zoneType === 'SHAPE'
                              ? 'bg-white text-slate-950 shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <Hexagon className="w-3.5 h-3.5" />
                          <span>Shape</span>
                        </button>
                      </div>

                      {/* Zone Name */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Name:</label>
                        <input
                          type="text"
                          value={zone.name}
                          onChange={(e) =>
                            handleUpdateZone(zone.id, { name: e.target.value })
                          }
                          className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-orange-500"
                          placeholder="e.g. Soho / Central London"
                        />
                      </div>

                      {/* Circle Radius Controls (if Circle mode) */}
                      {zone.zoneType === 'CIRCLE' && (
                        <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800/60">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Coverage Radius:</span>
                            <span className="font-bold text-white">
                              {zone.radiusKm || 1.0} km / {((zone.radiusKm || 1.0) * 0.621371).toFixed(2)} miles
                            </span>
                          </div>
                          <input
                            type="range"
                            min="0.2"
                            max="20"
                            step="0.1"
                            value={zone.radiusKm || 1.0}
                            onChange={(e) =>
                              handleUpdateZone(zone.id, {
                                radiusKm: parseFloat(e.target.value),
                              })
                            }
                            className="w-full accent-orange-500 cursor-pointer"
                          />
                        </div>
                      )}

                      {/* Custom Shape Status & Pen Tool helper (if Shape mode) */}
                      {zone.zoneType === 'SHAPE' && (
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/60 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Custom Boundary:</span>
                            <span className="text-emerald-400 font-bold">
                              {zone.polygon?.length || 0} vertices
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                            💡 Use the <strong>Pen Tool</strong> button on the map to draw or click/drag corner nodes to adjust this delivery zone.
                          </p>
                        </div>
                      )}

                      {/* Minimum Amount */}
                      <div className="flex items-center justify-between gap-3">
                        <label className="text-xs font-semibold text-slate-300">
                          Minimum amount:
                        </label>
                        <div className="relative flex items-center w-36">
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={zone.minOrderAmount}
                            onChange={(e) =>
                              handleUpdateZone(zone.id, {
                                minOrderAmount: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 pr-12 text-xs font-bold text-right text-white focus:outline-none focus:border-orange-500"
                          />
                          <span className="absolute right-2 text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {currency}
                          </span>
                        </div>
                      </div>

                      {/* Delivery Fee */}
                      <div className="flex items-center justify-between gap-3">
                        <label className="text-xs font-semibold text-slate-300">
                          Delivery fee:
                        </label>
                        <div className="relative flex items-center w-36">
                          <input
                            type="number"
                            min="0"
                            step="0.5"
                            value={zone.deliveryFee}
                            onChange={(e) =>
                              handleUpdateZone(zone.id, {
                                deliveryFee: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 pr-12 text-xs font-bold text-right text-white focus:outline-none focus:border-orange-500"
                          />
                          <span className="absolute right-2 text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {currency}
                          </span>
                        </div>
                      </div>

                      {/* Free Delivery Threshold */}
                      <div className="flex items-center justify-between gap-3">
                        <label className="text-xs font-semibold text-slate-300">
                          Free delivery above:
                        </label>
                        <div className="relative flex items-center w-36">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={zone.freeDeliveryThreshold || 0}
                            onChange={(e) =>
                              handleUpdateZone(zone.id, {
                                freeDeliveryThreshold: parseFloat(e.target.value) || 0,
                              })
                            }
                            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 pr-12 text-xs font-bold text-right text-emerald-400 focus:outline-none focus:border-emerald-500"
                          />
                          <span className="absolute right-2 text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                            {currency}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons: Delete, Hide/Show, Save */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                        <div className="flex items-center gap-2">
                          {/* Trash Delete */}
                          <button
                            type="button"
                            onClick={(e) => handleDeleteZone(zone.id, e)}
                            title="Delete this zone"
                            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          {/* Hide Zone Button (Requested feature!) */}
                          <button
                            type="button"
                            onClick={(e) => handleToggleHide(zone.id, e)}
                            title={
                              zone.isHidden
                                ? 'Hidden from customers - Click to show'
                                : 'Visible to customers - Click to hide'
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              zone.isHidden
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                            }`}
                          >
                            {zone.isHidden ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                                <span>Hidden</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5 text-slate-400" />
                                <span>Hide zone</span>
                              </>
                            )}
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={handleSaveAll}
                          disabled={saving}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Another Zone Action */}
          <button
            type="button"
            onClick={handleAddZone}
            className="w-full py-3 border-2 border-dashed border-slate-800 hover:border-orange-500/60 rounded-2xl text-xs font-bold text-orange-400 hover:text-orange-300 hover:bg-orange-500/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add another zone?</span>
          </button>

          {/* Advanced Info Card */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-400 space-y-1.5">
            <h4 className="font-bold text-slate-200">Zone Hierarchy & Pricing</h4>
            <p>
              When a customer enters an address or postcode, the closest matching zone (or polygon boundary) is automatically applied to their basket.
            </p>
            <p className="text-[11px] text-slate-500">
              Hidden zones will not be matched or shown during the customer checkout process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
