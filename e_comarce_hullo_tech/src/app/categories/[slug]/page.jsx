"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { products as mockProducts, categories as mockCategories } from "../../../data/mockData";

export default function CategoryPage({ params }) {
  const { slug } = use(params);
  const [category, setCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        // Fetch categories to find the correct one
        const catRes = await fetch("/api/categories");
        const catData = await catRes.json();
        let foundCategory = null;

        if (catData.success) {
          foundCategory = catData.data.find((c) => c.slug === slug);
        }

        // Fallback to mock categories
        if (!foundCategory) {
          foundCategory = mockCategories.find((c) => c.slug === slug);
        }

        if (!foundCategory) {
          setError(true);
          setLoading(false);
          return;
        }

        setCategory(foundCategory);

        // Fetch products in this category
        const prodRes = await fetch(`/api/products?category=${slug}`);
        const prodData = await prodRes.json();

        if (prodData.success && prodData.data.length > 0) {
          setCategoryProducts(prodData.data);
        } else {
          setCategoryProducts(mockProducts.filter((p) => p.category === slug));
        }
      } catch (err) {
        console.error("Failed to load category page data, using mock fallback:", err);
        const fallbackCat = mockCategories.find((c) => c.slug === slug);
        if (fallbackCat) {
          setCategory(fallbackCat);
          setCategoryProducts(mockProducts.filter((p) => p.category === slug));
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [slug]);

  if (error) {
    notFound();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-star-light-gray text-star-text pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-star-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
          <Link key={product.id} href={`/${product.category}/${product.slug}`}>
            <div className="product-card p-4">
              <div className="aspect-square bg-star-light-gray rounded mb-3 flex items-center justify-center text-gray-400 overflow-hidden relative">
                <img src={product.image} alt={product.name} className="object-cover w-full h-full" />
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
