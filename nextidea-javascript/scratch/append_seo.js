const fs = require('fs');
const path = require('path');

const defaultsPath = path.join(__dirname, '../app/lib/settings-defaults.js');
let content = fs.readFileSync(defaultsPath, 'utf8');

const append = `
  { key: 'service_seo_process', value: JSON.stringify([
    {
      number: "1",
      title: "Research and Analysis",
      description: "We begin by analyzing the top competitors for your primary search terms. This includes detailed SERP analysis to uncover content gaps, backlink profiles and page structures. We also conduct a user intent study to identify what your customers are searching for and why.",
      color: "red",
    },
    {
      number: "2",
      title: "Strategy Development",
      description: "Based on our research, we create a customized SEO strategy that aligns with your business goals. We define success metrics, timelines and reporting cadence. You receive a clear roadmap that covers on-page, technical, off-page and local SEO services.",
      color: "black",
    },
    {
      number: "3",
      title: "Implementation",
      description: "Our team executes the strategy, optimizing your website's architecture, content and technical elements. We build high-quality backlinks and ensure your site is fully aligned with the latest search engine algorithms.",
      color: "red",
    },
    {
      number: "4",
      title: "Monitoring & Optimization",
      description: "SEO is an ongoing process. We continuously monitor your rankings, traffic and conversions. Using advanced analytics, we refine our strategies to ensure sustained growth and adapt to any algorithm changes.",
      color: "black",
    }
  ]), type: 'json', description: 'SEO Process Steps' },

  { key: 'service_seo_tabbed_services', value: JSON.stringify([
    {
      id: "technical",
      title: "Technical SEO",
      description: "We ensure your website meets all technical requirements of modern search engines. This includes optimizing site speed, mobile-friendliness, crawlability, and indexing.",
      features: [
        "Core Web Vitals Optimization",
        "Schema Markup Implementation",
        "XML Sitemap & Robots.txt",
        "Site Architecture & URL Structure",
        "SSL & Website Security",
        "Mobile-First Indexing"
      ]
    },
    {
      id: "onpage",
      title: "On-Page SEO",
      description: "We optimize individual web pages to rank higher and earn more relevant traffic. Our approach combines keyword targeting with user intent optimization.",
      features: [
        "Keyword Research & Mapping",
        "Meta Tags Optimization",
        "Content Gap Analysis",
        "Internal Linking Strategy",
        "Image Optimization",
        "Header Tags Structure"
      ]
    },
    {
      id: "offpage",
      title: "Off-Page SEO",
      description: "We build your website's authority and reputation through strategic link building and digital PR campaigns.",
      features: [
        "High-Authority Link Building",
        "Digital PR Campaigns",
        "Brand Mentions",
        "Guest Posting",
        "Broken Link Building",
        "Competitor Backlink Analysis"
      ]
    },
    {
      id: "content",
      title: "Content SEO",
      description: "We create and optimize high-quality, relevant content that satisfies user intent and establishes your brand as an authority.",
      features: [
        "Content Strategy Development",
        "SEO Copywriting",
        "Blog Post Creation",
        "Content Refresh & Updates",
        "Topic Cluster Creation",
        "E-E-A-T Optimization"
      ]
    }
  ]), type: 'json', description: 'SEO Tabbed Services' },

  { key: 'service_seo_hire_reviews', value: JSON.stringify([
    {
      company: "Clutch",
      rating: 5,
      reviews: 15,
      feedback: "Next Idea solution is one of the top-rated SEO agencies. Their team delivered exceptional results and maintained great communication throughout.",
    },
    {
      company: "Google",
      rating: 4.9,
      reviews: 42,
      feedback: "Consistent quality in delivering SEO results. Their AI-powered approach to modern search is what sets them apart from competitors.",
    },
    {
      company: "Upwork",
      rating: 5,
      reviews: 28,
      feedback: "The best SEO partner we've worked with. They understood our business goals and delivered measurable results within the timeline.",
    }
  ]), type: 'json', description: 'SEO Hire Reviews' },

  { key: 'service_seo_case_studies', value: JSON.stringify([
    {
      title: "E-commerce SEO",
      description: "Increased organic traffic by 270% for e-commerce platforms",
      image: "/E-commerce-SEO.jpg",
      stats: "270% Traffic Growth",
    },
    {
      title: "Local SEO",
      description: "Improved local search rankings and customer acquisition",
      image: "/Local-SEO.jpg",
      stats: "Top Local Rankings",
    },
    {
      title: "SEO Audit & Strategy",
      description: "Comprehensive audits leading to strategic optimization",
      image: "/SEO-Audit.jpg",
      stats: "40% Higher Rankings",
    }
  ]), type: 'json', description: 'SEO Case Studies' },

  { key: 'service_seo_why_choose_us', value: JSON.stringify([
    { title: "Proven Results", description: "Next Idea helped Dhgate with a 270% increase in organic traffic, leading to lower cost per acquisition (CPA) within 6 months." },
    { title: "Strategic Approach", description: "Our meticulous planning and execution guarantees flawless strategies that resonate with your target audience." },
    { title: "Industry Expertise", description: "With years of experience, our team understands the evolving search landscape and AI-powered search algorithms." },
    { title: "AI-Ready Solutions", description: "We build SEO strategies optimized for the AI-powered search era, ensuring long-term visibility." }
  ]), type: 'json', description: 'SEO Why Choose Us Features' },

  { key: 'service_seo_unique_features', value: JSON.stringify([
    { title: "AI-Optimized SEO Strategy", description: "We optimize for both traditional search and AI-powered results like SGE, ensuring your content is discovered through all search methods." },
    { title: "End-To-End SEO Services", description: "From technical SEO to content optimization and link building, we handle every aspect of your SEO needs under one roof." },
    { title: "Transparent Reporting", description: "Monthly detailed reports with clear metrics, actionable insights, and transparent communication about your SEO performance." }
  ]), type: 'json', description: 'SEO Unique Features' }
`;

content = content.replace('];', append + '\n];');
fs.writeFileSync(defaultsPath, content);
console.log('Appended successfully');
