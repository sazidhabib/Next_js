import { Product } from "../../../models";
import { products as mockProducts } from "../../data/mockData";
import ProductGrid from "../../components/ProductGrid";
import { SlidersHorizontal, Home } from "lucide-react";
import SubCategoryHeader from "../../components/SubCategoryHeader";
import Link from "next/link";

export default async function SecurityCameraPage() {
  let categoryProducts = [];
  try {
    if (Product) {
      const dbProducts = await Product.findAll({ where: { category: "security-camera" } });
      categoryProducts = dbProducts.map((p) => p.toJSON());
    }
  } catch (error) {
    console.error("DB Fetch failed for security cameras, using mock fallback:", error);
  }

  if (categoryProducts.length === 0) {
    categoryProducts = mockProducts.filter((p) => p.category === "security-camera");
  }

  return (
    <main className="min-h-screen bg-star-light-gray pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <ul className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-blue-600 flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" />
            </Link>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-semibold">Security Cameras</span>
          </li>
        </ul>
      </div>

      {/* Category Header */}
      <div className="bg-white border-b border-star-gray py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Security Cameras</h1>
          <p className="text-gray-600">
            Keep your home and office safe with CCTV, IP, and smart WiFi security cameras.
          </p>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <SubCategoryHeader customCategory="/security-camera" />
        <div className="bg-white rounded-lg border border-star-gray p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 border border-star-gray rounded hover:border-star-blue transition-colors text-sm">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            <select className="px-4 py-2 border border-star-gray rounded text-sm focus:outline-none focus:border-star-blue">
              <option>All Brands</option>
              <option>Hikvision</option>
              <option>Dahua</option>
              <option>Imou</option>
              <option>Ezviz</option>
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
