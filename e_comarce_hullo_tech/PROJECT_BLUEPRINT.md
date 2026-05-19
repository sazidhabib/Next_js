# PROJECT BLUEPRINT — HulloTech E-Commerce

> **Last Updated:** 2026-05-15
> **Read this file BEFORE any task** (new feature, bug fix, refactor).
> It describes the full project structure so you never need to re-scan the codebase.

---

## 1. Project Overview

| Key | Value |
|-----|-------|
| **Purpose** | Front-end e-commerce storefront for "HulloTech", a tech/electronics marketplace targeting Bangladesh. Currently uses mock data (no backend/database). |
| **Framework** | Next.js 14.2 (App Router) |
| **Language** | JavaScript (JSX) — no TypeScript in source files |
| **Styling** | Tailwind CSS 3.4 + custom CSS component layer (`globals.css`) |
| **Animations** | Framer Motion 11 |
| **Icons** | Lucide React 0.395 |
| **Font** | Inter (loaded via `next/font/google`) |
| **Backend** | Express.js custom server alongside Next.js |
| **Database** | MySQL via Sequelize (in progress, previously none) |
| **Auth** | JWT-based custom backend authentication (`/api/auth`) |
| **State Mgmt** | React `useState` only (no global store) |
| **Package Manager** | npm |
| **Entry Point** | `server.js` (Unified server) → `src/app/layout.jsx` (root layout) |

---

## 2. Complete File Tree with Purpose

```
📁 / (project root)
├── 📄 server.js                 — Unified Express + Next.js custom server entry point
├── 📄 package.json              — Dependencies, scripts (dev/build/start/lint)
├── 📄 next.config.mjs           — Next.js config (currently empty/default)
├── 📄 tailwind.config.js        — Tailwind theme: custom colors (hullo-blue, star-*), Inter font
├── 📄 postcss.config.mjs        — PostCSS plugins: tailwindcss + autoprefixer
├── 📄 .gitignore                — Standard Next.js ignores + .jetro/
├── 📄 .env.example              — Environment variables template
├── 📄 next-env.d.ts             — Auto-generated TypeScript env declarations
│
├── 📁 controllers/
│   ├── 📄 auth-controller.js    — Handles user login and profile fetching
│   ├── 📄 category-controller.js — Handles category CRUD operations
│   ├── 📄 product-controller.js  — Handles product CRUD operations
│   └── 📄 setting-controller.js — Handles site settings CRUD operations
│
├── 📁 db/
│   ├── 📄 database.js           — Sequelize MySQL connection configuration
│   └── 📄 seedData.js           — CJS Seeding data for categories and products
│
├── 📁 models/
│   ├── 📄 index.js              — Model initialization and associations
│   ├── 📄 Category.js           — Sequelize model for categories
│   ├── 📄 Product.js            — Sequelize model for products
│   ├── 📄 User.js               — Sequelize model for users (auth)
│   └── 📄 SiteSetting.js        — Sequelize model for site global settings
│
├── 📁 middlewares/
│   ├── 📄 auth-middleware.js    — JWT protection and admin verification
│   └── 📄 error-middleware.js   — Express global error handling middleware
│
├── 📁 router/
│   ├── 📄 index.js              — Main Express API router entry point
│   ├── 📄 auth-router.js        — Routes for login/profile
│   ├── 📄 category-router.js    — Routes for category CRUD
│   ├── 📄 product-router.js     — Routes for product CRUD
│   └── 📄 setting-router.js     — Routes for site settings
│
├── 📁 public/                   — Static assets served at root URL
│   ├── 📄 logo.jpg              — HulloTech brand logo (Navbar + Footer)
│   ├── 📄 icon.jpg              — Site favicon/icon
│   ├── 📄 1st-post.jpeg         — Banner/blog hero image
│   ├── 📄 2nd_post.jpeg         — Banner/blog hero image
│   ├── 📄 cover.jpeg            — Banner/blog hero image
│   ├── 📄 desktop.webp          — Category image: Desktops
│   ├── 📄 laptop.webp           — Category image: Laptops + product images
│   ├── 📄 components.jpg        — Category image: Components
│   ├── 📄 monitor.webp          — Category image: Monitors
│   ├── 📄 phone.webp            — Category image: Phones
│   ├── 📄 tab.webp              — Category image: Tablets
│   ├── 📄 camera.jpg            — Category image: Cameras
│   └── 📄 security.webp         — Category image: Security Cameras
│
├── 📁 src/
│   ├── 📁 app/                  — Next.js App Router (all routes)
│   │   ├── 📄 layout.jsx        — ROOT LAYOUT: <html>, Inter font, imports Navbar + Footer
│   │   ├── 📄 page.jsx          — HOME PAGE ("use client"): hero banner slider, quick links,
│   │   │                          CategoryGrid, Happy Hour, FeaturedProducts, New Arrivals,
│   │   │                          Recommendations, Blog section. Uses framer-motion for sliders.
│   │   ├── 📄 globals.css       — Global styles: Tailwind directives, CSS variables (--color-*),
│   │   │                          component classes (.product-card, .btn-primary, .mega-menu, etc.)
│   │   ├── 📄 icon.jpg          — App icon (Next.js metadata)
│   │   │
│   │   ├── 📁 [category]/[slug]/ — DYNAMIC PRODUCT DETAIL (catch-all: /:category/:slug)
│   │   │   ├── 📄 page.jsx      — Server component: finds product by slug, builds breadcrumb,
│   │   │   │                      gets related products, renders ProductDetailContent
│   │   │   └── 📄 ProductDetailContent.jsx — "use client": full PDP with image gallery,
│   │   │                          price table, key features, payment options (Cash/EMI),
│   │   │                          quantity selector, buy button, tabs (Spec/Desc/Reviews),
│   │   │                          related products sidebar
│   │   │
│   │   ├── 📁 desktops/
│   │   │   └── 📄 page.jsx      — Category listing: filters products by "desktops", renders ProductGrid
│   │   ├── 📁 laptop-notebook/
│   │   │   └── 📄 page.jsx      — Category listing: filters by "laptop-notebook"
│   │   ├── 📁 component/
│   │   │   └── 📄 page.jsx      — Category listing: filters by "component"
│   │   ├── 📁 monitor/
│   │   │   └── 📄 page.jsx      — Category listing: filters by "monitor"
│   │   ├── 📁 mobile-phone/
│   │   │   └── 📄 page.jsx      — Category listing: filters by "mobile-phone"
│   │   ├── 📁 tablet-pc/
│   │   │   └── 📄 page.jsx      — Category listing: filters by "tablet-pc"
│   │   ├── 📁 camera/
│   │   │   └── 📄 page.jsx      — Category listing: filters by "camera"
│   │   ├── 📁 security-camera/
│   │   │   └── 📄 page.jsx      — Category listing: filters by "security-camera"
│   │   │
│   │   ├── 📁 categories/[slug]/
│   │   │   └── 📄 page.jsx      — GENERIC category page ("use client"): looks up category by slug,
│   │   │                          shows simple product grid (no images, placeholder text)
│   │   │
│   │   ├── 📁 products/[id]/
│   │   │   └── 📄 page.jsx      — REDIRECT: old ID-based URLs → new /:category/:slug URLs
│   │   │
│   │   ├── 📁 blog/
│   │   │   └── 📄 page.jsx      — Blog listing: renders blogPosts from mockData with images
│   │   │
│   │   ├── 📁 contact/
│   │   │   └── 📄 page.jsx      — CONTACT PAGE ("use client"): fetches settings, contact form
│   │   │
│   │   ├── 📁 setup-builder/
│   │   │   └── 📄 page.jsx      — PC BUILDER ("use client"): select CPU/GPU/RAM, shows summary
│   │   │                              with total price, "Save Setup" button
│   │   │
│   │   ├── 📁 admin/
│   │   │   ├── 📁 login/
│   │   │   │   └── 📄 page.jsx  — ADMIN LOGIN ("use client"): login interface with API check
│   │   │   └── 📁 dashboard/
│   │   │       └── 📄 page.jsx  — ADMIN DASHBOARD ("use client"): site settings, category & product CRUD
│   │   │
│   │   ├── 📄 layout.jsx        — ROOT LAYOUT ("use server"): HTML wrapper, fonts, loads Header & Footer
│   │   ├── 📄 loading.jsx       — Global next/loading state skeleton
│   │   └── 📄 page.jsx          — HOMEPAGE ("use server"): loads BannerSlider, CategoryGrid,
│   │                              ProductSection (Featured + Hot deals)
│   │
│   ├── 📁 components/           — Reusable UI components
│   │   ├── 📄 Navbar.jsx        — "use client": top bar (offers/PC builder/compare/login),
│   │   │                          main navbar (logo, search, account, cart), category navigation
│   │   │                          with mega menu (hover dropdowns), mobile hamburger menu.
│   │   │                          Contains its OWN categories array with subcategories.
│   │   ├── 📄 Footer.jsx        — Server component: brand info, shop/support/company/legal links,
│   │   │                          newsletter signup, payment badges (VISA/MASTER/BKASH)
│   │   ├── 📄 CategoryGrid.jsx  — Server component: 8-column grid of category icons using
│   │   │                          categories from mockData + lucide icon mapping
│   │   ├── 📄 FeaturedProducts.jsx — "use client": filters products where featured===true,
│   │   │                          renders product cards with image, stars, price, cart button
│   │   └── 📄 ProductGrid.jsx   — Server component: generic product grid, receives {products, title}
│   │                              as props, renders cards with image, specs, price
│   │
│   ├── 📁 data/
│   │   └── 📄 mockData.js       — ALL APPLICATION DATA (no API/DB):
│   │
│   └── 📁 utils/
│       └── 📄 jwt.js            — Native JWT encoder/decoder using Node's crypto
│
└── 📁 public/
```

---

## 3. Dependency Map

### Import Graph (→ means "imports from")

```
src/app/layout.jsx
  → src/components/Navbar.jsx
  → src/components/Footer.jsx
  → src/app/globals.css

src/app/page.jsx (Home)
  → src/components/CategoryGrid.jsx
  → src/components/FeaturedProducts.jsx
  → next/link, next/image, lucide-react, react, framer-motion

src/components/CategoryGrid.jsx
  → src/data/mockData.js  (categories)
  → lucide-react (8 icon imports)

src/components/FeaturedProducts.jsx
  → src/data/mockData.js  (products)
  → lucide-react, next/image, next/link

src/components/ProductGrid.jsx
  → lucide-react, next/image, next/link
  (receives products via PROPS — no direct data import)

src/components/Navbar.jsx
  → next/link, next/image, lucide-react, next/navigation
  (defines its OWN categories array — NOT from mockData)

src/components/Footer.jsx
  → next/link, next/image, lucide-react
  (defines its OWN link arrays inline)

src/app/[category]/[slug]/page.jsx
  → src/data/mockData.js  (products, categories)
  → src/app/[category]/[slug]/ProductDetailContent.jsx

src/app/[category]/[slug]/ProductDetailContent.jsx
  → react, next/link, next/image, lucide-react
  (receives product, category, relatedProducts via PROPS)

src/app/{desktops,laptop-notebook,component,monitor,
         mobile-phone,tablet-pc,camera,security-camera}/page.jsx
  → src/data/mockData.js  (products)
  → src/components/ProductGrid.jsx
  → lucide-react (SlidersHorizontal)

src/app/categories/[slug]/page.jsx
  → src/data/mockData.js  (products, categories)
  → next/link, next/navigation, react

src/app/products/[id]/page.jsx
  → src/data/mockData.js  (products)
  → next/navigation (redirect, notFound)

src/app/blog/page.jsx
  → src/data/mockData.js  (blogPosts)
  → next/image

src/app/setup-builder/page.jsx
  → react (useState)
  (self-contained — defines its own parts[] data inline)
```

### Visual Dependency Diagram

```
                    ┌─────────────┐
                    │  layout.jsx │ (Root)
                    └──────┬──────┘
                    ┌──────┴──────┐
                    │             │
               ┌────▼───┐   ┌────▼───┐
               │ Navbar  │   │ Footer │
               └─────────┘   └────────┘

    ┌──────────────────────────────────────────┐
    │              mockData.js                 │
    │  (categories, products, blogPosts)       │
    └──┬─────┬──────┬──────┬───────┬───────┬───┘
       │     │      │      │       │       │
       ▼     ▼      ▼      ▼       ▼       ▼
  Category  Featured  8 Category  Blog  [category]  products/
   Grid    Products   Pages      Page   /[slug]     [id]
                        │                  │       (redirect)
                        ▼                  ▼
                   ProductGrid    ProductDetailContent
```

---

## 4. Key Functions & Exports

| File | Function/Export | Purpose | Used By |
|------|----------------|---------|---------|
| `mockData.js` | `categories` (array, 8 items) | Category definitions with id, name, icon, slug, image | CategoryGrid, [category]/[slug]/page, categories/[slug]/page |
| `mockData.js` | `products` (array, 21 items) | All product data with specs, pricing, stock status | FeaturedProducts, all 8 category pages, [category]/[slug]/page, products/[id]/page |
| `mockData.js` | `blogPosts` (array, 3 items) | Blog article metadata | blog/page.jsx |
| `Navbar.jsx` | `Navbar()` | Full site navigation with mega menu | layout.jsx |
| `Footer.jsx` | `Footer()` | Site footer with links and newsletter | layout.jsx |
| `CategoryGrid.jsx` | `CategoryGrid()` | Grid of 8 category icons with links | page.jsx (Home) |
| `FeaturedProducts.jsx` | `FeaturedProducts()` | Filtered grid of featured products | page.jsx (Home) |
| `ProductGrid.jsx` | `ProductGrid({ products, title })` | Generic product card grid | All 8 category pages |
| `ProductDetailContent.jsx` | `ProductDetailContent({ product, category, relatedProducts })` | Full product detail page UI | [category]/[slug]/page.jsx |

---

## 5. Data Flow

### Product Browsing Flow
```
[User visits /]
  → page.jsx (Home) renders:
      → CategoryGrid reads mockData.categories → renders icon grid
      → FeaturedProducts reads mockData.products (featured=true) → renders cards
      → Inline sections (Happy Hour, New Arrivals, Recommendations, Blog) with placeholder data

[User clicks category icon or nav link]
  → /{category}/page.jsx (e.g. /desktops)
      → Filters mockData.products by category slug
      → Passes filtered array to ProductGrid component
      → ProductGrid renders product cards with image, specs, price

[User clicks product card]
  → /[category]/[slug]/page.jsx (Server Component)
      → Finds product by slug in mockData.products
      → Finds category by slug in mockData.categories
      → Computes relatedProducts (same category, different ID, max 6)
      → Renders breadcrumb + passes data to ProductDetailContent

  → ProductDetailContent.jsx (Client Component)
      → Renders: image gallery, price table, key features, payment options,
        quantity selector, buy button, tabs (Spec/Desc/Reviews), sidebar
```

### Legacy URL Redirect
```
[User visits /products/:id]
  → products/[id]/page.jsx
      → Finds product by numeric ID
      → redirect() to /{product.category}/{product.slug}
```

### Navigation Data (IMPORTANT: Duplicated)
```
⚠️  Navbar.jsx defines its OWN categories array (10 items with subcategories)
    This is SEPARATE from mockData.js categories (8 items)
    They share some slugs but Navbar has more subcategory links
```

---

## 6. Configuration & Environment Variables

### `.env.local` handles sensitive configuration (ignored in git). Use `.env.example` as a template.

| Config File | Key Settings |
|-------------|-------------|
| `next.config.mjs` | Empty — default Next.js config |
| `tailwind.config.js` | Custom colors: `primary` (#0077e5), `primary-dark` (#010d21), `hullo-blue`, `hullo-navy`, `hullo-gray`, `star-*` palette. Font: Inter |
| `postcss.config.mjs` | Plugins: tailwindcss, autoprefixer |
| `globals.css` | CSS variables: `--color-primary`, `--color-text`, `--color-background`, etc. Component classes: `.product-card`, `.btn-primary`, `.btn-cart`, `.mega-menu`, `.category-link`, `.badge-new`, `.badge-sale` |
| `package.json` scripts | `dev`: next dev, `build`: next build, `start`: next start, `lint`: next lint |

### Design Token Reference

| Token | Value | Used For |
|-------|-------|----------|
| `star-blue` / `hullo-blue` | `#0077e5` | Primary brand color, buttons, links, accents |
| `star-dark-blue` / `hullo-navy` | `#010d21` | Top bar background, hover states, dark accents |
| `star-light-gray` / `hullo-gray` | `#f8fafc` | Page backgrounds, card backgrounds |
| `star-red` | `#e53935` | Cart/Buy buttons, sale badges |
| `star-orange` | `#ff6d00` | Happy Hour, promotional elements |
| `star-green` | `#43a047` | New badges, in-stock indicators |
| `star-yellow` | `#ffc107` | Star ratings |

---

## 7. Common Modification Points

### TO ADD A NEW PRODUCT CATEGORY:
1. Add category object to `mockData.js` → `categories[]` (with id, name, icon, slug, image)
2. Add product(s) to `mockData.js` → `products[]` with matching `category` slug
3. Create `src/app/{new-slug}/page.jsx` — copy any existing category page, change the filter string and brand options
4. Add the category to `Navbar.jsx` → `categories[]` array (with subcategories)
5. Add a matching icon import in `CategoryGrid.jsx` → `iconMap`
6. Add static image to `public/` for the category

### TO ADD A NEW PRODUCT:
1. Add product object to `mockData.js` → `products[]`
2. Set `category` to an existing category slug
3. Set `featured: true` if it should appear on the homepage
4. Product detail page auto-generates via `[category]/[slug]` dynamic route

### TO ADD A NEW PAGE/ROUTE:
1. Create `src/app/{route-name}/page.jsx`
2. The route is auto-registered by Next.js App Router
3. Add navigation link in `Navbar.jsx` and/or `Footer.jsx`

### TO CHANGE GLOBAL STYLING:
1. Modify CSS variables in `globals.css` → `:root` block
2. Modify Tailwind theme colors in `tailwind.config.js`
3. Modify component classes in `globals.css` → `@layer components`

### TO ADD A BACKEND/API:
1. Create a new router in `router/` (e.g., `product-router.js`)
2. Mount it in `router/index.js` (`router.use('/products', productRouter)`)
3. Create Sequelize models in a `models/` directory
4. Sync database via `server.js` or migrations
5. Replace `mockData.js` imports with `fetch()` calls to `/api/...` endpoints

### TO ADD CART FUNCTIONALITY:
1. Create a React Context or Zustand store in `src/context/` or `src/store/`
2. Wrap the app in the provider via `layout.jsx`
3. Update cart badge count in `Navbar.jsx` (currently hardcoded "0")
4. Connect "Buy Now" button in `ProductDetailContent.jsx`
5. Connect cart icon buttons in `FeaturedProducts.jsx` and `ProductGrid.jsx`

### TO CHANGE AUTHENTICATION:
1. Navbar links (`/account/login`, `/account/register`) are placeholder
2. Create `src/app/account/login/page.jsx` and `register/page.jsx`
3. Implement auth (NextAuth.js, Clerk, or custom)
4. Update Navbar to show user state

### TO ADD SEARCH FUNCTIONALITY:
1. `Navbar.jsx` has a search input (`searchQuery` state) but no logic
2. Implement search: filter `mockData.products` by name/specs or add API endpoint
3. Add a search results page at `src/app/search/page.jsx`

---

## 8. Testing Structure

**No tests exist in this project.**

There are no `__tests__/`, `test/`, or `*.test.*` files. No testing framework is configured.

### Recommended Testing Setup:
```
📁 __tests__/
  📄 mockData.test.js    — Validate data integrity (unique IDs, valid slugs, images exist)
  📄 navigation.test.js  — Verify all nav links resolve to valid routes
  📄 components.test.js  — Render tests for Navbar, Footer, ProductGrid, CategoryGrid
```

---

## 9. Known Architecture Notes & Gotchas

> ⚠️ **Duplicated Category Data**: `Navbar.jsx` defines its own 10-item `categories` array with subcategories. `mockData.js` has a separate 8-item `categories` array. These are NOT synced. When adding/editing categories, update BOTH.

> ⚠️ **No Real Backend**: All data is in `mockData.js`. Cart (0), reviews (hardcoded), search, auth, orders — all are UI-only placeholders.

> ⚠️ **Filter/Sort UI is Non-Functional**: All 8 category pages have brand filter dropdowns and sort dropdowns, but they are purely visual — no JS logic is connected.

> ⚠️ **Pricing is Synthetic**: `ProductDetailContent.jsx` computes `regularPrice = price * 1.12` to simulate discounts. This is not from real data.

> ⚠️ **Home Page Placeholders**: Happy Hour, New Arrivals, Recommendations, and Blog sections on the home page use hardcoded placeholder data (e.g., "Product 1", "Product 2") — they do NOT read from `mockData.js`.

> ⚠️ **Client vs Server Components**: Home page (`page.jsx`), Navbar, FeaturedProducts, CategoryPage (`categories/[slug]`), Setup Builder, and ProductDetailContent are "use client". All 8 category listing pages and the product detail page wrapper are server components.

> ⚠️ **Empty `[slug]` directory**: There is an empty `[slug]/` directory at the project root (outside `src/`). This appears to be a mistake and has no effect.

---

## 10. Route Map (All URLs)

| URL Pattern | File | Type | Description |
|-------------|------|------|-------------|
| `/` | `src/app/page.jsx` | Client | Homepage with banners, categories, featured products |
| `/desktops` | `src/app/desktops/page.jsx` | Server | Desktop PCs listing |
| `/laptop-notebook` | `src/app/laptop-notebook/page.jsx` | Server | Laptops listing |
| `/component` | `src/app/component/page.jsx` | Server | PC Components listing |
| `/monitor` | `src/app/monitor/page.jsx` | Server | Monitors listing |
| `/mobile-phone` | `src/app/mobile-phone/page.jsx` | Server | Phones listing |
| `/tablet-pc` | `src/app/tablet-pc/page.jsx` | Server | Tablets listing |
| `/camera` | `src/app/camera/page.jsx` | Server | Cameras listing |
| `/security-camera` | `src/app/security-camera/page.jsx` | Server | Security cameras listing |
| `/:category/:slug` | `src/app/[category]/[slug]/page.jsx` | Server | Product detail page |
| `/categories/:slug` | `src/app/categories/[slug]/page.jsx` | Client | Generic category page (simpler) |
| `/products/:id` | `src/app/products/[id]/page.jsx` | Server | Redirects to /:category/:slug |
| `/blog` | `src/app/blog/page.jsx` | Server | Blog listing |
| `/contact` | `src/app/contact/page.jsx` | Client | Contact page with dynamic info |
| `/setup-builder` | `src/app/setup-builder/page.jsx` | Client | PC Builder tool |

### Referenced but NOT implemented routes (dead links):
`/offers`, `/new-arrivals`, `/happy-hour`, `/tool/pc_builder`, `/compare`, `/track-order`, `/help`, `/account`, `/account/login`, `/account/register`, `/cart`, `/shipping`, `/returns`, `/faq`, `/about`, `/careers`, `/press`, `/stores`, `/privacy`, `/terms`, `/cookies`, `/sitemap`, `/gaming`, and all Navbar subcategory links (e.g., `/desktops/gaming-pc`, `/component/processor`, `/apple-iphone`, etc.)
