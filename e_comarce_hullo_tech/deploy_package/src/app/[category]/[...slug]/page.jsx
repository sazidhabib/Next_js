import { notFound } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";
import { Product, Category, SiteSetting } from "../../../../models";
import { products as mockProducts, categories as mockCategories } from "../../../data/mockData";
import ProductDetailContent from "./ProductDetailContent";
import ProductGrid from "../../../components/ProductGrid";

export async function generateMetadata({ params }) {
  const { category: categorySlug, slug } = await params;
  const lastSlug = slug[slug.length - 1];

  let product = null;
  try {
    const dbProduct = await Product.findOne({ where: { slug: lastSlug } });
    if (dbProduct) {
      product = dbProduct.toJSON();
    }
  } catch (error) {
    console.error("DB Fetch failed for metadata generation:", error);
  }

  if (!product) {
    product = mockProducts.find((p) => p.slug === lastSlug);
  }

  if (product) {
    const title = `${product.name} Price in Bangladesh | HulloTech`;
    const description = `Get the ${product.name} at the best price in Bangladesh. Brand: ${product.brand || "N/A"}, Model: ${product.model || "N/A"}. ${product.description ? product.description.substring(0, 155) + '...' : 'Check specs, price, reviews, and detailed parameters.'}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: [
          {
            url: product.image || "/icon.jpg",
            width: 800,
            height: 600,
            alt: product.name,
          },
        ],
      },
      alternates: {
        canonical: `/${product.category}/${product.slug}`,
      },
    };
  }

  // Generate metadata for subcategory or sub-subcategory page
  const displayName = lastSlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${displayName} Price in Bangladesh | HulloTech`,
    description: `Explore premium tech products in ${displayName} at the best prices in Bangladesh.`,
  };
}

export default async function ProductOrCategoryPage({ params }) {
  const { category: categorySlug, slug } = await params;
  const lastSlug = slug[slug.length - 1];

  // 1. Try to load as a Product
  let product = null;
  try {
    const dbProduct = await Product.findOne({ where: { slug: lastSlug } });
    if (dbProduct) {
      product = dbProduct.toJSON();
    }
  } catch (error) {
    console.error("DB Fetch failed for product detail, using fallback:", error);
  }

  if (!product && slug.length === 1) {
    product = mockProducts.find((p) => p.slug === lastSlug);
  }

  // 2. If it is a Product, render the Product Detail Page
  if (product) {
    let category = null;
    let relatedProducts = [];

    try {
      const dbCategory = await Category.findOne({ where: { slug: categorySlug } });
      if (dbCategory) {
        category = dbCategory.toJSON();
      }
    } catch (error) {
      console.error("DB Fetch failed for category, using fallback:", error);
    }

    if (!category) {
      category = mockCategories.find((c) => c.slug === categorySlug);
    }

    try {
      const dbRelated = await Product.findAll({
        where: { category: product.category },
        limit: 7,
      });
      relatedProducts = dbRelated
        .map((p) => p.toJSON())
        .filter((p) => p.id !== product.id)
        .slice(0, 6);
    } catch (error) {
      console.error("DB Fetch failed for related products, using fallback:", error);
      relatedProducts = mockProducts
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 6);
    }

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "image": product.image ? [`https://hullotech.com${product.image}`] : [],
      "description": product.description || `Buy ${product.name} at the best price in Bangladesh from HulloTech.`,
      "sku": product.id?.toString() || product.slug,
      "brand": {
        "@type": "Brand",
        "name": product.brand || "HulloTech",
      },
      "offers": {
        "@type": "Offer",
        "url": `https://hullotech.com/${product.category}/${product.slug}`,
        "priceCurrency": "BDT",
        "price": product.price,
        "priceValidUntil": "2027-12-31",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": product.stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "HulloTech",
        },
      },
    };

    return (
      <main className="min-h-screen bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <section className="border-b border-gray-100 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

  // 3. Otherwise, treat as Subcategory or Sub-subcategory listing view
  let category = null;
  try {
    const dbCategory = await Category.findOne({ where: { slug: categorySlug } });
    if (dbCategory) {
      category = dbCategory.toJSON();
    }
  } catch (error) {
    console.error("DB Category fetch failed:", error);
  }

  if (!category) {
    category = mockCategories.find((c) => c.slug === categorySlug);
  }

  if (!category) {
    notFound();
  }

  let products = [];
  try {
    const whereClause = { category: categorySlug };
    if (slug.length >= 1) whereClause.subcategory = slug[0];
    if (slug.length >= 2) whereClause.subSubcategory = slug[1];

    const dbProducts = await Product.findAll({ where: whereClause });
    products = dbProducts.map((p) => p.toJSON());
  } catch (error) {
    console.error("DB Products fetch failed for subcategory, using fallback:", error);
  }

  // Fallback to mock data matching filters
  if (products.length === 0) {
    products = mockProducts.filter((p) => {
      const matchCat = p.category === categorySlug;
      const matchSub = slug.length >= 1 ? p.subcategory === slug[0] : true;
      const matchSubSub = slug.length >= 2 ? p.subSubcategory === slug[1] : true;
      return matchCat && matchSub && matchSubSub;
    });
  }

  const breadcrumbs = [
    { name: category.name, href: `/${category.slug}` }
  ];
  if (slug.length >= 1) {
    breadcrumbs.push({
      name: slug[0].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      href: `/${categorySlug}/${slug[0]}`
    });
  }
  if (slug.length >= 2) {
    breadcrumbs.push({
      name: slug[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      href: `/${categorySlug}/${slug[0]}/${slug[1]}`
    });
  }

  const listingTitle = breadcrumbs[breadcrumbs.length - 1].name;

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <section className="mb-6">
        <ul className="flex items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-blue-600 flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" />
            </Link>
          </li>
          {breadcrumbs.map((crumb, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="text-gray-300">/</span>
              <Link href={crumb.href} className="hover:text-blue-600 transition-colors">
                {crumb.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Listing Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{listingTitle}</h1>
        <p className="text-gray-600">
          Showing products in {breadcrumbs.map(c => c.name).join(" > ")}.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-150 rounded-2xl">
          <p className="text-gray-400 font-semibold">There are no products on that selected category.</p>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </main>
  );
}
