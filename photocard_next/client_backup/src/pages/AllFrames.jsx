import React, { useState, useEffect } from 'react';
import SectionHeader from '../components/SectionHeader';
import FrameCard from '../components/FrameCard';
import { Search, Filter } from 'lucide-react';
import { API_URL } from '../config';

const AllFrames = () => {
    const [frames, setFrames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchFrames = async () => {
            try {
                const response = await fetch(`${API_URL}/frames`);
                const data = await response.json();
                if (response.ok) {
                    setFrames(data);
                }
            } catch (error) {
                console.error('Error fetching frames:', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/categories`);
                if (response.ok) {
                    const data = await response.json();
                    setCategories(['All', ...data.map(c => c.name)]);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchFrames();
        fetchCategories();
    }, []);

    const filteredFrames = frames.filter(frame => {
        const matchesSearch = frame.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || frame.category_name === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gray-50 py-10 pb-20">
            <div className="container mx-auto px-4">
                <SectionHeader title="সকল ফটো ফ্রেম" subtitle="আমাদের বিশাল কালেকশন থেকে আপনার পছন্দেরটি বেছে নিন" />

                {/* Search and Filter Bar */}
                <div className="bg-white p-4 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:max-w-md">
                        <input
                            type="text"
                            placeholder="ফ্রেম খুঁজুন..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>

                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                        {categories.map((cat, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">লোড হচ্ছে...</div>
                ) : filteredFrames.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">কোনো ফ্রেম পাওয়া যায়নি</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredFrames.map(frame => (
                            <FrameCard key={frame.id} id={frame.id} title={frame.title} subtitle={frame.category_name || 'General'} image={frame.image_url} viewCount={frame.view_count} useCount={frame.use_count} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllFrames;
