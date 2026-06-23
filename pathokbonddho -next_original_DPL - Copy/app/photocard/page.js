import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScrollToSection from '../components/ScrollToSection';
import PhotocardGenerator from '../components/PhotocardGenerator';

export const metadata = {
  title: 'Photocard Generator | পাঠকবন্ধু',
  description: 'Create your custom photocard and share it with your friends.',
};

export default function PhotocardPage() {
  return (
    <>
      <ScrollToSection />
      <Header />
      <main className="main-content custom-font" style={{ minHeight: '80vh', backgroundColor: '#f8f9fa', padding: '40px 0' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="display-5 font-weight-bold" style={{ color: '#006a60' }}>পাঠকবন্ধু ফটোকার্ড</h1>
            <p className="lead text-muted">আপনার ছবি ও নাম দিয়ে একটি সুন্দর ফটোকার্ড তৈরি করুন</p>
          </div>

          <PhotocardGenerator />
        </div>
      </main>
      <Footer />
    </>
  );
}
