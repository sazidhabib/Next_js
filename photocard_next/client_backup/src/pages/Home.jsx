import React from 'react';
import SectionHeader from '../components/SectionHeader';
import FrameCard from '../components/FrameCard';
import { PlayCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL } from '../config';

const Home = () => {
    // Mock Data for "Recent Frames"
    const recentFrames = [
        { id: 1, title: 'এ.বি.এম. মাজেদুল হাসান', subtitle: 'সদর, বগুড়া', image: null }, // Using placeholder
        { id: 2, title: 'Justice For Hadi', subtitle: 'আমরা ন্যায় বিচার চাই', image: null },
        { id: 3, title: 'এডভোকেট আব্দুল কালাম', subtitle: 'বগুড়া বার সভাপতি নির্বাচনে', image: null },
    ];

    // Mock Data for "Popular Designs"
    const popularFrames = [
        { id: 4, title: '২৬শে মার্চ স্বাধীনতা দিবস', subtitle: '', image: null },
        { id: 5, title: '২১শে ফেব্রুয়ারি', subtitle: '', image: null },
        { id: 6, title: 'ঈদুল ফিতর', subtitle: '', image: null },
    ];

    const [settings, setSettings] = React.useState({
        helpline_number: '01880578893',
        support_email: 'contact@photocardbd.com'
    });

    React.useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch(`${API_URL}/settings`);
                if (response.ok) {
                    const data = await response.json();
                    setSettings({
                        helpline_number: data.helpline_number || '01880578893',
                        support_email: data.support_email || 'contact@photocardbd.com'
                    });
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            }
        };
        fetchSettings();
    }, []);

    return (
        <div className="space-y-16 ">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-green-50 to-white pt-10 md:pt-20 pb-16">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        {/* Left Content */}
                        <div className="flex-1 text-center md:text-left space-y-6">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-background text-primary text-sm font-semibold mb-2">
                                ✨ ২০০০+ ডিজিটাল ফ্রেম
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                                আপনার পছন্দের <br />
                                <span className="text-primary">ফটো ফ্রেম</span> তৈরি করুন
                            </h1>
                            <p className="text-gray-600 text-lg md:max-w-lg mx-auto md:mx-0">
                                মাত্র এক ক্লিকেই আপনার ছবি দিয়ে তৈরি করুন রাজনীতি ও সামাজিক ফটো ফ্রেম।
                            </p>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <Link to="/frames" className="px-8 py-3.5 bg-primary hover:bg-green-700 text-white font-bold rounded-lg shadow-lg shadow-green-200 transition-all transform hover:-translate-y-1">
                                    তৈরি করুন
                                </Link>
                                <button className="px-8 py-3.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2">
                                    <PlayCircle size={20} className="text-primary" />
                                    কাজের নিয়ম
                                </button>
                            </div>
                        </div>

                        {/* Right Content - Hero Image Placeholder */}
                        <div className="flex-1 relative">
                            {/* Decorative background shape */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-green-500/10 rounded-full blur-3xl -z-10"></div>

                            <div className="relative z-10 bg-gradient-to-br from-green-600 to-green-800 rounded-3xl p-1 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="bg-white rounded-[20px] overflow-hidden aspect-video flex items-center justify-center relative">
                                    {/* Mocking the Hero Frame Design */}
                                    <div className="w-full h-full bg-[#1a4d2e] relative overflow-hidden flex items-center justify-center">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#22c55e] rounded-bl-full opacity-20"></div>
                                        <div className="text-center text-white p-6">
                                            <div className="w-40 h-40 mx-auto bg-white/20 rounded-full border-4 border-white/40 mb-4 backdrop-blur-sm"></div>
                                            <h3 className="text-2xl font-bold mb-2">ইনসাফের প্রতীক</h3>
                                            <div className="inline-block bg-red-600 text-white px-3 py-1 rounded font-bold">দাঁড়িপাল্লা</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent/All Frames Section */}
            <section className="container mx-auto px-4">
                <SectionHeader title="সকল ফটো ফ্রেম" subtitle="আমাদের কালেকশন" />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
                    {recentFrames.map(frame => (
                        <FrameCard key={frame.id} {...frame} />
                    ))}
                </div>

                {/* Second row / mock more */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {/* Reusing for visual density */}
                    {recentFrames.map((frame) => (
                        <FrameCard key={`dup-${frame.id}`} {...frame} title={`${frame.title} (Copy)`} />
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link to="/frames" className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-gray-300 text-gray-700 font-bold hover:border-primary hover:text-primary transition-all">
                        সকল দেখুন <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* Popular Designs Section */}
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto px-4">
                    <SectionHeader title="জনপ্রিয় ডিজাইন" subtitle="ট্রেন্ডিং" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {popularFrames.map(frame => (
                            <FrameCard key={frame.id} {...frame} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative overflow-hidden bg-[#163285] py-20">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
                    <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        নিজের ফ্রেম যুক্ত করতে চান?
                    </h2>
                    <p className="text-green-100 text-lg mb-10 max-w-2xl mx-auto">
                        আমাদের সাথে যোগাযোগ করুন এবং আপনার ব্যক্তিগত ডিজাইনটি তৈরি করে নিন।
                        সহজ এবং দ্রুততম উপায়ে।
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <div className="flex items-center gap-2 text-white bg-white/10 px-6 py-3 rounded-lg backdrop-blur-sm">
                            <span className="font-bold">📞 {settings.helpline_number}</span>
                        </div>
                        <a href={`mailto:${settings.support_email}`} className="flex items-center gap-2 text-white bg-white/10 px-6 py-3 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-colors">
                            <span>📧 {settings.support_email}</span>
                        </a>
                    </div>

                    <div className="mt-10">
                        <Link to="/contact" className="inline-block bg-white text-green-900 font-bold px-10 py-4 rounded-full hover:bg-green-50 transition-transform hover:scale-105 shadow-xl">
                            যোগাযোগ করুন
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
