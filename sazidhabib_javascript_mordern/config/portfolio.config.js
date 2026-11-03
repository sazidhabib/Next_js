/**
 * Centralized Portfolio Configuration
 * Easily update your personal information, projects, experience, and pricing here.
 */

export const portfolioConfig = {
  seo: {
    title: "Sazid Habib — Full-Stack & Next.js Engineer",
    description:
      "Sazid Habib is a Senior Full-Stack & Next.js Engineer specializing in high-performance web applications, scalable APIs, and clean software architecture. Available for new projects.",
    keywords: [
      "Sazid Habib",
      "Full-Stack Developer",
      "Next.js Developer",
      "React Developer",
      "Node.js",
      "Tailwind CSS",
      "Portfolio",
      "Dhaka, Bangladesh",
    ],
  },

  profile: {
    name: "Sazid Habib",
    role: "Senior Full-Stack & Next.js Engineer",
    location: "Dhaka, Bangladesh",
    availability: {
      status: "open", // 'open' | 'busy'
      openLabel: "Available for new projects",
      busyLabel: "Currently booked",
    },
    tagline:
      "5+ years of engineering experience architecting fast, scalable, and conversion-driven web applications for startups and enterprise clients.",
    summary:
      "Specialized in Next.js, React, Node.js, and modern cloud architectures. Obsessed with performance, clean code, and intuitive user experiences.",
    avatar: "/src/assets/sazid.png",
  },

  stats: [
    { value: "05+", label: "Years Exp." },
    { value: "25+", label: "Shipped Projects" },
    { value: "100%", label: "Client Satisfaction" },
    { value: "15+", label: "Core Technologies" },
  ],

  about: [
    {
      num: "01",
      subtitle: "Who",
      headline: ["A full-stack engineer", "from Dhaka, BD"],
      body: "Five years crafting high-performance web applications, scalable backends, and responsive UIs. Specialized in <b>Next.js</b>, <b>React</b>, <b>Node.js</b>, and modern databases.",
      highlights: ["5+ Years Experience", "Senior Engineer"],
    },
    {
      num: "02",
      subtitle: "How",
      headline: ["Architecture first,", "execution with speed"],
      body: "Clean domain boundaries, <b>type-safe APIs</b>, <b>sub-second load times</b>, and responsive layouts that look exceptional across mobile, tablet, and desktop.",
      highlights: ["Modern Stacks", "Clean Architecture"],
    },
    {
      num: "03",
      subtitle: "Where",
      headline: ["Remote & global,", "worldwide delivery"],
      body: "Collaborating with fast-moving startups and companies across the US, UK, and Asia to ship <b>SaaS platforms</b>, <b>e-commerce systems</b>, and <b>dynamic CMSs</b>.",
      highlights: ["Remote Ready", "GMT+6 (Dhaka)"],
    },
  ],

  experience: [
    {
      period: "2024 — Present",
      company: "Independent Lead Engineer",
      role: "Senior Full-Stack Consultant",
      summary: "Leading end-to-end web engineering, full-stack Next.js applications, and custom CMS platforms.",
      metric: "Shipped 12+ production apps with 99.9% uptime",
      isCurrent: true,
    },
    {
      period: "2023 — 2024",
      company: "Pathokbonddho",
      role: "Lead Full-Stack Developer",
      summary: "Architected a scalable dynamic news portal and CMS with a custom layout builder and high-traffic SSR.",
      metric: "+150% faster page loads via Next.js SSR & SWR caching",
      isCurrent: false,
    },
    {
      period: "2021 — 2023",
      company: "Software Innovations",
      role: "Full-Stack Developer",
      summary: "Built responsive frontend interfaces, RESTful microservices, and database models using React, Node.js, and MySQL.",
      metric: "Engineered 15+ client portals and internal SaaS tools",
      isCurrent: false,
    },
  ],

  projects: [
    {
      id: "pathokbonddho",
      title: "Pathokbonddho",
      subtitle: "Full-Stack Dynamic CMS & News Portal",
      category: "Full-Stack / CMS",
      year: "2024",
      description:
        "An enterprise-grade dynamic news platform featuring a custom Drag & Drop Section Builder, SSR optimization, role-based RBAC, and high-frequency content distribution.",
      image: "/src/assets/pathokbonddhufullpage.webp",
      liveUrl: "https://pathakbondhu.com/",
      sourceUrl: "",
      accent: "#0D99FF", // Electric Blue
      tags: ["Next.js", "React", "Node.js", "MySQL", "Tailwind CSS", "Zod", "SWR"],
      metrics: "Sub-second TTFB & custom CMS layout builder",
    },
    {
      id: "nextideasolution",
      title: "Next Idea Solution",
      subtitle: "Corporate Tech Agency Platform",
      category: "Web Application",
      year: "2024",
      description:
        "Modern corporate landing page and agency showcase with high-taste interactive micro-animations, lead generation funnel, and responsive layout.",
      image: "/src/assets/nextidea.png",
      liveUrl: "https://nextideasolution.com/",
      sourceUrl: "",
      accent: "#7B4DFF", // Electric Purple
      tags: ["Next.js", "Tailwind CSS", "Framer Motion", "SEO"],
      metrics: "98+ Google Lighthouse Performance Score",
    },
    {
      id: "realestate-next",
      title: "Prime Estate Explorer",
      subtitle: "Property Discovery & Booking System",
      category: "SaaS / Real Estate",
      year: "2023",
      description:
        "Interactive real estate marketplace with dynamic property filters, interactive map exploration, mortgage calculator, and booking management.",
      image: "/src/assets/realestate.png",
      liveUrl: "",
      sourceUrl: "https://github.com/sazidhabib",
      accent: "#0ACF83", // Emerald Green
      tags: ["React", "Next.js", "Node.js", "MongoDB", "Tailwind CSS"],
      metrics: "Filtered search with instant client-side response",
    },
    {
      id: "food-ordering",
      title: "FoodExpress Suite",
      subtitle: "Multi-Restaurant Ordering & Dispatch",
      category: "E-Commerce",
      year: "2023",
      description:
        "Full-fledged food delivery platform featuring real-time cart synchronization, Stripe payment checkout, and live order status tracker.",
      image: "/src/assets/foodordering.png",
      liveUrl: "",
      sourceUrl: "https://github.com/sazidhabib",
      accent: "#FF6E28", // Vibrant Amber
      tags: ["React", "Express.js", "Redux Toolkit", "Stripe API"],
      metrics: "Zero-latency live cart calculations",
    },
  ],

  services: [
    {
      num: "01",
      title: "Full-Stack Web Development",
      duration: "3–6 weeks",
      description:
        "End-to-end web applications built from scratch with Next.js, Node.js, and robust databases. Clean architecture, high security, and high test coverage.",
      deliverables: ["Full-Stack App", "REST / GraphQL API", "Database Design", "Auth & RBAC"],
    },
    {
      num: "02",
      title: "High-Performance Next.js Sites",
      duration: "2–4 weeks",
      description:
        "Marketing sites, landing pages, and portfolios engineered to convert. Kinetic motion, SEO optimization, and 95+ Lighthouse performance scores.",
      deliverables: ["Responsive UI", "Framer Motion", "SEO Optimization", "Analytics"],
    },
    {
      num: "03",
      title: "Custom CMS & SaaS Platforms",
      duration: "4–8 weeks",
      description:
        "Tailored content management systems, admin portals, and multi-tenant SaaS dashboards that empower non-technical teams to manage content with ease.",
      deliverables: ["Admin Dashboard", "Dynamic Builders", "Role Permissions", "Data Export"],
    },
    {
      num: "04",
      title: "API Architecture & Performance Optimization",
      duration: "1–3 weeks",
      description:
        "Audit existing codebases, eliminate performance bottlenecks, refactor legacy scripts, and optimize database queries for scale.",
      deliverables: ["Performance Audit", "Speed Boost", "Clean Refactor", "Security Hardening"],
    },
  ],

  testimonials: [
    {
      name: "Rafiqul Islam",
      role: "Founder, Pathokbonddho",
      quote:
        "Sazid transformed our complex news portal concept into a blazing-fast, dynamic CMS. His attention to performance and clean layout building is second to none.",
    },
    {
      name: "Tariq Mahmud",
      role: "Managing Director, Next Idea",
      quote:
        "Working with Sazid was effortless. He delivers on time, writes extremely clean code, and has an eye for both design aesthetics and backend stability.",
    },
    {
      name: "David Miller",
      role: "Product Owner, Global SaaS",
      quote:
        "Fast, communicative, and deeply skilled in Next.js and full-stack development. Our launch would not have happened without his technical leadership.",
    },
  ],

  pricing: [
    {
      title: "MVP / Landing Site",
      price: "$1,200",
      duration: "2–3 weeks",
      accent: "#0D99FF",
      bestFor: "Startups and founders needing a high-converting marketing site or MVP launch.",
      features: [
        "Modern Next.js & Tailwind CSS",
        "Fluid motion & responsive layouts",
        "SEO metadata & OpenGraph setup",
        "Contact form & lead integration",
        "1 month free bug-fix support",
      ],
    },
    {
      title: "Full-Stack Application",
      price: "$3,200",
      duration: "4–6 weeks",
      accent: "#7B4DFF",
      isPopular: true,
      bestFor: "Businesses requiring dynamic user authentication, databases, and custom workflows.",
      features: [
        "Full-stack Next.js + Node / SQL / Mongo",
        "Role-based authentication (RBAC)",
        "Custom Admin Dashboard & CMS",
        "Payment integration (Stripe / Local)",
        "Deployment to Vercel / AWS",
        "2 months dedicated support",
      ],
    },
    {
      title: "Dedicated Sprint / Retainer",
      price: "$2,500/mo",
      duration: "Ongoing",
      accent: "#0ACF83",
      bestFor: "Growing teams needing continuous engineering, feature delivery, and code reviews.",
      features: [
        "Direct Slack / Discord communication",
        "Weekly feature sprints & deployment",
        "Architecture reviews & refactoring",
        "Priority bug fixing & monitoring",
        "Cancel or pause anytime",
      ],
    },
  ],

  contact: {
    email: "sazidhabib.dev@gmail.com",
    whatsapp: "+8801700000000",
    whatsappDisplay: "+880 1700-000000",
    socials: [
      {
        name: "GitHub",
        url: "https://github.com/sazidhabib",
        handle: "@sazidhabib",
      },
      {
        name: "LinkedIn",
        url: "https://linkedin.com/in/sazidhabib",
        handle: "in/sazidhabib",
      },
      {
        name: "Email",
        url: "mailto:sazidhabib.dev@gmail.com",
        handle: "sazidhabib.dev@gmail.com",
      },
    ],
  },
};

