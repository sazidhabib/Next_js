export const DEFAULT_SETTINGS = [
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
  ]), type: 'json', description: 'Global FAQs for other pages' },

  // --- Service Pages ---
  
  // SEO Page
  { key: 'service_seo_hero_title', value: 'SEO Services', type: 'string', description: 'SEO Hero Title' },
  { key: 'service_seo_hero_tagline', value: 'Future-Proof Your Visibility With The Best SEO Agency in Bangladesh', type: 'text', description: 'SEO Hero Tagline' },
  { key: 'service_seo_hero_desc', value: 'At Next Idea solution, we specialize in turning concepts into remarkable SEO strategies that leave a lasting impression on your visibility ensuring your brand stands out in search results.', type: 'text', description: 'SEO Hero Description' },
  { key: 'service_seo_hero_image', value: '/SEO-Services.jpg', type: 'string', description: 'SEO Hero Image' },
  { key: 'service_seo_about_title', value: 'About SEO Services', type: 'string', description: 'SEO About Title' },
  { key: 'service_seo_about_subtitle', value: 'Your Customers Are Searching For You On Google, But You Don\'t Know', type: 'text', description: 'SEO About Subtitle' },
  { key: 'service_seo_about_desc', value: 'In this age where customers search online to gather information and then make a purchase decision, you\'re losing sales if you\'re not present in front of their eyes when they\'re searching.', type: 'text', description: 'SEO About Description' },
  { key: 'service_seo_about_image', value: '/seo.jpeg', type: 'string', description: 'SEO About Image' },
  { key: 'service_seo_stay_visible_title', value: 'Stay Visible In A Search Landscape Shaped By AI', type: 'string', description: 'SEO Stay Visible Title' },
  { key: 'service_seo_stay_visible_desc', value: 'Search is evolving faster than ever. With AI-powered results and personalization, ranking on Google is no longer just about keywords.', type: 'text', description: 'SEO Stay Visible Description' },
  { key: 'service_seo_stay_visible_image', value: '/SEO-Services.jpg', type: 'string', description: 'SEO Stay Visible Image' },
  { key: 'service_seo_hire_title', value: 'Hire The Best SEO Agency in Bangladesh', type: 'string', description: 'SEO Hire Title' },
  { key: 'service_seo_hire_desc', value: 'Trusted by leading brands and startups alike, we\'ve helped hundreds of businesses achieve top search rankings and drive sustainable growth.', type: 'text', description: 'SEO Hire Description' },
  { key: 'service_seo_case_title', value: 'See Next Idea Has Helped Clients', type: 'string', description: 'SEO Case Studies Title' },
  { key: 'service_seo_case_desc', value: 'Our portfolio showcases successful SEO projects across various industries with measurable results.', type: 'text', description: 'SEO Case Studies Description' },
  { key: 'service_seo_why_title', value: 'Why Choose Us As Your SEO Company in Bangladesh', type: 'string', description: 'SEO Why Choose Us Title' },
  { key: 'service_seo_why_desc', value: 'We combine expertise, innovation, and proven results to deliver SEO strategies that drive sustainable growth for your business.', type: 'text', description: 'SEO Why Choose Us Description' },
  { key: 'service_seo_unique_title', value: 'What\'s Unique About Next Idea\'s SEO? As An SEO Agency in Bangladesh?', type: 'string', description: 'SEO Unique Title' },
  { key: 'service_seo_unique_desc', value: 'We leverage cutting-edge tools and strategies to ensure your business thrives in the AI-powered search landscape.', type: 'text', description: 'SEO Unique Description' },

  // Web Design Page
  { key: 'service_web_design_development_hero_title', value: 'Web Design & Development', type: 'string', description: 'Web Hero Title' },
  { key: 'service_web_design_development_hero_tagline', value: 'Strong marketing your brand with high-converting landing page, website or app.', type: 'text', description: 'Web Hero Tagline' },
  { key: 'service_web_design_development_about_title', value: 'About Web Design & Development', type: 'string', description: 'Web About Title' },
  { key: 'service_web_design_development_about_subtitle', value: 'Our Web Design & Development service combines creativity, functionality, and cutting-edge technology to create digital experiences that resonate with your audience.', type: 'text', description: 'Web About Subtitle' },
  { key: 'service_web_design_development_about_desc', value: 'If the stage of your website is small, we decide to customize it with our amazing custom web app development, the resulting development will make your business look like the next leading business.', type: 'text', description: 'Web About Description' },
  { key: 'service_web_design_development_about_image', value: '/webdev.jpeg', type: 'string', description: 'Web About Image' },
  { key: 'service_web_design_development_offer_title', value: 'WHAT WE OFFER', type: 'string', description: 'Web Offer Title' },
  { key: 'service_web_design_development_offer_features', value: JSON.stringify([{title: "Ecommerce Solutions", description: "Empower your business with robust and scalable online stores that drive sales and provide a seamless shopping experience."}, {title: "Corporate Website Development", description: "Establish a professional and impactful online presence for your corporation with a custom-designed website."}, {title: "Landing page creation", description: "Drive higher conversions for your marketing campaigns with high-impact and optimized landing pages."}]), type: 'json', description: 'Web Offer Features' },

  // Brand Identity Page
  { key: 'service_brand_identity_hero_title', value: 'Brand Identity', type: 'string', description: 'Brand Hero Title' },
  { key: 'service_brand_identity_hero_tagline', value: 'We help creating strong brand identity that will separate you from the noise.', type: 'text', description: 'Brand Hero Tagline' },
  { key: 'service_brand_identity_about_title', value: 'About this Service', type: 'string', description: 'Brand About Title' },
  { key: 'service_brand_identity_about_subtitle', value: 'Your brand is unique—let\'s make sure it stands out. Elevate your brand identity with Next Idea Solution', type: 'text', description: 'Brand About Subtitle' },
  { key: 'service_brand_identity_about_desc', value: 'Your brand is more than a logo; it\'s an experience. Next Idea Solution\'s Brand identity design service goes beyond aesthetics, diving deep into the core of your brand to create a visual and emotional identity that speaks to your audience.', type: 'text', description: 'Brand About Description' },
  { key: 'service_brand_identity_about_image', value: '/brandidentity.jpeg', type: 'string', description: 'Brand About Image' },

  // Creative Concept Execution Page
  { key: 'service_creative_concept_execution_hero_title', value: 'Creative Concept & Execution', type: 'string', description: 'Creative Hero Title' },
  { key: 'service_creative_concept_execution_hero_tagline', value: 'Elevate your brand with Next Idea Solutions\' creative service that blends strategy, design, and technology to bring your concept to life.', type: 'text', description: 'Creative Hero Tagline' },
  { key: 'service_creative_concept_execution_about_title', value: 'About This Service', type: 'string', description: 'Creative About Title' },
  { key: 'service_creative_concept_execution_about_desc', value: 'At Next Idea Solutions, we believe in the power of creativity to transform brands. Our Creative Concept & Execution service is tailored to craft innovative, impactful, and memorable campaigns that resonate with your audience. We merge creativity with strategic insights to develop concepts that align with your brand\'s goals and values.', type: 'text', description: 'Creative About Description' },
  { key: 'service_creative_concept_execution_about_image', value: '/creative_concept.jpeg', type: 'string', description: 'Creative About Image' },

  // Digital Media Buying Page
  { key: 'service_digital_media_buying_hero_title', value: 'Digital Media Buying', type: 'string', description: 'Media Buying Hero Title' },
  { key: 'service_digital_media_buying_hero_tagline', value: 'Funnel-driven media buying solutions that generate higher ROI.', type: 'text', description: 'Media Buying Hero Tagline' },
  { key: 'service_digital_media_buying_hero_image', value: '/Digital-Media.png', type: 'string', description: 'Media Buying Hero Image' },
  { key: 'service_digital_media_buying_about_title', value: 'About Digital Media Buying', type: 'string', description: 'Media Buying About Title' },
  { key: 'service_digital_media_buying_about_desc', value: 'We specialize in data-driven media buying solutions that maximize your ROI. Our strategic approach ensures your message reaches the right audience at the right time through advanced funnel optimization.', type: 'text', description: 'Media Buying About Description' },
  { key: 'service_digital_media_buying_about_image', value: '/digitalmedia.jpeg', type: 'string', description: 'Media Buying About Image' },

  // Design Printing Page
  { key: 'service_design_printing_hero_title', value: 'Design and Printing Solutions', type: 'string', description: 'Design Printing Hero Title' },
  { key: 'service_design_printing_hero_tagline', value: 'Premium corporate designs and customized printing solutions.', type: 'text', description: 'Design Printing Hero Tagline' },
  { key: 'service_design_printing_about_title', value: 'About Design & Printing', type: 'string', description: 'Design Printing About Title' },
  { key: 'service_design_printing_about_desc', value: 'Elevate your brand with diaries, calendars, notebooks, annual reports, and corporate gifts.', type: 'text', description: 'Design Printing About Description' },

  // Digital PR Page
  { key: 'service_digital_pr_hero_title', value: 'Digital PR Services', type: 'string', description: 'Digital PR Hero Title' },
  { key: 'service_digital_pr_hero_tagline', value: 'Elevate your brand\'s online visibility with strategic digital PR campaigns.', type: 'text', description: 'Digital PR Hero Tagline' },
  { key: 'service_digital_pr_about_title', value: 'About Digital PR', type: 'string', description: 'Digital PR About Title' },
  { key: 'service_digital_pr_about_desc', value: 'Earn media coverage, build backlinks, and improve your SEO with our expert team.', type: 'text', description: 'Digital PR About Description' },

  // Event & Activation Page
  { key: 'service_event_and_activation_hero_title', value: 'Event & Activation', type: 'string', description: 'Event Hero Title' },
  { key: 'service_event_and_activation_hero_tagline', value: 'Next Idea Solution is the power to create happening events to guarantee you the maximum footfall', type: 'text', description: 'Event Hero Tagline' },
  { key: 'service_event_and_activation_about_title', value: 'About Event & Activation', type: 'string', description: 'Event About Title' },
  { key: 'service_event_and_activation_about_desc', value: 'We have the power to create happening events to guarantee you the maximum footfall.', type: 'text', description: 'Event About Description' },

  // Social Media Marketing Page
  { key: 'service_social_media_marketing_hero_title', value: 'Social Media Marketing', type: 'string', description: 'Social Media Hero Title' },
  { key: 'service_social_media_marketing_hero_tagline', value: 'Every 6 people out of 11 use social media to research products before making any purchase decision.', type: 'text', description: 'Social Media Hero Tagline' },
  { key: 'service_social_media_marketing_about_title', value: 'About Social Media Marketing', type: 'string', description: 'Social Media About Title' },
  { key: 'service_social_media_marketing_about_desc', value: 'Every 6 people out of 11 use social media to research products before making any purchase decision.', type: 'text', description: 'Social Media About Description' },

  // Video Production Photography Page
  { key: 'service_video_production_photography_hero_title', value: 'Video Production & Photography', type: 'string', description: 'Video Production Hero Title' },
  { key: 'service_video_production_photography_hero_tagline', value: 'Professional Content That Tells Your Story', type: 'text', description: 'Video Production Hero Tagline' },
  { key: 'service_video_production_photography_about_title', value: 'About Video Production & Photography', type: 'string', description: 'Video Production About Title' },
  { key: 'service_video_production_photography_about_desc', value: 'We provide engaging and high-end video & photography services for your business.', type: 'text', description: 'Video Production About Description' },


  { key: 'service_brand_identity_features', value: JSON.stringify([{title: 'Logo Design & Visual Elements', description: 'Craft a distinctive and memorable logo that embodies your brand essence.'}, {title: 'Branding Material & Packaging', description: 'Design & print your unique branding materials with out of the box design and execution.'}, {title: 'Brand Guidelines', description: 'Establish a cohesive visual identity with comprehensive brand guidelines.'}]), type: 'json', description: 'Brand Identity Features' },

  { key: 'service_creative_concept_execution_features', value: JSON.stringify([{title: 'Creative Approach', description: 'We infuse creativity into every project.'}, {title: 'Strategic Planning', description: 'Meticulous planning and execution.'}, {title: 'Diverse Offerings', description: 'Catering to a wide range of needs.'}]), type: 'json', description: 'Creative Concept Features' },

  { key: 'service_digital_media_buying_features', value: JSON.stringify([{title: 'Data-driven Targeting', description: 'We reach your exact ideal audience using advanced data points.'}, {title: 'Multi-channel Mgmt', description: 'Seamless campaign execution across multiple platforms.'}, {title: 'Real-time Optimization', description: 'Continuous adjustment to maximize performance and ROI.'}, {title: 'Advanced Funnel', description: 'Building pathways that convert visitors into loyal customers.'}, {title: 'Comprehensive Analytics', description: 'Transparent reporting on all key performance indicators.'}, {title: 'Strategic Budget', description: 'Smart allocation of your ad spend to prevent wastage.'}]), type: 'json', description: 'Digital Media Buying Features' },

  { key: 'service_event_and_activation_features', value: JSON.stringify([{title: 'Creative Approach', description: 'We infuse creativity into every event, ensuring it aligns with your brands identity and goals.'}, {title: 'Strategic Planning', description: 'Our meticulous planning and execution guarantees flawless events that resonate with your audience.'}, {title: 'Diverse Offerings', description: 'From product launches to brand activations, we cater to a wide range of event needs.'}]), type: 'json', description: 'Event Activation Features' },

  { key: 'service_event_and_activation_process', value: JSON.stringify([{title: 'Strategic Planning', description: 'We plan every detail with your objectives in mind, ensuring seamless execution.'}, {title: 'Engagement Strategies', description: 'From product launches to brand activations, we design experiences that captivate your audience.'}, {title: 'Measurable Impact', description: 'We track and analyze event performance, providing valuable insights for future strategies.'}]), type: 'json', description: 'Event Activation Process' },

  { key: 'service_social_media_marketing_features', value: JSON.stringify([{title: 'Strategy Development', description: 'Comprehensive social media strategy tailored to your business goals.'}, {title: 'Content Calendar', description: 'Planned out content for consistent posting and engagement.'}, {title: 'Media Buying & Ads', description: 'Running and optimizing paid campaigns for maximum ROI.'}, {title: 'Sales Funnel Monitoring', description: 'Continuous tracking and optimizing to drive more conversions.'}, {title: 'Design & Video', description: 'Engaging visuals, animations, and video content strategies.'}, {title: 'Community Management', description: 'Active engagement with your followers to build brand loyalty.'}]), type: 'json', description: 'Social Media Marketing Features' },

  { key: 'service_video_production_photography_features', value: JSON.stringify(['Video Production (Commercials, Campaigns)', 'Corporate Video Production', 'Product Photography', 'Event Coverage', 'Social Media Content Creation', 'Post-production & Editing', 'Motion Graphics & Animation', 'Drone Aerial Photography/Videography']), type: 'json', description: 'Video Production Features' },

  { key: 'service_video_production_photography_process', value: JSON.stringify([{title: 'Pre-production', description: 'We develop concepts, scripts, storyboards, and plan all logistics before the shoot.'}, {title: 'Production', description: 'Our professional crew captures high-quality footage and photographs using industry-standard equipment.'}, {title: 'Post-production', description: 'We edit, color grade, add motion graphics, and polish the content to perfection.'}, {title: 'Delivery', description: 'We deliver final assets in all required formats optimized for your intended platforms.'}]), type: 'json', description: 'Video Production Process' },

  { key: 'service_design_printing_showcase_title', value: 'Discover the Art of Exquisite Corporate Elements', type: 'string', description: 'Design Printing Showcase Title' },
  { key: 'service_design_printing_showcase_desc', value: 'Step into a world where premium quality meets innovative design.', type: 'string', description: 'Design Printing Showcase Desc' },

  { key: 'service_design_printing_features_title', value: 'Why Choose Our Customized Printing?', type: 'string', description: 'Design Printing Features Title' },

  { key: 'service_digital_pr_process_title', value: 'How We Execute', type: 'string', description: 'Digital PR Process Title' },
  { key: 'service_digital_pr_why_trust_title', value: 'Why Choose Next Idea', type: 'string', description: 'Digital PR Why Trust Title' },


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

  { key: 'service_seo_tabbed_services', value: JSON.stringify([{"id":"seo-audits","label":"SEO AUDITS","title":"SEO Audits & Analysis","description":"Our comprehensive SEO audits dive deep into your website's performance, identifying technical issues, content gaps, and structural weaknesses that hinder your search rankings. We provide actionable insights to transform your visibility.","image":"/SEO-Audit.jpg"},{"id":"keyword-research","label":"KEYWORD RESEARCH","title":"Keyword Research","description":"To achieve the ultimate objective of get in front of your customers when they are searching for you, you need to understand what they are looking for. This understanding starts with finding out the keywords using which the searches are being made by your potential customers. Just like any leading SEO agency, we conduct in-depth keyword research using industry-standard tools and market insights to identify high-impact, low-competition keywords. To become successful, you should be looking at intent-driven terms and long-tail keywords aligning with whatever you are selling and what customers are searching for. That's exactly what we do at Next Idea Solution. Interested? Contact Next Idea team for exploratory keyword research!","image":"/SEO_img01.jpg"},{"id":"on-page-seo","label":"ON-PAGE SEO","title":"On-Page SEO Optimization","description":"We optimize your website's individual pages to rank higher and earn more relevant traffic. This includes optimizing meta tags, headings, content structure, and internal linking to ensure search engines understand your value proposition.","image":"/seo.jpg"},{"id":"off-page-seo","label":"OFF-PAGE SEO","title":"Off-Page SEO & Link Building","description":"Building authority is key to ranking. Our off-page strategies focus on earning high-quality backlinks from reputable sources, enhancing your domain authority and establishing your brand as an industry leader.","image":"/Local-SEO.jpg"},{"id":"technical-seo","label":"TECHNICAL SEO","title":"Technical SEO Optimization","description":"We ensure your website meets the technical requirements of modern search engines. From site speed and mobile-friendliness to crawlability and schema markup, we build a solid foundation for your SEO success.","image":"/tecnicalseo.jpeg"},{"id":"local-seo","label":"LOCAL SEO","title":"Local SEO Solutions","description":"Be visible where your customers are. We optimize your local presence, including Google Business Profile management and local citations, to drive foot traffic and local inquiries to your business.","image":"/Local-SEO.jpg"},{"id":"e-commerce-seo","label":"E-COMMERCE SEO","title":"E-Commerce SEO Strategies","description":"Drive sales with targeted e-commerce SEO. We optimize product pages, category structures, and user experience to ensure your products are found by shoppers ready to buy.","image":"/E-commerce-SEO.jpg"},{"id":"aso","label":"APP STORE OPTIMIZATION (ASO)","title":"App Store Optimization","description":"Maximize your app's visibility in the Apple App Store and Google Play Store. We optimize titles, descriptions, and keywords to increase downloads and user engagement.","image":"/SEO-Services.jpg"},{"id":"youtube-seo","label":"YOUTUBE SEO","title":"YouTube Video SEO","description":"Get your videos in front of the right audience. We optimize video titles, tags, and descriptions to ensure your content ranks in both YouTube and Google search results.","image":"/youtubeseo.jpeg"},{"id":"vso","label":"VOICE SEARCH OPTIMIZATION (VSO)","title":"Voice Search Optimization","description":"Prepare for the future of search. We optimize your content for conversational queries and long-tail keywords used in voice searches on Alexa, Siri, and Google Assistant.","image":"/voicesearch.jpeg"},{"id":"aeo","label":"ASK ENGINE OPTIMIZATION (AEO)","title":"Ask Engine Optimization","description":"In the era of AI and Answer Engines, we optimize your content to be the preferred answer for LLMs and AI-powered search results like Perplexity and Google SGE.","image":"/AEO.jpeg"}]), type: 'json', description: 'SEO Tabbed Services' },

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

];
