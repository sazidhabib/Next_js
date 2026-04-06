'use client';

import { useEffect } from 'react';
import { useSettings } from './SettingsProvider';

export function FaviconUpdater() {
    const { settings, loading, refreshCount } = useSettings();

    useEffect(() => {
        // Wait for settings to load
        if (loading || !settings) {
            console.log('FaviconUpdater: Waiting for settings to load...');
            return;
        }

        const faviconPath = settings?.favicon;
        console.log('FaviconUpdater: Checking favicon. Path:', faviconPath, 'RefreshCount:', refreshCount);

        if (!faviconPath) {
            console.log('FaviconUpdater: No favicon path in settings, using default');
            setDefaultFavicon();
            return;
        }

        // Skip if it's a data URL (old format that won't work)
        if (typeof faviconPath === 'string' && faviconPath.startsWith('data:')) {
            console.log('FaviconUpdater: Favicon is a data URL, using default');
            setDefaultFavicon();
            return;
        }

        console.log('FaviconUpdater: Setting favicon to:', faviconPath);
        setFavicon(faviconPath);

    }, [settings?.favicon, loading, refreshCount]);

    const setFavicon = (path) => {
        if (!path || typeof path !== 'string') {
            console.warn('FaviconUpdater: Invalid favicon path:', path);
            return;
        }

        // Update main favicon link (rel="icon")
        let mainLink = document.querySelector('link[rel="icon"]');
        if (!mainLink) {
            mainLink = document.createElement('link');
            mainLink.rel = 'icon';
            document.head.appendChild(mainLink);
            console.log('FaviconUpdater: Created new favicon link');
        }

        const isIco = path.toLowerCase().endsWith('.ico');
        mainLink.type = isIco ? 'image/x-icon' : 'image/png';

        // Set href with cache busting to force refresh
        const newHref = `${path}?time=${Date.now()}`;
        mainLink.href = newHref;
        console.log('FaviconUpdater: Updated main favicon link to:', newHref);

        // Also update shortcut icon for maximum compatibility
        let shortcutLink = document.querySelector('link[rel="shortcut icon"]');
        if (!shortcutLink) {
            shortcutLink = document.createElement('link');
            shortcutLink.rel = 'shortcut icon';
            document.head.appendChild(shortcutLink);
        }
        shortcutLink.type = isIco ? 'image/x-icon' : 'image/png';
        shortcutLink.href = newHref;
        console.log('FaviconUpdater: Updated shortcut favicon link to:', newHref);
    };

    const setDefaultFavicon = () => {
        // Update favicon links to use default
        const mainLink = document.querySelector('link[rel="icon"]');
        if (mainLink) {
            mainLink.href = '/favicon.ico?time=' + Date.now();
            console.log('FaviconUpdater: Reset to default /favicon.ico');
        }

        const shortcutLink = document.querySelector('link[rel="shortcut icon"]');
        if (shortcutLink) {
            shortcutLink.href = '/favicon.ico?time=' + Date.now();
        }
    };

    return null;
}
