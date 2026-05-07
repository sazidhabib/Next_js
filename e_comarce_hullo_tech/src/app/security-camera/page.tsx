import { products } from "@/data/mockData";
import Link from "next/link";
import Image from "next/image";

export default function SecurityPage() {
  const categoryProducts = products.filter((p) => p.category === "security-camera");

  return (
    <main className="min-h-screen bg-star-light-gray text-star-text pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Security Cameras</h1>
        <p className="text-gray-600">
          Protect your home or office with our security solutions.
        </p>
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categoryProducts.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div className="product-card p-4">
              <div className="aspect-square bg-star-light-gray rounded mb-3 overflow-hidden relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              <h3 className="text-sm font-medium mb-2 line-clamp-2">{product.name}</h3>
              <p className="text-star-blue font-bold text-lg">${product.price}</p>
              {product.specs && (
                <ul className="mt-2 space-y-1">
                  {product.specs.slice(0, 2).map((spec) => (
                    <li key={spec} className="text-xs text-gray-500 flex items-center gap-1">
                      <span className="w-1 h-1 bg-star-blue rounded-full" />
                      {spec}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
