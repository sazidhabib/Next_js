const fs = require('fs');
const path = require('path');

const defaultsPath = path.join(__dirname, '../app/lib/settings-defaults.js');
let content = fs.readFileSync(defaultsPath, 'utf8');

const additionalKeys = [
  // Social Media Marketing
  { 
    key: 'service_social_media_marketing_related_services', 
    value: JSON.stringify([
      { title: "Digital Media Buying", link: "/services/digital-media-buying", icon: "TrendingUp" },
      { title: "Creative Concept", link: "/services/creative-concept-execution", icon: "Sparkles" },
      { title: "Video Production", link: "/services/video-production-photography", icon: "Video" }
    ]), 
    type: 'json', 
    description: 'Social Media Related Services' 
  },

  // Video Production & Photography
  { 
    key: 'service_video_production_photography_process', 
    value: JSON.stringify([
      { title: "Pre-production", description: "Scripting, storyboarding, and planning to ensure a smooth shoot.", icon: "Clapperboard" },
      { title: "Production", description: "High-quality filming and photography using professional equipment.", icon: "Camera" },
      { title: "Post-production", description: "Editing, sound design, and color grading to bring the story to life.", icon: "Scissors" }
    ]), 
    type: 'json', 
    description: 'Video Production Process' 
  },
  { 
    key: 'service_video_production_photography_related_services', 
    value: JSON.stringify([
      { title: "Social Media", link: "/services/social-media-marketing", icon: "Share2" },
      { title: "Brand Identity", link: "/services/brand-identity", icon: "Palette" },
      { title: "Creative Concept", link: "/services/creative-concept-execution", icon: "Sparkles" }
    ]), 
    type: 'json', 
    description: 'Video Production Related Services' 
  },

  // Event & Activation
  { 
    key: 'service_event_and_activation_related_services', 
    value: JSON.stringify([
      { title: "Social Media", link: "/services/social-media-marketing", icon: "Megaphone" },
      { title: "Digital PR", link: "/services/digital-pr", icon: "Globe" },
      { title: "Video Coverage", link: "/services/video-production-photography", icon: "Video" }
    ]), 
    type: 'json', 
    description: 'Event Activation Related Services' 
  }
];

let newKeysString = '';
additionalKeys.forEach(k => {
  newKeysString += `  { key: '${k.key}', value: JSON.stringify(${k.value}), type: '${k.type}', description: '${k.description}' },\n`;
});

// Insert before the end of the array
content = content.replace(/\];\s*$/, ',\n' + newKeysString + '];');
content = content.replace(/},\s*,\n/g, '},\n');

fs.writeFileSync(defaultsPath, content);
console.log('Added more keys successfully');
