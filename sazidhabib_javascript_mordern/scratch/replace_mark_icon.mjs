import fs from 'fs';

let content = fs.readFileSync('index.html', 'utf8');

// 1. In navbar .tb-logo (around line 2597)
// Target starts with <a href="#top" class="tb-logo" aria-label="Sazid, back to top"><svg class="mk"
// and ends with </svg><svg class="hi cv"
const tbTargetRegex = /<a href="#top" class="tb-logo" aria-label="Sazid, back to top"><svg class="mk"[\s\S]*?<\/svg><svg class="hi cv"/;

const tbRepl = `<a href="#top" class="tb-logo" aria-label="Sazid, back to top"><img src="assets/favicon-192.png" alt="Sazid" class="mk" width="34" height="34" style="object-fit:contain;border-radius:50%;"><svg class="hi cv"`;

if (tbTargetRegex.test(content)) {
  content = content.replace(tbTargetRegex, tbRepl);
  console.log('Replaced tb-logo mark SVG with favicon-192.png');
} else {
  console.error('tb-logo target NOT FOUND');
}

// 2. In contact dialog .sh-logo (around line 2534)
const shTargetRegex = /<span class="sh-logo"><svg class="mk"[\s\S]*?<\/svg><\/span>/;

const shRepl = `<span class="sh-logo"><img src="assets/favicon-192.png" alt="Sazid" class="mk" width="24" height="24" style="object-fit:contain;border-radius:50%;"></span>`;

if (shTargetRegex.test(content)) {
  content = content.replace(shTargetRegex, shRepl);
  console.log('Replaced sh-logo mark SVG with favicon-192.png');
} else {
  console.error('sh-logo target NOT FOUND');
}

// 3. Update .tb-logo .mk in CSS to include drop-shadow filter
const cssTarget = `.tb-logo .mk{width:34px;height:34px;display:block}`;
const cssRepl = `.tb-logo .mk{width:34px;height:34px;display:block;border-radius:50%;object-fit:contain;filter:drop-shadow(0 0 8px rgba(13,153,255,.35))}`;

if (content.includes(cssTarget)) {
  content = content.replace(cssTarget, cssRepl);
  console.log('Updated CSS for .tb-logo .mk');
}

fs.writeFileSync('index.html', content, 'utf8');
console.log('Successfully saved index.html');

