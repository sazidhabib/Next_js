const fs = require('fs');
const path = require('path');

const defaultsPath = path.join(__dirname, '../app/lib/settings-defaults.js');
let content = fs.readFileSync(defaultsPath, 'utf8');

const processSteps = [
  {
    title: "Creative Campaigns",
    description: "Our team designs captivating campaigns that engage your audience across digital and traditional platforms.",
    icon: "Trophy"
  },
  {
    title: "Content Creation",
    description: "We craft compelling content, including visuals, copy, and multimedia, to convey your brand's story effectively.",
    icon: "FileText"
  },
  {
    title: "Brand Messaging",
    description: "We refine your brand's messaging to deliver a clear, consistent, and impactful narrative.",
    icon: "Star"
  }
];

const relatedServices = [
  { title: "Brand Identity", link: "/services/brand-identity", icon: "Palette" },
  { title: "Digital Media Buying", link: "/services/digital-media-buying", icon: "TrendingUp" },
  { title: "Video Production", link: "/services/video-production-photography", icon: "Headphones" }
];

const newKeys = `
  { key: 'service_creative_concept_execution_process', value: JSON.stringify(${JSON.stringify(processSteps)}), type: 'json', description: 'Creative Concept Process' },
  { key: 'service_creative_concept_execution_related_services', value: JSON.stringify(${JSON.stringify(relatedServices)}), type: 'json', description: 'Creative Concept Related Services' },
`;

// Insert before the end of the array
content = content.replace('];', newKeys + '];');

fs.writeFileSync(defaultsPath, content);
console.log('Added keys successfully');
