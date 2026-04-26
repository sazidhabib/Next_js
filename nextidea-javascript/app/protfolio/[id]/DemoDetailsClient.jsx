"use client";

import { useState, useEffect } from "react";
import { getDemoById, IMAGE_BASE_URL } from "../../lib/api";
import { Loader2, ExternalLink, ArrowLeft, Layers, CheckCircle2, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function DemoDetailsClient({ id }) {
  const [demo, setDemo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDemo = async () => {
      try {
        const res = await getDemoById(id);
        if (res.success && res.data) {
           let demoData = res.data;
           // If it's an array, take the first element
           if (Array.isArray(res.data)) {
             demoData = res.data[0];
           } 
           // Some PHP APIs wrap the single result in a 'demo' or 'item' key
           else if (res.data.demo) {
             demoData = res.data.demo;
           }
           
           if (demoData) {
               setDemo(demoData);
           } else {
               setError("Demo data is empty.");
           }
        } else {
           setError("Demo not found or failed to load.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
        fetchDemo();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="text-zinc-500 font-medium">Loading details...</p>
      </div>
    );
  }

  if (error || !demo) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-zinc-900 mb-4">Oops!</h2>
        <p className="text-zinc-500 text-lg mb-8">{error || "Demo not found."}</p>
        <Link href="/protfolio" className="inline-flex items-center gap-2 text-primary hover:underline font-bold bg-white px-6 py-3 rounded-xl border border-gray-100 shadow-sm">
          <ArrowLeft className="w-5 h-5" /> Back to Portfolio
        </Link>
      </div>
    );
  }

  const imageUrl = demo.image 
    ? (demo.image.startsWith('http') ? demo.image : (demo.image.startsWith('/') ? demo.image : `${IMAGE_BASE_URL}${demo.image}`))
    : "/placeholder-project.png";
  const toolsArray = demo.tools ? demo.tools.split(',').map(t => t.trim()) : [];

  return (
    <div className="container mx-auto px-4">
      <Link href="/protfolio" className="inline-flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors mb-8 font-bold">
        <ArrowLeft className="w-5 h-5" /> Back to Portfolio
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm"
      >
        {/* Hero Image */}
        <div className="relative aspect-video md:aspect-[21/9] bg-zinc-100 overflow-hidden">
          <img src={imageUrl} alt={demo.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
            <div className="p-8 md:p-12 text-white w-full">
              <div className="flex flex-wrap gap-3 mb-4">
                {demo.category_name && (
                    <span className="px-4 py-1.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
                    {demo.category_name}
                    </span>
                )}
                {demo.is_new === true && (
                  <span className="px-4 py-1.5 bg-green-500 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md">
                    New Release
                  </span>
                )}
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">{demo.title}</h1>
              {demo.demo_link && (
                <a href={demo.demo_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 transform hover:-translate-y-1">
                  <ExternalLink className="w-6 h-6" /> View Live Demo
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-bold text-zinc-900 mb-6 border-b border-gray-100 pb-4">Project Overview</h2>
            <div className="prose prose-lg text-zinc-600 max-w-none">
              <p className="whitespace-pre-wrap leading-relaxed text-lg">{demo.details || demo.description || "No description provided."}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100 shadow-sm">
              <h3 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-3">
                <Layers className="w-6 h-6 text-primary" /> Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {toolsArray.length > 0 ? toolsArray.map((tool, index) => (
                  <span key={index} className="px-4 py-2 bg-white border border-zinc-200 text-zinc-800 text-sm font-bold rounded-xl shadow-sm">
                    {tool}
                  </span>
                )) : <span className="text-zinc-500 text-sm italic">Not specified</span>}
              </div>
            </div>

            <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-zinc-900 mb-4 border-b border-zinc-200 pb-4">Project Details</h3>
              
              <div className="flex items-center gap-4 text-zinc-700">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                    <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Status</div>
                    <div className="font-bold capitalize">{demo.status || 'Active'}</div>
                </div>
              </div>

              {demo.price > 0 && (
                <div className="flex items-center gap-4 text-zinc-700">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="font-bold text-primary text-lg">৳</span>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Purchase Price</div>
                    <div className="font-bold text-lg">{demo.price.toLocaleString()} BDT</div>
                  </div>
                </div>
              )}

              {demo.rent_price > 0 && (
                <div className="flex items-center gap-4 text-zinc-700">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <span className="font-bold text-blue-600 text-lg">৳</span>
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Rent Price</div>
                    <div className="font-bold text-lg">{demo.rent_price.toLocaleString()} BDT <span className="text-sm font-medium text-zinc-500">/ month</span></div>
                  </div>
                </div>
              )}

              {demo.created_at && (
                <div className="flex items-center gap-4 text-zinc-700">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Added On</div>
                    <div className="font-bold">{new Date(demo.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
