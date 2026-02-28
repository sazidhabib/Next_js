"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown, SlidersHorizontal, LocateFixed, Search } from "lucide-react";

const TABS = ["Project", "For Rent", "For Sale"] as const;
type Tab = (typeof TABS)[number];

const CATEGORIES = [
    "All",
    "Apartment",
    "House",
    "Villa",
    "Commercial",
    "Office",
    "Land",
] as const;

export function SearchSection() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("Project");
    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("All");
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Advanced filter states
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [beds, setBeds] = useState("");
    const [baths, setBaths] = useState("");

    const categoryRef = useRef<HTMLDivElement>(null);

    // Close category dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setIsCategoryOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (keyword) params.set("keyword", keyword);
        if (location) params.set("location", location);
        if (category !== "All") params.set("category", category);
        params.set("type", activeTab);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        if (beds) params.set("beds", beds);
        if (baths) params.set("baths", baths);

        router.push(`/projects?${params.toString()}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <section className="relative py-28 lg:py-36 overflow-hidden">
            {/* Background Image */}
            <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                alt="Modern city skyline"
                fill
                sizes="100vw"
                className="object-cover"
                priority
            />
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-slate-900/75" />

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="container mx-auto px-6 relative z-10 text-center">
                <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
                    Find Your Real Estate
                </h2>
                <p className="text-white/80 max-w-3xl mx-auto mb-16 text-lg md:text-xl font-light leading-relaxed">
                    We are a real estate agency that will help you find the best residence
                    you dream of, let&apos;s discuss for your dream house?
                </p>

                <div className="max-w-6xl mx-auto">
                    {/* Tabs */}
                    <div className="flex justify-center -mb-[1px]">
                        <div className="flex gap-1">
                            {TABS.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-8 md:px-12 py-4 font-bold rounded-t-lg transition-all duration-300 ${activeTab === tab
                                        ? "bg-white text-slate-900 shadow-lg"
                                        : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white backdrop-blur-sm"
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search Bar Container */}
                    <div className="bg-white rounded-lg rounded-tl-none shadow-2xl overflow-visible flex flex-col lg:flex-row items-stretch">
                        {/* Keyword Field */}
                        <div className="flex-1 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-100 text-left">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
                                Keyword
                            </label>
                            <input
                                type="text"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Search for Keyword"
                                className="w-full text-slate-900 text-lg font-medium placeholder:text-slate-300 focus:outline-none bg-transparent"
                            />
                        </div>

                        {/* Location Field */}
                        <div className="flex-1 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-100 text-left">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
                                Location
                            </label>
                            <div className="flex items-center gap-3">
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search for Location"
                                    className="w-full text-slate-900 text-lg font-medium placeholder:text-slate-300 focus:outline-none bg-transparent"
                                />
                                <LocateFixed
                                    size={20}
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
                            className="flex-1 p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-100 text-left relative"
                        >
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
                                Category
                            </label>
                            <div
                                className="flex items-center justify-between cursor-pointer group"
                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            >
                                <span className="text-slate-900 text-lg font-medium">
                                    {category}
                                </span>
                                <ChevronDown
                                    size={20}
                                    className={`text-slate-400 group-hover:text-primary transition-all duration-200 ${isCategoryOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </div>

                            {/* Dropdown Menu */}
                            {isCategoryOpen && (
                                <div className="absolute left-0 right-0 bottom-full mb-1 bg-white border border-slate-100 rounded-lg shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto">
                                    {CATEGORIES.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => {
                                                setCategory(cat);
                                                setIsCategoryOpen(false);
                                            }}
                                            className={`w-full text-left px-6 py-3 text-sm font-medium transition-colors ${category === cat
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
                            className={`lg:w-44 flex flex-col items-center justify-center p-6 md:p-8 border-b lg:border-b-0 lg:border-r border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group ${showAdvanced ? "bg-slate-50" : ""
                                }`}
                        >
                            <SlidersHorizontal
                                size={24}
                                className={`mb-2 transition-colors ${showAdvanced ? "text-primary" : "text-slate-900"
                                    }`}
                            />
                            <span
                                className={`text-sm font-bold tracking-wide transition-colors ${showAdvanced ? "text-primary" : "text-slate-900"
                                    }`}
                            >
                                Advanced
                            </span>
                        </div>

                        {/* Main Search Button */}
                        <button
                            onClick={handleSearch}
                            className="bg-primary hover:bg-primary/90 text-white px-12 lg:px-16 py-8 lg:py-0 font-bold text-xl uppercase tracking-widest transition-all hover:shadow-[inset_0_0_0_100px_rgba(0,0,0,0.05)] flex items-center justify-center gap-3"
                        >
                            <Search size={22} />
                            Search
                        </button>
                    </div>

                    {/* Advanced Filters Panel */}
                    <div
                        className={`bg-white rounded-b-lg shadow-xl overflow-hidden transition-all duration-300 ease-in-out ${showAdvanced
                            ? "max-h-96 opacity-100 mt-0 border-t border-slate-100"
                            : "max-h-0 opacity-0"
                            }`}
                    >
                        <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="text-left">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
                                    Min Price
                                </label>
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="$0"
                                    className="w-full text-slate-900 text-lg font-medium placeholder:text-slate-300 focus:outline-none bg-transparent border-b border-slate-200 pb-2"
                                />
                            </div>
                            <div className="text-left">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
                                    Max Price
                                </label>
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="No Max"
                                    className="w-full text-slate-900 text-lg font-medium placeholder:text-slate-300 focus:outline-none bg-transparent border-b border-slate-200 pb-2"
                                />
                            </div>
                            <div className="text-left">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
                                    Bedrooms
                                </label>
                                <input
                                    type="number"
                                    value={beds}
                                    onChange={(e) => setBeds(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Any"
                                    min="0"
                                    className="w-full text-slate-900 text-lg font-medium placeholder:text-slate-300 focus:outline-none bg-transparent border-b border-slate-200 pb-2"
                                />
                            </div>
                            <div className="text-left">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">
                                    Bathrooms
                                </label>
                                <input
                                    type="number"
                                    value={baths}
                                    onChange={(e) => setBaths(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Any"
                                    min="0"
                                    className="w-full text-slate-900 text-lg font-medium placeholder:text-slate-300 focus:outline-none bg-transparent border-b border-slate-200 pb-2"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
