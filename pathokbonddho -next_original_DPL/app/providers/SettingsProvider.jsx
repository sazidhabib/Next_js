'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/app/lib/api';

const SettingsContext = createContext();

const DEFAULT_SETTINGS = {
    siteName: 'Pathokbonddho',
    siteNameBn: 'পাঠকবন্ধু',
    logo: '/images/Logo.png',
    favicon: '/favicon.ico',
    footerDescription: 'সত্য, বস্তুনিষ্ঠ ও নিরপেক্ষ সংবাদ পরিবেশনে অঙ্গীকারবদ্ধ। দেশ-বিদেশের সর্বশেষ খবর, রাজনীতি, অর্থনীতি, খেলাধুলা ও বিনোদনের সকল খবর সবার আগে জানতে আমাদের সাথেই থাকুন।',
    contact: {
        email: 'info@pathokbonddho.com',
        phone: '+880 1XXX-XXXXXX',
        address: 'Dhaka, Bangladesh'
    },
    social: {
        facebook: 'https://facebook.com/pathokbonddho',
        twitter: 'https://twitter.com/pathokbonddho',
        instagram: 'https://instagram.com/pathokbonddho',
        linkedin: 'https://linkedin.com/company/pathokbonddho',
        youtube: 'https://youtube.com/pathokbonddho'
    },
    enableConfetti: true
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [refreshCount, setRefreshCount] = useState(0);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const res = await api.get('/designs', { params: { search: 'site-settings' } });
            const designs = res.data.designs || res.data || [];
            const siteSettings = designs.find(d => d.slug === 'site-settings');

            if (siteSettings) {
                const data = typeof siteSettings.design_data === 'string'
                    ? JSON.parse(siteSettings.design_data)
                    : siteSettings.design_data;
                
                // Merge with defaults
                const mergedSettings = {
                    ...DEFAULT_SETTINGS,
                    ...data,
                    contact: { ...DEFAULT_SETTINGS.contact, ...(data.contact || {}) },
                    social: { ...DEFAULT_SETTINGS.social, ...(data.social || {}) }
                };
                
                setSettings(mergedSettings);
                // Trigger a refresh count change to signal dependents
                setRefreshCount(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, loading, fetchSettings, refreshCount }}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);