import React from 'react';
import SectionHeader from '../components/SectionHeader';
import FrameCard from '../components/FrameCard';

const PopularFrames = () => {
    // Mock Data
    const popularFrames = [
        { id: 1, title: '২৬শে মার্চ স্বাধীনতা দিবস', subtitle: 'জনপ্রিয়', image: null },
        { id: 2, title: '২১শে ফেব্রুয়ারি', subtitle: 'মাতৃভাষা দিবস', image: null },
        { id: 3, title: 'ঈদুল ফিতর', subtitle: 'ঈদ মোবারক', image: null },
        { id: 4, title: 'শুভ নববর্ষ', subtitle: '১৪৩১', image: null },
        { id: 5, title: 'জাতীয় শোক দিবস', subtitle: 'শ্রদ্ধাঞ্জলি', image: null },
        { id: 6, title: 'বিজয় দিবস', subtitle: '১৬ই ডিসেম্বর', image: null },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-10 pb-20">
            <div className="container mx-auto px-4">
                <SectionHeader title="জনপ্রিয় ফ্রেম" subtitle="সবাই যা পছন্দ করছে" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {popularFrames.map(frame => (
                        <FrameCard key={frame.id} {...frame} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PopularFrames;
