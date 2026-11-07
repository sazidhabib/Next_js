import { execSync } from 'child_process';
import fs from 'fs';

const out = execSync('git show cc95019a:sazidhabib_javascript_mordern/index.html', { maxBuffer: 10 * 1024 * 1024 }).toString();

const cssMatch = out.match(/\/\* =+ EXPERIENCE[\s\S]*?(?=\/\* =+)/);
console.log('CSS match found:', !!cssMatch);
if (cssMatch) {
  fs.writeFileSync('scratch/prev_exp_css.css', cssMatch[0]);
  console.log('Wrote scratch/prev_exp_css.css');
}

const htmlMatch = out.match(/<section class="exp"[\s\S]*?<\/section>/);
console.log('HTML match found:', !!htmlMatch);
if (htmlMatch) {
  fs.writeFileSync('scratch/prev_exp_html.html', htmlMatch[0]);
  console.log('Wrote scratch/prev_exp_html.html');
}

const jsMatch = out.match(/\/\* -+ departures board[\s\S]*?(?=\/\* -+)/);
console.log('JS match found:', !!jsMatch);
if (jsMatch) {
  fs.writeFileSync('scratch/prev_exp_js.js', jsMatch[0]);
  console.log('Wrote scratch/prev_exp_js.js');
}
