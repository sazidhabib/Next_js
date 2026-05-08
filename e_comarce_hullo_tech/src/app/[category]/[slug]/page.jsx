import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Check, Truck, Shield, ArrowLeft, ChevronRight } from "lucide-react";
import { products, categories } from "../../../data/mockData";

export default async function ProductDetailPage({ params }) {
  const { slug, category: categorySlug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) notFound();

  const category = categories.find((c) => c.slug === categorySlug);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-star-light-gray border-b border-star-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-star-blue">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href={`/${category?.slug}`} className="text-gray-500 hover:text-star-blue">
              {category?.name}
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-star-text">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href={`/${category?.slug}`}
          className="inline-flex items-center gap-2 text-sm text-star-blue hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {category?.name}
        </Link>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div>
            <div className="bg-star-light-gray rounded-lg p-8 mb-4 relative aspect-square">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-contain p-4"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((img, index) => (
                  <div key={index} className="bg-star-light-gray rounded border border-star-gray p-2 cursor-pointer hover:border-star-blue">
                    <div className="relative aspect-square">
                      <Image
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        fill
                        className="object-contain p-1"
                        sizes="15vw"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {product.brand && (
              <span className="inline-block text-sm text-gray-500 mb-2">{product.brand}</span>
            )}
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <span className="text-sm text-gray-500">(5 Reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-star-blue">${product.price}</span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2 mb-6">
              {product.stock ? (
                <>
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-green-600 font-medium">In Stock</span>
                </>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </div>

            {/* Details */}
            <div className="bg-star-light-gray rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-3">Quick Specifications</h3>
              <div className="space-y-2 text-sm">
                {product.brand && (
                  <div className="flex">
                    <span className="w-32 text-gray-500">Brand</span>
                    <span className="font-medium">{product.brand}</span>
                  </div>
                )}
                {product.model && (
                  <div className="flex">
                    <span className="w-32 text-gray-500">Model</span>
                    <span className="font-medium">{product.model}</span>
                  </div>
                )}
                {product.specs.slice(0, 3).map((spec, index) => (
                  <div key={index} className="flex">
                    <span className="w-32 text-gray-500">Spec {index + 1}</span>
                    <span className="font-medium">{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                className="flex-1 py-3 bg-star-red text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                disabled={!product.stock}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button className="px-6 py-3 border border-star-gray rounded-lg hover:bg-star-light-gray transition-colors">
                ♡
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-star-blue" />
                <span>Free Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-star-blue" />
                <span>Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-star-blue" />
                <span>Authentic</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description & Specs Tabs */}
        <div className="mb-12">
          <div className="border-b border-star-gray mb-6">
            <div className="flex gap-8">
              <button className="py-3 border-b-2 border-star-blue text-star-blue font-medium">
                Description
              </button>
              <button className="py-3 text-gray-500 hover:text-star-blue">
                Specifications
              </button>
            </div>
          </div>
          <div className="bg-white">
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Specifications</h3>
              <ul className="space-y-2">
                {product.specs.map((spec) => (
                  <li key={spec} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-star-blue rounded-full" />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((relProduct) => (
                <Link
                  key={relProduct.id}
                  href={`/${relProduct.category}/${relProduct.slug}`}
                  className="group product-card bg-white"
                >
                  <div className="relative aspect-square bg-star-light-gray overflow-hidden">
                    <Image
                      src={relProduct.image}
                      alt={relProduct.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium mb-2 line-clamp-2 group-hover:text-star-blue transition-colors">
                      {relProduct.name}
                    </h3>
                    <p className="text-star-blue font-bold text-lg">${relProduct.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
