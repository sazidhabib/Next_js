"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const staticCategories = [
  {
    name: "Desktop",
    href: "/desktops",
    subCategories: [
      {
        name: "Gaming PC",
        href: "/desktops/gaming-pc",
        subCategories: [
          { name: "Intel Gaming PC", href: "/desktops/gaming-pc/intel" },
          { name: "AMD Gaming PC", href: "/desktops/gaming-pc/amd" },
          { name: "Custom Gaming Build", href: "/desktops/gaming-pc/custom" }
        ]
      },
      {
        name: "Brand PC",
        href: "/desktops/brand-pc",
        subCategories: [
          { name: "HP Brand PC", href: "/desktops/brand-pc/hp" },
          { name: "Dell Brand PC", href: "/desktops/brand-pc/dell" },
          { name: "Lenovo Brand PC", href: "/desktops/brand-pc/lenovo" }
        ]
      },
      { name: "All-in-One PC", href: "/desktops/all-in-one-pc" },
      { name: "Portable Mini PC", href: "/desktops/portable-mini-pc" }
    ]
  },
  {
    name: "Laptop",
    href: "/laptop-notebook",
    subCategories: [
      {
        name: "All Laptop",
        href: "/laptop-notebook/laptop",
        subCategories: [
          { name: "HP Laptops", href: "/laptop-notebook/laptop/hp" },
          { name: "Dell Laptops", href: "/laptop-notebook/laptop/dell" },
          { name: "Lenovo Laptops", href: "/laptop-notebook/laptop/lenovo" },
          { name: "Asus Laptops", href: "/laptop-notebook/laptop/asus" }
        ]
      },
      {
        name: "Gaming Laptop",
        href: "/laptop-notebook/Gaming-Laptop",
        subCategories: [
          { name: "ASUS ROG/TUF", href: "/laptop-notebook/Gaming-Laptop/asus" },
          { name: "MSI Gaming", href: "/laptop-notebook/Gaming-Laptop/msi" },
          { name: "Lenovo Legion", href: "/laptop-notebook/Gaming-Laptop/lenovo" }
        ]
      },
      { name: "Premium Ultrabook", href: "/laptop-notebook/ultrabook" },
      { name: "Laptop Bag", href: "/laptop-bag-backpack" }
    ]
  },
  {
    name: "Component",
    href: "/component",
    subCategories: [
      {
        name: "Processor",
        href: "/component/processor",
        subCategories: [
          { name: "Intel Processor", href: "/component/processor/intel" },
          { name: "AMD Processor", href: "/component/processor/amd" }
        ]
      },
      {
        name: "Motherboard",
        href: "/component/motherboard",
        subCategories: [
          { name: "ASUS Motherboard", href: "/component/motherboard/asus" },
          { name: "MSI Motherboard", href: "/component/motherboard/msi" },
          { name: "Gigabyte Motherboard", href: "/component/motherboard/gigabyte" }
        ]
      },
      {
        name: "Graphics Card",
        href: "/component/graphics-card",
        subCategories: [
          { name: "NVIDIA GeForce", href: "/component/graphics-card/nvidia" },
          { name: "AMD Radeon", href: "/component/graphics-card/amd" }
        ]
      },
      { name: "RAM (Desktop)", href: "/component/ram" },
      { name: "RAM (Laptop)", href: "/component/laptop-ram" },
      { name: "SSD", href: "/ssd" },
      { name: "Hard Disk Drive", href: "/component/hard-disk-drive" },
      { name: "Power Supply", href: "/component/power-supply" },
      { name: "Casing", href: "/component/casing" }
    ]
  },
  {
    name: "Monitor",
    href: "/monitor",
    subCategories: [
      {
        name: "Gaming Monitor",
        href: "/gaming-monitor",
        subCategories: [
          { name: "144Hz Monitor", href: "/gaming-monitor/144hz" },
          { name: "240Hz Monitor", href: "/gaming-monitor/240hz" },
          { name: "Ultrawide Gaming", href: "/gaming-monitor/ultrawide" }
        ]
      },
      { name: "Curved Monitor", href: "/curved-monitor" },
      { name: "4K Monitor", href: "/4k-monitor" },
      { name: "Portable Monitor", href: "/portable-monitor" }
    ]
  },
  {
    name: "Power",
    href: "/power",
    subCategories: [
      { name: "UPS", href: "/ups" },
      { name: "Online UPS", href: "/online-ups" },
      { name: "Mini UPS", href: "/mini-ups" },
      { name: "Portable Power Station", href: "/portable-power-station" }
    ]
  },
  {
    name: "Phone",
    href: "/mobile-phone",
    subCategories: [
      {
        name: "iPhone",
        href: "/apple-iphone",
        subCategories: [
          { name: "iPhone 15 Pro Max", href: "/apple-iphone/iphone-15-pro-max" },
          { name: "iPhone 15 Pro", href: "/apple-iphone/iphone-15-pro" },
          { name: "iPhone 15", href: "/apple-iphone/iphone-15" },
          { name: "iPhone 14 Series", href: "/apple-iphone/iphone-14" },
          { name: "iPhone 13 Series", href: "/apple-iphone/iphone-13" }
        ]
      },
      {
        name: "Samsung",
        href: "/samsung-mobile-phone",
        subCategories: [
          { name: "Galaxy S24 Ultra", href: "/samsung-mobile-phone/s24-ultra" },
          { name: "Galaxy S24 Series", href: "/samsung-mobile-phone/s24" },
          { name: "Galaxy Fold/Flip", href: "/samsung-mobile-phone/fold-flip" },
          { name: "Galaxy A Series", href: "/samsung-mobile-phone/a-series" }
        ]
      },
      { name: "Redmi", href: "/xiaomi-mobile-phone" },
      { name: "Realme", href: "/realme-mobile-phone" }
    ]
  },
  {
    name: "Tablet",
    href: "/tablet-pc",
    subCategories: [
      {
        name: "iPad",
        href: "/apple-ipad",
        subCategories: [
          { name: "iPad Pro", href: "/apple-ipad/ipad-pro" },
          { name: "iPad Air", href: "/apple-ipad/ipad-air" },
          { name: "iPad Mini", href: "/apple-ipad/ipad-mini" },
          { name: "iPad 10.2", href: "/apple-ipad/ipad-10-2" }
        ]
      },
      { name: "Samsung", href: "/samsung-tablet" },
      { name: "Lenovo", href: "/tablet-pc/lenovo-tablet-pc" },
      { name: "Graphics Tablet", href: "/graphics-tablet" }
    ]
  },
  {
    name: "Office Equipment",
    href: "/office-equipment",
    subCategories: [
      { name: "Printer", href: "/printer" },
      { name: "Photocopier", href: "/photocopier" },
      { name: "Projector", href: "/projector" },
      { name: "Scanner", href: "/office-equipment/Scanner" }
    ]
  },
  {
    name: "Camera",
    href: "/camera",
    subCategories: [
      { name: "DSLR", href: "/dslr-camera" },
      { name: "Mirrorless Camera", href: "/mirrorless-camera" },
      { name: "Action Camera", href: "/camera/action-camera" },
      { name: "Security Camera", href: "/security-camera" }
    ]
  },
  {
    name: "Security",
    href: "/security-camera",
    subCategories: [
      { name: "WiFi Camera", href: "/wifi-camera" },
      { name: "IP Camera", href: "/ip-camera" },
      { name: "DVR/NVR", href: "/dvr-nvr" },
      { name: "Accessories", href: "/security-accessories" }
    ]
  }
];

export default function SubCategoryHeader() {
  const pathname = usePathname();
  const [categories, setCategories] = useState(staticCategories);

  useEffect(() => {
    const parseMenu = (menuData) => {
      if (!menuData) return staticCategories;
      if (Array.isArray(menuData)) return menuData;
      if (typeof menuData === 'string') {
        try {
          const parsed = JSON.parse(menuData);
          return Array.isArray(parsed) && parsed.length > 0 ? parsed : staticCategories;
        } catch {
          return staticCategories;
        }
      }
      return staticCategories;
    };

    fetch('/api/settings', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCategories(parseMenu(data.data.menuItems));
        }
      })
      .catch((err) => {
        console.warn('Failed to load dynamic categories in header, using static fallback:', err);
      });
  }, []);

  const normalizePath = (path) => {
    if (!path) return '';
    // Strip '/categories' prefix if present, strip leading and trailing slashes
    return path.replace(/^\/categories/, '').replace(/^\//, '').replace(/\/$/, '');
  };

  const currentNormalized = normalizePath(pathname);
  const matchedCategory = categories.find(
    (cat) => normalizePath(cat.href) === currentNormalized
  );

  if (!matchedCategory || !matchedCategory.subCategories || matchedCategory.subCategories.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-6">
      <div className="flex flex-wrap gap-2.5 pb-2 pt-1">
        {matchedCategory.subCategories.map((sub) => (
          <Link
            key={sub.name}
            href={sub.href}
            className="px-4 py-2 bg-white hover:bg-star-blue hover:text-white border border-star-gray hover:border-star-blue rounded-full text-sm font-semibold transition-all duration-200 shadow-sm text-gray-700"
          >
            {sub.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
