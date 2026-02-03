'use client';
import React from 'react';
import { Link2, Facebook, Share2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Custom WhatsApp Icon Component since Lucide might not have it or for specific styling
const WhatsAppIcon = ({ size = 20, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
        <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
    </svg>
);

const ShareButtons = ({ url, title }) => {

    // Copy Link Handler
    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(url);
            toast.success('লিংক কপি হয়েছে!');
        } catch (err) {
            toast.error('লিংক কপি করা যায়নি');
            console.error('Failed to copy: ', err);
        }
    };

    // Social Share Handlers
    const handleFacebookShare = () => {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(fbUrl, '_blank', 'width=600,height=400');
    };

    const handleWhatsAppShare = () => {
        const waUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
        window.open(waUrl, '_blank');
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: 'একটি সুন্দর ফটো কার্ড তৈরি করুন!',
                    url: url,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            handleCopyLink(); // Fallback
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 text-center">
            <h3 className="text-slate-500 font-medium mb-4">বন্ধুদের সাথে শেয়ার করুন</h3>

            <div className="flex items-center justify-center gap-4">
                {/* Copy Link */}
                <button
                    onClick={handleCopyLink}
                    className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                    title="লিংক কপি করুন"
                >
                    <Link2 size={20} />
                </button>

                {/* Facebook */}
                <button
                    onClick={handleFacebookShare}
                    className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors"
                    title="ফেসবুকে শেয়ার করুন"
                >
                    <Facebook size={20} />
                </button>

                {/* WhatsApp */}
                <button
                    onClick={handleWhatsAppShare}
                    className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 hover:bg-green-100 transition-colors"
                    title=" হোয়াটসঅ্যাপে শেয়ার করুন"
                >
                    <WhatsAppIcon size={20} />
                </button>

                {/* Native Share */}
                <button
                    onClick={handleNativeShare}
                    className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 hover:bg-orange-100 transition-colors"
                    title="অন্যান্য মাধ্যমে শেয়ার করুন"
                >
                    <Share2 size={20} />
                </button>
            </div>
        </div>
    );
};

export default ShareButtons;
