const fs = require('fs');
const casino = fs.readFileSync('server/src/scripts/CasinoApp.js', 'utf8');

// Find all matches of [{...}] that look like arrays of objects with name/label/title
const arrayRegex = /\[\{[^{}]*(?:name|label|title)[^{}]*\}\]/g;

// Find currency array
const currMatch = casino.match(/\[\{[^{}]*BENGALI[^{}]*\}\]/) || casino.match(/\[\{[^{}]*symbol:[^{}]*\}\]/);
console.log('Currency snippet:', casino.match(/\{code:\"BDT\"[^\}]+\}/g) || casino.match(/\{[^{}]*BDT[^{}]*\}/g));

// Find category tabs
const tabMatches = [...casino.matchAll(/\{id:\"([^\"]+)\",label:\"([^\"]+)\"[^\}]*\}/g)].map(m => ({ id: m[1], label: m[2] }));
console.log('Category Tabs found:', tabMatches);

// Find banner matches
const bannerMatches = [...casino.matchAll(/title:\"([^\"]+)\"[^}]*image:\"([^\"]+)\"/g)].map(m => ({ title: m[1], image: m[2] }));
console.log('Banners found:', bannerMatches);

// Find navigation buttons
const navMatches = [...casino.matchAll(/label:\"([^\"]+)\"/g)].map(m => m[1]);
console.log('All labels found (sample):', [...new Set(navMatches)].slice(0, 50));

