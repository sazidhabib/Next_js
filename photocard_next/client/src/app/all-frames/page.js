'use client';

import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/SectionHeader';
import FrameCard from '../../components/FrameCard';
import { Search } from 'lucide-react';
import { API_URL } from '../../config';

export default function AllFramesPage() {
    const [frames, setFrames] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedParent, setSelectedParent] = useState('all');
    const [selectedSub, setSelectedSub] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [framesRes, catsRes] = await Promise.all([
                    fetch(`${API_URL}/frames`),
                    fetch(`${API_URL}/categories`)
                ]);

                if (framesRes.ok) {
                    const allFrames = await framesRes.json();
                    setFrames(allFrames.filter(f => f.status === 'active'));
                }
                if (catsRes.ok) {
                    setCategories(await catsRes.json());
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Derived State for Categories
    const parentCategories = categories.filter(c => !c.parent_id);
    const subCategories = selectedParent && selectedParent !== 'all'
        ? categories.filter(c => c.parent_id === selectedParent)
        : [];

    // Filter Logic
    const filteredFrames = frames.filter(frame => {
        // 1. Search Filter
        const matchesSearch = frame.title.toLowerCase().includes(searchTerm.toLowerCase());

        // 2. Category Filter
        let matchesCategory = true;

        if (selectedSub !== 'all') {
            // If specific sub-category selected, match exactly
            matchesCategory = frame.category_id === selectedSub;
        } else if (selectedParent !== 'all') {
            // If only parent selected, match parent OR any of its children
            // Find all child IDs of the selected parent
            const childIds = categories
                .filter(c => c.parent_id === selectedParent)
                .map(c => c.id);

            // Match if frame belongs to parent directly OR one of its children
            matchesCategory = frame.category_id === selectedParent || childIds.includes(frame.category_id);
        }

        return matchesSearch && matchesCategory;
    });

    // Handler to reset sub-category when parent changes
    const handleParentChange = (parentId) => {
        setSelectedParent(parentId);
        setSelectedSub('all');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 pb-20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-center text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">সকল ফটো ফ্রেম</h1>
                    <p className="text-gray-600">আমাদের বিশাল কালেকশন থেকে আপনার পছন্দেরটি বেছে নিন</p>
                </div>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto mb-8 relative">
                    <input
                        type="text"
                        placeholder="ফ্রেমের নাম লিখে খুঁজুন..."
                        className="w-full pl-5 pr-12 py-3.5 rounded-full border border-gray-200 shadow-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 text-gray-700 placeholder-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-700 p-2 rounded-full text-white cursor-pointer hover:bg-green-800 transition">
                        <Search size={20} />
                    </div>
                </div>

                {/* Categories & Filters */}
                <div className="flex flex-col items-center gap-4 mb-10">

                    {/* Parent Categories (Tabs) */}
                    <div className="flex flex-wrap justify-center gap-3">
                        <button
                            onClick={() => handleParentChange('all')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all
                                ${selectedParent === 'all'
                                    ? 'bg-white shadow-md text-green-700 border-green-100 ring-1 ring-green-500/20'
                                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
                            সব ফ্রেম
                        </button>

                        {parentCategories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => handleParentChange(cat.id)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all
                                    ${selectedParent === cat.id
                                        ? 'bg-green-700 text-white shadow-lg shadow-green-700/20'
                                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                            >
                                {/* Icons can be dynamic if we had them, for now standard icon or none */}
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Sub Categories (Pills) - Only if parent selected has children */}
                    {subCategories.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <button
                                onClick={() => setSelectedSub('all')}
                                className={`px-4 py-1.5 rounded-full text-sm transition-colors
                                    ${selectedSub === 'all'
                                        ? 'bg-green-100 text-green-700 font-medium'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                সব
                            </button>
                            {subCategories.map(sub => (
                                <button
                                    key={sub.id}
                                    onClick={() => setSelectedSub(sub.id)}
                                    className={`px-4 py-1.5 rounded-full text-sm transition-colors
                                        ${selectedSub === sub.id
                                            ? 'bg-green-100 text-green-700 font-medium'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                >
                                    {sub.name}
                                </button>
                            ))}
                        </div>
                    )}

                </div>

                {/* Frames Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500">লোড হচ্ছে...</p>
                    </div>
                ) : filteredFrames.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-medium text-gray-800 mb-2">কোনো ফ্রেম পাওয়া যায়নি</h3>
                        <p className="text-gray-500">অন্য কোনো ক্যাটাগরি বা কিওয়ার্ড দিয়ে চেষ্টা করুন</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredFrames.map(frame => (
                            <FrameCard
                                key={frame.id}
                                id={frame.id}
                                title={frame.title}
                                description={frame.description}
                                subtitle={frame.category_name || 'General'}
                                image={frame.image_url}
                                viewCount={frame.view_count}
                                useCount={frame.use_count}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
