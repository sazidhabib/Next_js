const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'index.html');
const code = fs.readFileSync(file, 'utf8');

// Check key markers
const startMarker = "let flows = [];";
const endMarker = "/* ---------- services: plate accordion";

const idx1 = code.indexOf(startMarker);
const idx2 = code.indexOf(endMarker);

console.log('idx1:', idx1, 'idx2:', idx2);
if (idx1 === -1 || idx2 === -1) {
  console.error('Markers not found!');
  process.exit(1);
}

console.log('Block length:', idx2 - idx1);
console.log('Block preview:\n' + code.slice(idx1, idx1 + 300));

