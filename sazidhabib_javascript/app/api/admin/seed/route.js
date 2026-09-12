import { NextResponse } from 'next/server';
import { checkAuthHeader } from '@/lib/auth';
import { Skill, Experience, Project, initDb } from '@/lib/models';

export async function POST(request) {
  if (!checkAuthHeader(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await initDb();

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
        name: 'Pathokbonddho',
        description: 'Pathokbonddho is a full-stack dynamic News Portal and Content Management System (CMS) built to manage and publish news content efficiently. The platform features articles, authors, categories, advertisements, galleries, and a fully customizable Dynamic Layout Builder controlled from the admin panel.',
        image: '/src/assets/pathakbondhu.webp',
        tags: [
          { name: 'Next.js', color: 'blue-text-gradient' },
          { name: 'React', color: 'blue-text-gradient' },
          { name: 'javascript', color: 'blue-text-gradient' },
          { name: 'Node.js', color: 'blue-text-gradient' },
          { name: 'Express.js', color: 'blue-text-gradient' },
          { name: 'Bootstrap', color: 'green-text-gradient' },
          { name: 'Tailwind', color: 'pink-text-gradient' },
          { name: 'MySQL', color: 'blue-text-gradient' }
        ],
        features: [
          'Dynamic News Management system with full CRUD operations',
          'Advanced Admin Dashboard for complete content control',
          'Dynamic Homepage Layout Builder (Pages, Sections, Rows & Columns)',
          'SEO-Optimized News Rendering with Server-Side Rendering (SSR)',
          'Role-based Authentication & Secure JWT Authorization',
          'Image Upload, Compression & WebP Optimization',
          'Rich Text Editor Integration for article publishing',
          'Advertisement & Banner Management System'
        ],
        sourceCodeLink: '',
        liveLink: 'https://pathakbondhu.com/',
        sortOrder: 0
      },
      {
        name: 'nextideasolution',
        description: 'Next Idea Solutions is a full-stack web application developed for a digital marketing and web development agency. The platform serves as both a professional corporate website and a powerful admin management system for handling portfolio projects, services, case studies, blogs, client information, team members, and business settings.',
        image: '/src/assets/nextidea.webp',
        tags: [
          { name: 'Next.js', color: 'blue-text-gradient' },
          { name: 'React', color: 'blue-text-gradient' },
          { name: 'Node.js', color: 'blue-text-gradient' },
          { name: 'Express.js', color: 'blue-text-gradient' },
          { name: 'Tailwind', color: 'pink-text-gradient' },
          { name: 'MySQL', color: 'blue-text-gradient' }
        ],
        features: [
          'Dynamic Service Management system',
          'Custom Admin Dashboard with Full CRUD Operations',
          'Case Study & Blog Publishing Platform',
          'SEO-Optimized Server-Side Rendering (SSR)',
          'JWT Authentication with Secure Cookie-Based Sessions',
          'Role-Based Access Control & User Management',
          'Image Upload & Optimization using Sharp'
        ],
        sourceCodeLink: '',
        liveLink: 'https://nextideasolution.com/',
        sortOrder: 1
      },
      {
        name: 'kamrulhasan',
        description: 'This project is a dynamic personal website developed for journalist Kamrul Hasan. It serves as an interactive platform to showcase his writings, reflections, experiences, and published reports. Fully dynamic and customizable from the admin panel.',
        image: '/src/assets/kamrulHasanWeb.webp',
        tags: [
          { name: 'React', color: 'blue-text-gradient' },
          { name: 'JavaScript', color: 'green-text-gradient' },
          { name: 'Tailwind', color: 'pink-text-gradient' },
          { name: 'MERN', color: 'blue-text-gradient' }
        ],
        features: [
          'Dynamic content management system with full CRUD operations',
          'Bengali-language platform for targeted local audience',
          'Customizable admin panel for seamless content management',
          'Article and multimedia publishing with rich text editor',
          'SEO-optimized layout with meta tag management'
        ],
        sourceCodeLink: 'https://github.com/sazidhabib/React_Js/tree/main/MERN_project',
        liveLink: 'https://kamrulhasan.com',
        sortOrder: 2
      },
      {
        name: 'PharmaSphere',
        description: 'A pharmacy-based e-commerce platform offering a seamless shopping experience for medicines and healthcare products. Built using the MERN stack, featuring secure Stripe checkout, dynamic inventory dashboard, and real-time product search.',
        image: '/src/assets/pharmasphere.webp',
        tags: [
          { name: 'React', color: 'blue-text-gradient' },
          { name: 'JavaScript', color: 'green-text-gradient' },
          { name: 'Tailwind', color: 'pink-text-gradient' },
          { name: 'MERN', color: 'blue-text-gradient' }
        ],
        features: [
          'Secure payment integration with Stripe checkout',
          'Dynamic admin panel for inventory and order management',
          'Advanced search with real-time filtering and sorting',
          'Responsive pharmacy catalog with category browsing',
          'User authentication with profile and order history'
        ],
        sourceCodeLink: 'https://github.com/shafquatulbari/mern-e-commerce',
        liveLink: '',
        sortOrder: 3
      },
      {
        name: 'SnapShop',
        description: 'A responsive e-commerce platform built with TypeScript, React, and Tailwind CSS. It features product management, user authentication, wishlist, and shopping cart with persistent state.',
        image: '/src/assets/snapshop.webp',
        tags: [
          { name: 'React', color: 'blue-text-gradient' },
          { name: 'TypeScript', color: 'green-text-gradient' },
          { name: 'REST APIs', color: 'pink-text-gradient' }
        ],
        features: [
          'TypeScript-powered architecture for type-safe development',
          'User authentication with JWT token management',
          'Product management dashboard with CRUD operations',
          'Wishlist and shopping cart with persistent state',
          'Responsive Tailwind design with dark theme support'
        ],
        sourceCodeLink: 'https://github.com/sazidhabib/SnapShop_e-commerce',
        liveLink: '',
        sortOrder: 4
      }
    ];

    await Skill.destroy({ where: {} });
    await Experience.destroy({ where: {} });
    await Project.destroy({ where: {} });

    await Skill.bulkCreate(initialSkills);
    await Experience.bulkCreate(initialExperiences);
    await Project.bulkCreate(initialProjects);

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with initial data via Sequelize!',
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
