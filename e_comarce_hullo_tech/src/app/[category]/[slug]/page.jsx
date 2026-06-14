import { notFound } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";
import { Product, Category } from "../../../../models";
import { products as mockProducts, categories as mockCategories } from "../../../data/mockData";
import ProductDetailContent from "./ProductDetailContent";

export default async function ProductDetailPage({ params }) {
  const { slug, category: categorySlug } = await params;
  
  let product = null;
  let category = null;
  let relatedProducts = [];

  try {
    const dbProduct = await Product.findOne({ where: { slug } });
    if (dbProduct) {
      product = dbProduct.toJSON();
    }
  } catch (error) {
    console.error("DB Fetch failed for product detail, using fallback:", error);
  }

  // Fallback to mockData
  if (!product) {
    product = mockProducts.find((p) => p.slug === slug);
  }
  if (!product) notFound();

  try {
    const dbCategory = await Category.findOne({ where: { slug: categorySlug } });
    if (dbCategory) {
      category = dbCategory.toJSON();
    }
  } catch (error) {
    console.error("DB Fetch failed for category, using fallback:", error);
  }

  // Fallback to mockData
  if (!category) {
    category = mockCategories.find((c) => c.slug === categorySlug);
  }

  try {
    const dbRelated = await Product.findAll({
      where: {
        category: product.category
      },
      limit: 7 // Grab 7, filter out current product later
    });
    relatedProducts = dbRelated
      .map(p => p.toJSON())
      .filter(p => p.id !== product.id)
      .slice(0, 6);
  } catch (error) {
    console.error("DB Fetch failed for related products, using fallback:", error);
    relatedProducts = mockProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 6);
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ul className="flex items-center gap-2 text-sm" itemScope itemType="http://schema.org/BreadcrumbList">
            <li>
              <Link href="/" className="text-gray-400 hover:text-blue-600 flex items-center gap-1 transition-colors">
                <Home className="w-3.5 h-3.5" />
              </Link>
            </li>
            <li className="text-gray-200">/</li>
            <li itemProp="itemListElement" itemScope itemType="http://schema.org/ListItem">
              <Link href={`/${category?.slug}`} className="text-gray-400 hover:text-blue-600 transition-colors" itemProp="item">
                <span itemProp="name">{category?.name}</span>
              </Link>
            </li>
            <li className="text-gray-200">/</li>
            <li className="text-gray-600 text-sm font-medium" itemProp="name">{product.name}</li>
          </ul>
        </div>
      </section>

      <ProductDetailContent product={product} category={category} relatedProducts={relatedProducts} />
    </main>
  );
}
