'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Building2,
  Phone,
  Globe,
  MapPin,
  Clock,
  Check,
  X,
  Sparkles,
  Search,
  UserCheck,
  Mail,
  ChevronRight,
  ArrowLeft,
  Navigation,
} from 'lucide-react';
import { toast } from 'react-toastify';

import { COUNTRIES_DATA, GLOBAL_TIMEZONES } from '@/lib/locationData';

export default function LocationSetupWizardModal({
  isOpen,
  onClose,
  onSuccess,
  editData = null,
}) {
  const [step, setStep] = useState(1); // Step 1: Basics & Map, Step 2: Owner/Manager, Step 3: Fulfillment & Settings
  const [submitting, setSubmitting] = useState(false);

  // Step 1: Restaurant Basics & Address
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('United States');
  const [state, setState] = useState('New York');
  const [city, setCity] = useState('New York');
  const [zipCode, setZipCode] = useState('10001');
  const [streetAddress, setStreetAddress] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');

  // Selected country details helper
  const selectedCountryData = COUNTRIES_DATA.find((c) => c.name === country) || COUNTRIES_DATA[0];

  // Coordinates & Map Pin State
  const [latitude, setLatitude] = useState(40.7128);
  const [longitude, setLongitude] = useState(-74.006);
  const [geocoding, setGeocoding] = useState(false);

  // Step 2: Owner / Manager Details
  const [managerFirstName, setManagerFirstName] = useState('');
  const [managerLastName, setManagerLastName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPhone, setManagerPhone] = useState('');

  // Step 3: Fulfillment & Services
  const [description, setDescription] = useState('');
  const [taxRatePercent, setTaxRatePercent] = useState('8.5');
  const [estimatedPrepTime, setEstimatedPrepTime] = useState('25');
  const [enableDelivery, setEnableDelivery] = useState(true);
  const [enablePickup, setEnablePickup] = useState(true);
  const [enableCash, setEnableCash] = useState(true);
  const [enableCard, setEnableCard] = useState(true);
  const [enableOnline, setEnableOnline] = useState(false);

  // Mini Map Leaflet references
  const miniMapContainerRef = useRef(null);
  const miniMapInstanceRef = useRef(null);
  const miniPinMarkerRef = useRef(null);

  // Populate data when in edit mode
  useEffect(() => {
    if (editData) {
      setName(editData.name || '');
      setSlug(editData.slug || '');
      setPhone(editData.phone || '');
      setCountry(editData.country || 'United States');
      setState(editData.state || 'New York');
      setCity(editData.city || 'New York');
      setZipCode(editData.zipCode || '');
      setStreetAddress(editData.address || '');
      setTimezone(editData.timezone || 'America/New_York');
      setLatitude(editData.latitude || 51.5074);
      setLongitude(editData.longitude || -0.1278);
      setManagerFirstName(editData.managerFirstName || '');
      setManagerLastName(editData.managerLastName || '');
      setManagerEmail(editData.managerEmail || editData.email || '');
      setManagerPhone(editData.managerPhone || editData.phone || '');
      setDescription(editData.description || '');
      setTaxRatePercent(String(editData.taxRatePercent || '8.5'));
      setEstimatedPrepTime(String(editData.estimatedPrepTime || '25'));
      setEnableDelivery(editData.enableDelivery !== false);
      setEnablePickup(editData.enablePickup !== false);
      setEnableCash(editData.enableCash !== false);
      setEnableCard(editData.enableCard !== false);
      setEnableOnline(!!editData.enableOnline);
    } else {
      setName('');
      setSlug('');
      setPhone('');
      setCountry('United States');
      setState('New York');
      setCity('New York');
      setZipCode('10021');
      setStreetAddress('740 Park Avenue');
      setTimezone('America/New_York');
      setLatitude(40.7725);
      setLongitude(-73.9644);
      setManagerFirstName('');
      setManagerLastName('');
      setManagerEmail('');
      setManagerPhone('');
      setDescription('');
      setTaxRatePercent('8.5');
      setEstimatedPrepTime('25');
      setEnableDelivery(true);
      setEnablePickup(true);
      setEnableCash(true);
      setEnableCard(true);
      setEnableOnline(false);
    }
    setStep(1);
  }, [editData, isOpen]);

  // Auto-generate slug when name changes in create mode
  const handleNameChange = (val) => {
    setName(val);
    if (!editData) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  };

  // Country Change handler to update default state/timezones
  const handleCountryChange = (cName) => {
    setCountry(cName);
    const found = COUNTRIES_DATA.find((c) => c.name === cName);
    if (found) {
      setState(found.defaultState || '');
      setCity(found.defaultCity || '');
      if (found.defaultZip) setZipCode(found.defaultZip);
      setTimezone(found.timezone || 'America/New_York');
      setLatitude(found.lat || 40.7128);
      setLongitude(found.lng || -74.006);
      if (miniMapInstanceRef.current) {
        miniMapInstanceRef.current.setView([found.lat, found.lng], 13);
        if (miniPinMarkerRef.current) {
          miniPinMarkerRef.current.setLatLng([found.lat, found.lng]);
        }
      }
    }
  };

  // Initialize interactive mini Leaflet map in Step 1
  useEffect(() => {
    if (!isOpen || step !== 1) return;

    let isMounted = true;

    async function initMiniMap() {
      if (typeof window === 'undefined') return;
      const L = (await import('leaflet')).default;

      // Monkey-patch DomUtil.getPosition to safely handle undefined/null elements.
      const _origGetPosition = L.DomUtil.getPosition;
      L.DomUtil.getPosition = function (el) {
        if (!el) return new L.Point(0, 0);
        return _origGetPosition.call(this, el);
      };

      if (!isMounted || !miniMapContainerRef.current) return;

      if (miniMapInstanceRef.current) {
        try { miniMapInstanceRef.current.remove(); } catch (_e) { /* ignore */ }
        miniMapInstanceRef.current = null;
      }

      const center = [latitude || 40.7725, longitude || -73.9644];

      const map = L.map(miniMapContainerRef.current, {
        center,
        zoom: 14,
        zoomControl: true,
        attributionControl: false,
        zoomAnimation: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Custom Draggable Pin
      const pinHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: grab;">
          <div style="background: #ea580c; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.4); border: 2.5px solid #ffffff;">
            <svg style="transform: rotate(45deg); width: 17px; height: 17px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div style="background: #0f172a; color: #fff; font-size: 10.5px; font-weight: 700; padding: 2px 7px; border-radius: 10px; margin-top: 3px; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
            Drag to exact entrance
          </div>
        </div>
      `;

      const pinIcon = L.divIcon({
        className: 'setup-drag-pin',
        html: pinHtml,
        iconSize: [0, 0],
      });

      const marker = L.marker(center, {
        icon: pinIcon,
        draggable: true,
        zIndexOffset: 1000,
      }).addTo(map);

      marker.on('dragend', (e) => {
        const pos = e.target.getLatLng();
        setLatitude(parseFloat(pos.lat.toFixed(6)));
        setLongitude(parseFloat(pos.lng.toFixed(6)));
      });

      // Click anywhere on map to reposition pin
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setLatitude(parseFloat(lat.toFixed(6)));
        setLongitude(parseFloat(lng.toFixed(6)));
      });

      miniPinMarkerRef.current = marker;
      miniMapInstanceRef.current = map;
    }

    const timer = setTimeout(() => {
      initMiniMap();
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (miniMapInstanceRef.current) {
        miniMapInstanceRef.current.remove();
        miniMapInstanceRef.current = null;
      }
    };
  }, [isOpen, step]);

  // Geocode address when user clicks "Locate on Map"
  const handleGeocodeAddress = async () => {
    const query = `${streetAddress}, ${city}, ${state}, ${zipCode}, ${country}`;
    if (!query.trim()) return;

    try {
      setGeocoding(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const foundLat = parseFloat(data[0].lat);
        const foundLng = parseFloat(data[0].lon);
        setLatitude(foundLat);
        setLongitude(foundLng);

        if (miniMapInstanceRef.current) {
          miniMapInstanceRef.current.setView([foundLat, foundLng], 16, { animate: true });
          if (miniPinMarkerRef.current) {
            miniPinMarkerRef.current.setLatLng([foundLat, foundLng]);
          }
        }
        toast.success('Found address on map! Adjust pin if needed.');
      } else {
        toast.warning('Could not find exact address. Drag the pin directly on the map.');
      }
    } catch (err) {
      toast.error('Geocoding search service is temporarily unavailable');
    } finally {
      setGeocoding(false);
    }
  };

  // Step 1 Validation
  const handleNextStep1 = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Restaurant name is required');
      return;
    }
    if (!streetAddress.trim()) {
      toast.error('Street address is required');
      return;
    }
    if (!phone.trim()) {
      toast.error('Phone number is required');
      return;
    }
    setStep(2);
  };

  // Step 2 Validation
  const handleNextStep2 = (e) => {
    e.preventDefault();
    if (!managerFirstName.trim() || !managerLastName.trim()) {
      toast.error('Manager first and last name are required');
      return;
    }
    if (!managerEmail.trim()) {
      toast.error('Manager email is required');
      return;
    }
    setStep(3);
  };

  // Final Submit
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description,
        phone,
        email: managerEmail,
        address: `${streetAddress}, ${city}, ${state} ${zipCode}, ${country}`,
        city,
        state,
        zipCode,
        country,
        timezone,
        managerFirstName,
        managerLastName,
        managerEmail,
        managerPhone: managerPhone || phone,
        latitude,
        longitude,
        taxRatePercent: parseFloat(taxRatePercent) || 0,
        estimatedPrepTime: parseInt(estimatedPrepTime) || 25,
        enableDelivery,
        enablePickup,
        enableCash,
        enableCard,
        enableOnline,
      };

      const url = '/api/admin/restaurants';
      const method = editData ? 'PUT' : 'POST';

      if (editData) {
        payload.id = editData.id;
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success) {
        toast.success(
          editData
            ? `Location "${name}" updated successfully!`
            : `Location "${name}" added successfully!`
        );
        onSuccess(json.data);
        onClose();
      } else {
        toast.error(json.error || 'Failed to save restaurant location');
      }
    } catch (err) {
      toast.error('Error saving restaurant location');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header & Step Tracker */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-black">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">
                {editData ? 'Edit Restaurant Location' : 'Setup New Restaurant Location'}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Add branch details, pinpoint entrance coordinates, and assign manager.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-full px-3 py-1 text-xs">
              <span className={`px-2 py-0.5 rounded-full font-bold ${step === 1 ? 'bg-orange-500 text-white' : 'text-slate-400'}`}>1. Address & Map</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className={`px-2 py-0.5 rounded-full font-bold ${step === 2 ? 'bg-orange-500 text-white' : 'text-slate-400'}`}>2. Manager</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className={`px-2 py-0.5 rounded-full font-bold ${step === 3 ? 'bg-orange-500 text-white' : 'text-slate-400'}`}>3. Services</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 text-slate-200">
          {/* STEP 1: RESTAURANT BASICS, ADDRESS & MAP PIN */}
          {step === 1 && (
            <form onSubmit={handleNextStep1} className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left Form: Name, Phone & Address Fields */}
                <div className="lg:col-span-6 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      Restaurant / Location Name <span className="text-orange-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        placeholder="e.g. Pronto Restaurant NYC (Brooklyn Branch)"
                        required
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-orange-500 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">
                        Phone Number <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 234 567 8900"
                        required
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">
                        Country <span className="text-orange-500">*</span>
                      </label>
                      <select
                        value={country}
                        onChange={(e) => handleCountryChange(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-orange-500 font-medium cursor-pointer"
                      >
                        {COUNTRIES_DATA.map((c) => (
                          <option key={c.code} value={c.name}>
                            {c.name} ({c.code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* State/Region & Timezone Selectors with rich lists */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-300">
                          State / Region <span className="text-orange-500">*</span>
                        </label>
                        {selectedCountryData?.states?.length > 0 && (
                          <span className="text-[10px] text-orange-400 font-bold">
                            {selectedCountryData.states.length} available
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          list="states-list"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="Select or type state/region..."
                          required
                          className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-orange-500 font-medium"
                        />
                        <datalist id="states-list">
                          {selectedCountryData?.states?.map((st) => (
                            <option key={st} value={st} />
                          ))}
                        </datalist>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">
                        Timezone <span className="text-orange-500">*</span>
                      </label>
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-orange-500 font-medium cursor-pointer"
                      >
                        {selectedCountryData?.timezones && selectedCountryData.timezones.length > 0 && (
                          <optgroup label={`Recommended for ${country}`}>
                            {selectedCountryData.timezones.map((tz) => (
                              <option key={tz.value} value={tz.value}>
                                {tz.label}
                              </option>
                            ))}
                          </optgroup>
                        )}
                        <optgroup label="All Global Timezones">
                          {GLOBAL_TIMEZONES.map((tz) => (
                            <option key={tz.value} value={tz.value}>
                              {tz.label}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">
                        City <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. New York"
                        required
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-300">ZIP / Postal Code</label>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="12345"
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      Street Name & Number <span className="text-orange-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder="e.g. 740 Park Avenue"
                        required
                        className="flex-1 bg-slate-950 border border-slate-700 text-white rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-orange-500"
                      />
                      <button
                        type="button"
                        onClick={handleGeocodeAddress}
                        disabled={geocoding}
                        className="px-3 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 disabled:opacity-50"
                      >
                        {geocoding ? (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Navigation className="w-3.5 h-3.5" />
                        )}
                        <span>Find on Map</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Interactive Mini Map */}
                <div className="lg:col-span-6 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-orange-400" />
                      Pinpoint Exact Storefront Location
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Lat: {latitude.toFixed(4)}, Lng: {longitude.toFixed(4)}
                    </span>
                  </div>

                  <div className="relative w-full h-[260px] sm:h-[300px] rounded-2xl overflow-hidden border border-slate-700 shadow-inner bg-slate-950">
                    <div ref={miniMapContainerRef} className="w-full h-full z-0" />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    💡 <em>Drag the orange pin directly or click anywhere on the map to set the exact restaurant coordinates.</em>
                  </p>
                </div>
              </div>

              {/* Step 1 Actions */}
              <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 active:bg-orange-700 shadow-lg shadow-orange-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Next: Owner / Manager</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: OWNER / MANAGER DETAILS */}
          {step === 2 && (
            <form onSubmit={handleNextStep2} className="space-y-4 max-w-xl mx-auto py-2">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-orange-400" />
                    Who is the restaurant owner / manager?
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    This contact receives order notification alerts, weekly sales summaries, and admin access.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      First Name <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={managerFirstName}
                      onChange={(e) => setManagerFirstName(e.target.value)}
                      placeholder="e.g. John"
                      required
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-300">
                      Last Name <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={managerLastName}
                      onChange={(e) => setManagerLastName(e.target.value)}
                      placeholder="e.g. Smith"
                      required
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    Email Address <span className="text-orange-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={managerEmail}
                      onChange={(e) => setManagerEmail(e.target.value)}
                      placeholder="manager@restaurant.com"
                      required
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-orange-500 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Manager Direct Phone</label>
                  <input
                    type="tel"
                    value={managerPhone}
                    onChange={(e) => setManagerPhone(e.target.value)}
                    placeholder="+1 234 567 8900 (Optional)"
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl py-2.5 px-3 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Step 2 Actions */}
              <div className="flex justify-between items-center gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 active:bg-orange-700 shadow-lg shadow-orange-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>Next: Services & Fulfillment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: SERVICES & FULFILLMENT SETTINGS */}
          {step === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-4 max-w-xl mx-auto py-2">
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl text-xs">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    Services & Fulfillment Setup
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure order intake, prep times, and payment methods for this branch.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Short Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Authentic wood-fired pizza & homemade pasta..."
                    rows={2}
                    className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Tax Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={taxRatePercent}
                      onChange={(e) => setTaxRatePercent(e.target.value)}
                      placeholder="8.5"
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Estimated Prep Time (mins)</label>
                    <input
                      type="number"
                      value={estimatedPrepTime}
                      onChange={(e) => setEstimatedPrepTime(e.target.value)}
                      placeholder="25"
                      className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl p-2.5 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Fulfillment and Payments Grid */}
                <div className="grid grid-cols-2 gap-4 bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                  <div className="space-y-2 flex flex-col">
                    <span className="font-bold text-orange-400 uppercase tracking-wider text-[10px]">Fulfillment</span>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-300">
                      <input
                        type="checkbox"
                        checked={enableDelivery}
                        onChange={(e) => setEnableDelivery(e.target.checked)}
                        className="rounded text-orange-500 focus:ring-0"
                      />
                      <span>Enable Delivery</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-300">
                      <input
                        type="checkbox"
                        checked={enablePickup}
                        onChange={(e) => setEnablePickup(e.target.checked)}
                        className="rounded text-orange-500 focus:ring-0"
                      />
                      <span>Enable Pickup</span>
                    </label>
                  </div>

                  <div className="space-y-2 flex flex-col">
                    <span className="font-bold text-orange-400 uppercase tracking-wider text-[10px]">Payment Methods</span>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-300">
                      <input
                        type="checkbox"
                        checked={enableCash}
                        onChange={(e) => setEnableCash(e.target.checked)}
                        className="rounded text-orange-500 focus:ring-0"
                      />
                      <span>Cash on Delivery</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-300">
                      <input
                        type="checkbox"
                        checked={enableCard}
                        onChange={(e) => setEnableCard(e.target.checked)}
                        className="rounded text-orange-500 focus:ring-0"
                      />
                      <span>Card POS on Arrival</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Step 3 Actions */}
              <div className="flex justify-between items-center gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-7 py-2.5 rounded-xl text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 active:bg-orange-700 shadow-xl shadow-orange-600/25 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Location...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{editData ? 'Save Changes' : 'Add Location'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
