"use client";
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import api from '@/app/lib/api';

const PhotocardGenerator = ({
    hideName = false,
    frameImage = '/pathokcard.png',
    nameBottom = '12%',
    nameCanvasY = 0.87,
    hideShare = false,
    placeholderTop = '50%',
    cardTypeText = 'ফটোকার্ড',
    requireValidation = false,
    redirectUrl = '',
    redirectDelayMs = 3000
}) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [name, setName] = useState('');
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [imageRatio, setImageRatio] = useState(1);
    const [isSharing, setIsSharing] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const containerRef = useRef(null);

    // Default placeholder frame (a simple border with a transparent center)
    // Replace this with your actual transparent PNG frame path, e.g., '/images/frame.png'
    const frameSrc = frameImage;

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setImageSrc(imageUrl);
            setScale(1);
            setPosition({ x: 0, y: 0 });
            setImageRatio(1);
        }
    };

    const handleImageLoad = (e) => {
        const { naturalWidth, naturalHeight } = e.target;
        if (naturalWidth && naturalHeight) {
            setImageRatio(naturalWidth / naturalHeight);
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
        if (isDownloading) return;

        // Validation checks
        if (requireValidation) {
            if (!imageSrc) {
                alert('দয়া করে আপনার একটি ছবি নির্বাচন করুন।');
                return;
            }
            if (!hideName && !name.trim()) {
                alert('দয়া করে আপনার নাম লিখুন।');
                return;
            }
        }

        setIsDownloading(true);

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

        const executeDownload = (dataUrl) => {
            const link = document.createElement('a');
            const filenamePrefix = cardTypeText === 'প্রোফাইল কার্ড' ? 'profilecard' : 'photocard';
            link.download = `${filenamePrefix}-${name || 'download'}.png`;
            link.href = dataUrl;
            link.click();

            setShowSuccessModal(true);

            if (redirectUrl) {
                setTimeout(() => {
                    window.location.href = redirectUrl;
                }, redirectDelayMs);
            } else {
                setIsDownloading(false);
                setTimeout(() => {
                    setShowSuccessModal(false);
                }, 3000);
            }
        };

        const drawFrameAndSave = () => {
            const frameImg = new window.Image();
            frameImg.crossOrigin = 'anonymous';

            frameImg.onload = () => {
                // Draw frame
                ctx.drawImage(frameImg, 0, 0, canvasWidth, canvasHeight);

                // Draw Text
                if (!hideName) {
                    ctx.fillStyle = '#ffffff'; // White text
                    ctx.font = 'bold 52px "Hind Siliguri", sans-serif'; // Matched to preview size (1.2rem)
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';

                    // Position text near the bottom (adjust Y coordinate as needed based on your frame)
                    ctx.fillText(name || 'আপনার নাম', canvasWidth / 2, canvasHeight * nameCanvasY);
                }

                // Export and save
                executeDownload(canvas.toDataURL('image/png'));
            };

            // If the user hasn't added a frame yet, we just draw the text and user image
            frameImg.onerror = () => {
                console.warn('Frame image not found. Drawing without frame.');
                if (!hideName) {
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 52px "Hind Siliguri", sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillText(name || 'আপনার নাম', canvasWidth / 2, canvasHeight * (nameCanvasY - 0.01));
                }

                executeDownload(canvas.toDataURL('image/png'));
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
                if (!container) {
                    setIsDownloading(false);
                    return;
                }

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
            userImg.onerror = () => {
                console.error('Failed to load user image.');
                setIsDownloading(false);
            };
            userImg.src = imageSrc;
        } else {
            drawFrameAndSave();
        }
    };

    const handleFacebookShare = () => {
        if (isSharing) return;
        setIsSharing(true);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const canvasWidth = 1080;
        const canvasHeight = 1080;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Draw background (white)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const uploadAndShare = () => {
            const frameImg = new window.Image();
            frameImg.crossOrigin = 'anonymous';

            const proceedWithUpload = async () => {
                try {
                    // Export canvas as base64 data URL
                    const dataUrl = canvas.toDataURL('image/png');

                    // Upload to server
                    const response = await api.post('/public/photocard', { image: dataUrl });
                    const imageUrl = response.data.url;

                    // Construct share page URL
                    const sharePageUrl = `${window.location.origin}/photocard/share?img=${imageUrl}&name=${encodeURIComponent(name || 'ফটোকার্ড')}`;

                    // Open Facebook sharer
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(sharePageUrl)}`, '_blank');
                } catch (error) {
                    console.error('Error sharing photocard:', error);
                    alert('ফেসবুকে শেয়ার করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।');
                } finally {
                    setIsSharing(false);
                }
            };

            frameImg.onload = () => {
                // Draw frame
                ctx.drawImage(frameImg, 0, 0, canvasWidth, canvasHeight);

                // Draw Name inside the card area
                if (!hideName) {
                    ctx.fillStyle = '#ffffff'; // White text
                    ctx.font = 'bold 52px "Hind Siliguri", sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillText(name || 'আপনার নাম', canvasWidth / 2, canvasHeight * nameCanvasY);
                }

                proceedWithUpload();
            };

            frameImg.onerror = () => {
                console.warn('Frame image not found. Sharing without frame.');
                if (!hideName) {
                    ctx.fillStyle = '#006a60';
                    ctx.font = 'bold 52px "Hind Siliguri", sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    ctx.fillText(name || 'আপনার নাম', canvasWidth / 2, canvasHeight * (nameCanvasY - 0.01));
                }

                proceedWithUpload();
            };

            frameImg.src = frameSrc;
        };

        if (imageSrc) {
            const userImg = new window.Image();
            userImg.crossOrigin = 'anonymous';
            userImg.onload = () => {
                const container = containerRef.current;
                if (!container) {
                    setIsSharing(false);
                    return;
                }

                // Ratio relative to the 1080x1080 canvas
                const ratio = canvasWidth / container.clientWidth;
                const imgWidth = userImg.width;
                const imgHeight = userImg.height;

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

                const finalDrawWidth = baseDrawWidth * scale;
                const finalDrawHeight = baseDrawHeight * scale;

                const centerX = (canvasWidth - finalDrawWidth) / 2;
                const centerY = (canvasHeight - finalDrawHeight) / 2;

                const finalX = centerX + (position.x * ratio);
                const finalY = centerY + (position.y * ratio);

                ctx.drawImage(userImg, finalX, finalY, finalDrawWidth, finalDrawHeight);
                uploadAndShare();
            };
            userImg.onerror = () => {
                console.error('Failed to load user image.');
                setIsSharing(false);
            };
            userImg.src = imageSrc;
        } else {
            uploadAndShare();
        }
    };

    return (
        <div className="photocard-container p-4 max-w-6xl mx-auto my-8 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8">
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
                    max-width: none !important;
                    max-height: none !important;
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
                @media (max-width: 768px) {
                    .controls {
                        padding: 10px;
                    }
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
                .file-upload-label {
                    cursor: pointer;
                    padding: 12px 20px;
                    border: 2px dashed #006a60;
                    border-radius: 8px;
                    background-color: #f8fafc;
                    color: #006a60 !important;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: all 0.2s;
                    text-align: center;
                }
                .file-upload-label:hover {
                    background-color: #006a60 !important;
                    color: #ffffff !important;
                }
                .file-upload-label:active {
                    background-color: #004d46 !important;
                    color: #ffffff !important;
                }
                .success-modal-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background-color: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(8px);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                    animation: fadeIn 0.3s ease-out forwards;
                }
                .success-modal-content {
                    background: white;
                    padding: 40px;
                    border-radius: 16px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.2);
                    text-align: center;
                    max-width: 90%;
                    width: 400px;
                    animation: slideUp 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                .success-message {
                    color: #006a60;
                    font-size: 1.25rem;
                    font-weight: bold;
                    margin-top: 20px;
                    font-family: 'Hind Siliguri', sans-serif;
                }
                .checkmark {
                    width: 72px;
                    height: 72px;
                    border-radius: 50%;
                    display: block;
                    stroke-width: 4;
                    stroke: #28a745;
                    stroke-miterlimit: 10;
                    box-shadow: inset 0px 0px 0px #28a745;
                    animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out 0s both;
                    margin: 0 auto;
                }
                .checkmark__circle {
                    stroke-dasharray: 166;
                    stroke-dashoffset: 166;
                    stroke-width: 4;
                    stroke-miterlimit: 10;
                    stroke: #28a745;
                    fill: none;
                    animation: stroke .6s cubic-bezier(0.650, 0.000, 0.450, 1.000) forwards;
                }
                .checkmark__check {
                    transform-origin: 50% 50%;
                    stroke-dasharray: 48;
                    stroke-dashoffset: 48;
                    stroke: #fff;
                    animation: stroke .3s cubic-bezier(0.650, 0.000, 0.450, 1.000) .8s forwards;
                }
                @keyframes stroke {
                    100% {
                        stroke-dashoffset: 0;
                    }
                }
                @keyframes scale {
                    0%, 100% {
                        transform: none;
                    }
                    50% {
                        transform: scale3d(1.1, 1.1, 1);
                    }
                }
                @keyframes fill {
                    100% {
                        box-shadow: inset 0px 0px 0px 40px #28a745;
                    }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
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
                            onLoad={handleImageLoad}
                            style={{
                                width: imageRatio > 1 ? `${imageRatio * 100}%` : '100%',
                                height: imageRatio <= 1 ? `${(1 / imageRatio) * 100}%` : '100%',
                                top: '50%',
                                left: '50%',
                                transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px)) scale(${scale})`,
                                transformOrigin: 'center center'
                            }}
                            draggable="false"
                        />
                    ) : (
                        <div
                            className="text-muted text-center p-4 w-100"
                            style={{
                                position: 'absolute',
                                top: placeholderTop,
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                pointerEvents: 'none'
                            }}
                        >
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
                    {!hideName && (
                        <div className="name-overlay" style={{ bottom: nameBottom }}>
                            {name || 'আপনার নাম'}
                        </div>
                    )}
                </div>
                <p className="text-muted mt-3 text-center small">
                    <i className="bi bi-arrows-move me-1"></i> ছবিটি টেনে সঠিক স্থানে বসান
                </p>
            </div>

            {/* Right Column: Controls */}
            <div className="controls">
                <h3 className="hidden md:block mb-3 text-success font-weight-bold">{cardTypeText} তৈরি করুন</h3>

                <div className="control-group">
                    <label>১. ছবি আপলোড করুন</label>
                    <input
                        id="photocard-file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="form-control"
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="photocard-file-input" className="file-upload-label">
                        <i className="fas fa-image me-2"></i>
                        {imageSrc ? 'অন্য ছবি নির্বাচন করুন' : 'ছবি নির্বাচন করুন'}
                    </label>
                </div>

                {!hideName && (
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
                )}

                <div className="control-group">
                    <label>{hideName ? '২.' : '৩.'} ছবি ছোট/বড় করুন (Scale)</label>
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

                <div className="mt-4 d-flex flex-column gap-2">
                    <button
                        onClick={handleDownload}
                        className="btn btn-download w-100 shadow d-flex align-items-center justify-content-center gap-2"
                        disabled={isDownloading}
                    >
                        {isDownloading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                {redirectUrl ? 'ডাউনলোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...' : 'ডাউনলোড হচ্ছে...'}
                            </>
                        ) : (
                            <>
                                <i className="bi bi-download me-2"></i> {cardTypeText} ডাউনলোড করুন
                            </>
                        )}
                    </button>
                    {!hideShare && (
                        <button
                            onClick={handleFacebookShare}
                            className="btn btn-share w-100 shadow d-flex align-items-center justify-content-center gap-2"
                            disabled={isSharing}
                            style={{
                                background: '#1877f2',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                opacity: isSharing ? 0.7 : 1
                            }}
                        >
                            {isSharing ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    লিঙ্ক তৈরি হচ্ছে...
                                </>
                            ) : (
                                <>
                                    <i className="fab fa-facebook-f me-2"></i> ফেসবুকে শেয়ার করুন
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {showSuccessModal && (
                <div className="success-modal-backdrop">
                    <div className="success-modal-content">
                        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                            <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                            <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                        <h4 className="success-message">
                            {cardTypeText === 'প্রোফাইল কার্ড'
                                ? 'আপনার প্রোফাইল পিকচার ডাউনলোড হয়েছে ।'
                                : 'আপনার ফটোকার্ড ডাউনলোড হয়েছে ।'}
                        </h4>
                        {!redirectUrl && (
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="btn btn-sm btn-success mt-3 px-4"
                                style={{ borderRadius: '20px', backgroundColor: '#006a60', borderColor: '#006a60' }}
                            >
                                বন্ধ করুন
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PhotocardGenerator;
