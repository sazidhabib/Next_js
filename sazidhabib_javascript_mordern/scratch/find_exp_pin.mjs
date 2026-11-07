import { execSync } from 'child_process';
import fs from 'fs';

const log = execSync('git log --all -S "exp-pin" --format="%h %s"', { maxBuffer: 10 * 1024 * 1024 }).toString();
console.log('Commits with exp-pin:\n' + log);

