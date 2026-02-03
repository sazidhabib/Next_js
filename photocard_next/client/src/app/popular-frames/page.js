'use client';

import React, { useState, useEffect } from 'react';
import SectionHeader from '../../components/SectionHeader';
import FrameCard from '../../components/FrameCard';
import { API_URL } from '../../config';

export default function PopularFramesPage() {
    const [frames, setFrames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPopularFrames = async () => {
            try {
                const response = await fetch(`${API_URL}/frames`);
                if (response.ok) {
                    const data = await response.json();

                    let allFrames = [];
                    if (Array.isArray(data)) {
                        allFrames = data;
                    } else if (data.frames && Array.isArray(data.frames)) {
                        allFrames = data.frames;
                    }

                    // Filter only popular AND active frames
                    const popular = allFrames.filter(frame => frame.is_popular && frame.status === 'active');
                    setFrames(popular);
                }
            } catch (error) {
                console.error('Error fetching popular frames:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPopularFrames();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-10 pb-20">
            <div className="container mx-auto px-4">
                <SectionHeader title="জনপ্রিয় ফ্রেম" subtitle="সবাই যা পছন্দ করছে" />

                {loading ? (
                    <div className="text-center py-20 text-gray-500">লোড হচ্ছে...</div>
                ) : frames.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">কোনো জনপ্রিয় ফ্রেম পাওয়া যায়নি</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {frames.map(frame => (
                            <FrameCard
                                key={frame.id}
                                id={frame.id}
                                title={frame.title}
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
