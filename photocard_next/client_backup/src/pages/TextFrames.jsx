import React from 'react';
import SectionHeader from '../components/SectionHeader';
import FrameCard from '../components/FrameCard';

const TextFrames = () => {
    // Mock Data for Text Frames
    const textFrames = [
        { id: 1, title: 'উক্তি - ১', subtitle: 'অনুপ্রেরণামূলক', image: null },
        { id: 2, title: 'উক্তি - ২', subtitle: 'ভালোবাসা', image: null },
        { id: 3, title: 'উক্তি - ৩', subtitle: 'বন্ধুত্ব', image: null },
        { id: 4, title: 'বাণী চিরন্তনী', subtitle: 'হুমায়ূন আহমেদ', image: null },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-10 pb-20">
            <div className="container mx-auto px-4">
                <SectionHeader title="টেক্সট ফ্রেম গ্যালারি" subtitle="নাম ও পদবী লেখার জন্য আপনার পছন্দের ফ্রেমটি বেছে নিন" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {textFrames.map(frame => (
                        <FrameCard key={frame.id} {...frame} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TextFrames;
