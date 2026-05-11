const DEFAULT_SETTINGS = [
  // Social Links
  { key: 'facebook_url', value: 'https://www.facebook.com/NextIdeaSolution', type: 'string', description: 'Facebook profile URL' },
  { key: 'linkedin_url', value: 'https://www.linkedin.com/company/next-idea-solution', type: 'string', description: 'LinkedIn company URL' },
  { key: 'youtube_url', value: '#', type: 'string', description: 'YouTube channel URL' },
  { key: 'instagram_url', value: '#', type: 'string', description: 'Instagram profile URL' },
  
  // Footer
  { key: 'footer_about', value: 'Next Idea Solution is a 360-degree digital-first advertising agency in Bangladesh.', type: 'string', description: 'Short description in footer' },
  { key: 'copyright_text', value: 'All rights reserved.', type: 'string', description: 'Copyright text in footer' },
  { key: 'site_name', value: 'Next Idea Solution', type: 'string', description: 'Website title' },
  
  // Contact
  { key: 'contact_email', value: 'support@nextideasolution.com', type: 'string', description: 'Primary contact email' },
  { key: 'contact_phone', value: '+8801714787250', type: 'string', description: 'Primary contact phone' },
  { key: 'address', value: 'House# 14 (2nd Floor), Road# 04, block# A, Section# 11, Mirpur, Dhaka, Bangladesh', type: 'text', description: 'Office address' },

  // About Page
  { key: 'about_hero_title', value: 'Empowering your Digital Future', type: 'string', description: 'Hero title on about page' },
  { key: 'about_hero_subtitle', value: 'We are a passionate team of technologists, designers, and strategists dedicated to transforming ideas into impactful digital realities.', type: 'text', description: 'Hero subtitle on about page' },
  { key: 'about_story_title', value: 'Built on a foundation of innovation', type: 'string', description: 'Our story title' },
  { key: 'about_story_desc_1', value: 'Since our inception, NextIdea Solution has been driven by a singular mission: to bridge the gap between complex technology and tangible business success. We believe that every challenge is an opportunity to innovate.', type: 'text', description: 'Our story description paragraph 1' },
  { key: 'about_story_desc_2', value: 'What started as a small team of passionate developers has grown into a full-service digital agency. From robust enterprise software to captivating brand identities, we bring a wealth of expertise and a commitment to excellence to every project we touch.', type: 'text', description: 'Our story description paragraph 2' },
  { key: 'about_mission_text', value: 'To empower businesses with cutting-edge digital solutions that drive growth, enhance user experiences, and solve complex challenges with elegance and efficiency.', type: 'text', description: 'Mission statement text' },
  { key: 'about_vision_text', value: 'To be the global benchmark for digital innovation, shaping the future of technology by delivering transformative experiences that leave a lasting impact.', type: 'text', description: 'Vision statement text' },
  { key: 'about_experience_years', value: '10+', type: 'string', description: 'Years of experience badge text' },
  { key: 'about_story_image', value: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', type: 'string', description: 'Main image on about page' },

  // Home Page
  { key: 'home_hero_slides', value: JSON.stringify([
    { id: 1, headline: "Necessary To Have", subheadline: "The Right Formula To Grow Big", description: "We inject the right formula to grow your business with award-winning digital campaigns.", ctaText: "Get Started", imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&q=80" },
    { id: 2, headline: "Digital Excellence", subheadline: "360-Degree Marketing Solutions", description: "We create award-winning, certified, 360-degree digital-first advertising campaigns.", ctaText: "Our Services", imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80" },
    { id: 3, headline: "Measurable Results", subheadline: "Data-Driven Growth Strategies", description: "Our campaigns produce measurable results that impact your bottom line.", ctaText: "View Portfolio", imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=1920&q=80" }
  ]), type: 'json', description: 'Home hero slider slides' },
  { key: 'home_services_title', value: 'What We Do', type: 'string', description: 'Title of services section on home page' },
  { key: 'home_services_list', value: JSON.stringify([
    { title: "Creative Concept & Execution", description: "Expert Conceptualization and Impeccable Execution for Your Brand.", link: "/services/creative-concept-execution", icon: "Sparkles" },
    { title: "Media Buying", description: "We offer funnel driven media buying solution that generates higher ROI for your company.", link: "/services/digital-media-buying", icon: "TrendingUp" },
    { title: "Brand Identity", description: "We help creating strong brand identity that will separate you from the noise.", link: "/services/brand-identity", icon: "Palette" },
    { title: "Web Design & Development", description: "We excel in creating user friendly high converting landing page, website, or app.", link: "/services/web-design-development", icon: "Code2" },
    { title: "Event & Activation", description: "We have the power to create happening events to guarantee you the maximum footfall.", link: "/services/event-and-activation", icon: "Megaphone" },
    { title: "Video Production & Photography", description: "We provide engaging and high-end video & photography services for your business.", link: "/services/video-production-photography", icon: "Headphones" }
  ]), type: 'json', description: 'List of services on home page' },
  { key: 'home_portfolio_title', value: 'Our Recent Work', type: 'string', description: 'Title of portfolio section on home page' },
  { key: 'home_portfolio_subtitle', value: 'Showcasing our best digital creations and success stories.', type: 'string', description: 'Subtitle of portfolio section' },
  { key: 'home_cta_title', value: 'Have Some Projects in Mind?', type: 'string', description: 'Title of CTA section' },
  { key: 'home_cta_button_text', value: "Let's Discuss", type: 'string', description: 'Button text in CTA section' },

  // Clients Section
  { key: 'home_clients', value: JSON.stringify([
    { name: "Client 1", logo: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=200&q=80" },
    { name: "Client 2", logo: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=200&q=80" },
    { name: "Client 3", logo: "https://images.unsplash.com/photo-1614850523590-c24502016645?w=200&q=80" },
    { name: "Client 4", logo: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=200&q=80" }
  ]), type: 'json', description: 'List of client logos on home page' },

  // FAQ Section
  { key: 'home_faqs', value: JSON.stringify([
    { question: "How long does a typical project take?", answer: "Project timelines vary depending on complexity, but most web projects take 4-8 weeks." },
    { question: "Do you offer post-launch support?", answer: "Yes, we provide ongoing maintenance and support packages to ensure your project stays updated and secure." }
  ]), type: 'json', description: 'FAQs for the home page' },
  { key: 'global_faqs', value: JSON.stringify([
    { question: "What services do you offer?", answer: "We offer a full suite of digital services including web development, media buying, SEO, and brand identity." }
  ]), type: 'json', description: 'Global FAQs for other pages' }
];

module.exports = { DEFAULT_SETTINGS };
