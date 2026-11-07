import { execSync } from 'child_process';
import fs from 'fs';

// Check the git diff between HEAD and working copy or git reflog
const diff = execSync('git diff -U5 HEAD index.html', { maxBuffer: 10 * 1024 * 1024 }).toString();

const expDiff = diff.split('\n').filter(line => line.includes('exp') || line.includes('dep')).join('\n');
fs.writeFileSync('scratch/current_diff_exp.txt', expDiff);
console.log('Done writing current_diff_exp.txt');

