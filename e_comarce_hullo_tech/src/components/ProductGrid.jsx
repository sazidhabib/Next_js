import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingCart } from "lucide-react";

export default function ProductGrid({ products, title }) {
  return (
    <div>
      {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/${product.category}/${product.slug}`}
            className="group product-card bg-white"
          >
            {/* Product Image */}
            <div className="relative aspect-square bg-star-light-gray overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <button
                className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow hover:bg-star-blue hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>

            {/* Product Info */}
            <div className="p-3">
              <div className="flex items-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-xs text-gray-500 ml-1">(5)</span>
              </div>
              <h3 className="text-sm font-medium mb-2 line-clamp-2 group-hover:text-star-blue transition-colors">
                {product.name}
              </h3>
              <div className="space-y-1 mb-2">
                {product.specs.slice(0, 2).map((spec) => (
                  <div key={spec} className="text-xs text-gray-500 flex items-center gap-1">
                    <span className="w-1 h-1 bg-star-blue rounded-full flex-shrink-0" />
                    {spec}
                  </div>
                ))}
              </div>
              <p className="text-star-blue font-bold text-lg">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
