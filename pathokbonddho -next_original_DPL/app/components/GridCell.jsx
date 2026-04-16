"use client";
import React from 'react';
import NewsWidget from './widgets/NewsWidget';
import ImageWidget from './widgets/ImageWidget';
import VideoWidget from './widgets/VideoWidget';
import AdWidget from './widgets/AdWidget';

const GridCell = ({ cell, isPriority }) => {
    const { contentType } = cell;

    if (!contentType || contentType === 'text') {
        return null;
    }

    const renderContent = () => {
        switch (contentType) {
            case 'news':
                return <NewsWidget cell={cell} isPriority={isPriority} />;
            case 'image':
                return <ImageWidget cell={cell} isPriority={isPriority} />;
            case 'video':
                return <VideoWidget cell={cell} />;
            case 'ads':
            case 'ad':
                return <AdWidget cell={cell} isPriority={isPriority} />;
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
