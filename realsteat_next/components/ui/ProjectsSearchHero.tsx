"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal, LocateFixed, Search, LayoutGrid, List } from "lucide-react";

const CATEGORIES = [
    "All",
    "Apartment",
    "House",
    "Villa",
    "Commercial",
    "Office",
    "Land",
] as const;

interface ProjectsSearchHeroProps {
    onSearch?: (filters: {
        keyword: string;
        location: string;
        category: string;
        minPrice: string;
        maxPrice: string;
        beds: string;
        baths: string;
    }) => void;
    onViewChange?: (view: "grid" | "list") => void;
    onPerPageChange?: (count: number) => void;
    currentView?: "grid" | "list";
    currentPerPage?: number;
    totalResults?: number;
}

export function ProjectsSearchHero({
    onSearch,
    onViewChange,
    onPerPageChange,
    currentView = "grid",
    currentPerPage = 12,
    totalResults = 0,
}: ProjectsSearchHeroProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
    const [location, setLocation] = useState(searchParams.get("location") || "");
    const [category, setCategory] = useState(searchParams.get("category") || "All");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [isPerPageOpen, setIsPerPageOpen] = useState(false);

    // Advanced filter states
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
    const [beds, setBeds] = useState(searchParams.get("beds") || "");
    const [baths, setBaths] = useState(searchParams.get("baths") || "");

    const categoryRef = useRef<HTMLDivElement>(null);
    const perPageRef = useRef<HTMLDivElement>(null);

    const perPageOptions = [6, 9, 12, 18, 24];

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
            }
            if (perPageRef.current && !perPageRef.current.contains(event.target as Node)) {
                setIsPerPageOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = () => {
        const filters = { keyword, location, category, minPrice, maxPrice, beds, baths };

        if (onSearch) {
            onSearch(filters);
        } else {
            const params = new URLSearchParams();
            if (keyword) params.set("keyword", keyword);
            if (location) params.set("location", location);
            if (category !== "All") params.set("category", category);
            if (minPrice) params.set("minPrice", minPrice);
            if (maxPrice) params.set("maxPrice", maxPrice);
            if (beds) params.set("beds", beds);
            if (baths) params.set("baths", baths);
            router.push(`/projects?${params.toString()}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <div className="relative">
            {/* Google Maps Background */}
            <div className="relative w-full h-[450px] lg:h-[500px]">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d467689.01579029957!2d90.22865870783729!3d23.780573258035957!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563b7df53efc!2sDhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full"
                    title="Property Locations Map"
                />
            </div>

            {/* Search Bar - Overlapping bottom edge of map */}
            <div className="relative z-20 -mt-16 lg:-mt-12">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="max-w-6xl mx-auto">
                        {/* Search Bar Container */}
                        <div className="bg-white rounded-lg shadow-2xl overflow-visible flex flex-col lg:flex-row items-stretch">
                            {/* Keyword Field */}
                            <div className="flex-1 p-5 md:p-6 border-b lg:border-b-0 lg:border-r border-slate-100 text-left">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                                    Keyword
                                </label>
                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search for Keyword"
                                    className="w-full text-slate-900 text-base font-medium placeholder:text-slate-300 focus:outline-none bg-transparent"
                                />
                            </div>

                            {/* Location Field */}
                            <div className="flex-1 p-5 md:p-6 border-b lg:border-b-0 lg:border-r border-slate-100 text-left">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                                    Location
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Search for Location"
                                        className="w-full text-slate-900 text-base font-medium placeholder:text-slate-300 focus:outline-none bg-transparent"
                                    />
                                    <LocateFixed
                                        size={18}
                                        className="text-slate-400 cursor-pointer hover:text-primary transition-colors shrink-0"
                                        onClick={() => {
                                            if (navigator.geolocation) {
                                                navigator.geolocation.getCurrentPosition(
                                                    () => setLocation("Current Location"),
                                                    () => setLocation("")
                                                );
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Category Dropdown */}
                            <div
                                ref={categoryRef}
                                className="flex-1 p-5 md:p-6 border-b lg:border-b-0 lg:border-r border-slate-100 text-left relative"
                            >
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                                    Category
                                </label>
                                <div
                                    className="flex items-center justify-between cursor-pointer group"
                                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                >
                                    <span className="text-slate-900 text-base font-medium">
                                        {category}
                                    </span>
                                    <ChevronDown
                                        size={18}
                                        className={`text-slate-400 group-hover:text-primary transition-all duration-200 ${isCategoryOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </div>

                                {/* Dropdown Menu */}
                                {isCategoryOpen && (
                                    <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-100 rounded-lg shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto">
                                        {CATEGORIES.map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    setCategory(cat);
                                                    setIsCategoryOpen(false);
                                                }}
                                                className={`w-full text-left px-5 py-2.5 text-sm font-medium transition-colors ${category === cat
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-slate-700 hover:bg-slate-50"
                                                    }`}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Advanced Filters Button */}
                            <div
                                onClick={() => setShowAdvanced(!showAdvanced)}
                                className={`lg:w-40 flex flex-row lg:flex-col items-center justify-center gap-2 p-5 md:p-6 border-b lg:border-b-0 lg:border-r border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${showAdvanced ? "bg-slate-50" : ""
                                    }`}
                            >
                                <SlidersHorizontal
                                    size={20}
                                    className={`transition-colors ${showAdvanced ? "text-primary" : "text-slate-900"
                                        }`}
                                />
                                <span
                                    className={`text-sm font-bold tracking-wide transition-colors ${showAdvanced ? "text-primary" : "text-slate-900"
                                        }`}
                                >
                                    Advanced
                                </span>
                            </div>

                            {/* Search Button */}
                            <button
                                onClick={handleSearch}
                                className="bg-primary hover:bg-primary/90 text-white px-10 lg:px-12 py-6 lg:py-0 font-bold text-base uppercase tracking-widest transition-all hover:shadow-[inset_0_0_0_100px_rgba(0,0,0,0.05)] flex items-center justify-center gap-2 rounded-b-lg lg:rounded-bl-none lg:rounded-r-lg"
                            >
                                <Search size={18} />
                                Search
                            </button>
                        </div>

                        {/* Advanced Filters Panel */}
                        <div
                            className={`bg-white rounded-b-lg shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${showAdvanced
                                ? "max-h-96 opacity-100 border-t border-slate-100"
                                : "max-h-0 opacity-0"
                                }`}
                        >
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                                <div className="text-left">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                                        Min Price
                                    </label>
                                    <input
                                        type="number"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="$0"
                                        className="w-full text-slate-900 text-base font-medium placeholder:text-slate-300 focus:outline-none bg-transparent border-b border-slate-200 pb-2"
                                    />
                                </div>
                                <div className="text-left">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                                        Max Price
                                    </label>
                                    <input
                                        type="number"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="No Max"
                                        className="w-full text-slate-900 text-base font-medium placeholder:text-slate-300 focus:outline-none bg-transparent border-b border-slate-200 pb-2"
                                    />
                                </div>
                                <div className="text-left">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                                        Bedrooms
                                    </label>
                                    <input
                                        type="number"
                                        value={beds}
                                        onChange={(e) => setBeds(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Any"
                                        min="0"
                                        className="w-full text-slate-900 text-base font-medium placeholder:text-slate-300 focus:outline-none bg-transparent border-b border-slate-200 pb-2"
                                    />
                                </div>
                                <div className="text-left">
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">
                                        Bathrooms
                                    </label>
                                    <input
                                        type="number"
                                        value={baths}
                                        onChange={(e) => setBaths(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Any"
                                        min="0"
                                        className="w-full text-slate-900 text-base font-medium placeholder:text-slate-300 focus:outline-none bg-transparent border-b border-slate-200 pb-2"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* View Controls Bar */}
            <div className="container mx-auto px-4 lg:px-12 mt-6">
                <div className="max-w-6xl mx-auto flex items-center justify-end gap-3">
                    {/* Grid / List View Toggle */}
                    <div className="flex items-center border border-slate-200 rounded-md overflow-hidden">
                        <button
                            onClick={() => onViewChange?.("grid")}
                            className={`p-2.5 transition-colors ${currentView === "grid"
                                ? "bg-primary text-white"
                                : "bg-white text-slate-500 hover:bg-slate-50"
                                }`}
                            title="Grid View"
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button
                            onClick={() => onViewChange?.("list")}
                            className={`p-2.5 transition-colors ${currentView === "list"
                                ? "bg-primary text-white"
                                : "bg-white text-slate-500 hover:bg-slate-50"
                                }`}
                            title="List View"
                        >
                            <List size={16} />
                        </button>
                    </div>

                    {/* Per Page Selector */}
                    <div ref={perPageRef} className="relative">
                        <button
                            onClick={() => setIsPerPageOpen(!isPerPageOpen)}
                            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-md bg-white text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
                        >
                            {currentPerPage}
                            <ChevronDown
                                size={14}
                                className={`transition-transform duration-200 ${isPerPageOpen ? "rotate-180" : ""}`}
                            />
                        </button>
                        {isPerPageOpen && (
                            <div className="absolute right-0 top-full mt-1 bg-white border border-slate-100 rounded-lg shadow-xl z-50 overflow-hidden min-w-[80px]">
                                {perPageOptions.map((num) => (
                                    <button
                                        key={num}
                                        onClick={() => {
                                            onPerPageChange?.(num);
                                            setIsPerPageOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${currentPerPage === num
                                            ? "bg-primary/10 text-primary"
                                            : "text-slate-700 hover:bg-slate-50"
                                            }`}
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Total Results */}
                    {totalResults > 0 && (
                        <span className="text-sm text-slate-500 font-medium">
                            {totalResults} result{totalResults !== 1 ? "s" : ""}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
