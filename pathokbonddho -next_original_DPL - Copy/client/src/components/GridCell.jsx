import React, { Suspense, lazy } from 'react';
// Lazy load widgets to improve performance
const NewsWidget = lazy(() => import('./widgets/NewsWidget'));
const ImageWidget = lazy(() => import('./widgets/ImageWidget'));
const VideoWidget = lazy(() => import('./widgets/VideoWidget'));
const AdWidget = lazy(() => import('./widgets/AdWidget'));

const GridCell = ({ cell }) => {
    const { contentType, contentId } = cell;

    if (!contentType || contentType === 'text') {
        return null; // Don't render empty text cells
    }

    const renderContent = () => {
        switch (contentType) {
            case 'news':
                return <NewsWidget cell={cell} />;
            case 'image':
                return <ImageWidget cell={cell} />;
            case 'video':
                return <VideoWidget cell={cell} />;
            case 'ad':
                return <AdWidget cell={cell} />;
            default:
                return null;
        }
    };

    return (
        <div className="grid-cell h-100">
            <Suspense fallback={<div className="placeholder-glow"><span className="placeholder w-100" style={{ height: '200px' }}></span></div>}>
                {renderContent()}
            </Suspense>
        </div>
    );
};

export default GridCell;
