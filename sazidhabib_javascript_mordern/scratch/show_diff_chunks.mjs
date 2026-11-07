import { execSync } from 'child_process';
import fs from 'fs';

const diff = execSync('git diff -U3 HEAD index.html', { maxBuffer: 10 * 1024 * 1024 }).toString();

const chunks = diff.split('@@ ');
for (const chunk of chunks) {
  if (chunk.includes('exp') || chunk.includes('Departures') || chunk.includes('dep-')) {
    console.log('--- CHUNK ---');
    console.log(chunk.slice(0, 800));
  }
}

