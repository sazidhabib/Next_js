import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Upload, ZoomIn, ZoomOut, Move, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_URL } from '../config';

const FrameDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Data State
    const [frame, setFrame] = useState(null);
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
    const frameImageRef = useRef(null);
    const userImageRef = useRef(null);

    // 1. Fetch Frame Data
    useEffect(() => {
        const fetchFrame = async () => {
            try {
                const response = await fetch(`${API_URL}/frames/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setFrame(data);
                } else {
                    toast.error('ফ্রেম পাওয়া যায়নি');
                    navigate('/all-frames');
                }
            } catch (error) {
                console.error('Error:', error);
                toast.error('সার্ভার এরর');
            } finally {
                setLoading(false);
            }
        };
        fetchFrame();
    }, [id, navigate]);

    // 2. Handle Image Upload
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

    // 3. Canvas Drawing Logic
    useEffect(() => {
        if (!frame || !canvasRef.current) return;

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
        if (frameImageRef.current) {
            ctx.drawImage(frameImageRef.current, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
        } else {
            // Load frame image
            const img = new Image();
            img.crossOrigin = "anonymous"; // Important for download
            img.onload = () => {
                frameImageRef.current = img;
                // Redraw to show frame immediately
                ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
            };
            img.src = frame.image_url;
        }

    }, [frame, userImage, scale, position]);


    // 4. Drag Logic
    const handleMouseDown = (e) => {
        if (!userImage) return;
        setIsDragging(true);
        // Calculate start position relative to canvas
        const canvas = canvasRef.current;
        // Check for touch or mouse
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        setDragStart({ x: clientX - position.x, y: clientY - position.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging || !userImage) return;
        e.preventDefault();

        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        // Note: We might need sensitivity adjustment here depending on screen vs canvas pixels
        // But simplified logic:
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

            // Increment Use Count
            fetch(`${API_URL}/frames/${frame.id}/use`, { method: 'POST' })
                .catch(err => console.error('Failed to increment use count', err));

        } catch (err) {
            console.error(err);
            toast.error('ডাউনলোড ব্যর্থ হয়েছে. দয়া করে আবার চেষ্টা করুন');
        }
    };


    if (loading) return <div className="min-h-screen flex items-center justify-center">লোড হচ্ছে...</div>;
    if (!frame) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-10 pb-20">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Header / Back */}
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors">
                    <ArrowLeft size={20} /> ফিরে যান
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Left: Canvas Editor */}
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                        <div className="relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden cursor-move touch-none"
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            onTouchStart={handleMouseDown}
                            onTouchMove={handleMouseMove}
                            onTouchEnd={handleMouseUp}
                        >
                            <canvas ref={canvasRef} className="w-full h-full object-contain pointer-events-none" />
                            {/* Pointer events none on canvas to let div handle events? No, logic above attached to div. */}
                        </div>

                        {/* Controls */}
                        {userImage && (
                            <div className="mt-4 space-y-4">
                                <div className="flex items-center gap-4">
                                    <ZoomOut size={20} className="text-gray-500" />
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="3"
                                        step="0.1"
                                        value={scale}
                                        onChange={(e) => setScale(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <ZoomIn size={20} className="text-gray-500" />
                                </div>
                                <p className="text-center text-xs text-gray-400">ছবিটি সরাতে ড্র্যাগ করুন এবং জুম করতে স্লাইডার ব্যবহার করুন</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Actions */}
                    <div className="space-y-6">

                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">{frame.title}</h1>
                            <p className="text-gray-500 text-sm">ক্যাটাগরি: <span className="text-primary font-medium">{frame.category_name || 'General'}</span></p>

                            <div className="flex gap-4 mt-2">
                                <div className="flex items-center gap-1 text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">
                                    <span>👁️</span> {frame.view_count || 0}
                                </div>
                                <div className="flex items-center gap-1 text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded">
                                    <span>⬇️</span> {frame.use_count || 0}
                                </div>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4 items-start">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                                <ImageIcon size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-sm mb-1">নির্দেশনা</h3>
                                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                                    <li>"ছবি নির্বাচন করুন" বাটনে ক্লিক করে আপনার ছবি আপলোড করুন।</li>
                                    <li>ছবিটি ফ্রেমের মাঝে বসাতে ড্র্যাগ/মুভ করুন।</li>
                                    <li>স্লাইডার ব্যবহার করে জুম ইন/আউট করুন।</li>
                                    <li>সবশেষে "ডাউনলোড" বাটনে ক্লিক করে সেভ করুন।</li>
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                className="hidden"
                            />

                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="w-full py-3.5 rounded-xl font-bold bg-white border-2 border-dashed border-gray-300 text-gray-600 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
                            >
                                <Upload size={20} />
                                {userImage ? 'অন্য ছবি পরিবর্তন করুন' : 'ছবি নির্বাচন করুন'}
                            </button>

                            <button
                                onClick={handleDownload}
                                disabled={!userImage}
                                className="w-full py-3.5 rounded-xl font-bold bg-green-600 text-white shadow-lg shadow-green-200 hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Download size={20} />
                                ফ্রেম ডাউনলোড করুন
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default FrameDetails;
