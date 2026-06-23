"use client";
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

const PhotocardGenerator = () => {
    const [imageSrc, setImageSrc] = useState(null);
    const [name, setName] = useState('');
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    // Default placeholder frame (a simple border with a transparent center)
    // Replace this with your actual transparent PNG frame path, e.g., '/images/frame.png'
    const frameSrc = '/pathokcard.png';

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImageSrc(imageUrl);
            setScale(1);
            setPosition({ x: 0, y: 0 });
        }
    };

    // Dragging Logic
    const handleMouseDown = (e) => {
        if (!imageSrc) return;
        setIsDragging(true);
        setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        setPosition({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Touch support for mobile dragging
    const handleTouchStart = (e) => {
        if (!imageSrc) return;
        setIsDragging(true);
        const touch = e.touches[0];
        setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    };

    const handleTouchMove = (e) => {
        if (!isDragging) return;
        // Prevent scrolling while dragging
        e.preventDefault();
        const touch = e.touches[0];
        setPosition({
            x: touch.clientX - dragStart.x,
            y: touch.clientY - dragStart.y
        });
    };

    const handleDownload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Assuming a standard square photocard ratio (1080x1080)
        const canvasWidth = 1080;
        const canvasHeight = 1080;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Draw background (white)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const drawFrameAndSave = () => {
            const frameImg = new window.Image();
            frameImg.crossOrigin = 'anonymous';

            frameImg.onload = () => {
                // Draw frame
                ctx.drawImage(frameImg, 0, 0, canvasWidth, canvasHeight);

                // Draw Text
                ctx.fillStyle = '#ffffff'; // White text
                ctx.font = 'bold 52px "Hind Siliguri", sans-serif'; // Matched to preview size (1.2rem)
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                // Position text near the bottom (adjust Y coordinate as needed based on your frame)
                ctx.fillText(name || 'আপনার নাম', canvasWidth / 2, canvasHeight * 0.87);

                // Export
                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `photocard-${name || 'download'}.png`;
                link.href = dataUrl;
                link.click();
            };

            // If the user hasn't added a frame yet, we just draw the text and user image
            frameImg.onerror = () => {
                console.warn('Frame image not found. Drawing without frame.');
                ctx.fillStyle = '#ffffff';
                ctx.font = 'bold 52px "Hind Siliguri", sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';
                ctx.fillText(name || 'আপনার নাম', canvasWidth / 2, canvasHeight * 0.86);

                const dataUrl = canvas.toDataURL('image/png');
                const link = document.createElement('a');
                link.download = `photocard-${name || 'download'}.png`;
                link.href = dataUrl;
                link.click();
            };

            frameImg.src = frameSrc;
        };

        if (imageSrc) {
            const userImg = new window.Image();
            userImg.crossOrigin = 'anonymous';
            userImg.onload = () => {
                // Calculate scaling and positioning for the canvas
                // We map the UI scale and position to the canvas size
                // The preview box is typically smaller than the actual canvas
                const container = containerRef.current;
                if (!container) return;

                const ratio = canvasWidth / container.clientWidth;

                // Calculate dimensions
                const imgWidth = userImg.width;
                const imgHeight = userImg.height;

                // Calculate cover sizing for initial fit (like object-fit: cover)
                const containerRatio = container.clientWidth / container.clientHeight;
                const imgRatio = imgWidth / imgHeight;

                let baseDrawWidth, baseDrawHeight;
                if (imgRatio > containerRatio) {
                    baseDrawHeight = canvasHeight;
                    baseDrawWidth = canvasHeight * imgRatio;
                } else {
                    baseDrawWidth = canvasWidth;
                    baseDrawHeight = canvasWidth / imgRatio;
                }

                // Apply user scale
                const finalDrawWidth = baseDrawWidth * scale;
                const finalDrawHeight = baseDrawHeight * scale;

                // Center point calculation + user drag position
                const centerX = (canvasWidth - finalDrawWidth) / 2;
                const centerY = (canvasHeight - finalDrawHeight) / 2;

                const finalX = centerX + (position.x * ratio);
                const finalY = centerY + (position.y * ratio);

                // Draw user image
                ctx.drawImage(userImg, finalX, finalY, finalDrawWidth, finalDrawHeight);

                // Proceed to draw frame on top
                drawFrameAndSave();
            };
            userImg.src = imageSrc;
        } else {
            drawFrameAndSave();
        }
    };

    return (
        <div className="photocard-container p-4 max-w-6xl mx-auto my-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <style jsx>{`
                .preview-box {
                    width: 100%;
                    max-width: 400px;
                    aspect-ratio: 1/1;
                    background-color: #ffffffff;
                    position: relative;
                    overflow: hidden;
                    border-radius: 5px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                    margin: 0 auto;
                    cursor: grab;
                    touch-action: none;
                }
                .preview-box:active {
                    cursor: grabbing;
                }
                .user-image {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transform-origin: center center;
                }
                .frame-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none; /* Let clicks pass through to image for dragging */
                    z-index: 10;
                    /* Temporary placeholder style in case frame image is missing */
                    border: 5px solid #006a60; 
                    box-sizing: border-box;
                }
                .frame-image {
                    width: 100%;
                    height: 100%;
                    object-fit: contain; /* Changed from contain to cover to remove top/bottom blank spaces */
                }
                .name-overlay {
                    position: absolute;
                    bottom: 12%;
                    left: 0;
                    width: 100%;
                    text-align: center;
                    color: white;
                    font-size: 1.2rem;
                    font-weight: bold;
                    z-index: 20;
                    pointer-events: none;
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                }
                .controls {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    background: white;
                    padding: 30px;
                    border-radius: 12px;
                    box-shadow: 0 5px 20px rgba(0,0,0,0.05);
                }
                .control-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .control-group label {
                    font-weight: 600;
                    color: #333;
                }
                .form-control, .form-range {
                    width: 100%;
                }
                .btn-download {
                    background: linear-gradient(135deg, #006a60, #60efbbff);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 1.1rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: transform 0.2s, box-shadow 0.2s;
                }
                .btn-download:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 198, 255, 0.4);
                }
            `}</style>

            {/* Left Column: Preview Area */}
            <div className="preview-section d-flex flex-column align-items-center justify-content-center">
                <div
                    className="preview-box"
                    ref={containerRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleMouseUp}
                >
                    {/* 1. User Uploaded Image (Bottom Layer) */}
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt="User upload"
                            className="user-image"
                            style={{
                                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`
                            }}
                            draggable="false"
                        />
                    ) : (
                        <div className="d-flex h-100 align-items-center justify-content-center text-muted text-center p-4">
                            আপনার ছবি আপলোড করুন
                        </div>
                    )}

                    {/* 2. Default Frame Overlay (Middle Layer) */}
                    <div className="frame-overlay">
                        <img
                            src={frameSrc}
                            alt=""
                            className="frame-image"
                            draggable="false"
                            onError={(e) => e.target.style.display = 'none'} // Hide if missing
                        />
                    </div>

                    {/* 3. User Name Overlay (Top Layer) */}
                    <div className="name-overlay">
                        {name || 'আপনার নাম'}
                    </div>
                </div>
                <p className="text-muted mt-3 text-center small">
                    <i className="bi bi-arrows-move me-1"></i> ছবিটি টেনে সঠিক স্থানে বসান
                </p>
            </div>

            {/* Right Column: Controls */}
            <div className="controls">
                <h3 className="mb-3 text-success font-weight-bold">ফটোকার্ড তৈরি করুন</h3>

                <div className="control-group">
                    <label>১. ছবি আপলোড করুন</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="form-control"
                    />
                </div>

                <div className="control-group">
                    <label>২. আপনার নাম লিখুন</label>
                    <input
                        type="text"
                        placeholder="আপনার নাম"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                    />
                </div>

                <div className="control-group">
                    <label>৩. ছবি ছোট/বড় করুন (Scale)</label>
                    <input
                        type="range"
                        min="0.5"
                        max="3"
                        step="0.05"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="form-range"
                        disabled={!imageSrc}
                    />
                </div>

                <div className="mt-4">
                    <button
                        onClick={handleDownload}
                        className="btn btn-download w-100 shadow"
                    >
                        <i className="bi bi-download me-2"></i> ফটোকার্ড ডাউনলোড করুন
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PhotocardGenerator;
