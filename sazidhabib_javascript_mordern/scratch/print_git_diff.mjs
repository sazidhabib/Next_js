import { execSync } from 'child_process';
import fs from 'fs';

const diff = execSync('git diff index.html', { maxBuffer: 15 * 1024 * 1024 }).toString();
fs.writeFileSync('scratch/full_git_diff.diff', diff);
console.log('Diff size:', diff.length);

