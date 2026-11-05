import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.join(__dirname, '..', 'index.html');
let code = fs.readFileSync(indexPath, 'utf8');

// 1. Add CSS for .hb-content and .btn-resume
const targetCss = `.hb-p{margin:0;max-width:360px;font-size:12.5px;line-height:1.75;letter-spacing:.06em;text-transform:uppercase;color:#CFCFD5}`;
const replacementCss = `.hb-content{display:flex;flex-direction:column;gap:14px;align-items:flex-start}
.hb-p{margin:0;max-width:380px;font-size:12.5px;line-height:1.75;letter-spacing:.06em;text-transform:uppercase;color:#CFCFD5}
.btn-resume{display:inline-flex;align-items:center;gap:10px;height:42px;padding:0 16px 0 14px;border-radius:10px;background:rgba(13,153,255,0.08);border:1px solid rgba(13,153,255,0.32);color:#fff;font-family:var(--disp);font-size:12.5px;font-weight:600;letter-spacing:0.02em;text-decoration:none;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 6px 20px rgba(0,0,0,0.35),inset 0 1px 0 rgba(255,255,255,0.1);transition:all .25s cubic-bezier(.2,.8,.2,1);cursor:pointer}
.btn-resume .dl-ic{width:16px;height:16px;color:#0D99FF;transition:transform .25s ease}
.btn-resume .btn-ext{font-family:var(--mono);font-size:9.5px;font-weight:700;color:#38BDF8;background:rgba(56,189,248,0.15);padding:2px 6px;border-radius:4px;letter-spacing:0.05em;border:1px solid rgba(56,189,248,0.25)}
.btn-resume:hover{background:rgba(13,153,255,0.18);border-color:#0D99FF;color:#fff;transform:translateY(-2px);box-shadow:0 0 24px rgba(13,153,255,0.35),0 10px 28px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.2)}
.btn-resume:hover .dl-ic{transform:translateY(2px)}
.btn-resume:active{transform:translateY(0) scale(0.97)}`;

if (!code.includes(targetCss)) {
  console.error("Target CSS not found!");
  process.exit(1);
}
code = code.replace(targetCss, replacementCss);

// 2. Update HTML in .hero-bottom
const targetHtml = `<div class="hero-bottom wrap">
    <p class="hb-p">Full-Stack Software Engineer building scalable cloud architectures, high-performance web applications, and resilient distributed systems with 120 FPS creative engineering.</p>
    <span class="mono scroll-cue">`;

const replacementHtml = `<div class="hero-bottom wrap">
    <div class="hb-content">
      <p class="hb-p">Full-Stack Software Engineer building scalable cloud architectures, high-performance web applications, and resilient distributed systems with 120 FPS creative engineering.</p>
      <a href="Mahbub_Sazid_Habib_Resume.pdf" download="Mahbub_Sazid_Habib_Resume.pdf" class="btn-resume" aria-label="Download Resume" target="_blank" rel="noopener">
        <svg class="hi dl-ic" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 3v11m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>Download Resume</span>
        <span class="btn-ext">PDF</span>
      </a>
    </div>
    <span class="mono scroll-cue">`;

if (!code.includes(targetHtml)) {
  console.error("Target HTML not found!");
  process.exit(1);
}
code = code.replace(targetHtml, replacementHtml);

fs.writeFileSync(indexPath, code, 'utf8');
console.log("Successfully added Resume Button to Hero Section!");

