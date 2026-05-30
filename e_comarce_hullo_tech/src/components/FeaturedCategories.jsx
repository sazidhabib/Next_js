"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Laptop,
  Monitor,
  Cpu,
  Smartphone,
  Tablet,
  Camera,
  Shield,
  HardDrive,
} from "lucide-react";
import { categories as mockCategories } from "../data/mockData";

const iconMap = {
  HardDrive: HardDrive,
  Laptop: Laptop,
  Cpu: Cpu,
  Monitor: Monitor,
  Smartphone: Smartphone,
  Tablet: Tablet,
  Camera: Camera,
  Shield: Shield,
};

export default function FeaturedCategories() {
  const [categoriesList, setCategoriesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setCategoriesList(data.data);
        } else {
          setCategoriesList(mockCategories);
        }
      } catch (error) {
        console.error(
          "DB Fetch failed for categories, falling back to mockData:",
          error,
        );
        setCategoriesList(mockCategories);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl text-center font-bold text-gray-800 mb-6">
          Featured Category
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Get Your Desired Product from Featured Category!
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="h-24 bg-slate-100 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl text-center font-bold text-gray-800 mb-2">
        Featured Category
      </h2>
      <p className="text-sm text-center text-gray-600 mb-6">
        Get Your Desired Product from Featured Category!
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {categoriesList.map((category) => {
          const IconComponent = iconMap[category.icon];
          return (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className="group bg-white border border-star-gray rounded-lg p-3 flex flex-col items-center gap-2 hover:border-star-blue hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 bg-star-light-gray rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                {IconComponent && (
                  <IconComponent className="w-6 h-6 text-star-blue" />
                )}
              </div>
              <h3 className="text-xs font-medium text-center text-star-text group-hover:text-star-blue transition-colors">
                {category.name}
              </h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
