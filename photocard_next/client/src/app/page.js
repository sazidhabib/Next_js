'use client';

import React from 'react';
import SectionHeader from '../components/SectionHeader';
import FrameCard from '../components/FrameCard';
import { PlayCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { API_URL } from '../config';

const Home = () => {
  const [recentFrames, setRecentFrames] = React.useState([]);
  const [popularFrames, setPopularFrames] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

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

    const fetchFrames = async () => {
      try {
        // Fetch all frames (assuming API returns sorted by newest, or we reverse)
        // Adjust API params as per actual backend if needed (e.g. ?limit=20)
        const response = await fetch(`${API_URL}/frames`);
        if (response.ok) {
          const data = await response.json();

          let allFrames = [];
          if (Array.isArray(data)) {
            allFrames = data;
          } else if (data.frames && Array.isArray(data.frames)) {
            allFrames = data.frames;
          }

          // Filter for active frames only
          const activeFrames = allFrames.filter(f => f.status === 'active');

          // Recent: Take first 6
          setRecentFrames(activeFrames.slice(0, 6));

          // Popular: Filter by is_popular flag among active frames
          const popular = activeFrames.filter(f => f.is_popular);
          setPopularFrames(popular.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching frames:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
    fetchFrames();
  }, []);

  return (
    <div className="space-y-16 ">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white pt-10 md:pt-20 pb-16">
        <div className="container max-w-[1280px] mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center md:text-left space-y-6">
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-primary text-sm font-semibold mb-2">
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
                <Link href="/all-frames" className="px-8 py-3.5 bg-blue-800 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1">
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
      <section className="container max-w-[1280px] mx-auto px-4">
        <SectionHeader title="সকল ফটো ফ্রেম" subtitle="আমাদের কালেকশন" />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            {recentFrames.map(frame => (
              <FrameCard
                key={frame.id}
                id={frame.id}
                title={frame.title}
                // Map backend fields to component props if needed
                subtitle={frame.category_name}
                image={frame.image_url}
                viewCount={frame.view_count}
                useCount={frame.use_count}
              />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/all-frames" className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-gray-300 text-gray-700 font-bold hover:border-primary hover:text-primary transition-all">
            সকল দেখুন <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Popular Designs Section */}
      <section className="bg-gray-50 py-16">
        <div className="container max-w-[1280px] mx-auto px-4">
          <SectionHeader title="জনপ্রিয় ডিজাইন" subtitle="ট্রেন্ডিং" />

          {loading ? (
            <div className="text-center">লোড হচ্ছে...</div>
          ) : popularFrames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularFrames.map(frame => (
                <FrameCard
                  key={frame.id}
                  id={frame.id}
                  title={frame.title}
                  subtitle={frame.category_name}
                  image={frame.image_url}
                  viewCount={frame.view_count}
                  useCount={frame.use_count}
                />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">কোনো জনপ্রিয় ফ্রেম পাওয়া যায়নি</div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-[#163285] py-20">
        <div className="container max-w-[1280px] mx-auto px-4">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-3xl md:text-6xl font-bold text-white mb-6">
              নিজের ফ্রেম যুক্ত করতে চান?
            </h2>
            <p className="text-green-100 text-xl mb-10 max-w-2xl mx-auto">
              আমাদের সাথে যোগাযোগ করুন এবং আপনার ব্যক্তিগত ডিজাইনটি তৈরি করে নিন।
              সহজ এবং দ্রুততম উপায়ে।
            </p>

            <div className="flex flex-col text-xl sm:flex-row items-start justify-center gap-6">
              <div className="flex flex-col items-start text-white bg-white/10 px-6 py-3 rounded-3xl backdrop-blur-sm w-full sm:w-auto">
                <div className="text-base">হটলাইন নম্বর</div>
                <span className="font-bold mt-1 flex items-center gap-2">
                  <span>📞</span>
                  <span className="text-2xl">{settings.helpline_number}</span>
                </span>
              </div>

              <a
                href={`mailto:${settings.support_email}`}
                className="flex flex-col items-start text-white bg-white/10 px-6 py-3 rounded-3xl backdrop-blur-sm hover:bg-white/20 transition-colors w-full sm:w-auto"
              >
                <div className="text-base">ইমেইল এড্রেস</div>
                <span className="font-bold mt-1 flex items-center gap-2">
                  <span>📧</span>
                  <span className="text-2xl">{settings.support_email}</span>
                </span>
              </a>
            </div>

            <div className="mt-10">
              <Link href="/contact" className="inline-block bg-white text-green-900 font-bold px-10 py-4 rounded-full hover:bg-green-50 transition-transform hover:scale-105 shadow-xl">
                যোগাযোগ করুন
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
