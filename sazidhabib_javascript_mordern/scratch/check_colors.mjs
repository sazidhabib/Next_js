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

// Create a 24x24 ASCII preview of the 192x192 image
const S = 8; // 192 / 8 = 24
let ascii = '';
for (let y = 0; y < 192; y += S) {
  let line = '';
  for (let x = 0; x < 192; x += S) {
    let blockAlpha = 0;
    for (let dy = 0; dy < S; dy++) {
      for (let dx = 0; dx < S; dx++) {
        const idx = (y + dy) * 769 + 1 + (x + dx) * 4;
        if (decomp[idx + 3] > 80) blockAlpha++;
      }
    }
    line += blockAlpha > (S*S/4) ? '#' : '.';
  }
  ascii += line + '\n';
}
console.log(ascii);
