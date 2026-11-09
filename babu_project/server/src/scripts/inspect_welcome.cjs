const fs = require('fs');

const welcome = fs.readFileSync('server/src/scripts/Welcome.js', 'utf8');
const casino = fs.readFileSync('server/src/scripts/CasinoApp.js', 'utf8');

console.log('Welcome size:', welcome.length);
console.log('CasinoApp size:', casino.length);

// Print the beginning of Welcome
console.log('=== Welcome snippet ===');
console.log(welcome.slice(0, 500));

// Find components or text strings in Welcome
const welcomeStrings = welcome.match(/"[^"\\]{4,50}"/g) || [];
console.log('Welcome sample strings:', welcomeStrings.slice(0, 30));

