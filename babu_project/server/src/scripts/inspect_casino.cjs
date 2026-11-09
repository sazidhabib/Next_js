const fs = require('fs');
const casino = fs.readFileSync('server/src/scripts/CasinoApp.js', 'utf8');

// Find all JSX/render text or labels
const strings = casino.match(/"([^"\\]{3,80})"/g) || [];
const uniqueStrings = [...new Set(strings.map(s => s.slice(1, -1)))];

// Filter interesting UI strings
const uiStrings = uniqueStrings.filter(s => 
  !s.startsWith('./') && 
  !s.startsWith('http') && 
  !s.includes('/') && 
  !s.includes(';') &&
  !s.includes('{') &&
  s.length > 2
);

console.log('UI Strings sample (100):');
console.log(uiStrings.slice(0, 100));

// Find category names or tabs
const catMatches = casino.match(/categories\s*=\s*(\[.*?\])/s) || casino.match(/tabs\s*=\s*(\[.*?\])/s);
if (catMatches) {
  console.log('Categories/Tabs found:', catMatches[1].slice(0, 500));
}

