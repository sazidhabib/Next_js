import React from 'react';
import { ArrowRight, Eye } from 'lucide-react';
import Link from 'next/link';
import { toHttps } from '../utils/imageUtils';

const FrameCard = ({
    id,
    title,
    description,
    subtitle,
    image,
    categoryBadge,
    viewCount,
    useCount
}) => {
    return (
        <Link
            href={`/frame/${id}`}
            className="block bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 group"
        >
            <div className="relative aspect-[3/3] overflow-hidden bg-gray-50 p-4">
                {categoryBadge && (
                    <div className="absolute top-2 right-2 z-10">
                        <img src={categoryBadge} alt="badge" className="w-8 h-8" />
                    </div>
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 z-20">
                    {subtitle && (
                        <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            {subtitle}
                        </span>
                    )}

                    <div className="bg-primary text-white px-4 py-2 rounded-lg font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75 flex items-center gap-2">
                        ফ্রেম তৈরি করুন
                        <ArrowRight size={16} />
                    </div>
                </div>

                {/* Image wrapper */}
                <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                    {image ? (
                        <img src={toHttps(image)} alt={title} className="max-w-full max-h-full object-contain pointer-events-none" />
                    ) : (
                        <div className="w-32 h-32 rounded-full border-4 border-green-600 border-dashed flex items-center justify-center bg-gray-100 text-gray-400">
                            Frame
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 text-center relative z-20 bg-white">
                <div className="block">
                    <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-primary transition-colors">{title}</h3>
                    {description && <p className="text-xs text-gray-500 line-clamp-2">{description}</p>}
                </div>
            </div>
        </Link>
    );
};

export default FrameCard;
