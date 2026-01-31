import { useState, useEffect } from 'react';
import { API_URL } from '../config';

export const useSettings = () => {
    const [settings, setSettings] = useState({
        site_name: 'ফটো কার্ড বিডি',
        logo_url: null,
        favicon_url: null,
        helpline_number: '01880578893',
        support_email: 'contact@photocardbd.com'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${API_URL}/settings`);
                if (response.ok) {
                    const data = await response.json();
                    setSettings({
                        site_name: data.site_name || 'ফটো কার্ড বিডি',
                        logo_url: data.logo_url,
                        favicon_url: data.favicon_url,
                        helpline_number: data.helpline_number || '01880578893',
                        support_email: data.support_email || 'contact@photocardbd.com'
                    });

                    // Update favicon dynamically
                    if (data.favicon_url) {
                        const favicon = document.querySelector("link[rel*='icon']") || document.createElement('link');
                        favicon.type = 'image/x-icon';
                        favicon.rel = 'shortcut icon';
                        favicon.href = data.favicon_url;
                        document.getElementsByTagName('head')[0].appendChild(favicon);
                    }

                    // Update page title
                    if (data.site_name) {
                        document.title = data.site_name;
                    }
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    return { settings, loading };
};
