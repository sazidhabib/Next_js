const fs = require('fs');
const path = require('path');

const defaultsPath = path.join(__dirname, '../app/lib/settings-defaults.js');
let content = fs.readFileSync(defaultsPath, 'utf8');

const servicePrefixes = [
  'seo',
  'web_design_development',
  'brand_identity',
  'creative_concept_execution',
  'digital_media_buying',
  'design_printing',
  'digital_pr',
  'event_and_activation',
  'social_media_marketing',
  'video_production_photography'
];

const newKeys = [];

servicePrefixes.forEach(prefix => {
  const label = prefix.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  
  // Features Title
  newKeys.push({
    key: `service_${prefix}_features_title`,
    value: prefix === 'web_design_development' ? 'OUR APPROACH' : (prefix === 'creative_concept_execution' ? 'WHAT SETS US APART' : "What's Included"),
    type: 'text',
    description: `${label} - Features Section Title`
  });

  // Process Title
  if (['seo', 'creative_concept_execution', 'video_production_photography', 'event_and_activation'].includes(prefix)) {
    newKeys.push({
      key: `service_${prefix}_process_title`,
      value: prefix === 'creative_concept_execution' ? 'WHAT WE OFFER' : "Our Process",
      type: 'text',
      description: `${label} - Process Section Title`
    });
  }

  // Related Services Title
  newKeys.push({
    key: `service_${prefix}_related_title`,
    value: "Related Services",
    type: 'text',
    description: `${label} - Related Services Title`
  });
});

let newKeysString = '';
newKeys.forEach(k => {
  newKeysString += `  { key: '${k.key}', value: '${k.value}', type: '${k.type}', description: '${k.description}' },\n`;
});

// Insert before the end of the array
content = content.replace(/\];\s*$/, ',\n' + newKeysString + '];');
content = content.replace(/},\s*,\n/g, '},\n');

fs.writeFileSync(defaultsPath, content);
console.log('Added title keys successfully');
