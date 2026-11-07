import fs from 'fs';

let content = fs.readFileSync('index.html', 'utf8');

// 1. Update .tb-logo and .tb-logo .mk CSS
const targetCss = `    .tb-logo {
      display: flex;
      align-items: center;
      gap: 4px;
      height: 40px;
      padding: 0 8px 0 10px;
      color: #fff;
      border-radius: 6px;
      transition: background .25s
    }

    .tb-logo .mk {
      width: 40px;
      height: 40px;
      display: block;
      border-radius: 50%;
      object-fit: contain;
      filter: drop-shadow(0 0 8px rgba(13, 153, 255, .35))
    }`;

const replCss = `    .tb-logo {
      display: flex;
      align-items: center;
      gap: 6px;
      height: 44px;
      padding: 0 8px 0 8px;
      color: #fff;
      border-radius: 8px;
      transition: background .25s;
    }

    .tb-logo .mk {
      width: 40px;
      height: 40px;
      min-width: 40px;
      min-height: 40px;
      flex-shrink: 0;
      display: block;
      border-radius: 50%;
      object-fit: contain;
      background: rgba(255, 255, 255, 0.08);
      border: 1.5px solid rgba(124, 198, 255, 0.5);
      box-shadow: 0 0 12px rgba(13, 153, 255, 0.35);
      filter: drop-shadow(0 0 8px rgba(13, 153, 255, 0.45));
    }`;

const normalize = s => s.replace(/\r\n/g, '\n');
const hasCRLF = content.includes('\r\n');

if (content.includes(targetCss)) {
  content = content.replace(targetCss, replCss);
  console.log('Direct CSS replacement succeeded');
} else if (normalize(content).includes(normalize(targetCss))) {
  content = normalize(content).replace(normalize(targetCss), hasCRLF ? replCss.replace(/\n/g, '\r\n') : replCss);
  console.log('Normalized CSS replacement succeeded');
} else {
  console.error('Target CSS NOT found');
}

fs.writeFileSync('index.html', content, 'utf8');
console.log('Saved index.html');

