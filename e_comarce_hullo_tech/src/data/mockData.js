export const categories = [
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

export const products = [
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
    "price": "28,880",
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
    "id": 9,
    "name": "AMD Ryzen 3 2200G Desktop PC",
    "slug": "amd-ryzen-3-2200g-desktop-pc",
    "price": 899,
    "category": "desktops",
    "image": "/desktop.webp",
    "images": [
      "/desktop.webp"
    ],
    "specs": [
      "AMD Ryzen 3 2200G",
      "8GB DDR4",
      "256GB SSD",
      "Integrated Graphics"
    ],
    "description": "Budget-friendly desktop with integrated Vega graphics.",
    "featured": false,
    "brand": "AMD",
    "model": "R3-2200G-PC",
    "stock": true,
    "warranty": "3 Years",
    "specifications": {
      "Basic Information": {
        "Product Name": "AMD Ryzen 3 2200G Desktop PC",
        "Model": "R3-2200G-PC"
      },
      "Processor": {
        "Processor Type": "AMD Ryzen 3 2200G"
      },
      "Memory & Storage": {
        "RAM": "8GB DDR4",
        "Storage": "256GB SSD"
      },
      "Graphics": {
        "Graphics Card": "Integrated Graphics"
      }
    }
  },
  {
    "id": 10,
    "name": "Mini PC Pro",
    "slug": "mini-pc-pro",
    "price": 899,
    "category": "desktops",
    "image": "/desktop.webp",
    "images": [
      "/desktop.webp"
    ],
    "specs": [
      "Intel i7-13700",
      "RTX 4060",
      "32GB DDR4",
      "1TB SSD"
    ],
    "description": "Compact powerhouse for space-constrained setups.",
    "featured": false,
    "brand": "MiniTech",
    "model": "Mini-PC-i7",
    "stock": true,
    "warranty": "3 Years",
    "specifications": {
      "Basic Information": {
        "Product Name": "Mini PC Pro",
        "Model": "Mini-PC-i7"
      },
      "Processor": {
        "Processor Type": "Intel i7-13700"
      },
      "Memory & Storage": {
        "RAM": "RTX 4060",
        "Storage": "32GB DDR4"
      },
      "Graphics": {
        "Graphics Card": "1TB SSD"
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
    "id": 12,
    "name": "RTX 4090 Graphics Card",
    "slug": "rtx-4090-graphics-card",
    "price": 1899,
    "category": "component",
    "image": "/components.jpg",
    "images": [
      "/components.jpg"
    ],
    "specs": [
      "24GB GDDR6X",
      "16384 CUDA Cores",
      "450W TDP"
    ],
    "description": "NVIDIA's most powerful consumer graphics card.",
    "featured": false,
    "brand": "NVIDIA",
    "model": "RTX-4090",
    "stock": true,
    "warranty": "3 Years",
    "specifications": {
      "Basic Information": {
        "Product Name": "RTX 4090 Graphics Card",
        "Model": "RTX-4090"
      },
      "Technical Details": {
        "Detail 1": "24GB GDDR6X",
        "Detail 2": "16384 CUDA Cores"
      }
    }
  },
  {
    "id": 13,
    "name": "32GB DDR5 RAM Kit",
    "slug": "32gb-ddr5-ram-kit",
    "price": 249,
    "category": "component",
    "image": "/components.jpg",
    "images": [
      "/components.jpg"
    ],
    "specs": [
      "6000MHz",
      "CL30",
      "RGB Lighting",
      "2x16GB"
    ],
    "description": "High-speed DDR5 memory kit with RGB lighting.",
    "featured": false,
    "brand": "Kingston",
    "model": "DDR5-32GB-Kit",
    "stock": true,
    "warranty": "3 Years",
    "specifications": {
      "Basic Information": {
        "Product Name": "32GB DDR5 RAM Kit",
        "Model": "DDR5-32GB-Kit"
      },
      "Technical Details": {
        "Detail 1": "6000MHz",
        "Detail 2": "CL30"
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
  },
  {
    "id": 15,
    "name": "32\" Curved Monitor",
    "slug": "32-inch-curved-monitor",
    "price": 899,
    "category": "monitor",
    "image": "/monitor.webp",
    "images": [
      "/monitor.webp"
    ],
    "specs": [
      "32-inch",
      "QHD 1440p",
      "165Hz",
      "1500R Curvature"
    ],
    "description": "Immersive curved monitor for gaming and productivity.",
    "featured": false,
    "brand": "MSI",
    "model": "MSI-32-Curved",
    "stock": true,
    "warranty": "3 Years",
    "specifications": {
      "Basic Information": {
        "Product Name": "32\" Curved Monitor",
        "Model": "MSI-32-Curved"
      },
      "Technical Details": {
        "Detail 1": "32-inch",
        "Detail 2": "QHD 1440p"
      }
    }
  },
  {
    "id": 16,
    "name": "iPad Pro M3",
    "slug": "ipad-pro-m3",
    "price": 1099,
    "category": "tablet-pc",
    "image": "/tab.webp",
    "images": [
      "/tab.webp"
    ],
    "specs": [
      "M3 Chip",
      "12.9-inch",
      "256GB Storage",
      "Face ID"
    ],
    "description": "Apple's most advanced tablet with M3 chip.",
    "featured": true,
    "brand": "Apple",
    "model": "iPad-Pro-M3",
    "stock": true,
    "warranty": "1 Year",
    "specifications": {
      "Basic Information": {
        "Product Name": "iPad Pro M3",
        "Model": "iPad-Pro-M3"
      },
      "Technical Details": {
        "Detail 1": "M3 Chip",
        "Detail 2": "12.9-inch"
      }
    }
  },
  {
    "id": 17,
    "name": "Galaxy Tab S10 Ultra",
    "slug": "galaxy-tab-s10-ultra",
    "price": 999,
    "category": "tablet-pc",
    "image": "/tab.webp",
    "images": [
      "/tab.webp"
    ],
    "specs": [
      "Snapdragon 8 Gen 3",
      "14.6-inch",
      "512GB Storage",
      "S Pen Included"
    ],
    "description": "Samsung's largest tablet with S Pen included.",
    "featured": false,
    "brand": "Samsung",
    "model": "Tab-S10-Ultra",
    "stock": true,
    "warranty": "1 Year",
    "specifications": {
      "Basic Information": {
        "Product Name": "Galaxy Tab S10 Ultra",
        "Model": "Tab-S10-Ultra"
      },
      "Technical Details": {
        "Detail 1": "Snapdragon 8 Gen 3",
        "Detail 2": "14.6-inch"
      }
    }
  },
  {
    "id": 18,
    "name": "EOS R6 Mark II",
    "slug": "canon-eos-r6-mark-ii",
    "price": 2499,
    "category": "camera",
    "image": "/camera.jpg",
    "images": [
      "/camera.jpg"
    ],
    "specs": [
      "24.2MP Full Frame",
      "40fps Burst",
      "4K 60p Video",
      "IBIS"
    ],
    "description": "Canon's versatile full-frame mirrorless camera.",
    "featured": false,
    "brand": "Canon",
    "model": "EOS-R6-M2",
    "stock": true,
    "warranty": "1 Year",
    "specifications": {
      "Basic Information": {
        "Product Name": "EOS R6 Mark II",
        "Model": "EOS-R6-M2"
      },
      "Technical Details": {
        "Detail 1": "24.2MP Full Frame",
        "Detail 2": "40fps Burst"
      }
    }
  },
  {
    "id": 19,
    "name": "Alpha A7R V",
    "slug": "sony-alpha-a7r-v",
    "price": 3899,
    "category": "camera",
    "image": "/camera.jpg",
    "images": [
      "/camera.jpg"
    ],
    "specs": [
      "61MP Full Frame",
      "8K Video",
      "693-point AF",
      "5-axis IBIS"
    ],
    "description": "Sony's highest resolution mirrorless camera.",
    "featured": false,
    "brand": "Sony",
    "model": "A7R-V",
    "stock": false,
    "warranty": "1 Year",
    "specifications": {
      "Basic Information": {
        "Product Name": "Alpha A7R V",
        "Model": "A7R-V"
      },
      "Technical Details": {
        "Detail 1": "61MP Full Frame",
        "Detail 2": "8K Video"
      }
    }
  },
  {
    "id": 20,
    "name": "4K Security Camera",
    "slug": "4k-security-camera",
    "price": 299,
    "category": "security-camera",
    "image": "/security.webp",
    "images": [
      "/security.webp"
    ],
    "specs": [
      "4K Resolution",
      "Night Vision",
      "Motion Detection",
      "IP66 Weatherproof"
    ],
    "description": "Professional 4K security camera with night vision.",
    "featured": false,
    "brand": "Hikvision",
    "model": "4K-Sec-Cam",
    "stock": true,
    "warranty": "3 Years",
    "specifications": {
      "Basic Information": {
        "Product Name": "4K Security Camera",
        "Model": "4K-Sec-Cam"
      },
      "Technical Details": {
        "Detail 1": "4K Resolution",
        "Detail 2": "Night Vision"
      }
    }
  },
  {
    "id": 21,
    "name": "WiFi Smart Camera",
    "slug": "wifi-smart-camera",
    "price": 89,
    "category": "security-camera",
    "image": "/security.webp",
    "images": [
      "/security.webp"
    ],
    "specs": [
      "1080p HD",
      "Two-way Audio",
      "Motion Alerts",
      "Cloud Storage"
    ],
    "description": "Affordable WiFi camera for home monitoring.",
    "featured": false,
    "brand": "TP-Link",
    "model": "WiFi-Cam-HD",
    "stock": true,
    "warranty": "3 Years",
    "specifications": {
      "Basic Information": {
        "Product Name": "WiFi Smart Camera",
        "Model": "WiFi-Cam-HD"
      },
      "Technical Details": {
        "Detail 1": "1080p HD",
        "Detail 2": "Two-way Audio"
      }
    }
  }
];

export const blogPosts = [
  {
    "id": 1,
    "title": "The Future of AI in Consumer Tech",
    "date": "2026-05-01",
    "category": "AI",
    "image": "/1st-post.jpeg"
  },
  {
    "id": 2,
    "title": "Gaming Setup Trends for 2026",
    "date": "2026-04-28",
    "category": "Gaming",
    "image": "/2nd-post.jpeg"
  },
  {
    "id": 3,
    "title": "Top 10 Smart Home Devices",
    "date": "2026-04-25",
    "category": "Smart Home",
    "image": "/3rd post.png"
  }
];
