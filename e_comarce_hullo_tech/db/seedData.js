const categories = [
  {
    "id": 1,
    "name": "Desktops",
    "icon": "HardDrive",
    "slug": "desktops",
    "image": "/desktop.webp"
  },
  {
    "id": 2,
    "name": "Laptops",
    "icon": "Laptop",
    "slug": "laptop-notebook",
    "image": "/laptop.webp"
  },
  {
    "id": 3,
    "name": "Components",
    "icon": "Cpu",
    "slug": "component",
    "image": "/components.jpg"
  },
  {
    "id": 4,
    "name": "Monitors",
    "icon": "Monitor",
    "slug": "monitor",
    "image": "/monitor.webp"
  },
  {
    "id": 5,
    "name": "Phones",
    "icon": "Smartphone",
    "slug": "mobile-phone",
    "image": "/phone.webp"
  },
  {
    "id": 6,
    "name": "Tablets",
    "icon": "Tablet",
    "slug": "tablet-pc",
    "image": "/tab.webp"
  },
  {
    "id": 7,
    "name": "Cameras",
    "icon": "Camera",
    "slug": "camera",
    "image": "/camera.jpg"
  },
  {
    "id": 8,
    "name": "Security",
    "icon": "Shield",
    "slug": "security-camera",
    "image": "/security.webp"
  }
];

const products = [
  {
    "id": 1,
    "name": "Quantum X Gaming Laptop",
    "slug": "quantum-x-gaming-laptop",
    "price": 2499,
    "category": "laptop-notebook",
    "image": "/laptop.webp",
    "images": [
      "/laptop.webp",
      "/laptop.webp",
      "/laptop.webp"
    ],
    "specs": [
      "Intel i9-14900H",
      "RTX 4090",
      "32GB DDR5",
      "1TB NVMe SSD"
    ],
    "description": "High-performance gaming laptop with latest Intel processor and RTX 4090 graphics.",
    "featured": true,
    "brand": "Quantum",
    "model": "QX-14900K",
    "stock": true,
    "warranty": "3 Years",
    "specifications": {
      "Basic Information": {
        "Product Name": "Quantum X Gaming Laptop",
        "Model": "QX-14900K"
      },
      "Processor": {
        "Processor Type": "Intel i9-14900H",
        "Processor Speed": "Up to 5.0 GHz"
      },
      "Display": {
        "Display Size": "15.6-inch",
        "Resolution": "1920 x 1080 (FHD)"
      },
      "Memory & Storage": {
        "RAM": "32GB DDR5",
        "Storage": "1TB NVMe SSD"
      },
      "Graphics": {
        "Graphics Card": "RTX 4090"
      }
    }
  },
  {
    "id": 2,
    "name": "Nebula Pro Ultrabook",
    "slug": "nebula-pro-ultrabook",
    "price": 1899,
    "category": "laptop-notebook",
    "image": "/laptop.webp",
    "images": [
      "/laptop.webp",
      "/laptop.webp"
    ],
    "specs": [
      "Intel i7-13700H",
      "RTX 4060",
      "16GB DDR5",
      "512GB SSD"
    ],
    "description": "Sleek and powerful ultrabook for professionals.",
    "featured": true,
    "brand": "Nebula",
    "model": "NP-13700H",
    "stock": true,
    "warranty": "3 Years",
    "specifications": {
      "Basic Information": {
        "Product Name": "Nebula Pro Ultrabook",
        "Model": "NP-13700H"
      },
      "Processor": {
        "Processor Type": "Intel i7-13700H",
        "Processor Speed": "Up to 5.0 GHz"
      },
      "Display": {
        "Display Size": "15.6-inch",
        "Resolution": "1920 x 1080 (FHD)"
      },
      "Memory & Storage": {
        "RAM": "16GB DDR5",
        "Storage": "512GB SSD"
      },
      "Graphics": {
        "Graphics Card": "RTX 4060"
      }
    }
  },
  {
    "id": 3,
    "name": "ROG Strix G16",
    "slug": "rog-strix-g16",
    "price": 3299,
    "category": "laptop-notebook",
    "image": "/laptop.webp",
    "images": [
      "/laptop.webp"
    ],
    "specs": [
      "AMD Ryzen 9 7940HS",
      "RTX 4080",
      "64GB DDR5",
      "2TB SSD"
    ],
    "description": "Ultimate gaming machine with Ryzen 9 and RTX 4080.",
    "featured": true,
    "brand": "ASUS",
    "model": "G16-7940HS",
    "stock": true,
    "warranty": "3 Years",
    "specifications": {
      "Basic Information": {
        "Product Name": "ROG Strix G16",
        "Model": "G16-7940HS"
      },
      "Processor": {
        "Processor Type": "AMD Ryzen 9 7940HS",
        "Processor Speed": "Up to 5.0 GHz"
      },
      "Display": {
        "Display Size": "15.6-inch",
        "Resolution": "1920 x 1080 (FHD)"
      },
      "Memory & Storage": {
        "RAM": "64GB DDR5",
        "Storage": "2TB SSD"
      },
      "Graphics": {
        "Graphics Card": "RTX 4080"
      }
    }
  },
  {
    "id": 4,
    "name": "MacBook Pro M3 Max",
    "slug": "macbook-pro-m3-max",
    "price": 3999,
    "category": "laptop-notebook",
    "image": "/laptop.webp",
    "images": [
      "/laptop.webp"
    ],
    "specs": [
      "Apple M3 Max",
      "48GB Unified",
      "1TB SSD",
      "14-core GPU"
    ],
    "description": "Apple's most powerful laptop with M3 Max chip.",
    "featured": false,
    "brand": "Apple",
    "model": "MBP-M3-Max",
    "stock": true,
    "warranty": "3 Years",
    "specifications": {
      "Basic Information": {
        "Product Name": "MacBook Pro M3 Max",
        "Model": "MBP-M3-Max"
      },
      "Processor": {
        "Processor Type": "Apple M3 Max",
        "Processor Speed": "Up to 5.0 GHz"
      },
      "Display": {
        "Display Size": "15.6-inch",
        "Resolution": "1920 x 1080 (FHD)"
      },
      "Memory & Storage": {
        "RAM": "1TB SSD",
        "Storage": "14-core GPU"
      },
      "Graphics": {
        "Graphics Card": "48GB Unified"
      }
    }
  },
  {
    "id": 5,
    "name": "Nebula Pro Phone 15",
    "slug": "nebula-pro-phone-15",
    "price": 1299,
    "category": "mobile-phone",
    "image": "/phone.webp",
    "images": [
      "/phone.webp"
    ],
    "specs": [
      "Snapdragon 8 Gen 3",
      "12GB RAM",
      "256GB Storage",
      "200MP Camera"
    ],
    "description": "Flagship phone with cutting-edge camera system.",
    "featured": true,
    "brand": "Nebula",
    "model": "NP-15-Pro",
    "stock": true,
    "warranty": "1 Year",
    "specifications": {
      "Basic Information": {
        "Product Name": "Nebula Pro Phone 15",
        "Model": "NP-15-Pro"
      },
      "Processor & Memory": {
        "Processor Type": "Snapdragon 8 Gen 3",
        "RAM": "12GB RAM"
      },
      "Storage": {
        "Capacity": "256GB Storage"
      },
      "Camera": {
        "Main Camera": "200MP Camera"
      }
    }
  },
  {
    "id": 6,
    "name": "iPhone 16 Pro Max",
    "slug": "iphone-16-pro-max",
    "price": 1599,
    "category": "mobile-phone",
    "image": "/phone.webp",
    "images": [
      "/phone.webp"
    ],
    "specs": [
      "A18 Pro Chip",
      "8GB RAM",
      "512GB Storage",
      "48MP Camera"
    ],
    "description": "Apple's latest iPhone with A18 Pro processor.",
    "featured": true,
    "brand": "Apple",
    "model": "IP-16-Pro-Max",
    "stock": true,
    "warranty": "1 Year",
    "specifications": {
      "Basic Information": {
        "Product Name": "iPhone 16 Pro Max",
        "Model": "IP-16-Pro-Max"
      },
      "Processor & Memory": {
        "Processor Type": "A18 Pro Chip",
        "RAM": "8GB RAM"
      },
      "Storage": {
        "Capacity": "512GB Storage"
      },
      "Camera": {
        "Main Camera": "48MP Camera"
      }
    }
  },
  {
    "id": 7,
    "name": "Galaxy S26 Ultra",
    "slug": "galaxy-s26-ultra",
    "price": 1399,
    "category": "mobile-phone",
    "image": "/phone.webp",
    "images": [
      "/phone.webp"
    ],
    "specs": [
      "Exynos 2400",
      "12GB RAM",
      "512GB Storage",
      "200MP Camera"
    ],
    "description": "Samsung's premium flagship with S Pen support.",
    "featured": false,
    "brand": "Samsung",
    "model": "GS-S26-Ultra",
    "stock": false,
    "warranty": "1 Year",
    "specifications": {
      "Basic Information": {
        "Product Name": "Galaxy S26 Ultra",
        "Model": "GS-S26-Ultra"
      },
      "Processor & Memory": {
        "Processor Type": "Exynos 2400",
        "RAM": "12GB RAM"
      },
      "Storage": {
        "Capacity": "512GB Storage"
      },
      "Camera": {
        "Main Camera": "200MP Camera"
      }
    }
  },
  {
    "id": 8,
    "name": "Quantum X Desktop PC",
    "slug": "quantum-x-desktop-pc",
    "price": 3499,
    "category": "desktops",
    "image": "/desktop.webp",
    "images": [
      "/desktop.webp",
      "/desktop.webp"
    ],
    "specs": [
      "Intel i9-14900K",
      "RTX 4090",
      "64GB DDR5",
      "4TB NVMe SSD"
    ],
    "description": "Ultimate gaming and workstation desktop with top-tier specs.",
    "featured": true,
    "brand": "Quantum",
    "model": "QX-Desktop-14900K",
    "stock": true,
    "warranty": "3 Years",
    "specifications": {
      "Basic Information": {
        "Product Name": "Quantum X Desktop PC",
        "Model": "QX-Desktop-14900K"
      },
      "Processor": {
        "Processor Type": "Intel i9-14900K"
      },
      "Memory & Storage": {
        "RAM": "RTX 4090",
        "Storage": "64GB DDR5"
      },
      "Graphics": {
        "Graphics Card": "4TB NVMe SSD"
      }
    }
  },
  {
    "id": 11,
    "name": "Intel Core i9-14900K",
    "slug": "intel-core-i9-14900k",
    "price": 599,
    "category": "component",
    "image": "/components.jpg",
    "images": [
      "/components.jpg"
    ],
    "specs": [
      "24 Cores",
      "32 Threads",
      "6.0GHz Boost",
      "LGA1700"
    ],
    "description": "Intel's flagship desktop processor with 24 cores.",
    "featured": false,
    "brand": "Intel",
    "model": "i9-14900K",
    "stock": true,
    "warranty": "3 Years",
    "specifications": {
      "Basic Information": {
        "Product Name": "Intel Core i9-14900K",
        "Model": "i9-14900K"
      },
      "Technical Details": {
        "Detail 1": "24 Cores",
        "Detail 2": "32 Threads"
      }
    }
  },
  {
    "id": 14,
    "name": "27\" 4K Gaming Monitor",
    "slug": "27-inch-4k-gaming-monitor",
    "price": 699,
    "category": "monitor",
    "image": "/monitor.webp",
    "images": [
      "/monitor.webp"
    ],
    "specs": [
      "27-inch",
      "4K UHD",
      "144Hz",
      "1ms Response"
    ],
    "description": "Professional 4K monitor for gaming and content creation.",
    "featured": true,
    "brand": "Samsung",
    "model": "S27-4K-Gaming",
    "stock": true,
    "warranty": "3 Years",
    "specifications": {
      "Basic Information": {
        "Product Name": "27\" 4K Gaming Monitor",
        "Model": "S27-4K-Gaming"
      },
      "Technical Details": {
        "Detail 1": "27-inch",
        "Detail 2": "4K UHD"
      }
    }
  }
];

module.exports = { categories, products };
