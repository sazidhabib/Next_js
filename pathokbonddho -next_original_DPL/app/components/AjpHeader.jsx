"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AjpHeader() {
    const pathname = usePathname();

    const isProfile = pathname === '/photocard-ajp-profile';
    const isPhotocard = pathname === '/photocard-ajp';

    return (
        <header className="custom-font w-100 py-3 mb-4" style={{ backgroundColor: '#ffffff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <div className="container d-flex justify-content-between align-items-center flex-wrap gap-3">
                <Link href="/" style={{ textDecoration: 'none', color: '#006a60', fontWeight: 'bold', fontSize: '1.4rem' }}>
                    আজকের পত্রিকা
                </Link>
                <div className="d-flex gap-2">
                    <Link 
                        href="/photocard-ajp" 
                        className="btn px-4 py-2 font-weight-bold"
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
                    <Link 
                        href="/photocard-ajp-profile" 
                        className="btn px-4 py-2 font-weight-bold"
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
                        প্রোফাইল কার্ড
                    </Link>
                </div>
            </div>
        </header>
    );
}
