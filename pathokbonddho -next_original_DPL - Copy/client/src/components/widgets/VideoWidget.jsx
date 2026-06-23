import React, { useState, useEffect } from 'react';
import axios from 'axios';


const VideoWidget = ({ cell }) => {
    const [videoData, setVideoData] = useState(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    // Try to extract YouTube video ID from URL
    const getYoutubeId = (url) => {
        if (!url) return null;
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&\n?#]+)/);
        return match ? match[1] : null;
    };

    const youtubeId = getYoutubeId(cell.contentId);

    if (!cell.contentId) return null;

    if (youtubeId) {
        return (
            <div className="video-widget h-100" style={{ position: 'relative' }}>
                <div style={{
                    position: 'relative',
                    paddingBottom: '56.25%',
                    height: 0,
                    overflow: 'hidden',
                    borderRadius: '8px',
                }}>
                    <iframe
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        title={cell.contentTitle || 'Video'}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                        }}
                    />
                </div>
                {cell.contentTitle && (
                    <div className="mt-2">
                        <h6 className="mb-0 small fw-bold">{cell.contentTitle}</h6>
                    </div>
                )}
            </div>
        );
    }

    // Fallback for non-YouTube videos
    return (
        <div className="video-widget h-100 bg-dark text-white d-flex flex-column align-items-center justify-content-center rounded" style={{ minHeight: '200px' }}>
            <span style={{ fontSize: '2rem' }}>🎥</span>
            <p className="small mt-2 mb-0">{cell.contentTitle || 'Video'}</p>
        </div>
    );
};

export default VideoWidget;
