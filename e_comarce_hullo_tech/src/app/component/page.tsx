import { products } from "@/data/mockData";
import Link from "next/link";
import Image from "next/image";

export default function ComponentsPage() {
  const categoryProducts = products.filter((p) => p.category === "component");

  return (
    <main className="min-h-screen bg-star-light-gray text-star-text pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Components</h1>
        <p className="text-gray-600">
          Build your PC with our wide range of processors, graphics cards, and more.
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
              {product.brand && (
                <span className="inline-block mt-1 text-xs bg-star-light-gray px-2 py-1 rounded text-gray-600">
                  {product.brand}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
