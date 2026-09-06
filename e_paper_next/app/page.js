'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ReaderHeader from '@/components/reader/ReaderHeader';
import NewspaperCanvas from '@/components/reader/NewspaperCanvas';
import ArticleDetailPanel from '@/components/reader/ArticleDetailPanel';

function EPaperReaderContent() {
  const searchParams = useSearchParams();
  const directArticleId = searchParams.get('articleId');

  // Edition and Page State
  const [edition, setEdition] = useState(null);
  const [selectedCity, setSelectedCity] = useState('ঢাকা সিটি');
  const [activePageNumber, setActivePageNumber] = useState(1);
  const [loading, setLoading] = useState(true);

  // Active Article & View Mode
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [viewMode, setViewMode] = useState('image'); // 'image' | 'text'

  // Fetch Full Edition Tree
  const fetchEdition = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/editions/1');
      const data = await res.json();
      if (data.success) {
        setEdition(data.data);
        // Default to first article if available
        if (data.data.articles && data.data.articles.length > 0) {
          setSelectedArticle(data.data.articles[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load edition:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEdition();
  }, [fetchEdition]);

  // Handle direct permalink article opening
  useEffect(() => {
    if (directArticleId && edition?.articles) {
      const art = edition.articles.find((a) => a.id === parseInt(directArticleId, 10));
      if (art) {
        setSelectedArticle(art);
      }
    }
  }, [directArticleId, edition]);

  const currentPage = edition?.pages?.find((p) => p.pageNumber === activePageNumber) || edition?.pages?.[0];
  const pageHotspots = currentPage?.hotspots || [];
  const totalPages = edition?.pages?.length || 12;

  // Page Navigation Handlers
  const handlePrevPage = () => setActivePageNumber((p) => Math.max(1, p - 1));
  const handleNextPage = () => setActivePageNumber((p) => Math.min(totalPages, p + 1));

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9] text-slate-800">
      
      {/* Top Header Bar Matching Screenshot */}
      <ReaderHeader
        edition={edition}
        selectedCity={selectedCity}
        onSelectCity={setSelectedCity}
        currentPageNumber={activePageNumber}
        totalPages={totalPages}
        onSelectPage={(num) => setActivePageNumber(num)}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        currentDate={edition?.publishDate || '২০২৪-০৮-০৬'}
      />

      {/* Main 2-Column Split View Layout */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        
        {/* Left Column: Full Newspaper Scan with Hotspot Overlays */}
        <section className="h-[85vh] min-h-[600px]">
          {loading ? (
            <div className="h-full bg-white rounded-lg border border-slate-200 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-3 border-[#008374] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-slate-500 font-medium">পত্রিকা লোড হচ্ছে...</span>
            </div>
          ) : (
            <NewspaperCanvas
              page={currentPage}
              hotspots={pageHotspots}
              activeArticleId={selectedArticle?.id}
              onSelectArticle={(article) => {
                if (article.content) {
                  setSelectedArticle(article);
                } else {
                  fetch(`/api/articles/${article.id}`)
                    .then((res) => res.json())
                    .then((data) => {
                      if (data.success) setSelectedArticle(data.data);
                    });
                }
              }}
              onPrevPage={handlePrevPage}
              onNextPage={handleNextPage}
              hasPrevPage={activePageNumber > 1}
              hasNextPage={activePageNumber < totalPages}
            />
          )}
        </section>

        {/* Right Column: Detailed Article Reader Panel */}
        <section className="h-[85vh] min-h-[600px]">
          <ArticleDetailPanel
            article={selectedArticle}
            viewMode={viewMode}
            onToggleViewMode={setViewMode}
          />
        </section>

      </main>

    </div>
  );
}

export default function EPaperHomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center text-slate-500">লোড হচ্ছে...</div>}>
      <EPaperReaderContent />
    </Suspense>
  );
}
