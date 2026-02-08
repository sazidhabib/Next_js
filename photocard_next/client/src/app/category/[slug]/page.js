'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import SectionHeader from '../../../components/SectionHeader';
import FrameCard from '../../../components/FrameCard';
import { API_URL } from '../../../config';

export default function CategoryPage() {
    const { slug } = useParams();
    const [frames, setFrames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Frames
                const framesRes = await fetch(`${API_URL}/frames`);
                if (framesRes.ok) {
                    const allFrames = await framesRes.json();
                    const filteredFrames = allFrames.filter(f => f.category_slug === slug && f.status === 'active');
                    setFrames(filteredFrames);
                }

                // Fetch Category Name for Header
                const catRes = await fetch(`${API_URL}/categories`);
                if (catRes.ok) {
                    const allCats = await catRes.json();
                    const currentCat = allCats.find(c => c.slug === slug);
                    if (currentCat) setCategoryName(currentCat.name);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchData();
    }, [slug]);

    if (loading) return <div className="text-center py-20 text-gray-500">লোড হচ্ছে...</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-10 pb-20">
            <div className="container mx-auto px-4">
                <SectionHeader
                    title={categoryName || "ক্যাটাগরি"}
                    subtitle={`এই ক্যাটাগরির সকল ফ্রেম দেখুন`}
                />

                {frames.length === 0 ? (
                    <div className="text-center py-20 text-gray-500 bg-white rounded-xl">এই ক্যাটাগরিতে কোনো ফ্রেম পাওয়া যায়নি</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {frames.map(frame => (
                            <FrameCard
                                key={frame.id}
                                id={frame.id}
                                title={frame.title}
                                description={frame.description}
                                subtitle={frame.category_name}
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
