import React, { useState, useEffect } from 'react';
import { Save, Lock, Globe, Upload, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../../config';

const Settings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [siteTitle, setSiteTitle] = useState('');
    const [supportEmail, setSupportEmail] = useState('');
    const [helplineNumber, setHelplineNumber] = useState('');
    const [footerText, setFooterText] = useState('');
    const [logoFile, setLogoFile] = useState(null);
    const [faviconFile, setFaviconFile] = useState(null);
    const [currentLogoUrl, setCurrentLogoUrl] = useState('');
    const [currentFaviconUrl, setCurrentFaviconUrl] = useState('');

    // Password change state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);

    // Footer fields
    const [siteDescription, setSiteDescription] = useState('');
    const [facebookUrl, setFacebookUrl] = useState('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [addressText, setAddressText] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch(`${API_URL}/settings`);
            if (response.ok) {
                const data = await response.json();
                setSiteTitle(data.site_name || '');
                setSupportEmail(data.support_email || '');
                setHelplineNumber(data.helpline_number || '');
                setFooterText(data.footer_text || '');
                setCurrentLogoUrl(data.logo_url || '');
                setCurrentFaviconUrl(data.favicon_url || '');
                setSiteDescription(data.site_description || '');
                setFacebookUrl(data.facebook_url || '');
                setYoutubeUrl(data.youtube_url || '');
                setWebsiteUrl(data.website_url || '');
                setAddressText(data.address_text || '');
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('সেটিংস লোড করতে সমস্যা হয়েছে');
        } finally {
            setLoading(false);
        }
    };

    const handleLogoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setLogoFile(e.target.files[0]);
        }
    };

    const handleFaviconChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFaviconFile(e.target.files[0]);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        const loadingToast = toast.loading('সেটিংস সেভ হচ্ছে...');

        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();

            formData.append('site_title', siteTitle);
            formData.append('support_email', supportEmail);
            formData.append('helpline_number', helplineNumber);
            formData.append('footer_text', footerText);
            formData.append('site_description', siteDescription);
            formData.append('facebook_url', facebookUrl);
            formData.append('youtube_url', youtubeUrl);
            formData.append('website_url', websiteUrl);
            formData.append('address_text', addressText);

            if (logoFile) {
                formData.append('logo', logoFile);
            }
            if (faviconFile) {
                formData.append('favicon', faviconFile);
            }

            const response = await fetch(`${API_URL}/settings`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                toast.success('সেটিংস সফলভাবে সেভ হয়েছে', { id: loadingToast });

                // Update current URLs if new files were uploaded
                if (data.settings) {
                    setCurrentLogoUrl(data.settings.logo_url || currentLogoUrl);
                    setCurrentFaviconUrl(data.settings.favicon_url || currentFaviconUrl);
                }

                // Clear file inputs
                setLogoFile(null);
                setFaviconFile(null);
            } else {
                const errorData = await response.json();
                console.error('Settings save failed:', errorData);
                toast.error(`সেটিংস সেভ করতে ব্যর্থ হয়েছে: ${errorData.message || 'Unknown error'}`, { id: loadingToast });
            }
        } catch (error) {
            console.error('Settings save error:', error);
            toast.error('সার্ভার সমস্যা', { id: loadingToast });
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('নতুন পাসওয়ার্ড মিলছে না');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
            return;
        }

        setChangingPassword(true);
        const loadingToast = toast.loading('পাসওয়ার্ড পরিবর্তন হচ্ছে...');

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/users/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            if (response.ok) {
                toast.success('পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে', { id: loadingToast });
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                const data = await response.json();
                toast.error(data.message || 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে', { id: loadingToast });
            }
        } catch (error) {
            console.error(error);
            toast.error('সার্ভার সমস্যা', { id: loadingToast });
        } finally {
            setChangingPassword(false);
        }
    };

    if (loading) return <div className="text-center py-20">লোড হচ্ছে...</div>;

    return (
        <div className="max-w-4xl space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">সেটিংস</h1>

            <form onSubmit={handleSave} className="space-y-8">

                {/* Branding Settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <ImageIcon className="text-primary" size={24} />
                        <h2 className="text-lg font-bold text-gray-800">ব্র্যান্ডিং</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">ওয়েবসাইট লোগো</label>
                            {currentLogoUrl && (
                                <div className="mb-2">
                                    <img src={currentLogoUrl} alt="Current Logo" className="h-16 object-contain border p-2 rounded" />
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                            />
                            {logoFile && <p className="text-xs text-green-600">নতুন লোগো নির্বাচিত: {logoFile.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">ফেভিকন</label>
                            {currentFaviconUrl && (
                                <div className="mb-2">
                                    <img src={currentFaviconUrl} alt="Current Favicon" className="h-8 object-contain border p-1 rounded" />
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFaviconChange}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
                            />
                            {faviconFile && <p className="text-xs text-green-600">নতুন ফেভিকন নির্বাচিত: {faviconFile.name}</p>}
                        </div>
                    </div>
                </div>

                {/* General Settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <Globe className="text-primary" size={24} />
                        <h2 className="text-lg font-bold text-gray-800">সাধারণ সেটিংস</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">ওয়েবসাইট টাইটেল</label>
                            <input
                                type="text"
                                value={siteTitle}
                                onChange={(e) => setSiteTitle(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">সাপোর্ট ইমেইল</label>
                            <input
                                type="email"
                                value={supportEmail}
                                onChange={(e) => setSupportEmail(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">হেল্পলাইন নম্বর</label>
                            <input
                                type="text"
                                value={helplineNumber}
                                onChange={(e) => setHelplineNumber(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">ফুটার টেক্সট</label>
                            <input
                                type="text"
                                value={footerText}
                                onChange={(e) => setFooterText(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <Globe className="text-primary" size={24} />
                        <h2 className="text-lg font-bold text-gray-800">ফুটার সেটিংস</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">সাইট বিবরণ</label>
                            <textarea
                                value={siteDescription}
                                onChange={(e) => setSiteDescription(e.target.value)}
                                rows="3"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                placeholder="ওয়েবসাইট সম্পর্কে সংক্ষিপ্ত বিবরণ..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Facebook URL</label>
                                <input
                                    type="url"
                                    value={facebookUrl}
                                    onChange={(e) => setFacebookUrl(e.target.value)}
                                    placeholder="https://facebook.com/..."
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">YouTube URL</label>
                                <input
                                    type="url"
                                    value={youtubeUrl}
                                    onChange={(e) => setYoutubeUrl(e.target.value)}
                                    placeholder="https://youtube.com/..."
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Website URL</label>
                                <input
                                    type="url"
                                    value={websiteUrl}
                                    onChange={(e) => setWebsiteUrl(e.target.value)}
                                    placeholder="https://..."
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">ঠিকানা</label>
                            <input
                                type="text"
                                value={addressText}
                                onChange={(e) => setAddressText(e.target.value)}
                                placeholder="মিরপুর, ঢাকা, বাংলাদেশ - ১২১৬"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save size={20} />
                        {saving ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
                    </button>
                </div>
            </form>

            {/* Password Change */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                    <Lock className="text-primary" size={24} />
                    <h2 className="text-lg font-bold text-gray-800">পাসওয়ার্ড পরিবর্তন</h2>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">বর্তমান পাসওয়ার্ড</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="********"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">নতুন পাসওয়ার্ড</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="********"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">পাসওয়ার্ড নিশ্চিত করুন</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="********"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={changingPassword || !currentPassword || !newPassword || !confirmPassword}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {changingPassword ? 'পরিবর্তন হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
