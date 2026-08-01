"use client";
import { useEffect, useRef } from "react";

export default function MapPicker({ latitude, longitude, onChange }) {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const mapInstanceRef = useRef(null);

    const latRef = useRef(latitude);
    const lngRef = useRef(longitude);

    useEffect(() => {
        latRef.current = latitude;
        lngRef.current = longitude;
    }, [latitude, longitude]);

    useEffect(() => {
        // Load Leaflet CSS and JS dynamically if not already loaded
        const linkId = "leaflet-css";
        if (!document.getElementById(linkId)) {
            const link = document.createElement("link");
            link.id = linkId;
            link.rel = "stylesheet";
            link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
            document.head.appendChild(link);
        }

        const initMap = () => {
            const L = window.L;
            if (!L || !mapRef.current || mapInstanceRef.current) return;

            // Default center is Dhaka if no coordinates provided
            const initialLat = parseFloat(latRef.current) || 23.8103;
            const initialLng = parseFloat(lngRef.current) || 90.4125;

            const map = L.map(mapRef.current).setView([initialLat, initialLng], 13);
            mapInstanceRef.current = map;

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);
            markerRef.current = marker;

            marker.on("dragend", () => {
                const position = marker.getLatLng();
                onChange(position.lat.toFixed(6), position.lng.toFixed(6));
            });

            map.on("click", (e) => {
                const { lat, lng } = e.latlng;
                marker.setLatLng([lat, lng]);
                onChange(lat.toFixed(6), lng.toFixed(6));
            });
        };

        if (!window.L) {
            const script = document.createElement("script");
            script.id = "leaflet-js";
            script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
            script.onload = initMap;
            document.body.appendChild(script);
        } else {
            // Give time for container element to mount properly
            const timer = setTimeout(() => {
                initMap();
            }, 100);
            return () => clearTimeout(timer);
        }

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Effect to update marker if lat/lng props change externally
    useEffect(() => {
        const L = window.L;
        if (L && mapInstanceRef.current && markerRef.current && latitude && longitude) {
            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
                markerRef.current.setLatLng([lat, lng]);
                mapInstanceRef.current.panTo([lat, lng]);
            }
        }
    }, [latitude, longitude]);

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-foreground block">Location Map (Click map or drag marker to set coordinates)</label>
            <div ref={mapRef} className="w-full h-[300px] rounded-lg border border-border z-0" />
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-muted-foreground">Latitude</label>
                    <input
                        type="text"
                        value={latitude || ""}
                        readOnly
                        placeholder="e.g. 23.8103"
                        className="w-full p-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none"
                    />
                </div>
                <div>
                    <label className="text-xs text-muted-foreground">Longitude</label>
                    <input
                        type="text"
                        value={longitude || ""}
                        readOnly
                        placeholder="e.g. 90.4125"
                        className="w-full p-3 bg-background border border-border rounded-lg text-sm text-foreground focus:outline-none"
                    />
                </div>
            </div>
        </div>
    );
}
