const fs = require('fs');
const html = fs.readFileSync('server/src/scripts/home_dump.html', 'utf8');

const regex = /https:\/\/casinogame\.ihookwebsolutions\.com\/build\/assets\/[a-zA-Z0-9_\-\.]+\.js/g;
const matches = [...new Set(html.match(regex) || [])];
console.log('Total asset scripts:', matches.length);
matches.forEach(m => {
  if (m.includes('Welcome') || m.includes('Casino') || m.includes('Home') || m.includes('app-') || m.includes('Main') || m.includes('Layout')) {
    console.log('->', m);
  }
});

