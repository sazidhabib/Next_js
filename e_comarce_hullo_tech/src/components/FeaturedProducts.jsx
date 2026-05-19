"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { products as mockProducts } from "../data/mockData";

export default function FeaturedProducts() {
  const [featuredList, setFeaturedList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch("/api/products?featured=true");
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setFeaturedList(data.data);
        } else {
          // Fallback if DB returns no featured products
          setFeaturedList(mockProducts.filter((p) => p.featured));
        }
      } catch (error) {
        console.error("Failed to load featured products:", error);
        setFeaturedList(mockProducts.filter((p) => p.featured));
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-square bg-slate-100 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {featuredList.map((product) => (
        <Link
          key={product.id}
          href={`/${product.category}/${product.slug}`}
          className="group product-card bg-white"
        >
          {/* Product Image */}
          <div className="relative aspect-square bg-star-light-gray overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <button
              className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow hover:bg-star-blue hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>

          {/* Product Info */}
          <div className="p-3">
            <div className="flex items-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-xs text-gray-500 ml-1">(5)</span>
            </div>
            <h3 className="text-sm font-medium mb-2 line-clamp-2 group-hover:text-star-blue transition-colors">
              {product.name}
            </h3>
            <p className="text-star-blue font-bold text-lg">${product.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
