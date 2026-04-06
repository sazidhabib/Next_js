"use client";
import React, { useState, useEffect } from 'react';
import api from '@/app/lib/api';
import Image from 'next/image';

const ImageWidget = ({ cell }) => {
    const [imageData, setImageData] = useState(cell.resolvedContent || null);
    const [loading, setLoading] = useState(!cell.resolvedContent);
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        // Skip fetching if content is already resolved by the server
        if (cell.resolvedContent) {
            setImageData(cell.resolvedContent);
            setLoading(false);
            return;
        }

        const fetchImage = async () => {
            if (!cell.contentId) {
                setLoading(false);
                return;
            }
            try {
                const response = await api.get(`/photos/${cell.contentId}`);
                setImageData(response.data);
            } catch (err) {
                console.error('Error fetching image widget data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchImage();
    }, [cell.contentId, cell.resolvedContent, API_BASE_URL]);

    if (loading && !imageData) return <div className="h-100 w-100 bg-light animate-pulse"></div>;

    const imageUrl = imageData?.imageUrl 
        ? (imageData.imageUrl.startsWith('http') ? imageData.imageUrl : `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000'}/${imageData.imageUrl.replace(/^\//, '')}`)
        : (cell.contentId && (cell.contentId.startsWith('http') || cell.contentId.startsWith('/')) ? cell.contentId : null);

    if (!imageUrl) return null;

    return (
        <div className="image-widget h-100 position-relative border-0 rounded overflow-hidden" style={{ minHeight: '200px' }}>
            <Image
                src={imageUrl}
                alt={imageData?.title || cell.title || "Image content"}
                fill
                className="object-fit-cover rounded group-hover-scale transition-all"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={cell.rowSpan > 1 || cell.colSpan > 1}
            />
            {(imageData?.title || cell.title) && (
                <div className="position-absolute bottom-0 start-0 end-0 p-2 bg-gradient-dark text-white small font-bangla">
                    {imageData?.title || cell.title}
                </div>
            )}
        </div>
    );
};

export default ImageWidget;
