'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Download, Upload, ZoomIn, ZoomOut, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../../../config';
import ShareButtons from '../../../components/ShareButtons';
import { toHttps } from '../../../utils/imageUtils';
import FrameCard from '../../../components/FrameCard';

export default function FrameDetailsPage() {
    const { id } = useParams();
    const router = useRouter();

    // Data State
    const [frame, setFrame] = useState(null);
    const [relatedFrames, setRelatedFrames] = useState([]);
    const [loading, setLoading] = useState(true);

    // Editor State
    const [userImage, setUserImage] = useState(null);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    // Refs
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);

    // Editor State - Frame Image
    const [loadedFrameImage, setLoadedFrameImage] = useState(null);

    // 1. Fetch Frame Data & Related Frames
    useEffect(() => {
        if (!id) return;
        const fetchData = async () => {
            try {
                // Fetch current frame
                const response = await fetch(`${API_URL}/frames/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFrame(data);
                } else {
                    toast.error('ফ্রেম পাওয়া যায়নি');
                    router.push('/all-frames');
                    return;
                }

                // Fetch related/popular frames (fetching 4 random/popular ones for now)
                const relatedResponse = await fetch(`${API_URL}/frames?sort=popular&limit=4`);
                if (relatedResponse.ok) {
                    const relatedData = await relatedResponse.json();

                    let framesList = [];
                    if (Array.isArray(relatedData)) {
                        framesList = relatedData;
                    } else if (relatedData.frames && Array.isArray(relatedData.frames)) {
                        framesList = relatedData.frames;
                    }

                    setRelatedFrames(framesList.filter(f => f.id !== parseInt(id)).slice(0, 4));
                }

            } catch (error) {
                console.error('Error:', error);
                toast.error('সার্ভার এরর');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, router]);

    // 2. Load Frame Image Effect
    useEffect(() => {
        if (!frame) return;

        setLoadedFrameImage(null); // Reset on frame change

        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = toHttps(frame.image_url);
        img.onload = () => {
            setLoadedFrameImage(img);
        };
        img.onerror = (e) => {
            console.error("Failed to load frame image", e);
            toast.error("ফ্রেম লোড করতে সমস্যা হয়েছে");
        };

    }, [frame]);

    // 3. Handle Image Upload
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    setUserImage(img);
                    // Reset position/scale on new image
                    setScale(1);
                    setPosition({ x: 0, y: 0 });
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    // 4. Canvas Drawing Logic
    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const CANVAS_SIZE = 1000; // High res for download

        // Set canvas size
        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;

        // Clear canvas
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // A. Draw User Image (Background layer)
        if (userImage) {
            ctx.save();
            // Center crop logic roughly
            // Move to center + position offset
            const centerX = CANVAS_SIZE / 2 + position.x;
            const centerY = CANVAS_SIZE / 2 + position.y;

            ctx.translate(centerX, centerY);
            ctx.scale(scale, scale);
            // Draw image centered
            ctx.drawImage(userImage, -userImage.width / 2, -userImage.height / 2);
            ctx.restore();
        } else {
            // Placeholder text or instructions on canvas
            ctx.fillStyle = '#f3f4f6';
            ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
            ctx.fillStyle = '#9ca3af';
            ctx.font = 'bold 40px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('আপনার ছবি যুক্ত করুন', CANVAS_SIZE / 2, CANVAS_SIZE / 2);
        }

        // B. Draw Frame (Overlay layer)
        if (loadedFrameImage) {
            ctx.drawImage(loadedFrameImage, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
        }

    }, [loadedFrameImage, userImage, scale, position]);


    // 5. Drag Logic
    const handleMouseDown = (e) => {
        if (!userImage) return;
        setIsDragging(true);
        const canvas = canvasRef.current;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        setDragStart({ x: clientX - position.x, y: clientY - position.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !userImage) return;
        e.preventDefault();

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        setPosition({
            x: clientX - dragStart.x,
            y: clientY - dragStart.y
        });
    };

    const handleMouseUp = () => setIsDragging(false);


    // 5. Download Logic
    const handleDownload = () => {
        if (!canvasRef.current) return;
        try {
            const link = document.createElement('a');
            link.download = `photocard-${frame.id || 'download'}.png`;
            link.href = canvasRef.current.toDataURL('image/png');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('ডাউনলোড সফল হয়েছে!');

            fetch(`${API_URL}/frames/${frame.id}/use`, { method: 'POST' })
                .catch(err => console.error('Failed to increment use count', err));

        } catch (err) {
            console.error(err);
            toast.error('ডাউনলোড ব্যর্থ হয়েছে');
        }
    };


    if (loading) return <div className="min-h-screen flex items-center justify-center">লোড হচ্ছে...</div>;
    if (!frame) return null;

    return (
        <div className="min-h-screen bg-green-50/30 py-8 pb-32">
            <div className="container mx-auto px-4">



                <div className="max-w-4xl mx-auto text-center space-y-8">

                    {/* Title Section */}
                    <div>
                        <h1 className="text-3xl font-bold text-blue-800 mb-2">{frame.title}</h1>
                        <p className="text-gray-500 text-sm">{frame.category_name || 'General'}</p>
                        {frame.description && <p className="text-gray-600 mt-2">{frame.description}</p>}
                        <div className="w-16 h-1 bg-blue-200 mx-auto mt-4 rounded-full"></div>
                    </div>

                    {/* Canvas Editor */}
                    <div className="relative max-w-[500px] mx-auto bg-white p-3 rounded-2xl shadow-xl border-4 border-white">
                        <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden cursor-move touch-none shadow-inner"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={handleMouseDown}
                            onTouchMove={handleMouseMove}
                            onTouchEnd={handleMouseUp}
                        >
                            <canvas ref={canvasRef} className="w-full h-full object-contain pointer-events-none" />
                        </div>

                        {/* Zoom Controls */}
                        {userImage && (
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                                <ZoomOut size={16} />
                                <input
                                    type="range"
                                    min="0.1"
                                    max="3"
                                    step="0.1"
                                    value={scale}
                                    onChange={(e) => setScale(parseFloat(e.target.value))}
                                    className="w-24 h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white"
                                />
                                <ZoomIn size={16} />
                            </div>
                        )}
                    </div>

                    {/* Actions Section */}
                    <div className="max-w-md mx-auto space-y-6">

                        {/* Upload Button */}
                        <div className="relative">
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="w-full py-4 rounded-full font-bold bg-blue-800 text-white shadow-lg shadow-blue-200 hover:bg-blue-900 transition-all flex items-center justify-center gap-3 text-lg"
                            >
                                <Upload size={24} />
                                {userImage ? 'অন্য ছবি পরিবর্তন করুন' : 'আপনার ছবি যুক্ত করুন'}
                            </button>
                        </div>

                        {/* Instructions - Styled as requested */}
                        <div className="bg-gray-100/50 rounded-xl p-3 flex items-center justify-center gap-2 text-xs text-gray-500">
                            <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-[10px]">!</div>
                            ছবি যুক্ত করার পর আঙ্গুল দিয়ে টেনে সঠিক স্থানে বসান।
                        </div>

                        {/* Download Button */}
                        <button
                            onClick={handleDownload}
                            disabled={!userImage}
                            className={`w-full py-3 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 ${!userImage
                                ? 'border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50'
                                : 'border-blue-600 text-blue-700 hover:bg-blue-50'
                                }`}
                        >
                            <Download size={20} />
                            ডাউনলোড করুন
                        </button>

                        {/* Share Section */}
                        <ShareButtons
                            url={typeof window !== 'undefined' ? window.location.href : ''}
                            title={`তৈরি করে ফেললাম দারুণ একটি ফটো কার্ড! - ${frame.title}`}
                        />
                    </div>
                </div>

                {/* Related Frames Section */}
                <div className="mt-24 mb-10">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl font-bold text-blue-800">আরো কিছু ডিজাইন দেখুন</h2>
                        <div className="w-12 h-1 bg-blue-200 mx-auto mt-3 rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                        {relatedFrames.map((relatedFrame) => (
                            <FrameCard
                                key={relatedFrame.id}
                                id={relatedFrame.id}
                                title={relatedFrame.title}
                                image_url={relatedFrame.image_url}
                                category_name={relatedFrame.category_name}
                                description={relatedFrame.description}
                                use_count={relatedFrame.use_count}
                                view_count={relatedFrame.view_count}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
