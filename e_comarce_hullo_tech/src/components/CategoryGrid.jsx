"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Laptop, Monitor, Cpu, Smartphone, Tablet, Camera, Shield, HardDrive } from "lucide-react";
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

export default function CategoryGrid() {
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
        console.error("DB Fetch failed for categories, falling back to mockData:", error);
        setCategoriesList(mockCategories);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop by Category</h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {categoriesList.map((category) => {
          const IconComponent = iconMap[category.icon];
          return (
            <Link
              key={category.id}
              href={`/${category.slug}`}
              className="group bg-white border border-star-gray rounded-lg p-3 flex flex-col items-center gap-2 hover:border-star-blue hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 bg-star-light-gray rounded-lg flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                {IconComponent && <IconComponent className="w-6 h-6 text-star-blue" />}
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
