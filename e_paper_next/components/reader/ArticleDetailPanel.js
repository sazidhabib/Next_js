'use client';

import React, { useState } from 'react';
import { 
  Download, 
  Printer, 
  Share2, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause,
  Check,
  Copy
} from 'lucide-react';

export default function ArticleDetailPanel({ article, viewMode = 'image', onToggleViewMode }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!article) {
    return (
      <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-white rounded-lg border border-slate-200">
        <p className="text-base font-medium text-slate-500">
          বাম পাশের পত্রিকা পাতা থেকে যেকোনো সংবাদের ওপর ক্লিক করুন।
        </p>
      </div>
    );
  }

  // Audio Narration TTS
  const handleToggleAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanContent = article.content?.replace(/<[^>]*>?/gm, ' ') || '';
    const textToRead = `${article.title}. ${article.subHeadline || ''}. ${cleanContent}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.95;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}/?articleId=${article.id}` : '');
    const title = encodeURIComponent(article.title || '');

    if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    } else if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${title}%20${url}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print();
  };

  const handleDownloadImage = () => {
    if (article.featuredImageUrl) {
      const link = document.createElement('a');
      link.href = article.featuredImageUrl;
      link.download = `${article.title.slice(0, 20)}.png`;
      link.click();
    } else {
      handlePrint();
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col h-full overflow-hidden">
      
      {/* Top Header Action Bar (Matching Screenshot) */}
      <div className="bg-[#bbf2ea]/40 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: View Mode Toggles & Download */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onToggleViewMode && onToggleViewMode('image')}
            className={`px-3 py-1 rounded text-xs font-bold transition shadow-xs ${
              viewMode === 'image'
                ? 'bg-[#008374] text-white border border-[#008374]'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            ইমেজ ভিউ
          </button>

          <button
            onClick={() => onToggleViewMode && onToggleViewMode('text')}
            className={`px-3 py-1 rounded text-xs font-bold transition shadow-xs ${
              viewMode === 'text'
                ? 'bg-[#008374] text-white border border-[#008374]'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
          >
            টেক্সট ভিউ
          </button>

          {/* Download Icon Button */}
          <button
            onClick={handleDownloadImage}
            className="w-7 h-7 rounded-full bg-slate-300/80 hover:bg-slate-400/80 text-slate-700 flex items-center justify-center transition shadow-xs"
            title="ডাউনলোড"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Audio TTS Reader Button */}
          <button
            onClick={handleToggleAudio}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-semibold transition ${
              isPlayingAudio
                ? 'bg-amber-500 text-white'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
            }`}
            title="সংবাদ শুনুন"
          >
            {isPlayingAudio ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span className="hidden sm:inline">{isPlayingAudio ? 'শুনছেন...' : 'শুনুন'}</span>
            <Volume2 className="w-3 h-3" />
          </button>
        </div>

        {/* Right: Social Share Buttons */}
        <div className="flex items-center space-x-1.5 text-xs text-slate-600">
          <span className="font-semibold text-slate-700 mr-1 hidden sm:inline">শেয়ার করুন</span>
          
          {/* Facebook */}
          <button
            onClick={() => handleShare('facebook')}
            className="w-6 h-6 rounded-full bg-slate-400 hover:bg-[#1877f2] text-white flex items-center justify-center text-[11px] font-bold transition"
            title="Facebook"
          >
            f
          </button>

          {/* WhatsApp */}
          <button
            onClick={() => handleShare('whatsapp')}
            className="w-6 h-6 rounded-full bg-slate-400 hover:bg-[#25d366] text-white flex items-center justify-center text-[11px] transition"
            title="WhatsApp"
          >
            💬
          </button>

          {/* X / Twitter */}
          <button
            onClick={() => handleShare('twitter')}
            className="w-6 h-6 rounded-full bg-slate-400 hover:bg-black text-white flex items-center justify-center text-[10px] font-bold transition"
            title="X (Twitter)"
          >
            𝕏
          </button>

          {/* LinkedIn */}
          <button
            onClick={() => handleShare('linkedin')}
            className="w-6 h-6 rounded-full bg-slate-400 hover:bg-[#0a66c2] text-white flex items-center justify-center text-[10px] font-bold transition"
            title="LinkedIn"
          >
            in
          </button>

          {/* Print */}
          <button
            onClick={handlePrint}
            className="w-6 h-6 rounded-full bg-slate-400 hover:bg-slate-600 text-white flex items-center justify-center transition"
            title="প্রিন্ট"
          >
            <Printer className="w-3 h-3" />
          </button>
        </div>

      </div>

      {/* Main Article Body Container with Decorative Header Border */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto custom-reader-scroll bg-white">
        
        {/* Outer Framed Box with Title in Top Border */}
        <div className="relative border border-[#008374]/70 rounded-md p-5 sm:p-6">
          
          {/* Masthead in Top Border */}
          <div className="absolute -top-3.5 left-6 bg-white px-3 text-[#008374] font-serif-bn font-black text-lg tracking-wider">
            — আজকের পত্রিকা —
          </div>

          {/* Category Ribbon Badge */}
          {article.category && (
            <div className="mt-2 mb-4">
              <div className="w-full bg-[#df742e] text-white text-center py-2 px-4 rounded-md font-sans-bn font-bold text-lg sm:text-xl tracking-wide shadow-xs">
                {article.category}
              </div>
            </div>
          )}

          {/* Large Crimson Red Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-bn font-black text-[#dc2626] leading-[1.2] my-4">
            {article.title}
          </h1>

          {/* Reporter Byline */}
          <div className="text-slate-800 font-sans-bn font-bold text-sm sm:text-base my-3">
            {article.author || 'তৌফিকুল ইসলাম, ঢাকা'}
          </div>

          {/* Article Columns and Content */}
          <div className="text-slate-800 font-sans-bn text-base leading-relaxed space-y-4 pt-2">
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </div>

          {/* Faint Background Masthead Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
            <span className="font-serif-bn font-black text-7xl text-[#008374] select-none">
              আজকের পত্রিকা
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
