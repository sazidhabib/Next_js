"use client";

import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";

export default function Home() {
  return (
    <main className="bg-star-light-gray">
      {/* Hero Banner */}
      <section className="bg-white border-b border-star-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold mb-4">
                Next-Gen Tech Marketplace
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Experience premium technology with the best prices in Bangladesh.
              </p>
              <button className="btn-primary">
                Shop Now
              </button>
            </div>
            <div className="bg-star-light-gray rounded-lg h-64 flex items-center justify-center text-gray-400">
              Hero Banner Image
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <CategoryGrid />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* AI Recommendations */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-white border-t border-star-gray">
        <h2 className="text-2xl font-semibold mb-6">Recommended for You</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="product-card p-4">
              <div className="aspect-square bg-star-light-gray rounded mb-3 flex items-center justify-center text-gray-400">
                Product Image
              </div>
              <h3 className="text-sm font-medium mb-2">Recommended Product {item}</h3>
              <p className="text-star-blue font-bold text-lg">$999</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
