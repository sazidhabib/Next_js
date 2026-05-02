const fs = require('fs');
const path = require('path');

const servicesDir = path.join(__dirname, '../app/services');
const dirs = fs.readdirSync(servicesDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

let output = '';

dirs.forEach(service => {
  const pagePath = path.join(servicesDir, service, 'page.jsx');
  if (!fs.existsSync(pagePath)) return;
  
  const content = fs.readFileSync(pagePath, 'utf8');
  const prefix = `service_${service.replace(/-/g, '_')}`;
  
  output += `\n  // ${service} Page\n`;
  
  // Try to extract ServiceHero title
  const titleMatch = content.match(/title="([^"]+)"/);
  const title = titleMatch ? titleMatch[1] : service.replace(/-/g, ' ');
  output += `  { key: '${prefix}_hero_title', value: '${title.replace(/'/g, "\\'")}', type: 'string', description: 'Hero title' },\n`;
  
  const taglineMatch = content.match(/tagline="([^"]+)"/);
  if (taglineMatch) {
    output += `  { key: '${prefix}_hero_tagline', value: '${taglineMatch[1].replace(/'/g, "\\'")}', type: 'text', description: 'Hero tagline' },\n`;
  } else {
    output += `  { key: '${prefix}_hero_tagline', value: 'Default Tagline', type: 'text', description: 'Hero tagline' },\n`;
  }
  
  const descMatch = content.match(/description="([^"]+)"/);
  if (descMatch) {
    output += `  { key: '${prefix}_hero_description', value: '${descMatch[1].replace(/'/g, "\\'")}', type: 'text', description: 'Hero description' },\n`;
  }
  
  const imgMatch = content.match(/image="([^"]+)"/);
  if (imgMatch) {
    output += `  { key: '${prefix}_hero_image', value: '${imgMatch[1]}', type: 'string', description: 'Hero image' },\n`;
  }
  
  // Extract About section title
  const aboutTitleMatch = content.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
  if (aboutTitleMatch) {
    // strip tags
    const aboutTitle = aboutTitleMatch[1].replace(/<[^>]*>?/gm, '').trim().replace(/\s+/g, ' ');
    output += `  { key: '${prefix}_about_title', value: '${aboutTitle.replace(/'/g, "\\'")}', type: 'string', description: 'About section title' },\n`;
  }

  // Add generic fields for features or processes
  output += `  { key: '${prefix}_about_text', value: 'About text goes here.', type: 'text', description: 'About section paragraph' },\n`;
});

fs.writeFileSync(path.join(__dirname, 'settings_out.txt'), output);
console.log('Done!');
