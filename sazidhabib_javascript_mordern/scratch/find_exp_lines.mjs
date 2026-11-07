import fs from 'fs';
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
lines.forEach((line, i) => {
  if (line.includes('id="exp"') || line.includes('03 · Experience') || line.includes('03 · EXPERIENCE') || line.includes('04 · Experience') || line.includes('04 · EXPERIENCE') || line.includes('Five years, three studios')) {
    console.log((i+1) + ': ' + line.trim().slice(0, 100));
  }
});

