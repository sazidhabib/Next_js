"use client";
import { useEffect, useRef } from "react";

export default function MapViewer({ latitude, longitude, title }) {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        if (!latitude || !longitude) return;

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

            const lat = parseFloat(latitude);
            const lng = parseFloat(longitude);

            const map = L.map(mapRef.current).setView([lat, lng], 15);
            mapInstanceRef.current = map;

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            const marker = L.marker([lat, lng]).addTo(map);
            if (title) {
                marker.bindPopup(`<b>${title}</b>`).openPopup();
            }
        };

        if (!window.L) {
            const script = document.createElement("script");
            script.id = "leaflet-js";
            script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
            script.onload = initMap;
            document.body.appendChild(script);
        } else {
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
    }, [latitude, longitude, title]);

    if (!latitude || !longitude) {
        return (
            <div className="w-full h-[400px] bg-secondary/20 border border-border flex items-center justify-center text-muted-foreground">
                <p>Location coordinates are not specified for this project.</p>
            </div>
        );
    }

    return (
        <div ref={mapRef} className="w-full h-[400px] rounded-lg border border-border z-0" />
    );
}
