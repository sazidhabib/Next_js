"use client";

import { notFound } from "next/navigation";
import { products } from "@/data/mockData";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === parseInt(params.id));

  if (!product) notFound();

  return (
    <main className="min-h-screen bg-white text-star-text pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-star-light-gray rounded-lg p-8 relative aspect-square">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div>
          {product.brand && (
            <span className="inline-block bg-star-light-gray px-3 py-1 rounded text-sm text-gray-600 mb-4">
              {product.brand}
            </span>
          )}
          <h1 className="text-3xl font-semibold mb-4">{product.name}</h1>
          <div className="mb-6">
            <span className="text-3xl font-bold text-star-blue">${product.price}</span>
          </div>

          <div className="bg-star-light-gray rounded-lg p-6 mb-6">
            <h3 className="font-semibold mb-3">Specifications</h3>
            <ul className="space-y-2">
              {product.specs.map((spec) => (
                <li key={spec} className="text-gray-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-star-blue rounded-full" />
                  {spec}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-4">
            <button className="flex-1 py-3 bg-star-red text-white font-semibold rounded hover:bg-red-700 transition-colors">
              Add to Cart
            </button>
            <button className="px-6 py-3 border border-star-gray rounded hover:bg-star-light-gray transition-colors">
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
