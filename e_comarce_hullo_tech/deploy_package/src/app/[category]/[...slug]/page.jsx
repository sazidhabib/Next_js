import { notFound } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";
import { Product, Category, SiteSetting } from "../../../../models";
import { products as mockProducts, categories as mockCategories } from "../../../data/mockData";
import ProductDetailContent from "./ProductDetailContent";
import ProductGrid from "../../../components/ProductGrid";
import SubCategoryHeader from "../../../components/SubCategoryHeader";
import {
  staticCategories,
  parseMenuData,
  findCategoryHierarchy,
  getProductBreadcrumbs,
} from "../../../lib/categoryUtils";

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
    const description = `Get the ${product.name} at the best price in Bangladesh. Brand: ${product.brand || "N/A"}, Model: ${product.model || "N/A"}. ${
      product.description ? product.description.substring(0, 155) + "..." : "Check specs, price, reviews, and detailed parameters."
    }`;

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

  // Load menu structure
  let menuItems = staticCategories;
  try {
    if (SiteSetting) {
      const settings = await SiteSetting.findOne();
      if (settings && settings.menuItems) {
        menuItems = parseMenuData(settings.menuItems);
      }
    }
  } catch (e) {
    console.error("Failed to load settings menu:", e);
  }

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

  // 2. If it is a Product, render the Product Detail Page with full hierarchical menu path
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

    // Resolve full 3-level breadcrumb path
    const breadcrumbs = getProductBreadcrumbs(menuItems, product);

    // Build structured BreadcrumbList for JSON-LD
    const breadcrumbItemList = [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://hullotech.com",
      },
      ...breadcrumbs.map((crumb, idx) => ({
        "@type": "ListItem",
        position: idx + 2,
        name: crumb.name,
        item: `https://hullotech.com${crumb.href}`,
      })),
      {
        "@type": "ListItem",
        position: breadcrumbs.length + 2,
        name: product.name,
        item: `https://hullotech.com/${product.category}/${product.slug}`,
      },
    ];

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      image: product.image ? [`https://hullotech.com${product.image}`] : [],
      description: product.description || `Buy ${product.name} at the best price in Bangladesh from HulloTech.`,
      sku: product.id?.toString() || product.slug,
      brand: {
        "@type": "Brand",
        name: product.brand || "HulloTech",
      },
      offers: {
        "@type": "Offer",
        url: `https://hullotech.com/${product.category}/${product.slug}`,
        priceCurrency: "BDT",
        price: product.price,
        priceValidUntil: "2027-12-31",
        itemCondition: "https://schema.org/NewCondition",
        availability: product.stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        seller: {
          "@type": "Organization",
          name: "HulloTech",
        },
      },
    };

    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItemList,
    };

    return (
      <main className="min-h-screen bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
        />
        <section className="border-b border-gray-100 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <li>
                <Link href="/" className="text-gray-400 hover:text-blue-600 flex items-center gap-1 transition-colors">
                  <Home className="w-3.5 h-3.5" />
                </Link>
              </li>
              {breadcrumbs.map((crumb, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="text-gray-200">/</span>
                  <Link href={crumb.href} className="text-gray-500 hover:text-blue-600 transition-colors">
                    {crumb.name}
                  </Link>
                </li>
              ))}
              <li className="text-gray-200">/</li>
              <li className="text-gray-700 text-sm font-medium line-clamp-1">{product.name}</li>
            </ul>
          </div>
        </section>

        <ProductDetailContent product={product} category={category} relatedProducts={relatedProducts} />
      </main>
    );
  }

  // 3. Otherwise, treat as Subcategory or Sub-subcategory listing view
  const fullPath = `/${categorySlug}/${slug.join("/")}`;
  const match = findCategoryHierarchy(menuItems, fullPath) || findCategoryHierarchy(menuItems, lastSlug);

  let queryCategory = categorySlug;
  let querySubcategory = slug.length >= 1 ? slug[0] : null;
  let querySubSubcategory = slug.length >= 2 ? slug[1] : null;
  let breadcrumbs = [];

  if (match) {
    breadcrumbs = match.breadcrumbs;
    if (match.level === 1) {
      queryCategory = match.matchedNode.href ? match.matchedNode.href.split("/").pop() : categorySlug;
    } else if (match.level === 2) {
      queryCategory = match.parent ? (match.parent.href.split("/").pop() || categorySlug) : categorySlug;
      querySubcategory = match.matchedNode.href ? match.matchedNode.href.split("/").pop() : slug[0];
    } else if (match.level === 3) {
      queryCategory = match.grandparent ? (match.grandparent.href.split("/").pop() || categorySlug) : categorySlug;
      querySubcategory = match.parent ? (match.parent.href.split("/").pop() || slug[0]) : slug[0];
      querySubSubcategory = match.matchedNode.href ? match.matchedNode.href.split("/").pop() : lastSlug;
    }
  } else {
    // Fallback breadcrumbs
    let category = null;
    try {
      const dbCategory = await Category.findOne({ where: { slug: categorySlug } });
      if (dbCategory) category = dbCategory.toJSON();
    } catch (error) {}

    if (!category) {
      category = mockCategories.find((c) => c.slug === categorySlug);
    }

    breadcrumbs.push({
      name: category ? category.name : categorySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      href: `/${categorySlug}`,
    });

    if (slug.length >= 1) {
      breadcrumbs.push({
        name: slug[0].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        href: `/${categorySlug}/${slug[0]}`,
      });
    }
    if (slug.length >= 2) {
      breadcrumbs.push({
        name: slug[1].replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        href: `/${categorySlug}/${slug[0]}/${slug[1]}`,
      });
    }
  }

  let products = [];
  try {
    if (Product) {
      const { Op } = require("sequelize");
      const whereConditions = [];

      if (queryCategory) {
        whereConditions.push({
          [Op.or]: [
            { category: queryCategory },
            { category: categorySlug },
          ],
        });
      }
      if (querySubcategory) {
        whereConditions.push({
          [Op.or]: [
            { subcategory: querySubcategory },
            { subcategory: lastSlug },
          ],
        });
      }
      if (querySubSubcategory) {
        whereConditions.push({
          [Op.or]: [
            { subSubcategory: querySubSubcategory },
            { subSubcategory: lastSlug },
          ],
        });
      }

      const dbProducts = await Product.findAll({
        where: whereConditions.length > 0 ? { [Op.and]: whereConditions } : { category: categorySlug },
      });
      products = dbProducts.map((p) => p.toJSON());
    }
  } catch (error) {
    console.error("DB Products fetch failed for subcategory, using fallback:", error);
  }

  // Fallback to mock data matching filters
  if (products.length === 0) {
    products = mockProducts.filter((p) => {
      const matchCat =
        p.category === queryCategory ||
        p.category === categorySlug ||
        p.subcategory === categorySlug;
      const matchSub = querySubcategory
        ? p.subcategory === querySubcategory || p.subcategory === lastSlug
        : true;
      const matchSubSub = querySubSubcategory
        ? p.subSubcategory === querySubSubcategory || p.subSubcategory === lastSlug
        : true;
      return matchCat && matchSub && matchSubSub;
    });
  }

  const listingTitle = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].name : lastSlug;

  return (
    <main className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <section className="mb-6">
        <ul className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <li>
            <Link href="/" className="hover:text-blue-600 flex items-center gap-1 transition-colors">
              <Home className="w-3.5 h-3.5" />
            </Link>
          </li>
          {breadcrumbs.map((crumb, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span className="text-gray-300">/</span>
              {idx === breadcrumbs.length - 1 ? (
                <span className="text-gray-900 font-semibold">{crumb.name}</span>
              ) : (
                <Link href={crumb.href} className="hover:text-blue-600 transition-colors">
                  {crumb.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </section>

      {/* Listing Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{listingTitle}</h1>
        <p className="text-gray-600">
          Showing products in {breadcrumbs.map((c) => c.name).join(" > ")}.
        </p>
      </div>

      {/* Multi-Level SubCategory Pills */}
      <SubCategoryHeader customCategory={fullPath} />

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
