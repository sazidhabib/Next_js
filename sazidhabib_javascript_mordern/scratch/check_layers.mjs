import fs from 'fs';
const text = fs.readFileSync('index.html', 'utf8');

const checkSec = (id) => {
  const start = text.indexOf(`id="${id}"`);
  console.log(`=== ${id} ===`);
  console.log(text.slice(start, start + 400));
};

checkSec('about');
checkSec('exp');
checkSec('work');
