import React from 'react';
import PhotocardGenerator from '@/app/components/PhotocardGenerator';
import ConfettiFalling from '@/app/components/ConfettiFalling';
import AjpHeader from '@/app/components/AjpHeader';

export const metadata = {
  title: 'Photocard Generator | পাঠকবন্ধু',
  description: 'Create your custom photocard and share it with your friends.',
};

export default function PhotocardAjpProfilePage() {
  return (
    <main className="main-content custom-font" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', paddingBottom: '40px' }}>
      <AjpHeader />
      <ConfettiFalling />
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="text-2xl md:text-4xl font-bold" style={{ color: '#006a60' }}>প্রোফাইল পিকচার</h1>
          <p className="hidden md:block text-sm md:text-lg text-muted">আপনার ছবি দিয়ে একটি সুন্দর প্রোফাইল পিকচার তৈরি করুন</p>
        </div>

        <PhotocardGenerator
          hideName={true}
          frameImage="/photocard_profile.png"
          hideShare={true}
          cardTypeText="প্রোফাইল পিকচার"
          requireValidation={true}
          redirectUrl="https://www.ajkerpatrika.com/"
          redirectDelayMs={3000}
          photocardType="ajp-profile"
        />
      </div>
    </main>
  );
}
