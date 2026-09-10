'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as turf from '@turf/turf';

export default function DeliveryZoneMap({
  restaurantLocation = { lat: 51.5133, lng: -0.1362, name: 'Bella Vista Gourmet' },
  allLocations = [],
  onSelectLocation = null,
  zones = [],
  selectedZoneId = null,
  onSelectZone = () => {},
  onUpdateZone = () => {},
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef({
    tileLayer: null,
    restaurantMarker: null,
    otherLocationMarkers: [],
    zoneLayers: {},
    editHandles: [],
  });

  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' | 'satellite'
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoints, setDrawingPoints] = useState([]);
  const drawingLayersRef = useRef({
    markers: [],
    polyline: null,
    previewLine: null,
    firstPointMarker: null,
  });

  const selectedZone = zones.find((z) => z.id === selectedZoneId);

  // Initialize Leaflet Map on client mount (runs ONCE)
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === 'undefined') return;

      const L = (await import('leaflet')).default;

      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous instance if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const initialCenter = [
        restaurantLocation?.lat || 51.5133,
        restaurantLocation?.lng || -0.1362,
      ];

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      // Default Tile Layer (OpenStreetMap - Free & No API Key Required)
      const streetLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      ).addTo(map);

      layersRef.current.tileLayer = streetLayer;
      mapInstanceRef.current = map;
      setLeafletLoaded(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Active Restaurant Pin Marker when restaurantLocation changes
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletLoaded) return;

    import('leaflet').then((module) => {
      const L = module.default;
      const map = mapInstanceRef.current;

      const center = [
        restaurantLocation?.lat || 51.5133,
        restaurantLocation?.lng || -0.1362,
      ];

      // Remove existing restaurant marker
      if (layersRef.current.restaurantMarker && map.hasLayer(layersRef.current.restaurantMarker)) {
        map.removeLayer(layersRef.current.restaurantMarker);
      }

      const storePinHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: pointer;">
          <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 50%; background: rgba(234, 88, 12, 0.4); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); width: 36px; height: 36px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 16px rgba(234,88,12,0.4); border: 2.5px solid #ffffff; z-index: 10;">
            <svg style="transform: rotate(45deg); width: 19px; height: 19px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div style="background: rgba(15, 23, 42, 0.92); color: #fff; font-size: 11px; font-weight: 800; padding: 3px 9px; border-radius: 12px; margin-top: 5px; white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.15); z-index: 10;">
            ${restaurantLocation.name || 'Active Store'} (HQ)
          </div>
        </div>
      `;

      const storeIcon = L.divIcon({
        className: 'custom-store-pin',
        html: storePinHtml,
        iconSize: [0, 0],
      });

      const restMarker = L.marker(center, {
        icon: storeIcon,
        zIndexOffset: 1500,
      }).addTo(map);

      layersRef.current.restaurantMarker = restMarker;
    });
  }, [restaurantLocation.lat, restaurantLocation.lng, restaurantLocation.name, leafletLoaded]);

  // Update Branch Pin Markers when allLocations changes
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletLoaded) return;

    import('leaflet').then((module) => {
      const L = module.default;
      const map = mapInstanceRef.current;

      layersRef.current.otherLocationMarkers.forEach((m) => {
        if (map.hasLayer(m)) map.removeLayer(m);
      });
      layersRef.current.otherLocationMarkers = [];

      if (Array.isArray(allLocations) && allLocations.length > 0) {
        allLocations.forEach((loc) => {
          if (
            (loc.slug && loc.slug === restaurantLocation.slug) ||
            (loc.lat === restaurantLocation.lat && loc.lng === restaurantLocation.lng)
          ) {
            return;
          }

          if (!loc.lat || !loc.lng) return;

          const branchPinHtml = `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: pointer;">
              <div style="background: #334155; width: 30px; height: 30px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid #ffffff;">
                <svg style="transform: rotate(45deg); width: 15px; height: 15px; color: #f8fafc;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div style="background: rgba(30, 41, 59, 0.9); color: #cbd5e1; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 10px; margin-top: 4px; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1);">
                ${loc.name || 'Branch'}
              </div>
            </div>
          `;

          const branchIcon = L.divIcon({
            className: 'custom-branch-pin',
            html: branchPinHtml,
            iconSize: [0, 0],
          });

          const branchMarker = L.marker([loc.lat, loc.lng], {
            icon: branchIcon,
            zIndexOffset: 1000,
          }).addTo(map);

          if (onSelectLocation) {
            branchMarker.on('click', () => {
              onSelectLocation(loc);
            });
          }

          layersRef.current.otherLocationMarkers.push(branchMarker);
        });
      }
    });
  }, [allLocations, restaurantLocation.slug, restaurantLocation.lat, restaurantLocation.lng, leafletLoaded, onSelectLocation]);

  // Handle Switch Map Type (Roadmap / Satellite)
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletLoaded) return;
    import('leaflet').then((module) => {
      const L = module.default;
      const map = mapInstanceRef.current;

      if (layersRef.current.tileLayer) {
        map.removeLayer(layersRef.current.tileLayer);
      }

      if (mapType === 'satellite') {
        layersRef.current.tileLayer = L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          { maxZoom: 19 }
        ).addTo(map);
      } else {
        layersRef.current.tileLayer = L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }
        ).addTo(map);
      }
    });
  }, [mapType, leafletLoaded]);

  // Complete Drawing polygon
  const handleFinishDrawing = useCallback(() => {
    if (drawingPoints.length < 3) {
      alert('A shape requires at least 3 points. Click around the map to add more points.');
      return;
    }
    if (selectedZoneId) {
      onUpdateZone(selectedZoneId, {
        zoneType: 'SHAPE',
        polygon: drawingPoints,
      });
    }
    setIsDrawing(false);
    setDrawingPoints([]);
  }, [drawingPoints, selectedZoneId, onUpdateZone]);

  // Cancel Drawing
  const handleCancelDrawing = useCallback(() => {
    setIsDrawing(false);
    setDrawingPoints([]);
  }, []);

  // Undo Last Point in Drawing Mode
  const handleUndoPoint = useCallback(() => {
    setDrawingPoints((prev) => prev.slice(0, -1));
  }, []);

  // Start Drawing Mode for current selected zone
  const handleStartDrawingMode = () => {
    setIsDrawing(true);
    setDrawingPoints([]);
  };

  // Interactive Drawing Handlers on Map (Click to add points, close on first node)
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletLoaded) return;

    let cleanupL = null;

    import('leaflet').then((module) => {
      const L = module.default;
      const map = mapInstanceRef.current;
      cleanupL = L;

      // Clean existing drawing overlays
      const dRef = drawingLayersRef.current;
      dRef.markers.forEach((m) => {
        if (map.hasLayer(m)) map.removeLayer(m);
      });
      dRef.markers = [];
      if (dRef.polyline && map.hasLayer(dRef.polyline)) map.removeLayer(dRef.polyline);
      if (dRef.previewLine && map.hasLayer(dRef.previewLine)) map.removeLayer(dRef.previewLine);
      if (dRef.firstPointMarker && map.hasLayer(dRef.firstPointMarker)) map.removeLayer(dRef.firstPointMarker);

      if (!isDrawing) {
        map.getContainer().style.cursor = '';
        return;
      }

      map.getContainer().style.cursor = 'crosshair';
      const zoneColor = selectedZone?.color || '#ea580c';

      // 1. Draw solid line connecting current points
      if (drawingPoints.length > 0) {
        dRef.polyline = L.polyline(drawingPoints, {
          color: zoneColor,
          weight: 3.5,
          dashArray: '4, 4',
          opacity: 0.9,
        }).addTo(map);

        // Preview rubberband line following cursor
        dRef.previewLine = L.polyline([], {
          color: zoneColor,
          weight: 2,
          dashArray: '6, 6',
          opacity: 0.6,
        }).addTo(map);

        const onMouseMove = (e) => {
          if (drawingPoints.length > 0 && dRef.previewLine) {
            const lastPt = drawingPoints[drawingPoints.length - 1];
            dRef.previewLine.setLatLngs([lastPt, [e.latlng.lat, e.latlng.lng]]);
          }
        };

        map.on('mousemove', onMouseMove);

        // Place markers on each placed point
        drawingPoints.forEach((pt, idx) => {
          const isFirst = idx === 0;

          if (isFirst) {
            // First Node: Special Pulsing Close Target
            const firstNodeHtml = `
              <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%); cursor: pointer;">
                <div style="position: absolute; width: 30px; height: 30px; border-radius: 50%; background: ${zoneColor}; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
                <div style="width: 18px; height: 18px; background: #ffffff; border: 4px solid ${zoneColor}; border-radius: 50%; box-shadow: 0 3px 10px rgba(0,0,0,0.5); z-index: 10;"></div>
                <div style="position: absolute; left: 24px; top: -14px; background: #0f172a; color: #fff; font-size: 10.5px; font-weight: 800; padding: 3px 8px; border-radius: 8px; white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 1px solid #ffffff; z-index: 100;">
                  ${drawingPoints.length >= 3 ? '🎯 Click to Close Shape' : 'Start Point'}
                </div>
              </div>
            `;

            const firstMarker = L.marker([pt[0], pt[1]], {
              icon: L.divIcon({
                className: 'pen-start-node',
                html: firstNodeHtml,
                iconSize: [0, 0],
              }),
              zIndexOffset: 2000,
            }).addTo(map);

            firstMarker.on('click', (e) => {
              L.DomEvent.stopPropagation(e);
              if (drawingPoints.length >= 3) {
                handleFinishDrawing();
              }
            });

            dRef.firstPointMarker = firstMarker;
          } else {
            const regularNodeHtml = `
              <div style="width: 12px; height: 12px; background: #ffffff; border: 3px solid ${zoneColor}; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.4); transform: translate(-50%, -50%);"></div>
            `;

            const regularMarker = L.marker([pt[0], pt[1]], {
              icon: L.divIcon({
                className: 'pen-regular-node',
                html: regularNodeHtml,
                iconSize: [0, 0],
              }),
              zIndexOffset: 1500,
            }).addTo(map);

            dRef.markers.push(regularMarker);
          }
        });
      }

      // Map click handler to place next point
      const onMapClick = (e) => {
        const newLat = parseFloat(e.latlng.lat.toFixed(6));
        const newLng = parseFloat(e.latlng.lng.toFixed(6));
        setDrawingPoints((prev) => [...prev, [newLat, newLng]]);
      };

      map.on('click', onMapClick);

      return () => {
        map.off('click', onMapClick);
        map.getContainer().style.cursor = '';
      };
    });
  }, [isDrawing, drawingPoints, selectedZone?.color, leafletLoaded, handleFinishDrawing]);

  // Render and Update Delivery Zones
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletLoaded) return;

    import('leaflet').then((module) => {
      const L = module.default;
      const map = mapInstanceRef.current;

      // Clear existing zone layers and edit handles
      Object.values(layersRef.current.zoneLayers).forEach((layer) => {
        if (map.hasLayer(layer)) map.removeLayer(layer);
      });
      layersRef.current.zoneLayers = {};

      layersRef.current.editHandles.forEach((handle) => {
        if (map.hasLayer(handle)) map.removeLayer(handle);
      });
      layersRef.current.editHandles = [];

      const restCenter = [
        restaurantLocation?.lat || 51.5133,
        restaurantLocation?.lng || -0.1362,
      ];

      // Sort zones by radius (largest to smallest) so smaller zones are clickable on top
      const sortedZones = [...zones].sort((a, b) => {
        const radA = a.radiusKm || 0;
        const radB = b.radiusKm || 0;
        return radB - radA;
      });

      sortedZones.forEach((zone) => {
        const isSelected = zone.id === selectedZoneId;
        const zoneColor = zone.color || '#ea580c';
        const isHidden = !!zone.isHidden;

        const baseStyle = {
          color: zoneColor,
          weight: isSelected ? 3.5 : 2.5,
          opacity: isHidden ? 0.4 : isSelected ? 0.95 : 0.8,
          fillColor: zoneColor,
          fillOpacity: isHidden ? 0.05 : isSelected ? 0.22 : 0.12,
          dashArray: isHidden ? '6, 6' : undefined,
        };

        if (zone.zoneType === 'CIRCLE') {
          const center = zone.center
            ? [zone.center.lat, zone.center.lng]
            : restCenter;
          const radiusMeters = (zone.radiusKm || 1.0) * 1000;

          const circleLayer = L.circle(center, {
            ...baseStyle,
            radius: radiusMeters,
          }).addTo(map);

          circleLayer.on('click', () => {
            if (!isDrawing) onSelectZone(zone.id);
          });

          layersRef.current.zoneLayers[zone.id] = circleLayer;

          // If this circle is currently selected, add draggable radius handles + distance tooltip!
          if (isSelected && !isDrawing) {
            // Calculate handle position on the circle circumference (e.g. East or North)
            const centerPt = turf.point([center[1], center[0]]);
            const distanceKm = zone.radiusKm || 1.0;
            const distanceMiles = (distanceKm * 0.621371).toFixed(2);

            // Handle at 45 degrees
            const handleDest = turf.destination(centerPt, distanceKm, 45, {
              units: 'kilometers',
            });
            const handleCoords = [
              handleDest.geometry.coordinates[1],
              handleDest.geometry.coordinates[0],
            ];

            const handleHtml = `
              <div style="position: relative; display: flex; align-items: center; cursor: grab;">
                <div style="width: 16px; height: 16px; background: ${zoneColor}; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.4); transform: translate(-50%, -50%);"></div>
                <div style="position: absolute; left: 14px; top: -16px; background: #ffffff; color: #0f172a; padding: 4px 8px; border-radius: 8px; font-size: 11px; font-weight: 700; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.25); border: 1px solid #e2e8f0; pointer-events: none; z-index: 1000;">
                  <div>${distanceMiles} Miles</div>
                  <div style="color: #64748b; font-size: 9.5px; font-weight: 600;">${distanceKm.toFixed(2)} Kilometers</div>
                </div>
              </div>
            `;

            const handleIcon = L.divIcon({
              className: 'custom-radius-handle',
              html: handleHtml,
              iconSize: [0, 0],
            });

            const radiusHandleMarker = L.marker(handleCoords, {
              icon: handleIcon,
              draggable: true,
              zIndexOffset: 1200,
            }).addTo(map);

            radiusHandleMarker.on('drag', (e) => {
              const newPos = e.target.getLatLng();
              const newDistanceKm =
                map.distance(center, [newPos.lat, newPos.lng]) / 1000;
              const roundedKm = Math.max(0.2, parseFloat(newDistanceKm.toFixed(2)));

              // Live update circle radius visual
              circleLayer.setRadius(roundedKm * 1000);

              // Update tooltip html live
              const miles = (roundedKm * 0.621371).toFixed(2);
              const updatedHtml = `
                <div style="position: relative; display: flex; align-items: center; cursor: grabbing;">
                  <div style="width: 16px; height: 16px; background: ${zoneColor}; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,0,0,0.4); transform: translate(-50%, -50%);"></div>
                  <div style="position: absolute; left: 14px; top: -16px; background: #ffffff; color: #0f172a; padding: 4px 8px; border-radius: 8px; font-size: 11px; font-weight: 700; white-space: nowrap; box-shadow: 0 4px 12px rgba(0,0,0,0.25); border: 1px solid #e2e8f0; pointer-events: none; z-index: 1000;">
                    <div>${miles} Miles</div>
                    <div style="color: #64748b; font-size: 9.5px; font-weight: 600;">${roundedKm.toFixed(2)} Kilometers</div>
                  </div>
                </div>
              `;
              radiusHandleMarker.setIcon(
                L.divIcon({
                  className: 'custom-radius-handle',
                  html: updatedHtml,
                  iconSize: [0, 0],
                })
              );
            });

            radiusHandleMarker.on('dragend', (e) => {
              const newPos = e.target.getLatLng();
              const newDistanceKm =
                map.distance(center, [newPos.lat, newPos.lng]) / 1000;
              const roundedKm = Math.max(0.2, parseFloat(newDistanceKm.toFixed(2)));
              onUpdateZone(zone.id, { radiusKm: roundedKm });
            });

            layersRef.current.editHandles.push(radiusHandleMarker);
          }
        } else {
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
            // Polygon Shape Layer
            const polygonLayer = L.polygon(polygonCoords, baseStyle).addTo(map);

          polygonLayer.on('click', () => {
            if (!isDrawing) onSelectZone(zone.id);
          });

          layersRef.current.zoneLayers[zone.id] = polygonLayer;

          // If selected, add draggable vertex nodes
          if (isSelected && !isDrawing) {
            const currentPoints = polygonCoords.map((pt) => [pt[0], pt[1]]);

            currentPoints.forEach((point, pointIdx) => {
              const nodeHtml = `
                <div style="width: 14px; height: 14px; background: #ffffff; border: 3px solid ${zoneColor}; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.3); transform: translate(-50%, -50%); cursor: crosshair;"></div>
              `;

              const nodeIcon = L.divIcon({
                className: 'custom-polygon-node',
                html: nodeHtml,
                iconSize: [0, 0],
              });

              const nodeMarker = L.marker([point[0], point[1]], {
                icon: nodeIcon,
                draggable: true,
                zIndexOffset: 1100,
              }).addTo(map);

              nodeMarker.on('drag', (e) => {
                const updatedLatLng = e.target.getLatLng();
                currentPoints[pointIdx] = [updatedLatLng.lat, updatedLatLng.lng];
                polygonLayer.setLatLngs(currentPoints);
              });

              nodeMarker.on('dragend', () => {
                onUpdateZone(zone.id, { polygon: currentPoints });
              });

              // Right click node to remove point (if polygon has more than 3 points)
              nodeMarker.on('contextmenu', (e) => {
                L.DomEvent.stopPropagation(e);
                if (currentPoints.length > 3) {
                  const filtered = currentPoints.filter((_, idx) => idx !== pointIdx);
                  onUpdateZone(zone.id, { polygon: filtered });
                }
              });

              layersRef.current.editHandles.push(nodeMarker);
            });
          }
        }
      }
    });
  });
}, [zones, selectedZoneId, leafletLoaded, restaurantLocation, isDrawing]);

  // Zoom Helpers
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut();
  };

  const handleCenterRestaurant = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(
        [restaurantLocation?.lat || 51.5133, restaurantLocation?.lng || -0.1362],
        14,
        { animate: true }
      );
    }
  };

  // Search Address / London Postcode
  const handleSearchAddress = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    try {
      setSearching(true);
      // Try UK Postcodes API first for fast accurate UK lookup
      const isPostcode = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i.test(
        searchQuery.trim()
      );

      let targetLat = null;
      let targetLng = null;

      if (isPostcode) {
        const clean = searchQuery.trim().replace(/\s+/g, '');
        const res = await fetch(`https://api.postcodes.io/postcodes/${clean}`);
        const data = await res.json();
        if (data.status === 200 && data.result) {
          targetLat = data.result.latitude;
          targetLng = data.result.longitude;
        }
      }

      // Fallback to OSM Nominatim
      if (!targetLat) {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery + ', London, UK'
          )}`
        );
        const data = await res.json();
        if (data && data.length > 0) {
          targetLat = parseFloat(data[0].lat);
          targetLng = parseFloat(data[0].lon);
        }
      }

      if (targetLat && targetLng) {
        mapInstanceRef.current.setView([targetLat, targetLng], 15, {
          animate: true,
        });
      }
    } catch (err) {
      console.error('Geocoding error:', err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[640px] rounded-2xl overflow-hidden shadow-inner border border-slate-700/60 bg-slate-950 flex flex-col">
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full flex-1 z-0" />

      {/* Drawing Pen Tool Banner Overlay */}
      {isDrawing && (
        <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/95 backdrop-blur-md border border-orange-500/50 p-3.5 rounded-2xl shadow-2xl animate-in slide-in-from-top-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white font-bold shadow-md shadow-orange-600/30">
              ✏️
            </div>
            <div>
              <div className="text-xs font-black text-white flex items-center gap-2">
                <span>Pen Tool Active: Drawing Custom Shape</span>
                <span className="bg-orange-500/20 text-orange-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {drawingPoints.length} {drawingPoints.length === 1 ? 'Point' : 'Points'} Placed
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {drawingPoints.length === 0
                  ? 'Click anywhere on the map to place your 1st starting point.'
                  : drawingPoints.length < 3
                  ? 'Click to place at least 3 points around your delivery boundary.'
                  : 'Click on the first pulsing start point or press Finish to complete the shape.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {drawingPoints.length > 0 && (
              <button
                type="button"
                onClick={handleUndoPoint}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Undo Point
              </button>
            )}
            <button
              type="button"
              onClick={handleFinishDrawing}
              disabled={drawingPoints.length < 3}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-40 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              Finish Shape
            </button>
            <button
              type="button"
              onClick={handleCancelDrawing}
              className="px-3 py-1.5 bg-slate-800 hover:bg-red-900/30 text-slate-300 hover:text-red-400 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Floating Top Bar: Search & View Controls */}
      {!isDrawing && (
        <div className="absolute top-3.5 left-3.5 right-3.5 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-10">
          {/* Search */}
          <form
            onSubmit={handleSearchAddress}
            className="pointer-events-auto flex items-center bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-300 p-1.5 w-full sm:w-80 map-search-form"
          >
            <svg
              className="w-4 h-4 text-slate-500 ml-2 mr-2 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search address or postcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-slate-900 placeholder:text-slate-500 focus:outline-none w-full font-medium"
            />
            {searching && (
              <div className="w-3.5 h-3.5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mr-2" />
            )}
          </form>

          {/* Map Controls: Pen Tool Trigger & Satellite Switcher */}
          <div className="pointer-events-auto flex items-center gap-2">
            {selectedZone && selectedZone.zoneType === 'SHAPE' && (
              <button
                type="button"
                onClick={handleStartDrawingMode}
                className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-500 active:bg-orange-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
              >
                <span>✏️ Pen Tool (Draw Shape)</span>
              </button>
            )}

            <div className="flex items-center bg-white rounded-xl shadow-lg border border-slate-300 p-1 map-type-switcher">
              <button
                type="button"
                onClick={() => setMapType('roadmap')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mapType === 'roadmap'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Map
              </button>
              <button
                type="button"
                onClick={() => setMapType('satellite')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  mapType === 'satellite'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Satellite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Left Controls: Zoom & Center */}
      <div className="absolute top-18 left-3.5 flex flex-col gap-2 pointer-events-auto z-10">
        <div className="flex flex-col bg-white rounded-xl shadow-lg border border-slate-300 overflow-hidden map-zoom-controls">
          <button
            type="button"
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className="w-8 h-8 flex items-center justify-center text-slate-800 hover:bg-slate-100 text-base font-bold border-b border-slate-200 transition-colors cursor-pointer"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className="w-8 h-8 flex items-center justify-center text-slate-800 hover:bg-slate-100 text-base font-bold transition-colors cursor-pointer"
          >
            -
          </button>
        </div>

        <button
          type="button"
          onClick={handleCenterRestaurant}
          title="Center on Restaurant"
          className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-lg border border-slate-300 text-orange-500 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </button>
      </div>

      {/* Helper Legend in Bottom Left */}
      <div className="absolute bottom-3 left-3 pointer-events-none z-10 hidden sm:flex items-center gap-2 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] text-slate-300">
        <span className="w-2 h-2 rounded-full bg-orange-500"></span>
        <span>Drag handles to adjust radius or click Pen Tool to draw point-to-point custom delivery zones</span>
      </div>
    </div>
  );
}
