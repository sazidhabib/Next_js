"use client";

import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Filter, Loader2 } from "lucide-react";
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
      setPage(1); // Reset to first page when search changes
    }
  }, [searchParams]);

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
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="relative w-full md:flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 transition-all text-zinc-900"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>

          {/* Category Filter */}
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5 pointer-events-none" />
            <select
              className="w-full pl-12 pr-10 py-3 bg-zinc-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 appearance-none transition-all text-zinc-900"
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
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
