"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ChevronLeft, ChevronRight, Filter, Loader2, LayoutGrid } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getDemos, getCategories } from "../lib/api";
import DemoCard from "./DemoCard";

export default function PortfolioPage() {
  const [demos, setDemos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [lang, setLang] = useState("en");

  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.get("search");
    if (query !== null) {
      setSearch(query);
    } else {
      setSearch("");
    }

    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      if (categories.length > 0) {
        const match = categories.find(c => {
          const title = c.title || c.name || "";
          const normalize = (str) => str.toString().toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]/g, '').trim();
          return normalize(title) === normalize(categoryParam);
        });
        if (match) {
          setSelectedCategory(match.id);
        }
      }
    } else {
      setSelectedCategory("");
    }
    setPage(1); 
  }, [searchParams, categories]);


  const fetchData = async () => {
    setLoading(true);
    try {
      const demoRes = await getDemos({
        page,
        limit: 9,
        category_id: selectedCategory,
        search,
        lang
      });

      if (demoRes.success) {
        setDemos(demoRes.data.demos);
        setPagination(demoRes.data.pagination);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const catRes = await getCategories();
        if (catRes.success) {
          setCategories(catRes.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 500); // Debounce search
    return () => clearTimeout(timer);
  }, [search, selectedCategory, page, lang]);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= (pagination?.total_pages || 1)) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold text-zinc-900 mb-6 uppercase tracking-tighter">
            Our <span className="text-primary">Portfolio</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl mx-auto text-lg">
            Explore our latest projects and high-performance solutions designed to scale your business.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative w-full md:flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
            <input
              type="text"
              placeholder={lang === "en" ? "Search projects..." : "প্রজেক্ট খুঁজুন..."}
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all text-zinc-900 placeholder:text-zinc-400"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          {/* Language Toggle */}
          <div className="flex bg-zinc-50 p-1 rounded-2xl w-full md:w-auto">
            <button
              onClick={() => setLang("en")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${lang === "en" ? "bg-white text-primary shadow-sm" : "text-zinc-400"}`}
            >
              EN
            </button>
            <button
              onClick={() => setLang("bn")}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${lang === "bn" ? "bg-white text-primary shadow-sm" : "text-zinc-400"}`}
            >
              BN
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center mb-12 gap-3">
          <button
            onClick={() => { setSelectedCategory(""); setPage(1); }}
            className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
              selectedCategory === ""
                ? "bg-primary text-white shadow-lg shadow-primary/25"
                : "bg-white text-zinc-600 hover:bg-zinc-50 border border-zinc-200 shadow-sm"
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            {lang === "en" ? "All Categories" : "সব ফ্রেম"}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setPage(1); }}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === cat.id
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-white text-zinc-600 hover:bg-zinc-50 border border-zinc-200 shadow-sm"
              }`}
            >
              {cat.title || cat.name}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-zinc-400 font-medium">Fetching demos...</p>
          </div>
        ) : (
          <>
            {demos.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {demos.map((demo) => (
                  <DemoCard key={demo.id} demo={demo} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-zinc-200">
                <p className="text-zinc-400 text-lg">No projects found matching your criteria.</p>
                <button 
                    onClick={() => { setSearch(""); setSelectedCategory(""); setPage(1); }}
                    className="mt-4 text-primary font-bold hover:underline"
                >
                    Clear all filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {pagination && pagination.total_pages > 1 && (
              <div className="mt-16 flex justify-center items-center gap-4">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="p-3 rounded-2xl bg-white border border-gray-100 text-zinc-400 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <div className="flex items-center gap-2">
                  {[...Array(pagination.total_pages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-12 h-12 rounded-2xl font-bold transition-all ${
                        page === i + 1
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "bg-white text-zinc-600 hover:bg-zinc-50 border border-gray-100"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.total_pages}
                  className="p-3 rounded-2xl bg-white border border-gray-100 text-zinc-400 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
