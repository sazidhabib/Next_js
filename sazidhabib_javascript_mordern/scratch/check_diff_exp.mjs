import { execSync } from 'child_process';
import fs from 'fs';

const diff = execSync('git diff cc95019a 574c1b58 -- sazidhabib_javascript_mordern/index.html', { maxBuffer: 15 * 1024 * 1024 }).toString();

const lines = diff.split('\n');
const expLines = [];
let inExp = false;
for (const line of lines) {
  if (line.includes('EXPERIENCE') || line.includes('exp-pin') || line.includes('dep-wrap') || line.includes('dep-box')) {
    inExp = true;
  }
  if (inExp) {
    expLines.push(line);
    if (expLines.length > 300) break;
  }
}
fs.writeFileSync('scratch/diff_exp_cc_to_57.txt', expLines.join('\n'));
console.log('Saved diff_exp_cc_to_57.txt');

