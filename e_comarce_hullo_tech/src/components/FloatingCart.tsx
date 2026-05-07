"use client";

import { ShoppingCart } from "lucide-react";

export default function FloatingCart() {
  const itemCount = 0;

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button className="bg-star-blue text-white rounded-full p-4 shadow-lg hover:bg-star-dark-blue transition-colors relative">
        <ShoppingCart className="w-6 h-6" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-star-red text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>
    </div>
  );
}
