import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v1/videos`;

const YouTubeGallery = () => {
    const [videos, setVideos] = useState([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const playerRef = useRef(null);

    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Fetch videos from backend
    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await axios.get(API_URL);
                if (res.data.success) {
                    setVideos(res.data.data);
                } else {
                    console.error("Invalid video response format.");
                }
            } catch (error) {
                console.error("Error fetching videos:", error);
            }
        };
        fetchVideos();
    }, []);

    // Load YouTube IFrame API
    useEffect(() => {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);

        window.onYouTubeIframeAPIReady = () => {
            const firstVideoId = getYouTubeId(videos[0]?.src);
            if (firstVideoId) {
                playerRef.current = new window.YT.Player('youtube-player', {
                    height: '390',
                    width: '640',
                    videoId: firstVideoId,
                    playerVars: {
                        autoplay: 0,
                        controls: 1,
                        modestbranding: 1,
                        rel: 0
                    },
                    events: {
                        onReady: () => setIsPlayerReady(true),
                        onStateChange: () => { }
                    }
                });
            }
        };

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, [videos]);

    // Load selected video into player
    useEffect(() => {
        if (isPlayerReady && videos.length > 0) {
            const videoId = getYouTubeId(videos[currentVideoIndex]?.src);
            if (videoId && playerRef.current?.loadVideoById) {
                playerRef.current.loadVideoById(videoId);
            }
        }
    }, [currentVideoIndex, isPlayerReady]);

    const selectVideo = (index) => {
        setCurrentVideoIndex(index);
    };

    const currentVideo = videos[currentVideoIndex] || {};

    return (
        <div className="youtube-gallery py-5 px-2">
            <h2>Video Gallery</h2>

            <div className="main-video-container">
                <div id="youtube-player"></div>
                <div className="video-info">
                    <h3>{currentVideo.title}</h3>
                    <p>{currentVideo.description}</p>
                </div>
            </div>

            <div className="thumbnail-grid">
                {videos.map((video, index) => {
                    const videoId = getYouTubeId(video.src);
                    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;

                    return (
                        <div
                            key={video._id || index}
                            className={`thumbnail ${index === currentVideoIndex ? 'active' : ''}`}
                            onClick={() => selectVideo(index)}
                        >
                            <img src={thumbnailUrl} alt={video.title} />
                            <div className="thumbnail-overlay">
                                <span>{video.title}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default YouTubeGallery;
