'use client';

import React, { useEffect, useRef, useState, useId, useMemo } from 'react';
import { MapPin } from 'lucide-react';

export default function RestaurantZoneInfoMap({
  restaurantLocation = { lat: 51.5133, lng: -0.1362, name: 'Restaurant Location' },
  zones = [],
  hoveredZoneIndex = null,
  onHoverZone = () => {},
}) {
  const mapUniqueId = useId().replace(/:/g, '_');
  const mapContainerId = `restaurant-zone-info-map-${mapUniqueId}`;
  const mapInstanceRef = useRef(null);
  const zoneLayersRef = useRef([]);
  // Keep a stable ref for the onHoverZone callback to avoid stale closures
  const onHoverZoneRef = useRef(onHoverZone);
  onHoverZoneRef.current = onHoverZone;

  const [activeZone, setActiveZone] = useState(null);

  // Stabilize zones so the map only reinitializes when zone DATA changes,
  // not when the parent re-renders from hover state changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableZonesKey = useMemo(() => JSON.stringify(zones), [JSON.stringify(zones)]);
  const zonesRef = useRef(zones);
  zonesRef.current = zones;

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined') return;

      const L = (await import('leaflet')).default;

      // Monkey-patch DomUtil.getPosition to safely handle undefined/null elements.
      // In iframe/modal contexts, Leaflet's internal zoom transition callbacks
      // (_onZoomTransitionEnd -> _move -> _getMapPanePos) can fire before
      // _mapPane is positioned, causing "Cannot read properties of undefined
      // (reading '_leaflet_pos')". This patch returns a zero Point instead of crashing.
      const _origGetPosition = L.DomUtil.getPosition;
      L.DomUtil.getPosition = function (el) {
        if (!el) return new L.Point(0, 0);
        return _origGetPosition.call(this, el);
      };

      const container = document.getElementById(mapContainerId);
      if (!isMounted || !container) return;

      // Clean up existing map instance or container leaflet ID
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (container._leaflet_id) {
        delete container._leaflet_id;
      }

      const centerLat = restaurantLocation?.lat || 51.5133;
      const centerLng = restaurantLocation?.lng || -0.1362;

      const map = L.map(container, {
        center: [centerLat, centerLng],
        zoom: 13,
        zoomControl: true,
        attributionControl: false,
        // Disable zoom animation to prevent _onZoomTransitionEnd crash in iframes
        zoomAnimation: false,
      });

      // OpenStreetMap Street Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
      }).addTo(map);

      // Custom Restaurant Pin Marker
      const storePinHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: pointer;">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%; background: rgba(234, 88, 12, 0.4); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px rgba(234,88,12,0.4); border: 2.5px solid #ffffff; z-index: 10;">
            <svg style="transform: rotate(45deg); width: 17px; height: 17px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      `;

      const storeIcon = L.divIcon({
        className: 'custom-store-pin',
        html: storePinHtml,
        iconSize: [0, 0],
      });

      L.marker([centerLat, centerLng], { icon: storeIcon, zIndexOffset: 1000 }).addTo(map);

      // Render Delivery Zones
      const layers = [];
      const bounds = L.latLngBounds([[centerLat, centerLng]]);

      // Sort zones from largest radius to smallest so smaller inner zones receive hover
      const sortedZones = [...zones].sort((a, b) => {
        const radA = a.radiusKm || 0;
        const radB = b.radiusKm || 0;
        return radB - radA;
      });

      sortedZones.forEach((zone, idx) => {
        const color = zone.color || '#ea580c';
        let layer = null;

        let polygonCoords = zone.polygon;
        if (typeof polygonCoords === 'string') {
          try {
            polygonCoords = JSON.parse(polygonCoords);
          } catch (e) {
            polygonCoords = null;
          }
        }
        if (polygonCoords && polygonCoords.coordinates && Array.isArray(polygonCoords.coordinates[0])) {
          polygonCoords = polygonCoords.coordinates[0].map(([lng, lat]) => [lat, lng]);
        }

        const isShape =
          zone.zoneType === 'SHAPE' ||
          zone.zoneType === 'POLYGON' ||
          (Array.isArray(polygonCoords) && polygonCoords.length >= 3);

        if (isShape && Array.isArray(polygonCoords) && polygonCoords.length >= 3) {
          layer = L.polygon(polygonCoords, {
            color: color,
            weight: 2.5,
            fillColor: color,
            fillOpacity: 0.22,
          }).addTo(map);

          polygonCoords.forEach((pt) => bounds.extend([pt[0], pt[1]]));
        } else if (zone.radiusKm) {
          layer = L.circle([centerLat, centerLng], {
            radius: zone.radiusKm * 1000,
            color: color,
            weight: 2.5,
            fillColor: color,
            fillOpacity: 0.18,
          }).addTo(map);

          const kmInDegrees = zone.radiusKm / 111.32;
          bounds.extend([centerLat + kmInDegrees, centerLng + kmInDegrees]);
          bounds.extend([centerLat - kmInDegrees, centerLng - kmInDegrees]);
        }

        if (layer) {
          // Use mouseover/mouseout with style changes only — no Leaflet tooltips
          layer.on('mouseover', () => {
            layer.setStyle({ fillOpacity: 0.45, weight: 3.5 });
            setActiveZone(zone);
            onHoverZoneRef.current(idx);
          });

          layer.on('mouseout', () => {
            layer.setStyle({ fillOpacity: zone.zoneType === 'SHAPE' ? 0.22 : 0.18, weight: 2.5 });
            setActiveZone(null);
            onHoverZoneRef.current(null);
          });

          layers.push({ layer, zone, index: idx });
        }
      });

      zoneLayersRef.current = layers;

      if (zones.length > 0) {
        // Ensure map container is properly measured before fitting bounds.
        // In iframe/modal contexts the container may not have final dimensions yet.
        map.invalidateSize({ animate: false });
        // Use animate: false to avoid zoom transition that crashes in iframes
        map.fitBounds(bounds, { padding: [35, 35], animate: false });
      }

      mapInstanceRef.current = map;
    }

    // Longer delay to ensure iframe/modal container is fully laid out
    const timer = setTimeout(initMap, 250);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (_e) {
          // Silently ignore errors during cleanup (map may already be detached)
        }
        mapInstanceRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurantLocation.lat, restaurantLocation.lng, restaurantLocation.name, stableZonesKey, mapContainerId]);

  // Handle external hover highlight from parent list
  useEffect(() => {
    if (!zoneLayersRef.current || zoneLayersRef.current.length === 0) return;

    zoneLayersRef.current.forEach(({ layer, zone, index }) => {
      if (hoveredZoneIndex === index) {
        layer.setStyle({ fillOpacity: 0.5, weight: 4 });
      } else {
        layer.setStyle({ fillOpacity: zone.zoneType === 'SHAPE' ? 0.22 : 0.18, weight: 2.5 });
      }
    });
  }, [hoveredZoneIndex]);

  return (
    <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-300 shadow-md bg-slate-100">
      <div id={mapContainerId} className="w-full h-full z-10" />

      {/* Floating Zone Legend Badge */}
      <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl shadow-md border border-slate-200 text-xs font-semibold text-slate-800 space-y-1 max-w-xs">
        <div className="flex items-center gap-1.5 text-slate-900 font-bold text-[11px] border-b border-slate-200 pb-1">
          <MapPin className="w-3.5 h-3.5 text-orange-600" />
          <span>Interactive Delivery Zone Map</span>
        </div>
        <p className="text-[10px] text-slate-500 font-normal">
          Hover over zones or rings to see fee & minimum order breakdown.
        </p>
      </div>

      {/* Floating Active Zone Banner on Hover */}
      {activeZone && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md z-20 bg-slate-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center justify-between gap-3 text-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: activeZone.color || '#ea580c' }}
            ></span>
            <span className="font-bold">{activeZone.name || 'Selected Zone'}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-200">
            <span>
              Fee: <strong className="text-white">£{(activeZone.deliveryFee || activeZone.fee || 0).toFixed(2)}</strong>
            </span>
            <span>•</span>
            <span>
              Min: <strong className="text-white">£{(activeZone.minOrderAmount || activeZone.minOrder || 0).toFixed(2)}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
