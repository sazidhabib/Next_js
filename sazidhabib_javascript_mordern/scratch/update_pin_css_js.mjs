import fs from 'fs';

let content = fs.readFileSync('index.html', 'utf8');

// 1. Update .exp .sv-stats b and .dep-pin CSS
const cssTarget = `.exp .sv-stats div{display:flex;flex-direction:column;align-items:center;gap:6px}
.exp .sv-stats b{font-size:clamp(22px, 2.4vw, 36px);line-height:1;color:#0D99FF}
.exp .sv-stats span{font-family:var(--mono);font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}

/* Departures scroll runway: starts below the header, pins the Departures card when it reaches viewport */
.dep-track{
  position:relative;
  z-index:2;
  height:240vh;
}
.dep-pin{
  position:sticky;
  top:clamp(60px, 8vh, 80px);
  height:calc(100vh - clamp(60px, 8vh, 80px));
  height:calc(100svh - clamp(60px, 8vh, 80px));
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  overflow:hidden;
  box-sizing:border-box;
  padding:0 max(calc(var(--u) * 32), 20px) 16px;
  width:100%;
}`;

const cssRepl = `.exp .sv-stats div{display:flex;flex-direction:column;align-items:center;gap:6px}
.exp .sv-stats b{
  font-family:var(--dotf);
  font-weight:900;
  font-size:clamp(26px, 3vw, 42px);
  line-height:1;
  color:#0D99FF;
  letter-spacing:.02em;
  text-shadow:0 0 20px rgba(13,153,255,.35);
}
.exp .sv-stats span{
  font-family:var(--mono);
  font-size:11px;
  letter-spacing:.12em;
  text-transform:uppercase;
  color:var(--muted);
}

/* Departures scroll runway: starts below the header, pins the Departures card when it reaches viewport */
.dep-track{
  position:relative;
  z-index:2;
  height:240vh;
}
.dep-pin{
  position:sticky;
  top:clamp(64px, 8.5vh, 86px);
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:flex-start;
  box-sizing:border-box;
  padding:clamp(6px, 1.2vh, 16px) max(calc(var(--u) * 32), 20px) clamp(16px, 2.5vh, 32px);
  width:100%;
}`;

// 2. Update JS loop pinTop & totalScroll
const jsTarget = `      const pinTop = Math.min(80, Math.max(60, vh * 0.08));
      const totalScroll = Math.max(1, depTrack.offsetHeight - vh + pinTop);`;

const jsRepl = `      const pinTop = Math.min(86, Math.max(64, vh * 0.085));
      const depPin = $('#depPin');
      const pinH = depPin ? depPin.offsetHeight : dep.offsetHeight;
      const totalScroll = Math.max(1, depTrack.offsetHeight - pinH);`;

// Handle CRLF / LF
const normalize = str => str.replace(/\r\n/g, '\n');
const hasCRLF = content.includes('\r\n');

let replacedCSS = false;
let replacedJS = false;

if (content.includes(cssTarget)) {
  content = content.replace(cssTarget, cssRepl);
  replacedCSS = true;
} else if (normalize(content).includes(normalize(cssTarget))) {
  const cNorm = normalize(content);
  const nTarget = normalize(cssTarget);
  const nRepl = normalize(cssRepl);
  content = cNorm.replace(nTarget, hasCRLF ? nRepl.replace(/\n/g, '\r\n') : nRepl);
  replacedCSS = true;
}

if (content.includes(jsTarget)) {
  content = content.replace(jsTarget, jsRepl);
  replacedJS = true;
} else if (normalize(content).includes(normalize(jsTarget))) {
  const cNorm = normalize(content);
  const nTarget = normalize(jsTarget);
  const nRepl = normalize(jsRepl);
  content = cNorm.replace(nTarget, hasCRLF ? nRepl.replace(/\n/g, '\r\n') : nRepl);
  replacedJS = true;
}

console.log('Replaced CSS:', replacedCSS, '| Replaced JS:', replacedJS);
fs.writeFileSync('index.html', content, 'utf8');
console.log('Saved index.html');

