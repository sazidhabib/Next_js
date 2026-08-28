import { notFound } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";
import { Product, Category, SiteSetting } from "../../../models";
import { products as mockProducts, categories as mockCategories } from "../../data/mockData";
import ProductGrid from "../../components/ProductGrid";

function findCategoryPath(menuItems, currentPath) {
  const path = "/" + currentPath.replace(/^\//, '');
  for (const cat of menuItems) {
    if (cat.href === path) {
      return { level: 0, category: cat, subcategory: null, subSubcategory: null };
    }
    if (cat.subCategories) {
      for (const sub of cat.subCategories) {
        if (sub.href === path) {
          return { level: 1, category: cat, subcategory: sub, subSubcategory: null };
        }
        if (sub.subCategories) {
          for (const subSub of sub.subCategories) {
            if (subSub.href === path) {
              return { level: 2, category: cat, subcategory: sub, subSubcategory: subSub };
            }
          }
        }
      }
    }
  }
  return null;
}

export async function generateMetadata({ params }) {
  const { category: categorySlug } = await params;

  let menuItems = [];
  try {
    const settings = await SiteSetting.findOne();
    if (settings && settings.menuItems) {
      const raw = settings.menuItems;
      menuItems = typeof raw === 'string' ? JSON.parse(raw) : raw;
    }
  } catch (e) {}

  const match = findCategoryPath(menuItems, categorySlug);
  const displayName = match
    ? (match.subcategory ? match.subcategory.name : match.category.name)
    : categorySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${displayName} Price in Bangladesh | HulloTech`,
    description: `Explore premium tech products in ${displayName} at the best prices in Bangladesh.`,
  };
}

export default async function DynamicCategoryLandingPage({ params }) {
  const { category: categorySlug } = await params;

  // Load menu structure
  let menuItems = [];
  try {
    if (SiteSetting) {
      const settings = await SiteSetting.findOne();
      if (settings && settings.menuItems) {
        const raw = settings.menuItems;
        menuItems = typeof raw === 'string' ? JSON.parse(raw) : raw;
      }
    }
  } catch (e) {
    console.error("Failed to load settings menu:", e);
  }

  const match = findCategoryPath(menuItems, categorySlug);

  let queryCategory = categorySlug;
  let querySubcategory = null;
  let querySubSubcategory = null;
  let breadcrumbs = [];

  if (match) {
    // Resolve parents and set correct filters
    const catSlug = match.category.href ? match.category.href.split('/').pop() : match.category.name.toLowerCase();
    queryCategory = catSlug;
    
    breadcrumbs.push({ name: match.category.name, href: `/${catSlug}` });

    if (match.subcategory) {
      const subSlug = match.subcategory.href ? match.subcategory.href.split('/').pop() : match.subcategory.name;
      querySubcategory = subSlug;
      breadcrumbs.push({ name: match.subcategory.name, href: `/${categorySlug}` });
    }

    if (match.subSubcategory) {
      const subSubSlug = match.subSubcategory.href ? match.subSubcategory.href.split('/').pop() : match.subSubcategory.name;
      querySubSubcategory = subSubSlug;
      breadcrumbs.push({ name: match.subSubcategory.name, href: match.subSubcategory.href });
    }
  } else {
    // Try to fall back to category search directly
    let category = null;
    try {
      if (Category) {
        const dbCategory = await Category.findOne({ where: { slug: categorySlug } });
        if (dbCategory) category = dbCategory.toJSON();
      }
    } catch (e) {}

    if (!category) {
      category = mockCategories.find((c) => c.slug === categorySlug);
    }

    if (!category) {
      // Not a category/subcategory, show not found
      notFound();
    }
    breadcrumbs.push({ name: category.name, href: `/${category.slug}` });
  }

  let products = [];
  try {
    if (Product) {
      const whereClause = { category: queryCategory };
      if (querySubcategory) whereClause.subcategory = querySubcategory;
      if (querySubSubcategory) whereClause.subSubcategory = querySubSubcategory;

      const dbProducts = await Product.findAll({ where: whereClause });
      products = dbProducts.map((p) => p.toJSON());
    }
  } catch (error) {
    console.error("DB Products fetch failed:", error);
  }

  // Fallback to mock data matching filters
  if (products.length === 0) {
    products = mockProducts.filter((p) => {
      const matchCat = p.category === queryCategory;
      const matchSub = querySubcategory ? p.subcategory === querySubcategory : true;
      const matchSubSub = querySubSubcategory ? p.subSubcategory === querySubSubcategory : true;
      return matchCat && matchSub && matchSubSub;
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
