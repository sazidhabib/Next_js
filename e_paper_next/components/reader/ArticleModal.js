'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink,
  Printer,
  Type,
  Clock,
  User
} from 'lucide-react';

export default function ArticleModal({ article, onClose }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [fontSize, setFontSize] = useState('base'); // sm, base, lg, xl
  const speechUtteranceRef = useRef(null);

  // Stop audio when unmounting or article changes
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article?.id]);

  if (!article) return null;

  // Text-To-Speech Narration Handler
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

    window.speechSynthesis.cancel(); // Stop any pending utterances

    // Strip HTML tags for clean narration
    const cleanContent = article.content?.replace(/<[^>]*>?/gm, ' ') || '';
    const textToRead = `${article.title}. ${article.subHeadline || ''}. ${cleanContent}`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Detect Bengali language or default
    if (article.title && /[\u0980-\u09FF]/.test(article.title)) {
      utterance.lang = 'bn-BD';
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };
    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/?articleId=${article.id}`;
      navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const handleShare = (platform) => {
    const url = encodeURIComponent(typeof window !== 'undefined' ? `${window.location.origin}/?articleId=${article.id}` : '');
    const title = encodeURIComponent(article.title || '');

    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${title}%20${url}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${title}&url=${url}`, '_blank');
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const fontSizeClasses = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-relaxed',
    xl: 'text-xl leading-loose',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
      >
        {/* Header Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          {/* Category Tag */}
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/30">
            {article.category || 'General News'}
          </span>

          {/* Controls: Audio TTS, Font Size, Print, Close */}
          <div className="flex items-center space-x-2">
            {/* Audio Narration Toggle */}
            <button
              onClick={handleToggleAudio}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                isPlayingAudio
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
              }`}
              title={isPlayingAudio ? 'Pause Narration' : 'Listen to Article (Audio Reader)'}
            >
              {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlayingAudio ? 'Listening...' : 'Listen Audio'}</span>
              <Volume2 className="w-3.5 h-3.5 ml-0.5" />
            </button>

            {/* Font Resize */}
            <button
              onClick={() => {
                const sizes = ['sm', 'base', 'lg', 'xl'];
                const next = sizes[(sizes.indexOf(fontSize) + 1) % sizes.length];
                setFontSize(next);
              }}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
              title="Change Text Size"
            >
              <Type className="w-4 h-4" />
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="hidden sm:inline-flex p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700"
              title="Print Article"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 hover:text-rose-300 text-slate-400 transition border border-slate-700 ml-2"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Article Body */}
        <div className="overflow-y-auto px-6 sm:px-10 py-6 space-y-6">
          {/* Article Title */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-100 leading-tight">
              {article.title}
            </h2>
            {article.subHeadline && (
              <p className="mt-2 text-base sm:text-lg text-slate-300 font-serif italic">
                {article.subHeadline}
              </p>
            )}
          </div>

          {/* Byline & Metadata */}
          <div className="flex flex-wrap items-center gap-4 py-3 border-y border-slate-800 text-xs text-slate-400">
            <div className="flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium text-slate-300">{article.author || 'Staff Reporter'}</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{article.edition?.publishDate || 'Digital Edition'}</span>
            </div>
          </div>

          {/* Article Content */}
          <div
            className={`prose prose-invert max-w-none text-slate-200 font-serif space-y-4 ${fontSizeClasses[fontSize]}`}
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Share & Permalink Section */}
          <div className="pt-6 mt-8 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1">
                <Share2 className="w-3.5 h-3.5" />
                <span>Share:</span>
              </span>
              <button
                onClick={() => handleShare('whatsapp')}
                className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-700/80 hover:bg-emerald-600 text-white transition"
              >
                WhatsApp
              </button>
              <button
                onClick={() => handleShare('facebook')}
                className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-700/80 hover:bg-blue-600 text-white transition"
              >
                Facebook
              </button>
              <button
                onClick={() => handleShare('twitter')}
                className="px-2.5 py-1 rounded-md text-xs font-semibold bg-sky-700/80 hover:bg-sky-600 text-white transition"
              >
                X (Twitter)
              </button>
            </div>

            <button
              onClick={handleCopyLink}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? 'Link Copied!' : 'Copy Article Link'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
