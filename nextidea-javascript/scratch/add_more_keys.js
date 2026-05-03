const fs = require('fs');
const path = require('path');

const defaultsPath = path.join(__dirname, '../app/lib/settings-defaults.js');
let content = fs.readFileSync(defaultsPath, 'utf8');

const additionalKeys = [
  // Web Design & Development
  { 
    key: 'service_web_design_development_features', 
    value: JSON.stringify([
      { title: "User-Centric Design", description: "We prioritize user experience to ensure your visitors stay engaged and convert.", icon: "Layout" },
      { title: "Mobile Optimization", description: "Your site will look and perform beautifully on every device, from mobile to desktop.", icon: "Smartphone" },
      { title: "Scalable Architecture", description: "We build with the future in mind, ensuring your site can grow with your business.", icon: "Zap" }
    ]), 
    type: 'json', 
    description: 'Web Design Features' 
  },
  { 
    key: 'service_web_design_development_related_services', 
    value: JSON.stringify([
      { title: "SEO Services", link: "/services/seo", icon: "Search" },
      { title: "Brand Identity", link: "/services/brand-identity", icon: "Palette" },
      { title: "Digital Media Buying", link: "/services/digital-media-buying", icon: "TrendingUp" }
    ]), 
    type: 'json', 
    description: 'Web Design Related Services' 
  },

  // Brand Identity
  { 
    key: 'service_brand_identity_related_services', 
    value: JSON.stringify([
      { title: "Creative Concept", link: "/services/creative-concept-execution", icon: "Sparkles" },
      { title: "Web Design", link: "/services/web-design-development", icon: "Code2" },
      { title: "Social Media", link: "/services/social-media-marketing", icon: "Megaphone" }
    ]), 
    type: 'json', 
    description: 'Brand Identity Related Services' 
  }
];

let newKeysString = '';
additionalKeys.forEach(k => {
  newKeysString += `  { key: '${k.key}', value: JSON.stringify(${k.value}), type: '${k.type}', description: '${k.description}' },\n`;
});

// Insert before the end of the array (before the last ];)
content = content.replace(/\];\s*$/, ',\n' + newKeysString + '];');

// Fix any potential double commas
content = content.replace(/},\s*,\n/g, '},\n');

fs.writeFileSync(defaultsPath, content);
console.log('Added keys successfully');
