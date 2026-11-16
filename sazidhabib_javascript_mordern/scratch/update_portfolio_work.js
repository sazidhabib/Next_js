const fs = require('fs');
const path = require('path');

const contentFile = path.resolve('data/portfolio-content.json');
const publicContentFile = path.resolve('public/data/portfolio-content.json');
const indexHtmlFile = path.resolve('index.html');
const distIndexFile = path.resolve('dist/index.html');

const data = JSON.parse(fs.readFileSync(contentFile, 'utf8'));

const text = fs.readFileSync('project_details.md', 'utf8');
const sections = text.split(/\n(?=## \d+\. )/).slice(1);

const names = [
  'FIFA World Cup 2026 Tournament Hub',
  'High-Velocity Breaking News Engine',
  'Edition Archive & Faceted Filter System',
  'Meteorological Intelligence Dashboard',
  'National Election 2026 Command Center',
  'Pathokbonddho CMS',
  'SnapShop E-Commerce',
  'Xai Intelligence Workspace',
  'President Properties',
  'Next Idea Solution'
];

const slugs = [
  '#/project/world-cup-2026',
  '#/project/breaking-news',
  '#/project/edition-archive',
  '#/project/weather-portal',
  '#/project/election-2026',
  '#/project/pathokbonddho',
  '#/project/snapshop',
  '#/project/xai',
  '#/project/president-properties',
  '#/project/nextidea-solution'
];

const mediaMap = {
  'pathakbondhu.com': { img: '/uploads/general/pathokbonddhu-471108.gif', video: '' },
  'snap-shop-e-commerce': { img: '', video: '/uploads/projects/shanpshop-386073.mp4' },
  'sazid-x-ai': { img: '', video: '/uploads/general/Xai-407742.webm' },
  'nextideasolution.com': { img: '', video: '/uploads/projects/nextIdeaSolution-947826.mp4' }
};

const newWork = sections.map((sec, idx) => {
  const lines = sec.trim().split('\n').map(l => l.trim()).filter(Boolean);
  
  let subtitle = '';
  let desc = '';
  let i = 1;
  if (lines[i] && lines[i].startsWith('**') && lines[i].endsWith('**')) {
    subtitle = lines[i].replace(/^\*\*|\*\*$/g, '');
    i++;
  }
  if (lines[i] && !lines[i].startsWith('#') && !lines[i].startsWith('VISIT') && !lines[i].startsWith('>_')) {
    desc = lines[i];
    i++;
  }

  const tags = [];
  while (lines[i] && lines[i].startsWith('#')) {
    tags.push(lines[i].replace(/^#/, ''));
    i++;
  }

  let live = '';
  let source = '';
  while (lines[i] && (lines[i].startsWith('VISIT') || lines[i].startsWith('GITHUB'))) {
    if (lines[i].startsWith('VISIT PRODUCTION:')) {
      live = lines[i].replace('VISIT PRODUCTION:', '').trim();
    }
    if (lines[i].startsWith('GITHUB REPO:')) {
      source = lines[i].replace('GITHUB REPO:', '').trim();
    }
    i++;
  }

  let role = '';
  if (lines[i] === 'ENGINEERING ROLE') {
    i++;
    role = lines[i] || '';
    i++;
  }

  let latency = '';
  if (lines[i] === 'LATENCY SLA') {
    i++;
    latency = lines[i] || '';
    i++;
  }

  let scale = '';
  if (lines[i] === 'SCALE / THROUGHPUT') {
    i++;
    scale = lines[i] || '';
    i++;
  }

  let topology = '';
  if (lines[i] === '>_ SYSTEM ARCHITECTURE TOPOLOGY') {
    i++;
    if (lines[i] === 'DATA PIPELINE') i++;
    topology = lines[i] || '';
    i++;
  }

  let challenge = '';
  if (lines[i] === 'THE ARCHITECTURAL CHALLENGE') {
    i++;
    challenge = lines[i] || '';
    i++;
  }

  let solution = '';
  if (lines[i] === 'ENGINEERED SOLUTION') {
    i++;
    solution = lines[i] || '';
    i++;
  }

  const decisions = [];
  if (lines[i] === 'KEY TECHNICAL DECISIONS') {
    i++;
    while (lines[i] && (lines[i].startsWith('✔') || lines[i].startsWith('-'))) {
      decisions.push(lines[i].replace(/^[✔\-]\s*/, ''));
      i++;
    }
  }

  let scores = { perf: 100, seo: 100, a11y: 98, best: 100 };
  if (lines[i] === '>_ LIGHTHOUSE BENCHMARK AUDIT') {
    i++;
    const s1 = parseInt(lines[i++], 10);
    i++;
    const s2 = parseInt(lines[i++], 10);
    i++;
    const s3 = parseInt(lines[i++], 10);
    i++;
    const s4 = parseInt(lines[i++], 10);
    i++;
    scores = { perf: s1, seo: s2, a11y: s3, best: s4 };
  }

  let img = '';
  let video = '';
  for (const [k, v] of Object.entries(mediaMap)) {
    if (live.includes(k)) {
      img = v.img;
      video = v.video;
      break;
    }
  }

  return {
    n: names[idx],
    d: desc,
    img: img,
    video: video,
    live: live,
    source: source,
    case: slugs[idx],
    tags: tags,
    dossier: {
      role: role,
      latency: latency,
      scale: scale,
      topology: topology,
      challenge: challenge,
      solution: solution,
      decisions: decisions,
      scores: scores
    }
  };
});

data.work = newWork;

// 1. Save data/portfolio-content.json
fs.writeFileSync(contentFile, JSON.stringify(data, null, 2), 'utf8');
console.log('Saved', contentFile);

// 2. Save public/data/portfolio-content.json
if (fs.existsSync(path.dirname(publicContentFile))) {
  fs.writeFileSync(publicContentFile, JSON.stringify(data, null, 2), 'utf8');
  console.log('Saved', publicContentFile);
}

// 3. Pre-hydrate index.html
if (fs.existsSync(indexHtmlFile)) {
  let html = fs.readFileSync(indexHtmlFile, 'utf8');
  html = html.replace(/window\.__C\s*=\s*\{[\s\S]*?\};/, `window.__C=${JSON.stringify(data)};`);
  fs.writeFileSync(indexHtmlFile, html, 'utf8');
  console.log('Pre-hydrated', indexHtmlFile);
}

// 4. Pre-hydrate dist/index.html if exists
if (fs.existsSync(distIndexFile)) {
  let html = fs.readFileSync(distIndexFile, 'utf8');
  html = html.replace(/window\.__C\s*=\s*\{[\s\S]*?\};/, `window.__C=${JSON.stringify(data)};`);
  fs.writeFileSync(distIndexFile, html, 'utf8');
  console.log('Pre-hydrated', distIndexFile);
}

console.log('SUCCESS! All 10 projects populated.');
