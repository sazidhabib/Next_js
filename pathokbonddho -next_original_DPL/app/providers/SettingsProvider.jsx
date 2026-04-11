'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/app/lib/api';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(null);
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
                console.log('Settings fetched:', data);
                setSettings(data);
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