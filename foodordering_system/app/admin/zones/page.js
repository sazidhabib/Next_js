'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  MapPin,
  Plus,
  Edit2,
  Check,
  DollarSign,
  Clock,
  ShieldCheck,
  AlertCircle,
  Truck,
} from 'lucide-react';

export default function AdminZonesPage() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingZoneId, setEditingZoneId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/restaurant?slug=bellavista-pizza');
      const json = await res.json();
      if (json.success && json.data) {
        setRestaurant(json.data);
      }
    } catch (err) {
      console.error('Error loading zones:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStartEdit = (zone) => {
    setEditingZoneId(zone.id);
    setEditForm({
      name: zone.name,
      radiusKm: zone.radiusKm || 5,
      deliveryFee: zone.deliveryFee || 2.99,
      minOrderAmount: zone.minOrderAmount || 15.0,
      freeDeliveryThreshold: zone.freeDeliveryThreshold || 40.0,
      estimatedTimeMin: zone.estimatedTimeMin || 30,
    });
  };

  const handleSaveEdit = (zoneId) => {
    setRestaurant((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const idx = next.deliveryZones.findIndex((z) => z.id === zoneId);
      if (idx !== -1) {
        next.deliveryZones[idx] = {
          ...next.deliveryZones[idx],
          ...editForm,
        };
      }
      return next;
    });
    setEditingZoneId(null);
    toast.success('Delivery zone updated successfully!');
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Delivery Zones & Pricing Engine
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure concentric radius zones, minimum order requirements, delivery fees, and free delivery thresholds.
          </p>
        </div>
      </div>

      {/* Zones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {restaurant?.deliveryZones?.map((zone, idx) => {
          const isEditing = editingZoneId === zone.id;

          return (
            <div
              key={zone.id}
              className={`bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                isEditing
                  ? 'border-orange-500 ring-2 ring-orange-500/20'
                  : 'border-slate-800'
              }`}
            >
              <div className="space-y-4">
                {/* Zone Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-xs">
                      #{idx + 1}
                    </div>
                    <div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="bg-slate-950 border border-slate-700 text-white rounded-lg p-1 text-xs font-bold w-full"
                        />
                      ) : (
                        <h3 className="font-bold text-white text-sm">
                          {zone.name}
                        </h3>
                      )}
                      <p className="text-[11px] text-slate-400">
                        Coverage: {zone.radiusKm} km radius
                      </p>
                    </div>
                  </div>
                </div>

                {/* Zone Parameters */}
                <div className="space-y-2.5 bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs">
                  {/* Delivery Fee */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Base Delivery Fee:</span>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.deliveryFee}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            deliveryFee: parseFloat(e.target.value),
                          })
                        }
                        className="w-20 bg-slate-900 border border-slate-700 text-right text-white rounded p-1 text-xs"
                      />
                    ) : (
                      <span className="font-bold text-white">
                        ${zone.deliveryFee?.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Minimum Order */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Min. Order Amount:</span>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.minOrderAmount}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            minOrderAmount: parseFloat(e.target.value),
                          })
                        }
                        className="w-20 bg-slate-900 border border-slate-700 text-right text-white rounded p-1 text-xs"
                      />
                    ) : (
                      <span className="font-bold text-orange-400">
                        ${zone.minOrderAmount?.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Free Delivery Threshold */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Free Delivery Over:</span>
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.01"
                        value={editForm.freeDeliveryThreshold}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            freeDeliveryThreshold: parseFloat(e.target.value),
                          })
                        }
                        className="w-20 bg-slate-900 border border-slate-700 text-right text-white rounded p-1 text-xs"
                      />
                    ) : (
                      <span className="font-bold text-emerald-400">
                        ${zone.freeDeliveryThreshold?.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {/* Estimated Time */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Est. Duration:</span>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editForm.estimatedTimeMin}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            estimatedTimeMin: parseInt(e.target.value),
                          })
                        }
                        className="w-20 bg-slate-900 border border-slate-700 text-right text-white rounded p-1 text-xs"
                      />
                    ) : (
                      <span className="font-bold text-slate-300">
                        {zone.estimatedTimeMin} mins
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-end">
                {isEditing ? (
                  <button
                    onClick={() => handleSaveEdit(zone.id)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartEdit(zone)}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Rules</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
