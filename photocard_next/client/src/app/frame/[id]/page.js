import React from 'react';
import { API_URL } from '../../../config';
import FrameDetailsClient from './FrameDetailsClient';

export async function generateMetadata({ params }) {
    const { id } = await params;

    try {
        const response = await fetch(`${API_URL}/frames/${id}`);
        if (!response.ok) {
            return {
                title: 'Frame Not Found - Photo frame BD',
            };
        }

        const frame = await response.json();

        return {
            title: `${frame.title} - Photo frame BD`,
            description: frame.description || `Create your own version of ${frame.title} photo frame in just one click.`,
            openGraph: {
                title: `${frame.title} - Photo frame BD`,
                description: frame.description || `Create your own version of ${frame.title} photo frame in just one click.`,
                url: `https://photoframe.nextideasolution.com/frame/${id}`,
                siteName: 'Photo frame BD',
                images: [
                    {
                        url: frame.image_url,
                        width: 1200,
                        height: 630,
                    },
                ],
                locale: 'bn_BD',
                type: 'article',
            },
            twitter: {
                card: 'summary_large_image',
                title: `${frame.title} - Photo frame BD`,
                description: frame.description || `Create your own version of ${frame.title} photo frame in just one click.`,
                images: [frame.image_url],
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Photo frame BD',
        };
    }
}

export default async function FramePage({ params }) {
    const { id } = await params;

    // Fetch initial frame data to pass to client component (improves hydration/LCP)
    let initialFrame = null;
    try {
        const response = await fetch(`${API_URL}/frames/${id}`);
        if (response.ok) {
            initialFrame = await response.json();
        }
    } catch (error) {
        console.error('Error fetching initial frame:', error);
    }

    return <FrameDetailsClient initialFrame={initialFrame} />;
}
