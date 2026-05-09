import { notFound } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";
import { products, categories } from "../../../data/mockData";
import ProductDetailContent from "./ProductDetailContent";

export default async function ProductDetailPage({ params }) {
  const { slug, category: categorySlug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const category = categories.find((c) => c.slug === categorySlug);
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 6);

  return (
    <main className="min-h-screen bg-white">
      <section className="bg-[#f8f9fa] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ul className="flex items-center gap-2 text-sm" itemScope itemType="http://schema.org/BreadcrumbList">
            <li>
              <Link href="/" className="text-gray-500 hover:text-star-blue flex items-center gap-1">
                <Home className="w-4 h-4" />
              </Link>
            </li>
            <li className="text-gray-300">/</li>
            <li itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem">
              <Link href={`/${category?.slug}`} className="text-gray-500 hover:text-star-blue" itemProp="item">
                <span itemProp="name">{category?.name}</span>
              </Link>
            </li>
            <li className="text-gray-300">/</li>
            <li className="text-gray-600" itemProp="name">{product.name}</li>
          </ul>
        </div>
      </section>

      <ProductDetailContent product={product} category={category} relatedProducts={relatedProducts} />
    </main>
  );
}
