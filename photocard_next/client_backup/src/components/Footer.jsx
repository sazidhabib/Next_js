import React, { useState, useEffect } from 'react';
import { Facebook, Youtube, Globe, MapPin, Phone, Mail } from 'lucide-react';
import { API_URL } from '../config';

const Footer = () => {
    const [settings, setSettings] = useState({
        site_name: 'ফটো কার্ড বিডি',
        site_description: 'বাংলাদেশের যেকোনো জাতীয় দিবস বা বিশেষ দিনে নিজের ছবি দিয়ে সবাইকে শুভেচ্ছা জানানোর জন্য ডিজিটাল কার্ড তৈরি করুন খুব সহজে।',
        helpline_number: '01880578893',
        support_email: 'contact@photocardbd.com',
        address_text: 'মিরপুর, ঢাকা, বাংলাদেশ - ১২১৬',
        facebook_url: '#',
        youtube_url: '#',
        website_url: '#',
        footer_text: '© 2026 Photo Card BD. All rights reserved. Developed by Sazid.js Dev'
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${API_URL}/settings`);
                if (response.ok) {
                    const data = await response.json();
                    setSettings({
                        site_name: data.site_name || 'ফটো কার্ড বিডি',
                        site_description: data.site_description || 'বাংলাদেশের যেকোনো জাতীয় দিবস বা বিশেষ দিনে নিজের ছবি দিয়ে সবাইকে শুভেচ্ছা জানানোর জন্য ডিজিটাল কার্ড তৈরি করুন খুব সহজে।',
                        helpline_number: data.helpline_number || '01880578893',
                        support_email: data.support_email || 'contact@photocardbd.com',
                        address_text: data.address_text || 'মিরপুর, ঢাকা, বাংলাদেশ - ১২১৬',
                        facebook_url: data.facebook_url || '#',
                        youtube_url: data.youtube_url || '#',
                        website_url: data.website_url || '#',
                        footer_text: data.footer_text || '© 2026 Photo Card BD. All rights reserved. Developed by Sazid.js Dev'
                    });
                }
            } catch (error) {
                console.error('Error fetching footer settings:', error);
            }
        };
        fetchSettings();
    }, []);

    return (
        <footer className="bg-[#0f172a] text-white pt-12 pb-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand & Description */}
                    <div>
                        <div className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                            <span className="text-2xl">📷</span> {settings.site_name}
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6">
                            {settings.site_description}
                        </p>
                        <div className="flex space-x-4">
                            {settings.facebook_url && settings.facebook_url !== '#' && (
                                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                                    <Facebook size={16} />
                                </a>
                            )}
                            {settings.youtube_url && settings.youtube_url !== '#' && (
                                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                                    <Youtube size={16} />
                                </a>
                            )}
                            {settings.website_url && settings.website_url !== '#' && (
                                <a href={settings.website_url} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                                    <Globe size={16} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 border-b border-gray-700 pb-2 inline-block">প্রয়োজনীয় লিংক</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="/" className="hover:text-primary transition-colors">হোম পেজ</a></li>
                            <li><a href="/all-frames" className="hover:text-primary transition-colors">সকল ফ্রেম</a></li>
                            <li><a href="/dashboard" className="hover:text-primary transition-colors">ড্যাশবোর্ড</a></li>
                            <li><a href="/add-frame" className="hover:text-primary transition-colors">ফ্রেম যুক্ত করুন</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 border-b border-gray-700 pb-2 inline-block">যোগাযোগ করুন</h3>
                        <ul className="space-y-3 text-sm text-gray-400">
                            {settings.helpline_number && (
                                <li className="flex items-start gap-3">
                                    <Phone size={16} className="text-primary mt-1" />
                                    <div>
                                        <span className="block font-medium text-gray-300">হটলাইন:</span>
                                        {settings.helpline_number}
                                    </div>
                                </li>
                            )}
                            {settings.support_email && (
                                <li className="flex items-start gap-3">
                                    <Mail size={16} className="text-primary mt-1" />
                                    <div>
                                        <span className="block font-medium text-gray-300">ইমেইল:</span>
                                        {settings.support_email}
                                    </div>
                                </li>
                            )}
                            {settings.address_text && (
                                <li className="flex items-start gap-3">
                                    <MapPin size={16} className="text-primary mt-1" />
                                    <div>
                                        <span className="block font-medium text-gray-300">ঠিকানা:</span>
                                        {settings.address_text}
                                    </div>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-6 text-center text-xs text-gray-500">
                    <p>{settings.footer_text}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
