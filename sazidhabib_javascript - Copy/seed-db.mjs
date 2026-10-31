import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

// 1. Load .env and .env.local
['.env', '.env.local'].forEach(file => {
  const envPath = path.resolve(file);
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          const val = valueParts.join('=').replace(/^["']|["']$/g, '');
          process.env[key.trim()] = val;
        }
      }
    });
  }
});

const dbName = process.env.MYSQL_DATABASE || 'saziddb';
const user = process.env.MYSQL_USER || 'root';
const password = process.env.MYSQL_PASSWORD || '';
const host = process.env.MYSQL_HOST || 'localhost';
const port = parseInt(process.env.MYSQL_PORT || '3306', 10);

console.log(`Connecting to MySQL server at ${host}:${port} as ${user}...`);

async function run() {
  try {
    // 1. Connect without selecting DB to ensure DB exists
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
    });

    console.log(`Creating database '${dbName}' if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.end();
    console.log(`Database '${dbName}' is ready.`);

    // 2. Import models and sync schema
    const { sequelize, Skill, Experience, Project } = await import('./lib/models/index.js');
    await sequelize.authenticate();
    console.log('Sequelize connected to MySQL database.');

    await sequelize.sync({ force: true });
    console.log('Tables created successfully.');

    // 3. Initial Seed Data from Previous Project
    const initialSkills = [
      // Frontend
      { category: 'Frontend', name: 'React Js', image: 'https://dac.digital/wp-content/uploads/2023/11/react-logo-optimized.png', sortOrder: 0 },
      { category: 'Frontend', name: 'Redux', image: 'https://d33wubrfki0l68.cloudfront.net/0834d0215db51e91525a25acf97433051f280f2f/c30f5/img/redux.svg', sortOrder: 1 },
      { category: 'Frontend', name: 'React Router', image: 'https://www.svgrepo.com/show/354262/react-router.svg', sortOrder: 2 },
      { category: 'Frontend', name: 'TypeScript', image: 'https://www.datocms-assets.com/48401/1627663113-learn-typescript.png?fit=max&w=900', sortOrder: 3 },
      { category: 'Frontend', name: 'HTML', image: 'https://www.w3.org/html/logo/badge/html5-badge-h-solo.png', sortOrder: 4 },
      { category: 'Frontend', name: 'CSS', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/CSS3_logo_and_wordmark.svg/1452px-CSS3_logo_and_wordmark.svg.png', sortOrder: 5 },
      { category: 'Frontend', name: 'JavaScript', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/800px-JavaScript-logo.png', sortOrder: 6 },
      { category: 'Frontend', name: 'Bootstrap', image: 'https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo-shadow.png', sortOrder: 7 },
      { category: 'Frontend', name: 'Tailwind CSS', image: 'https://avatars.githubusercontent.com/u/30317862?s=280&v=4', sortOrder: 8 },
      { category: 'Frontend', name: 'Material UI', image: 'https://www.remoterocketship.com/images/blog/Material%20UI-icon-for-blog.jpg', sortOrder: 9 },
      
      // Backend
      { category: 'Backend', name: 'Node Js', image: 'https://nodejs.org/static/images/logo.svg', sortOrder: 10 },
      { category: 'Backend', name: 'Express Js', image: 'https://img.icons8.com/office80/512/express-js.png', sortOrder: 11 },
      { category: 'Backend', name: 'Python', image: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg', sortOrder: 12 },
      { category: 'Backend', name: 'Django', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSlFFyY16N5NRhzoG24RqB7x8Ok2t8Bdgs-tuMsOBXS2Q&s', sortOrder: 13 },
      { category: 'Backend', name: 'MySQL', image: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg', sortOrder: 14 },
      { category: 'Backend', name: 'Postgresql', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/1200px-Postgresql_elephant.svg.png', sortOrder: 15 },
      { category: 'Backend', name: 'MongoDB', image: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original-wordmark.svg', sortOrder: 16 },
      { category: 'Backend', name: 'Firebase', image: 'https://www.vectorlogo.zone/logos/firebase/firebase-icon.svg', sortOrder: 17 },
      
      // Others
      { category: 'Others', name: 'Git', image: 'https://e7.pngegg.com/pngimages/713/558/png-clipart-computer-icons-pro-git-github-logo-text-logo-thumbnail.png', sortOrder: 18 },
      { category: 'Others', name: 'GitHub', image: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png', sortOrder: 19 },
      { category: 'Others', name: 'Netlify', image: 'https://seeklogo.com/images/N/netlify-logo-BD8F8A77E2-seeklogo.com.png', sortOrder: 20 },
      { category: 'Others', name: 'VS Code', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/512px-Visual_Studio_Code_1.35_icon.svg.png?20210804221519', sortOrder: 21 },
      { category: 'Others', name: 'Postman', image: 'https://www.cdnlogo.com/logos/p/20/postman.svg', sortOrder: 22 },
      { category: 'Others', name: 'Adobe XD', image: 'https://w7.pngwing.com/pngs/213/165/png-transparent-adobe-logo-logos-xd-logos-and-brands-icon.png', sortOrder: 23 },
      { category: 'Others', name: 'Figma', image: 'https://s3-alpha.figma.com/hub/file/1481185752/fa4cd070-6a79-4e1b-b079-8b9b76408595-cover.png', sortOrder: 24 }
    ];

    const initialExperiences = [
      {
        role: 'Junior Web Developer',
        company: 'Ajker Patrika',
        companyLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdFJmybFp9hgFmci0L4srOF-YYwndid8Rrog&s',
        date: 'Mar 2025 - Present',
        description: [
          'Successfully developed and maintained several in-house projects and implemented customized web pages, including dynamic event pages and additional feature-rich sections, for the Ajker Patrika website. Utilized a diverse technology stack comprising React for building interactive user interfaces, Node.js and Express.js for backend development, MongoDB and MySQL for database management, and Laravel for handling certain server-side functionalities, ensuring seamless integration and optimized performance across the platform.'
        ],
        skills: ['ReactJS', 'Redux', 'NodeJs', 'ExpressJS', 'Laravel', 'MySQL', 'Tailwind CSS', 'JavaScript', 'MongoDB', 'Teamwork', 'Leadership', 'Communication'],
        sortOrder: 0
      },
      {
        role: 'Frontend Developer Intern',
        company: 'Brain Station 23',
        companyLogo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtzxGpr5zWduFJ49PtDaKOQdcbfTqFY7bhGw&s',
        date: 'Sep 2024 - Feb 2025',
        description: [
          'Collaborated with a colleague to develop "PharmaSphere," a pharmacy-based e-commerce site built using the MERN stack. Focused on implementing secure payment integrations, efficient database structures, and a user-friendly interface.',
          'Developed responsive web platforms, including an e-commerce site with dynamic product displays, user authentication, and cart management, and a movie listing site featuring top-rated movies, API-based data fetching, and a wishlist feature. Leveraged React, TypeScript, Tailwind CSS, REST APIs, Context API and Redux to create user-friendly, intuitive, and responsive experiences focused on seamless navigation and functionality.'
        ],
        skills: ['ReactJS', 'Redux', 'NodeJs', 'Tailwind CSS', 'TypeScript', 'JavaScript', 'MongoDB', 'Teamwork', 'Leadership', 'Communication'],
        sortOrder: 1
      },
      {
        role: 'Junior Unity Developer',
        company: 'Imaginary Workstation',
        companyLogo: 'https://i.pinimg.com/280x280_RS/90/52/47/905247c7f849068635cfea3b4a5702ef.jpg',
        date: 'Aug 2023 - Oct 2024',
        description: [
          'Imaginary Work station is a software company that specializesinmixed-realitygames, web development and mobile and desktop application.',
          'Started independently and after sometime joined a team of 5 more colleagues with key roles in company.',
          'Developed2D and 3Dgames for Android.',
          'Created particle systems, shaders, textures, and animations to simulate various natural and magical phenomena.'
        ],
        skills: ['Unity', 'C#', 'Game Development', 'Visual effect graph', 'Particle System', 'Teamwork', 'Leadership', 'Communication'],
        sortOrder: 2
      },
      {
        role: 'Joint Treasurer',
        company: 'Green University of Bangladesh',
        companyLogo: '/planet/cse-club.png',
        date: 'June 2020 - jun 2022',
        description: [
          'I have maintained a role in my University\'s Computer Club for 2years, Organizing various types of events such as Programming Contests, 3-Minute Presentations, Gaming Contests, Webinars, and Workshops.'
        ],
        skills: ['Teamwork', 'Leadership', 'Communication'],
        sortOrder: 3
      }
    ];

    const initialProjects = [
  {
    "name": "Pathokbonddho",
    "description": "Pathokbonddho is a full-stack dynamic News Portal and Content Management System (CMS) built to manage and publish news content efficiently. The platform is far more advanced than a traditional static news website, featuring a powerful backend system for managing articles, authors, categories, advertisements, galleries, and fully customizable homepage layouts.\\n    One of the core highlights of the project is its Dynamic Layout Builder, where administrators can create and control pages, sections, rows, and columns directly from the admin dashboard without modifying code. The system is optimized for SEO, fast content delivery, image optimization, and scalable content management, making it ideal for modern digital news platforms.",
    "image": "/src/assets/pathakbondhu.webp",
    "media": [
      {
        "type": "image",
        "src": "/src/assets/pathakbondhu.webp"
      },
      {
        "type": "image",
        "src": "/src/assets/pathokbonddhufullpage.webp"
      }
    ],
    "tags": [
      {
        "name": "Next.js",
        "color": "blue-text-gradient"
      },
      {
        "name": "React",
        "color": "blue-text-gradient"
      },
      {
        "name": "javascript",
        "color": "blue-text-gradient"
      },
      {
        "name": "Node.js",
        "color": "blue-text-gradient"
      },
      {
        "name": "Express.js",
        "color": "blue-text-gradient"
      },
      {
        "name": "Bootstrap",
        "color": "green-text-gradient"
      },
      {
        "name": "Tailwind",
        "color": "pink-text-gradient"
      },
      {
        "name": "MySQL",
        "color": "blue-text-gradient"
      },
      {
        "name": "SWR",
        "color": "pink-text-gradient"
      },
      {
        "name": "React Hook Form",
        "color": "pink-text-gradient"
      },
      {
        "name": "Zod",
        "color": "pink-text-gradient"
      },
      {
        "name": "JWT",
        "color": "pink-text-gradient"
      },
      {
        "name": "Bcryptjs",
        "color": "pink-text-gradient"
      },
      {
        "name": "Multer",
        "color": "pink-text-gradient"
      },
      {
        "name": "Sharp",
        "color": "pink-text-gradient"
      },
      {
        "name": "Open Graph",
        "color": "pink-text-gradient"
      }
    ],
    "features": [
      "Dynamic News Management system with full CRUD operations",
      "Advanced Admin Dashboard for complete content control",
      "Dynamic Homepage Layout Builder (Pages, Sections, Rows & Columns)",
      "SEO-Optimized News Rendering with Server-Side Rendering (SSR)",
      "Role-based Authentication & Secure JWT Authorization",
      "Image Upload, Compression & WebP Optimization",
      "Rich Text Editor Integration for article publishing",
      "Advertisement & Banner Management System",
      "Category, Author & Tag Management",
      "Responsive and Mobile-Friendly UI",
      "Fast Client-Side Data Fetching using SWR",
      "Custom API Architecture with Express.js & Next.js Integration"
    ],
    "sourceCodeLink": "",
    "liveLink": "https://pathakbondhu.com/",
    "sortOrder": 0
  },
  {
    "name": "nextideasolution",
    "description": "Next Idea Solutions is a full-stack web application developed for a digital marketing and web development agency. The platform serves as both a professional corporate website and a powerful admin management system for handling portfolio projects, services, case studies, blogs, client information, team members, and business settings. The project combines a modern frontend experience with a scalable backend architecture, allowing administrators to dynamically manage content, analytics, categories, and site-wide configurations through a centralized dashboard. The application is designed with performance, SEO optimization, scalability, and responsive user experience in mind.",
    "image": "/src/assets/nextidea.webp",
    "media": [
      {
        "type": "image",
        "src": "/src/assets/nextidea.webp"
      },
      {
        "type": "image",
        "src": "/src/assets/nextideafullpage.webp"
      }
    ],
    "tags": [
      {
        "name": "Next.js",
        "color": "blue-text-gradient"
      },
      {
        "name": "React",
        "color": "blue-text-gradient"
      },
      {
        "name": "javascript",
        "color": "blue-text-gradient"
      },
      {
        "name": "Node.js",
        "color": "blue-text-gradient"
      },
      {
        "name": "Express.js",
        "color": "blue-text-gradient"
      },
      {
        "name": "Tailwind",
        "color": "pink-text-gradient"
      },
      {
        "name": "MySQL",
        "color": "blue-text-gradient"
      },
      {
        "name": "SWR",
        "color": "pink-text-gradient"
      },
      {
        "name": "React Hook Form",
        "color": "pink-text-gradient"
      },
      {
        "name": "Zod",
        "color": "pink-text-gradient"
      },
      {
        "name": "JWT",
        "color": "pink-text-gradient"
      },
      {
        "name": "Bcryptjs",
        "color": "pink-text-gradient"
      },
      {
        "name": "Multer",
        "color": "pink-text-gradient"
      },
      {
        "name": "Sharp",
        "color": "pink-text-gradient"
      }
    ],
    "features": [
      "Dynamic Service Management system",
      "Custom Admin Dashboard with Full CRUD Operations",
      "Case Study & Blog Publishing Platform",
      "SEO-Optimized Server-Side Rendering (SSR)",
      "JWT Authentication with Secure Cookie-Based Sessions",
      "Role-Based Access Control & User Management",
      "Client & Team Member Management",
      "Image Upload & Optimization using Sharp",
      "Contact Form & Email Integration with Nodemailer",
      "Analytics & Business Settings Management",
      "Responsive and Mobile-Friendly UI",
      "RESTful API Architecture with Express.js",
      "Rate Limiting & Security Middleware Integration"
    ],
    "sourceCodeLink": "",
    "liveLink": "https://nextideasolution.com/",
    "sortOrder": 1
  },
  {
    "name": "kamrulhasan",
    "description": "This project is a dynamic personal website developed for journalist Kamrul Hasan. It serves as an interactive platform to showcase his writings, reflections, experiences, and published reports, offering readers valuable insights into various topics. The website is primarily in Bengali, targeting Bengali-speaking audiences, and is designed with a focus on readability, user engagement, and content accessibility. From top to bottom, every section of the website is fully dynamic and customizable through its powerful admin panel, allowing seamless management of content, including articles, reports, multimedia, and even the website's menu structure.",
    "image": "/src/assets/kamrulHasanWeb.webp",
    "media": [
      {
        "type": "image",
        "src": "/src/assets/kamrulHasanWeb.webp"
      },
      {
        "type": "image",
        "src": "/src/assets/kamrulhasan_fullpage.webp"
      },
      {
        "type": "video",
        "src": "/src/assets/kamrulhasan.mp4"
      }
    ],
    "tags": [
      {
        "name": "React",
        "color": "blue-text-gradient"
      },
      {
        "name": "JavaScript",
        "color": "green-text-gradient"
      },
      {
        "name": "Tailwind",
        "color": "pink-text-gradient"
      },
      {
        "name": "MERN",
        "color": "blue-text-gradient"
      },
      {
        "name": "e-commerce",
        "color": "pink-text-gradient"
      }
    ],
    "features": [
      "Dynamic content management system with full CRUD operations",
      "Bengali-language platform for targeted local audience",
      "Customizable admin panel for seamless content management",
      "Article and multimedia publishing with rich text editor",
      "SEO-optimized layout with meta tag management"
    ],
    "sourceCodeLink": "https://github.com/sazidhabib/React_Js/tree/main/MERN_project",
    "liveLink": "https://kamrulhasan.com",
    "sortOrder": 2
  },
  {
    "name": "PharmaSphere",
    "description": "A pharmacy-based e-commerce platform offering a seamless shopping experience for medicines and healthcare products. Built using the MERN stack, PharmaSphere features a secure payment system with Stripe, a dynamic admin panel for inventory management, and a user-friendly interface with advanced search and sorting capabilities.",
    "image": "/src/assets/pharmasphere.webp",
    "media": [
      {
        "type": "image",
        "src": "/src/assets/pharmasphere.webp"
      }
    ],
    "tags": [
      {
        "name": "React",
        "color": "blue-text-gradient"
      },
      {
        "name": "JavaScript",
        "color": "green-text-gradient"
      },
      {
        "name": "Tailwind",
        "color": "pink-text-gradient"
      },
      {
        "name": "MERN",
        "color": "blue-text-gradient"
      },
      {
        "name": "e-commerce",
        "color": "pink-text-gradient"
      }
    ],
    "features": [
      "Secure payment integration with Stripe checkout",
      "Dynamic admin panel for inventory and order management",
      "Advanced search with real-time filtering and sorting",
      "Responsive pharmacy catalog with category browsing",
      "User authentication with profile and order history"
    ],
    "sourceCodeLink": "https://github.com/shafquatulbari/mern-e-commerce",
    "liveLink": "",
    "sortOrder": 3
  },
  {
    "name": "SnapShop",
    "description": "This is a responsive e-commerce platform built with TypeScript, React, and Tailwind CSS. It features product management, user authentication, user information and user-specific functionalities such as a wishlist and shopping cart.",
    "image": "/src/assets/snapshop.webp",
    "media": [
      {
        "type": "image",
        "src": "/src/assets/snapshop.webp"
      }
    ],
    "tags": [
      {
        "name": "React",
        "color": "blue-text-gradient"
      },
      {
        "name": "TypeScript",
        "color": "green-text-gradient"
      },
      {
        "name": "REST APIs",
        "color": "pink-text-gradient"
      },
      {
        "name": "e-commerce",
        "color": "green-text-gradient"
      }
    ],
    "features": [
      "TypeScript-powered architecture for type-safe development",
      "User authentication with JWT token management",
      "Product management dashboard with CRUD operations",
      "Wishlist and shopping cart with persistent state",
      "Responsive Tailwind design with dark theme support"
    ],
    "sourceCodeLink": "https://github.com/sazidhabib/SnapShop_e-commerce",
    "liveLink": "",
    "sortOrder": 4
  },
  {
    "name": "Movie List Website",
    "description": "A simple and user-friendly website to explore movies and TV shows, built using React and styled with styled-components or Tailwind CSS. This project allows users to keep track of their favorite movies and provides features for managing a personal watchlist.",
    "image": "/src/assets/movie.webp",
    "media": [
      {
        "type": "image",
        "src": "/src/assets/movie.webp"
      }
    ],
    "tags": [
      {
        "name": "React",
        "color": "blue-text-gradient"
      },
      {
        "name": "JavaScript",
        "color": "green-text-gradient"
      },
      {
        "name": "useContext",
        "color": "pink-text-gradient"
      }
    ],
    "features": [
      "Browse trending movies and TV shows with live data",
      "Personal watchlist with add/remove functionality",
      "Search and filter across extensive media catalog",
      "State management using React useContext hook",
      "Responsive card layout with hover animations"
    ],
    "sourceCodeLink": "https://github.com/sazidhabib/MovieListingWebsite",
    "liveLink": "",
    "sortOrder": 5
  },
  {
    "name": "Product Detail & Add to Cart",
    "description": "This project is a responsive product detail page built with React, JavaScript, and useContext. The page allows users to select product options such as color, size, and quantity while dynamically updating the product image, price, and cart details.",
    "image": "/src/assets/shopCard.webp",
    "media": [
      {
        "type": "image",
        "src": "/src/assets/shopCard.webp"
      }
    ],
    "tags": [
      {
        "name": "React",
        "color": "blue-text-gradient"
      },
      {
        "name": "JavaScript",
        "color": "green-text-gradient"
      },
      {
        "name": "UseContext",
        "color": "pink-text-gradient"
      }
    ],
    "features": [
      "Dynamic product option selection (color, size, quantity)",
      "Real-time price calculation and image updates",
      "Interactive color and size picker with visual feedback",
      "Cart management with useContext state pattern",
      "Responsive product gallery with zoom preview"
    ],
    "sourceCodeLink": "https://github.com/sazidhabib/shopcardreact/tree/master",
    "liveLink": "",
    "sortOrder": 6
  },
  {
    "name": "Food Ordering App",
    "description": "A food ordering application built with React and Redux for state management. Users can browse menu items, add them to the cart, and manage quantities — all powered by a centralized Redux store for predictable state updates across the application.",
    "image": "/src/assets/FoodOrder.webp",
    "media": [
      {
        "type": "image",
        "src": "/src/assets/FoodOrder.webp"
      }
    ],
    "tags": [
      {
        "name": "React",
        "color": "blue-text-gradient"
      },
      {
        "name": "JavaScript",
        "color": "green-text-gradient"
      },
      {
        "name": "Redux",
        "color": "pink-text-gradient"
      },
      {
        "name": "Router",
        "color": "green-text-gradient"
      }
    ],
    "features": [
      "Redux-powered centralized state management",
      "Add/remove cart items with quantity controls",
      "Dynamic price calculation and order summary",
      "Clean food catalog with category organization",
      "Mobile-first responsive design for on-the-go ordering"
    ],
    "sourceCodeLink": "https://github.com/sazidhabib/FoodCardApp_React_Redux",
    "liveLink": "",
    "sortOrder": 7
  }
];

    console.log('Seeding skills, experiences, and projects...');
    await Skill.bulkCreate(initialSkills);
    await Experience.bulkCreate(initialExperiences);
    await Project.bulkCreate(initialProjects);

    console.log('🎉 SUCCESS: MySQL database created, tables synced, and all files imported successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error executing database import:', err);
    process.exit(1);
  }
}

run();
