"use client";
import React from 'react';
import NewsWidget from './widgets/NewsWidget';
import ImageWidget from './widgets/ImageWidget';
import VideoWidget from './widgets/VideoWidget';
import AdWidget from './widgets/AdWidget';

const GridCell = ({ cell }) => {
    const { contentType } = cell;

    if (!contentType || contentType === 'text') {
        return null;
    }

    const renderContent = () => {
        switch (contentType) {
            case 'news':
                return <NewsWidget cell={cell} />;
            case 'image':
                return <ImageWidget cell={cell} />;
            case 'video':
                return <VideoWidget cell={cell} />;
            case 'ads':
            case 'ad':
                return <AdWidget cell={cell} />;
            default:
                return null;
        }
    };

    return (
        <div className="grid-cell h-100">
            {renderContent()}
        </div>
    );
};

export default GridCell;
