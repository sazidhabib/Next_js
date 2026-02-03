'use client';
import React, { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { MapPin, Phone, Mail, Send, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ContactPage = () => {
    const { settings } = useSettings();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [sending, setSending] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);

        // Simulate form submission for now (replace with actual API call later)
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success('আপনার বার্তা পাঠানো হয়েছে!');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setSending(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4 shadow-sm">
            <div className="container mx-auto max-w-6xl">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-slate-800 mb-4">যোগাযোগ করুন</h1>
                    <p className="text-slate-600 max-w-2xl mx-auto">
                        আপনার কোনো প্রশ্ন বা মতামত থাকলে আমাদের জানান। আমরা দ্রুততম সময়ে আপনার সাথে যোগাযোগ করার চেষ্টা করবো।
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800 mb-6">যোগাযোগের তথ্য</h3>
                            <div className="space-y-6">
                                {settings.address_text && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-primary shrink-0">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-800">ঠিকানা</h4>
                                            <p className="text-slate-600 mt-1">{settings.address_text}</p>
                                        </div>
                                    </div>
                                )}

                                {settings.helpline_number && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-primary shrink-0">
                                            <Phone size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-800">ফোন</h4>
                                            <p className="text-slate-600 mt-1">{settings.helpline_number}</p>
                                        </div>
                                    </div>
                                )}

                                {settings.support_email && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-primary shrink-0">
                                            <Mail size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-800">ইমেইল</h4>
                                            <p className="text-slate-600 mt-1">{settings.support_email}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Map or secondary info could go here */}
                        <div className="bg-gradient-to-br from-primary to-blue-800 p-8 rounded-2xl text-white shadow-lg">
                            <h3 className="text-xl font-bold mb-4">সরাসরি কথা বলতে চান?</h3>
                            <p className="text-blue-100 mb-6">
                                আমাদের হটলাইন নাম্বারে কল করুন সকাল ১০টা থেকে রাত ৮টা পর্যন্ত।
                            </p>
                            <a
                                href={`tel:${settings.helpline_number}`}
                                className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors"
                            >
                                <Phone size={20} />
                                কল করুন
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="text-xl font-bold text-slate-800 mb-6">বার্তা পাঠান</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">আপনার নাম</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full text-gray-500 px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="সম্পূর্ণ নাম"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">ইমেইল ঠিকানা</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full text-gray-500 px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        placeholder="example@mail.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">বিষয়</label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full text-gray-500 px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    placeholder="কি বিষয়ে জানতে চান?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">বার্তা</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full text-gray-500 px-4 py-3 rounded-lg border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                    placeholder="আপনার বার্তা লিখুন..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full bg-primary hover:bg-blue-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-200"
                            >
                                {sending ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        পাঠানো হচ্ছে...
                                    </>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        বার্তা পাঠান
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
