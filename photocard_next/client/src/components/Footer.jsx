'use client';
import React from 'react';
import Link from 'next/link';
import { Facebook, Youtube, Globe, MapPin, Phone, Mail } from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import Image from 'next/image';

const Footer = () => {
    const { settings } = useSettings();

    return (
        <footer className="bg-[#0f172a] text-white pt-12 pb-6">
            <div className="container max-w-[1280px] mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand & Description */}
                    <div>
                        <div className="text-xl font-bold text-white flex items-center gap-2 mb-4">
                            {settings.logo_url ? (
                                <Image
                                    src={settings.logo_url}
                                    alt={settings.site_name}
                                    width={40}
                                    height={40}
                                    className="h-10 w-auto"
                                />
                            ) : (
                                <>
                                    <span className="text-2xl">📷</span> {settings.site_name}
                                </>
                            )}
                        </div>
                        <p className="text-gray-400 text-sm md:text-xl leading-relaxed mb-6">
                            {settings.site_description || 'বাংলাদেশের যেকোনো জাতীয় দিবস বা বিশেষ দিনে নিজের ছবি দিয়ে সবাইকে শুভেচ্ছা জানানোর জন্য ডিজিটাল কার্ড তৈরি করুন খুব সহজে।'}
                        </p>
                        <div className="flex space-x-4">
                            {settings.facebook_url && settings.facebook_url !== '#' && (
                                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                                    <Facebook size={24} />
                                </a>
                            )}
                            {settings.youtube_url && settings.youtube_url !== '#' && (
                                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                                    <Youtube size={24} />
                                </a>
                            )}
                            {settings.website_url && settings.website_url !== '#' && (
                                <a href={settings.website_url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                                    <Globe size={24} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="text-sm md:text-xl">
                        <h3 className="text-white font-semibold mb-4 border-b border-gray-700 pb-2 inline-block">প্রয়োজনীয় লিংক</h3>
                        <ul className="space-y-2  text-gray-400">
                            <li><Link href="/" className="hover:text-primary transition-colors">হোম পেজ</Link></li>
                            <li><Link href="/all-frames" className="hover:text-primary transition-colors">সকল ফ্রেম</Link></li>
                            <li><Link href="/dashboard" className="hover:text-primary transition-colors">ড্যাশবোর্ড</Link></li>
                            <li><Link href="/add-frame" className="hover:text-primary transition-colors">ফ্রেম যুক্ত করুন</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="text-sm md:text-xl">
                        <h3 className="text-white font-semibold mb-4 border-b border-gray-700 pb-2 inline-block">যোগাযোগ করুন</h3>
                        <ul className="space-y-3  text-gray-400">
                            {settings.helpline_number && (
                                <li className="flex items-start gap-3">
                                    <Phone size={24} className="text-primary mt-1" />
                                    <div>
                                        <span className="block font-medium text-gray-300">হটলাইন:</span>
                                        {settings.helpline_number}
                                    </div>
                                </li>
                            )}
                            {settings.support_email && (
                                <li className="flex items-start gap-3">
                                    <Mail size={24} className="text-primary mt-1" />
                                    <div>
                                        <span className="block font-medium text-gray-300">ইমেইল:</span>
                                        {settings.support_email}
                                    </div>
                                </li>
                            )}
                            {settings.address_text && (
                                <li className="flex items-start gap-3">
                                    <MapPin size={24} className="text-primary mt-1" />
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
                    <p>{settings.footer_text || '© 2026 Photo Card BD. All rights reserved. Developed by Sazid.js Dev'}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
