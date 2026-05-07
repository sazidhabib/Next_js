"use client";

import { products, categories } from "@/data/mockData";
import { notFound } from "next/navigation";
import Link from "next/link";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((c) => c.slug === params.slug);
  const categoryProducts = products.filter((p) => p.category === params.slug);

  if (!category) notFound();

  return (
    <main className="min-h-screen bg-star-light-gray text-star-text pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">{category.name}</h1>
        <p className="text-gray-600">
          Explore our collection of premium {category.name.toLowerCase()} technology.
        </p>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categoryProducts.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div className="product-card p-4">
              <div className="aspect-square bg-star-light-gray rounded mb-3 flex items-center justify-center text-gray-400">
                Product Image
              </div>
              <h3 className="text-sm font-medium mb-2 line-clamp-2">{product.name}</h3>
              <p className="text-star-blue font-bold text-lg">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
