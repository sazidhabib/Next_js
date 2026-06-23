import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ScrollToSection from '../../components/ScrollToSection';
import Link from 'next/link';

export async function generateMetadata({ searchParams }) {
  const resolvedParams = await searchParams;
  const img = resolvedParams?.img || '';
  const name = resolvedParams?.name || 'ফটোকার্ড';
  
  // Use production URL or fallback
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pathokbonddho.kamrulhasan.info';
  const fullImageUrl = img ? (img.startsWith('http') ? img : `${baseUrl}${img}`) : '';

  return {
    title: `${name} - পাঠকবন্ধু ফটোকার্ড`,
    description: `${name} পাঠকবন্ধু ফটোকার্ড তৈরি করেছেন। আপনিও আপনার ছবি দিয়ে তৈরি করুন!`,
    openGraph: {
      title: `${name} - পাঠকবন্ধু ফটোকার্ড`,
      description: `${name} পাঠকবন্ধু ফটোকার্ড তৈরি করেছেন। আপনিও আপনার ছবি দিয়ে তৈরি করুন!`,
      images: [
        {
          url: fullImageUrl,
          width: 1080,
          height: 1080,
          alt: `${name} পাঠকবন্ধু ফটোকার্ড`,
        },
      ],
      type: 'article',
      url: `${baseUrl}/photocard/share?img=${encodeURIComponent(img)}&name=${encodeURIComponent(name)}`
    },
    twitter: {
      card: 'summary',
      title: `${name} - পাঠকবন্ধু ফটোকার্ড`,
      description: `${name} পাঠকবন্ধু ফটোকার্ড তৈরি করেছেন। আপনিও আপনার ছবি দিয়ে তৈরি করুন!`,
      images: [fullImageUrl],
    }
  };
}

export default async function PhotocardSharePage({ searchParams }) {
  const resolvedParams = await searchParams;
  const img = resolvedParams?.img || '';
  const name = resolvedParams?.name || '';

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pathokbonddho.kamrulhasan.info';
  const fullImageUrl = img ? (img.startsWith('http') ? img : `${baseUrl}${img}`) : '';

  return (
    <>
      <ScrollToSection />
      <Header />
      <main className="main-content custom-font" style={{ minHeight: '80vh', backgroundColor: '#f8f9fa', padding: '60px 0' }}>
        <div className="container d-flex flex-column align-items-center justify-content-center">
          <div className="text-center mb-4">
            <h2 className="font-weight-bold" style={{ color: '#006a60' }}>
              {name ? `${name} এর পাঠকবন্ধু ফটোকার্ড` : 'পাঠকবন্ধু ফটোকার্ড'}
            </h2>
            <p className="text-muted">আপনার জন্য একটি সুন্দর ফটোকার্ড তৈরি করা হয়েছে</p>
          </div>

          {img ? (
            <div className="card shadow border-0 overflow-hidden mb-4" style={{ maxWidth: '600px', width: '100%', borderRadius: '12px' }}>
              <img 
                src={fullImageUrl} 
                alt={`${name || 'ব্যবহারকারী'} এর ফটোকার্ড`} 
                className="img-fluid"
                style={{ aspectRatio: '1/1', objectFit: 'contain', backgroundColor: '#f8fafc' }}
              />
            </div>
          ) : (
            <div className="alert alert-warning text-center w-100" style={{ maxWidth: '500px' }}>
              কোনো ফটোকার্ডের ছবি খুঁজে পাওয়া যায়নি।
            </div>
          )}

          <div className="d-flex gap-3 flex-wrap justify-content-center mt-3">
            <Link 
              href="/photocard" 
              className="btn py-2 px-4 shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #006a60, #60efbbff)',
                color: 'white',
                fontWeight: 'bold',
                borderRadius: '8px',
                border: 'none'
              }}
            >
              নিজেও একটি ফটোকার্ড তৈরি করুন
            </Link>

            {img && (
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${baseUrl}/photocard/share?img=${img}&name=${name}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary py-2 px-4 shadow-sm"
                style={{
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  border: '1px solid #1877f2',
                  color: '#1877f2',
                  backgroundColor: 'white'
                }}
              >
                <i className="fab fa-facebook-f me-2"></i> ফেসবুকে শেয়ার করুন
              </a>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
