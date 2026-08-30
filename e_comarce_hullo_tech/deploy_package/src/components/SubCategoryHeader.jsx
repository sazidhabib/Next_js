"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { staticCategories, findCategoryHierarchy, parseMenuData, normalizePath } from "../lib/categoryUtils";

export default function SubCategoryHeader({ customCategory = null }) {
  const pathname = usePathname();
  const [categories, setCategories] = useState(staticCategories);

  useEffect(() => {
    fetch("/api/settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.menuItems) {
          setCategories(parseMenuData(data.data.menuItems));
        }
      })
      .catch((err) => {
        console.warn("Failed to load dynamic categories in header, using fallback:", err);
      });
  }, []);

  const lookupTarget = customCategory || pathname;
  const hierarchy = findCategoryHierarchy(categories, lookupTarget);

  if (!hierarchy) {
    return null;
  }

  const { matchedNode, subCategories, siblings } = hierarchy;
  const currentNormalized = normalizePath(pathname);

  // If node has direct children, render those children
  // Otherwise if it's a leaf/sub-subcategory, render its siblings with active state highlighted
  const itemsToRender = subCategories && subCategories.length > 0 ? subCategories : (siblings || []);

  if (!itemsToRender || itemsToRender.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-6">
      <div className="flex flex-wrap items-center gap-2.5 pb-2 pt-1">
        {itemsToRender.map((sub) => {
          const isCurrentActive = normalizePath(sub.href) === currentNormalized || normalizePath(sub.name) === currentNormalized;
          return (
            <Link
              key={sub.name}
              href={sub.href}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 shadow-sm border ${
                isCurrentActive
                  ? "bg-star-blue text-white border-star-blue shadow-md scale-105"
                  : "bg-white hover:bg-star-blue hover:text-white border-star-gray hover:border-star-blue text-gray-700"
              }`}
            >
              {sub.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
