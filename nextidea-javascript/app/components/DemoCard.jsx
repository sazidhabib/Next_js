"use client";

import { motion } from "framer-motion";
import { ExternalLink, Layers, Eye } from "lucide-react";
import { IMAGE_BASE_URL } from "../lib/api";

export default function DemoCard({ demo }) {
  const imageUrl = demo.thumbnail_url ? `${IMAGE_BASE_URL}${demo.thumbnail_url}` : "/placeholder-project.png";

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={demo.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {demo.featured === 1 && (
            <span className="px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
              Featured
            </span>
          )}
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-zinc-800 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
            {demo.category_title}
          </span>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            {demo.client_website && (
              <a 
                href={demo.client_website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 hover:bg-primary hover:text-white"
              >
                <Eye className="w-6 h-6" />
              </a>
            )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-zinc-900 group-hover:text-primary transition-colors line-clamp-1 mb-2">
            {demo.title}
          </h3>
          <p className="text-zinc-500 text-sm line-clamp-2 min-h-[40px]">
            {demo.description}
          </p>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-400">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-medium uppercase truncate max-w-[150px]">
              {demo.technologies?.join(", ") || "No tech listed"}
            </span>
          </div>
          
          {demo.client_website && (
            <a
              href={demo.client_website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-primary font-bold text-sm group/link hover:underline"
            >
              Live Demo
              <ExternalLink className="w-4 h-4 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
            </a>
          )}
        </div>
      </div>

      {/* Pricing/Priority indicator (Subtle) */}
      {demo.badge && (
          <div className="absolute bottom-0 right-0 p-2">
               {/* Could add more indicators here if needed */}
          </div>
      )}
    </div>
  );
}
