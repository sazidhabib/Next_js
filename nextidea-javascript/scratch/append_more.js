const fs = require('fs');
const path = require('path');

const defaultsPath = path.join(__dirname, '../app/lib/settings-defaults.js');
let content = fs.readFileSync(defaultsPath, 'utf8');

const append = `
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
  { key: 'service_digital_pr_why_trust_title', value: 'Why Choose Next Idea', type: 'string', description: 'Digital PR Why Trust Title' }
`;

content = content.replace('];', append + '\n];');
fs.writeFileSync(defaultsPath, content);
console.log('Appended fully');
