"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function AjpHeader() {
    const pathname = usePathname();

    const isProfile = pathname === '/photocard-ajp-profile';
    const isPhotocard = pathname === '/photocard-ajp';

    return (
        <header className="custom-font w-100 py-3 mb-4" style={{ backgroundColor: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <style jsx>{`
                .logo-img {
                    max-width: 240px !important;
                    width: 240px !important;
                    height: auto !important;
                }
                .nav-btn {
                    font-size: 0.85rem !important;
                    padding: 8px 16px !important;
                }
                .logo-link {
                    width: 100% !important;
                }
                .buttons-wrapper {
                    width: 100% !important;
                }
                @media (min-width: 768px) {
                    .logo-img {
                        max-width: 200px !important;
                        width: 200px !important;
                    }
                    .nav-btn {
                        font-size: 1.05rem !important;
                        padding: 10px 24px !important;
                    }
                    .logo-link {
                        width: auto !important;
                    }
                    .buttons-wrapper {
                        width: auto !important;
                    }
                }
            `}</style>
            <div className="container d-flex justify-content-center justify-content-md-between align-items-center flex-wrap gap-3">
                <Link 
                    href="https://www.ajkerpatrika.com/" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="logo-link text-center text-md-start d-block d-md-inline-block"
                    style={{ textDecoration: 'none', color: '#006a60', fontWeight: 'bold', fontSize: '1.4rem' }}
                >
                    <Image 
                        src="/Ajker_Patrika_Logo.png" 
                        alt="আজকের পত্রিকা" 
                        width={200} 
                        height={100} 
                        className="mx-auto d-inline-block logo-img" 
                    />
                </Link>
                <div className="buttons-wrapper d-flex gap-2 justify-content-center justify-content-md-start">
                    <Link
                        href="/photocard-ajp-profile"
                        className="btn nav-btn font-weight-bold"
                        style={{
                            borderRadius: '25px',
                            backgroundColor: isProfile ? '#006a60' : 'transparent',
                            borderColor: '#006a60',
                            color: isProfile ? '#ffffff' : '#006a60',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                            borderWidth: '2px',
                            borderStyle: 'solid'
                        }}
                    >
                        প্রোফাইল পিকচার
                    </Link>
                    <Link
                        href="/photocard-ajp"
                        className="btn nav-btn font-weight-bold"
                        style={{
                            borderRadius: '25px',
                            backgroundColor: isPhotocard ? '#006a60' : 'transparent',
                            borderColor: '#006a60',
                            color: isPhotocard ? '#ffffff' : '#006a60',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                            borderWidth: '2px',
                            borderStyle: 'solid'
                        }}
                    >
                        ফটোকার্ড
                    </Link>
                </div>
            </div>
        </header>
    );
}
