import { notFound } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";
import { Product, Category, SiteSetting } from "../../../models";
import { products as mockProducts, categories as mockCategories } from "../../data/mockData";
import ProductGrid from "../../components/ProductGrid";
import SubCategoryHeader from "../../components/SubCategoryHeader";
import { findCategoryHierarchy, staticCategories, parseMenuData } from "../../lib/categoryUtils";

export async function generateMetadata({ params }) {
  const { category: categorySlug } = await params;

  let menuItems = staticCategories;
  try {
    const settings = await SiteSetting.findOne();
    if (settings && settings.menuItems) {
      menuItems = parseMenuData(settings.menuItems);
    }
  } catch (e) {}

  const match = findCategoryHierarchy(menuItems, categorySlug);
  const displayName = match
    ? match.matchedNode.name
    : categorySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: `${displayName} Price in Bangladesh | HulloTech`,
    description: `Explore premium tech products in ${displayName} at the best prices in Bangladesh.`,
  };
}

export default async function DynamicCategoryLandingPage({ params }) {
  const { category: categorySlug } = await params;

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

  const match = findCategoryHierarchy(menuItems, categorySlug);

  let queryCategory = categorySlug;
  let querySubcategory = null;
  let querySubSubcategory = null;
  let breadcrumbs = [];

  if (match) {
    breadcrumbs = match.breadcrumbs;
    if (match.level === 1) {
      const catSlug = match.matchedNode.href ? match.matchedNode.href.split("/").pop() : match.matchedNode.name.toLowerCase();
      queryCategory = catSlug;
    } else if (match.level === 2) {
      const parentSlug = match.parent.href ? match.parent.href.split("/").pop() : match.parent.name.toLowerCase();
      const subSlug = match.matchedNode.href ? match.matchedNode.href.split("/").pop() : match.matchedNode.name.toLowerCase();
      queryCategory = parentSlug;
      querySubcategory = subSlug;
    } else if (match.level === 3) {
      const grandSlug = match.grandparent.href ? match.grandparent.href.split("/").pop() : match.grandparent.name.toLowerCase();
      const parentSlug = match.parent.href ? match.parent.href.split("/").pop() : match.parent.name.toLowerCase();
      const subSubSlug = match.matchedNode.href ? match.matchedNode.href.split("/").pop() : match.matchedNode.name.toLowerCase();
      queryCategory = grandSlug;
      querySubcategory = parentSlug;
      querySubSubcategory = subSubSlug;
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
      // Check if any product has this category
      const hasProducts = mockProducts.some((p) => p.category === categorySlug || p.subcategory === categorySlug);
      if (!hasProducts) {
        notFound();
      }
      breadcrumbs.push({
        name: categorySlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        href: `/${categorySlug}`,
      });
    } else {
      breadcrumbs.push({ name: category.name, href: `/${category.slug}` });
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
            { subcategory: categorySlug },
          ],
        });
      }
      if (querySubcategory) {
        whereConditions.push({
          [Op.or]: [
            { subcategory: querySubcategory },
            { subcategory: categorySlug },
          ],
        });
      }
      if (querySubSubcategory) {
        whereConditions.push({
          [Op.or]: [
            { subSubcategory: querySubSubcategory },
            { subSubcategory: categorySlug },
          ],
        });
      }

      const dbProducts = await Product.findAll({
        where: whereConditions.length > 0 ? { [Op.and]: whereConditions } : { category: categorySlug },
      });
      products = dbProducts.map((p) => p.toJSON());
    }
  } catch (error) {
    console.error("DB Products fetch failed:", error);
  }

  // Fallback to mock data matching filters
  if (products.length === 0) {
    products = mockProducts.filter((p) => {
      const matchCat =
        p.category === queryCategory ||
        p.category === categorySlug ||
        p.subcategory === categorySlug;
      const matchSub = querySubcategory
        ? p.subcategory === querySubcategory || p.subcategory === categorySlug
        : true;
      const matchSubSub = querySubSubcategory
        ? p.subSubcategory === querySubSubcategory || p.subSubcategory === categorySlug
        : true;
      return matchCat && matchSub && matchSubSub;
    });
  }

  const listingTitle = breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].name : categorySlug;

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
      <SubCategoryHeader customCategory={categorySlug} />

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
