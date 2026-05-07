"use client";

import { products } from "@/data/mockData";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

export default function FeaturedProducts() {
  const featured = products.filter((p) => p.featured);

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {featured.map((product) => (
          <div key={product.id} className="product-card p-4">
            <div className="aspect-square bg-star-light-gray rounded mb-3 overflow-hidden relative">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            </div>
            <h3 className="text-sm font-medium mb-2 line-clamp-2">{product.name}</h3>
            <p className="text-star-blue font-bold text-lg mb-3">${product.price}</p>
            <button
              className="btn-cart w-full py-2 rounded flex items-center justify-center gap-2 text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
