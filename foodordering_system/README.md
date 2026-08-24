# GloriaFood-Inspired Online Restaurant Ordering Platform

An end-to-end multi-tenant restaurant online food ordering platform inspired by **GloriaFood** and **FoodBooking**. Built with **Next.js 16 (App Router)**, **MySQL**, and **Prisma ORM**.

---

## ✨ Features

- **🍔 Customer Storefront (`/menu/bellavista-pizza`)**:
  - Sticky category navigation with live search and dietary filter pills (🌱 Vegetarian, 🌶️ Spicy, ⭐ Popular, 🌿 Vegan).
  - Item customizer modal for single-choice and multi-choice modifier groups (sizes, crusts, extra toppings, doneness).
  - Dynamic cart drawer with automatic delivery zone calculation and minimum order validation.
- **🔔 Live Kitchen Order Taking Receiver (`/admin/live-orders`)**:
  - Web Audio API real-time incoming order bell chime.
  - One-click prep time acceptance (`+15m`, `+25m`, `+35m`, `+45m`) or structured rejection.
  - 80mm thermal receipt printer template.
- **🕒 Customer Live Tracking (`/order/[id]`)**:
  - GloriaFood pulse animation, 5-stage progress timeline, and live status polling.
- **📊 Multi-Role Admin Suite (`/admin`)**:
  - **Overview**: Real-time sales metrics, revenue, order count, and fulfillment distribution.
  - **Menu Management (`/admin/menu`)**: Categories, items, modifier groups, and one-click In-Stock/Out-of-Stock toggles.
  - **Delivery Zones (`/admin/zones`)**: Concentric radius rings, delivery fees, minimum order amounts, and free delivery thresholds.
  - **Invoices (`/admin/invoices`)**: Searchable invoices with tax breakdown and printable receipts.
  - **Operating Hours & Profile (`/admin/settings`)**: Weekly operating timetable and tax rate %.
  - **Staff Management (`/admin/users`)**: Role-based access control (`SUPER_ADMIN`, `RESTAURANT_ADMIN`, `STAFF_OPERATOR`).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Server Actions, API Routes)
- **Database & ORM**: MySQL + Prisma ORM
- **Styling**: Tailwind CSS + Gourmet Dark/Light UI System
- **Icons**: Lucide React
- **Audio Engine**: Web Audio API Sound Synthesizer

---

## 🚀 Getting Started

### 1. Configure MySQL Database
Edit `.env` and provide your MySQL connection string:
```env
DATABASE_URL="mysql://root:password@localhost:3306/foodordering_db"
```

### 2. Push Schema & Seed
```bash
# Push Prisma schema to MySQL
npx prisma db push

# Seed initial restaurant, menu, modifier groups, zones, and users
node prisma/seed.js
```

### 3. Run Development Server
```bash
npm run dev
```

Visit:
- **Landing & Showcase**: `http://localhost:3000`
- **Customer Storefront**: `http://localhost:3000/menu/bellavista-pizza`
- **Kitchen Order Receiver**: `http://localhost:3000/admin/live-orders`
- **Admin Dashboard**: `http://localhost:3000/admin`
- **Prisma Visual Studio**: `npx prisma studio`
