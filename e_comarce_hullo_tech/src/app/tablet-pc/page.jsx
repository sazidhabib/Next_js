import { products } from "../../data/mockData";
import ProductGrid from "../../components/ProductGrid";
import { SlidersHorizontal } from "lucide-react";

export default function TabletsPage() {
  const categoryProducts = products.filter((p) => p.category === "tablet-pc");

  return (
    <main className="min-h-screen bg-star-light-gray">
      {/* Category Header */}
      <div className="bg-white border-b border-star-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tablets</h1>
          <p className="text-gray-600">
            Discover tablets and iPads for work and entertainment.
          </p>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg border border-star-gray p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-star-gray rounded hover:border-star-blue transition-colors text-sm">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <select className="px-4 py-2 border border-star-gray rounded text-sm focus:outline-none focus:border-star-blue">
              <option>All Brands</option>
              <option>Apple</option>
              <option>Samsung</option>
              <option>Lenovo</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Sort by:</span>
            <select className="px-4 py-2 border border-star-gray rounded text-sm focus:outline-none focus:border-star-blue">
              <option>Popularity</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest First</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold">{categoryProducts.length}</span> products
          </p>
        </div>

        <ProductGrid products={categoryProducts} />
      </div>
    </main>
  );
}
