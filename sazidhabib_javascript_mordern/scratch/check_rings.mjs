import fs from 'fs';
import zlib from 'zlib';

const buf = fs.readFileSync('public/assets/favicon-192.png');
let p = 8;
const idats = [];
while (p < buf.length) {
  const len = buf.readUInt32BE(p);
  const type = buf.toString('ascii', p + 4, p + 8);
  if (type === 'IDAT') idats.push(buf.subarray(p + 8, p + 8 + len));
  p += 12 + len;
}
const decomp = zlib.inflateSync(Buffer.concat(idats));

// Let's sample colors in circular rings from center (96, 96):
// radius r from 0 to 95
for (let r = 0; r < 96; r += 5) {
  let samples = [];
  for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
    const x = Math.round(96 + r * Math.cos(angle));
    const y = Math.round(96 + r * Math.sin(angle));
    if (x >= 0 && x < 192 && y >= 0 && y < 192) {
      const idx = y * 769 + 1 + x * 4;
      samples.push(`(${decomp[idx]},${decomp[idx+1]},${decomp[idx+2]},a:${decomp[idx+3]})`);
    }
  }
  console.log(`Radius ${r}:`, samples.slice(0, 3).join(' '));
}

