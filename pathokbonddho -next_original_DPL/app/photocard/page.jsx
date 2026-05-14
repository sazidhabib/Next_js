"use client";
import React, { useState, useRef, useEffect } from 'react';
import Footer from '@/app/components/Footer';
import { formatBengaliDate } from '@/app/lib/dateUtils';
import { useSettings } from '@/app/providers/SettingsProvider';
import * as htmlToImage from 'html-to-image';

export default function PhotocardPage() {
    const { settings } = useSettings();
    const [currentDate, setCurrentDate] = useState("");
    const [name, setName] = useState("আপনার নাম");
    const [imageSrc, setImageSrc] = useState(null);
    const [scale, setScale] = useState(1);
    const cardRef = useRef(null);

    useEffect(() => {
        setCurrentDate(formatBengaliDate(new Date()));
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageSrc(event.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const downloadCard = () => {
        if (!cardRef.current) return;
        
        htmlToImage.toPng(cardRef.current, { quality: 1.0, pixelRatio: 2 })
            .then((dataUrl) => {
                const link = document.createElement('a');
                link.download = `pathokbonddho-card-${Date.now()}.png`;
                link.href = dataUrl;
                link.click();
            })
            .catch((err) => {
                console.error('Error downloading card', err);
                alert("কার্ড ডাউনলোড করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
            });
    };

    return (
        <div className="min-vh-100 d-flex flex-column bg-light custom-font">
            {/* Top Green Bar */}
            <div className="top-bar-custom-wrapper" style={{ backgroundColor: '#006a60', color: 'white' }}>
                <div className="top-bar-custom container px-3 px-lg-0" style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0', fontSize: '0.85rem'
                }}>
                    <div className="top-bar-left">
                        <span>{currentDate || '২৮ ফেব্রুয়ারি, ২০২৬'}</span>
                    </div>
                    <div className="top-bar-right d-flex gap-3 align-items-center">
                        {settings?.social?.facebook && <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer" className="text-white"><i className="fa-brands fa-facebook-f"></i></a>}
                        {settings?.social?.instagram && <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className="text-white"><i className="fa-brands fa-instagram"></i></a>}
                        {settings?.social?.youtube && <a href={settings.social.youtube} target="_blank" rel="noopener noreferrer" className="text-white"><i className="fa-brands fa-youtube"></i></a>}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-grow-1 container py-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                            <div className="card-header bg-white border-bottom-0 pt-4 pb-0 text-center">
                                <h2 className="fw-bold" style={{ color: '#006a60' }}>ফটোকার্ড তৈরি করুন</h2>
                                <p className="text-muted">আপনার ছবি এবং নাম দিয়ে পাঠকবন্ধু ফটোকার্ড তৈরি করে ডাউনলোড করুন</p>
                            </div>
                            <div className="card-body p-4 p-md-5">
                                <div className="row g-4">
                                    {/* Controls Area */}
                                    <div className="col-md-5">
                                        <div className="mb-4">
                                            <label className="form-label fw-bold">আপনার ছবি আপলোড করুন</label>
                                            <input type="file" className="form-control" accept="image/*" onChange={handleImageUpload} />
                                        </div>
                                        
                                        <div className="mb-4">
                                            <label className="form-label fw-bold">আপনার নাম লিখুন</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                value={name} 
                                                onChange={(e) => setName(e.target.value)} 
                                                placeholder="আপনার নাম" 
                                                maxLength={30}
                                            />
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-bold">ছবি জুম করুন (Scale)</label>
                                            <input 
                                                type="range" 
                                                className="form-range" 
                                                min="0.5" max="2.5" step="0.1" 
                                                value={scale} 
                                                onChange={(e) => setScale(parseFloat(e.target.value))} 
                                                disabled={!imageSrc}
                                            />
                                        </div>

                                        <button 
                                            className="btn w-100 text-white fw-bold py-2 mt-3 shadow-sm" 
                                            style={{ backgroundColor: '#006a60' }}
                                            onClick={downloadCard}
                                        >
                                            <i className="fas fa-download me-2"></i> কার্ড ডাউনলোড করুন
                                        </button>
                                    </div>

                                    {/* Card Preview Area */}
                                    <div className="col-md-7 d-flex justify-content-center">
                                        <div className="photocard-preview-wrapper" style={{ 
                                            width: '100%', 
                                            maxWidth: '350px', 
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                                            borderRadius: '12px',
                                            overflow: 'hidden'
                                        }}>
                                            {/* The actual element that gets converted to an image */}
                                            <div ref={cardRef} className="photocard-canvas position-relative" style={{ 
                                                width: '350px', 
                                                height: '450px', 
                                                backgroundColor: '#006a60',
                                                overflow: 'hidden',
                                                display: 'flex',
                                                flexDirection: 'column'
                                            }}>
                                                {/* Header in Card */}
                                                <div className="text-center pt-4 pb-2" style={{ zIndex: 2 }}>
                                                    <h3 className="text-white fw-bold mb-0">পাঠকবন্ধু</h3>
                                                    <p className="text-white-50 small mb-0">সত্য ও বস্তুনিষ্ঠ সংবাদ</p>
                                                </div>

                                                {/* Image Area */}
                                                <div className="flex-grow-1 d-flex justify-content-center align-items-center position-relative mt-2 mb-3 mx-4" style={{
                                                    backgroundColor: '#e9ecef',
                                                    borderRadius: '12px',
                                                    overflow: 'hidden',
                                                    border: '4px solid white',
                                                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
                                                }}>
                                                    {imageSrc ? (
                                                        <img 
                                                            src={imageSrc} 
                                                            alt="User" 
                                                            style={{ 
                                                                width: '100%', 
                                                                height: '100%', 
                                                                objectFit: 'cover',
                                                                transform: `scale(${scale})`,
                                                                transformOrigin: 'center center'
                                                            }} 
                                                        />
                                                    ) : (
                                                        <div className="text-muted text-center p-3">
                                                            <i className="fas fa-image fa-3x mb-2 opacity-50"></i>
                                                            <p className="small mb-0">ছবি দেখা যাবে এখানে</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Name and Footer Area in Card */}
                                                <div className="text-center pb-4 px-3" style={{ zIndex: 2 }}>
                                                    <h4 className="text-white fw-bold mb-1" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{name}</h4>
                                                    <p className="text-white-50 small mb-0">সদস্য, পাঠকবন্ধু পরিবার</p>
                                                </div>
                                                
                                                {/* Decorative background elements */}
                                                <div className="position-absolute" style={{
                                                    width: '200px', height: '200px', borderRadius: '50%', 
                                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                                    top: '-50px', right: '-50px', zIndex: 1
                                                }}></div>
                                                <div className="position-absolute" style={{
                                                    width: '150px', height: '150px', borderRadius: '50%', 
                                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                                    bottom: '-30px', left: '-30px', zIndex: 1
                                                }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
