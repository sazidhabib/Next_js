const fs = require('fs');
const path = require('path');

const defaultsPath = path.join(__dirname, '../app/lib/settings-defaults.js');
let content = fs.readFileSync(defaultsPath, 'utf8');

const correctJson = [
  {
    "id": "seo-audits",
    "label": "SEO AUDITS",
    "title": "SEO Audits & Analysis",
    "description": "Our comprehensive SEO audits dive deep into your website's performance, identifying technical issues, content gaps, and structural weaknesses that hinder your search rankings. We provide actionable insights to transform your visibility.",
    "image": "/SEO-Audit.jpg"
  },
  {
    "id": "keyword-research",
    "label": "KEYWORD RESEARCH",
    "title": "Keyword Research",
    "description": "To achieve the ultimate objective of get in front of your customers when they are searching for you, you need to understand what they are looking for. This understanding starts with finding out the keywords using which the searches are being made by your potential customers. Just like any leading SEO agency, we conduct in-depth keyword research using industry-standard tools and market insights to identify high-impact, low-competition keywords. To become successful, you should be looking at intent-driven terms and long-tail keywords aligning with whatever you are selling and what customers are searching for. That's exactly what we do at Next Idea Solution. Interested? Contact Next Idea team for exploratory keyword research!",
    "image": "/SEO_img01.jpg"
  },
  {
    "id": "on-page-seo",
    "label": "ON-PAGE SEO",
    "title": "On-Page SEO Optimization",
    "description": "We optimize your website's individual pages to rank higher and earn more relevant traffic. This includes optimizing meta tags, headings, content structure, and internal linking to ensure search engines understand your value proposition.",
    "image": "/seo.jpg"
  },
  {
    "id": "off-page-seo",
    "label": "OFF-PAGE SEO",
    "title": "Off-Page SEO & Link Building",
    "description": "Building authority is key to ranking. Our off-page strategies focus on earning high-quality backlinks from reputable sources, enhancing your domain authority and establishing your brand as an industry leader.",
    "image": "/Local-SEO.jpg"
  },
  {
    "id": "technical-seo",
    "label": "TECHNICAL SEO",
    "title": "Technical SEO Optimization",
    "description": "We ensure your website meets the technical requirements of modern search engines. From site speed and mobile-friendliness to crawlability and schema markup, we build a solid foundation for your SEO success.",
    "image": "/tecnicalseo.jpeg"
  },
  {
    "id": "local-seo",
    "label": "LOCAL SEO",
    "title": "Local SEO Solutions",
    "description": "Be visible where your customers are. We optimize your local presence, including Google Business Profile management and local citations, to drive foot traffic and local inquiries to your business.",
    "image": "/Local-SEO.jpg"
  },
  {
    "id": "e-commerce-seo",
    "label": "E-COMMERCE SEO",
    "title": "E-Commerce SEO Strategies",
    "description": "Drive sales with targeted e-commerce SEO. We optimize product pages, category structures, and user experience to ensure your products are found by shoppers ready to buy.",
    "image": "/E-commerce-SEO.jpg"
  },
  {
    "id": "aso",
    "label": "APP STORE OPTIMIZATION (ASO)",
    "title": "App Store Optimization",
    "description": "Maximize your app's visibility in the Apple App Store and Google Play Store. We optimize titles, descriptions, and keywords to increase downloads and user engagement.",
    "image": "/SEO-Services.jpg"
  },
  {
    "id": "youtube-seo",
    "label": "YOUTUBE SEO",
    "title": "YouTube Video SEO",
    "description": "Get your videos in front of the right audience. We optimize video titles, tags, and descriptions to ensure your content ranks in both YouTube and Google search results.",
    "image": "/youtubeseo.jpeg"
  },
  {
    "id": "vso",
    "label": "VOICE SEARCH OPTIMIZATION (VSO)",
    "title": "Voice Search Optimization",
    "description": "Prepare for the future of search. We optimize your content for conversational queries and long-tail keywords used in voice searches on Alexa, Siri, and Google Assistant.",
    "image": "/voicesearch.jpeg"
  },
  {
    "id": "aeo",
    "label": "ASK ENGINE OPTIMIZATION (AEO)",
    "title": "Ask Engine Optimization",
    "description": "In the era of AI and Answer Engines, we optimize your content to be the preferred answer for LLMs and AI-powered search results like Perplexity and Google SGE.",
    "image": "/AEO.jpeg"
  }
];

content = content.replace(/{ key: 'service_seo_tabbed_services', value: JSON\.stringify\(\[[\s\S]*?\]\), type: 'json', description: 'SEO Tabbed Services' }/, 
  "{ key: 'service_seo_tabbed_services', value: JSON.stringify(" + JSON.stringify(correctJson) + "), type: 'json', description: 'SEO Tabbed Services' }");

fs.writeFileSync(defaultsPath, content);
console.log('Replaced successfully');
