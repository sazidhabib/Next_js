import React from 'react';
import { ArrowRight, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const FrameCard = ({
    id,
    title,
    subtitle,
    image,
    categoryBadge,
    viewCount,
    useCount
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 group">
            <div className="relative aspect-[4/3] overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                {categoryBadge && (
                    <div className="absolute top-2 right-2 z-10">
                        <img src={categoryBadge} alt="badge" className="w-8 h-8" />
                    </div>
                )}

                {/* Stats Badge - Download Only */}
                <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
                    {(useCount !== undefined) && (
                        <div className="bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-gray-600 shadow-sm border border-gray-100 flex flex-col gap-0.5">
                            <span title="Uses">⬇️ {useCount || 0}</span>
                        </div>
                    )}
                </div>

                {/* Frame Image Container - Scaling effect on hover */}
                <div className="relative w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                    {image ? (
                        <img src={image} alt={title} className="max-w-full max-h-full object-contain" />
                    ) : (
                        <div className="w-32 h-32 rounded-full border-4 border-green-600 border-dashed flex items-center justify-center bg-gray-100 text-gray-400">
                            Frame
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 text-center">
                <h3 className="font-bold text-gray-800 text-lg mb-1">{title}</h3>

                {/* View Count */}
                <div className="flex items-center justify-center gap-1 text-red-500 font-bold text-sm mb-2">
                    <Eye size={16} /> {viewCount || 0} ভিউ
                </div>

                {subtitle && <p className="text-xs text-gray-500 mb-3">{subtitle}</p>}

                <Link
                    to={`/frame/${id}`}
                    className="w-full mt-2 py-2 px-4 rounded-lg bg-white border border-green-600 text-green-700 font-medium hover:bg-green-50 transition-colors flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white"
                >
                    ফ্রেম তৈরি করুন
                    <ArrowRight size={16} />
                </Link>
            </div>
        </div>
    );
};

export default FrameCard;
