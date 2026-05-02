const fs = require('fs');
const path = require('path');

const defaultsPath = path.join(__dirname, '../app/lib/settings-defaults.js');
let content = fs.readFileSync(defaultsPath, 'utf8');

const newSettings = `
  // --- Service Pages ---
  
  // SEO Page
  { key: 'service_seo_hero_title', value: 'SEO Services', type: 'string', description: 'SEO Hero Title' },
  { key: 'service_seo_hero_tagline', value: 'Future-Proof Your Visibility With The Best SEO Agency in Bangladesh', type: 'text', description: 'SEO Hero Tagline' },
  { key: 'service_seo_hero_desc', value: 'At Next Idea solution, we specialize in turning concepts into remarkable SEO strategies that leave a lasting impression on your visibility ensuring your brand stands out in search results.', type: 'text', description: 'SEO Hero Description' },
  { key: 'service_seo_hero_image', value: '/SEO-Services.jpg', type: 'string', description: 'SEO Hero Image' },
  { key: 'service_seo_about_title', value: 'About SEO Services', type: 'string', description: 'SEO About Title' },
  { key: 'service_seo_about_subtitle', value: 'Your Customers Are Searching For You On Google, But You Don\\'t Know', type: 'text', description: 'SEO About Subtitle' },
  { key: 'service_seo_about_desc', value: 'In this age where customers search online to gather information and then make a purchase decision, you\\'re losing sales if you\\'re not present in front of their eyes when they\\'re searching.', type: 'text', description: 'SEO About Description' },
  { key: 'service_seo_about_image', value: '/seo.jpeg', type: 'string', description: 'SEO About Image' },
  { key: 'service_seo_stay_visible_title', value: 'Stay Visible In A Search Landscape Shaped By AI', type: 'string', description: 'SEO Stay Visible Title' },
  { key: 'service_seo_stay_visible_desc', value: 'Search is evolving faster than ever. With AI-powered results and personalization, ranking on Google is no longer just about keywords.', type: 'text', description: 'SEO Stay Visible Description' },
  { key: 'service_seo_stay_visible_image', value: '/SEO-Services.jpg', type: 'string', description: 'SEO Stay Visible Image' },
  { key: 'service_seo_hire_title', value: 'Hire The Best SEO Agency in Bangladesh', type: 'string', description: 'SEO Hire Title' },
  { key: 'service_seo_hire_desc', value: 'Trusted by leading brands and startups alike, we\\'ve helped hundreds of businesses achieve top search rankings and drive sustainable growth.', type: 'text', description: 'SEO Hire Description' },
  { key: 'service_seo_case_title', value: 'See Next Idea Has Helped Clients', type: 'string', description: 'SEO Case Studies Title' },
  { key: 'service_seo_case_desc', value: 'Our portfolio showcases successful SEO projects across various industries with measurable results.', type: 'text', description: 'SEO Case Studies Description' },
  { key: 'service_seo_why_title', value: 'Why Choose Us As Your SEO Company in Bangladesh', type: 'string', description: 'SEO Why Choose Us Title' },
  { key: 'service_seo_why_desc', value: 'We combine expertise, innovation, and proven results to deliver SEO strategies that drive sustainable growth for your business.', type: 'text', description: 'SEO Why Choose Us Description' },
  { key: 'service_seo_unique_title', value: 'What\\'s Unique About Next Idea\\'s SEO? As An SEO Agency in Bangladesh?', type: 'string', description: 'SEO Unique Title' },
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
  { key: 'service_brand_identity_about_subtitle', value: 'Your brand is unique—let\\'s make sure it stands out. Elevate your brand identity with Next Idea Solution', type: 'text', description: 'Brand About Subtitle' },
  { key: 'service_brand_identity_about_desc', value: 'Your brand is more than a logo; it\\'s an experience. Next Idea Solution\\'s Brand identity design service goes beyond aesthetics, diving deep into the core of your brand to create a visual and emotional identity that speaks to your audience.', type: 'text', description: 'Brand About Description' },
  { key: 'service_brand_identity_about_image', value: '/brandidentity.jpeg', type: 'string', description: 'Brand About Image' },

  // Creative Concept Execution Page
  { key: 'service_creative_concept_execution_hero_title', value: 'Creative Concept & Execution', type: 'string', description: 'Creative Hero Title' },
  { key: 'service_creative_concept_execution_hero_tagline', value: 'Elevate your brand with Next Idea Solutions\\' creative service that blends strategy, design, and technology to bring your concept to life.', type: 'text', description: 'Creative Hero Tagline' },
  { key: 'service_creative_concept_execution_about_title', value: 'About This Service', type: 'string', description: 'Creative About Title' },
  { key: 'service_creative_concept_execution_about_desc', value: 'At Next Idea Solutions, we believe in the power of creativity to transform brands. Our Creative Concept & Execution service is tailored to craft innovative, impactful, and memorable campaigns that resonate with your audience. We merge creativity with strategic insights to develop concepts that align with your brand\\'s goals and values.', type: 'text', description: 'Creative About Description' },
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
  { key: 'service_digital_pr_hero_tagline', value: 'Elevate your brand\\'s online visibility with strategic digital PR campaigns.', type: 'text', description: 'Digital PR Hero Tagline' },
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
  { key: 'service_video_production_photography_about_desc', value: 'We provide engaging and high-end video & photography services for your business.', type: 'text', description: 'Video Production About Description' }
`;

content = content.replace('];', newSettings + '\n];');
fs.writeFileSync(defaultsPath, content);
console.log('Appended successfully');
