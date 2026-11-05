import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.join(__dirname, '..', 'index.html');
let code = fs.readFileSync(indexPath, 'utf8');

const startMarker = "let flows = [];";
const endMarker = "/* ---------- services: plate accordion";

const idx1 = code.indexOf(startMarker);
const idx2 = code.indexOf(endMarker);

if (idx1 === -1 || idx2 === -1) {
  console.error("Could not find markers!");
  process.exit(1);
}

const replacement = `let allFlows = [];

    const build = () => {
      frames.forEach((f, i) => {
        const r = box(i);
        f.style.left = r.x + 'px';
        f.style.top = r.y + 'px';
      });

      svg.replaceChildren();
      allFlows = [];

      // 1. Intra-cluster flows (connecting cards inside each cluster frame)
      clusters.forEach((group, cIdx) => {
        const fr = frames[cIdx];
        if (!fr) return;
        const cards = Array.from(fr.querySelectorAll('.prj-card'));
        const frPos = box(cIdx);
        const cardGaps = cards.length - 1;

        for (let j = 0; j < cardGaps; j++) {
          const c1 = cards[j];
          const c2 = cards[j + 1];

          const x1 = frPos.x + c1.offsetLeft + c1.offsetWidth;
          const y1 = frPos.y + c1.offsetTop + c1.offsetHeight / 2;
          const x2 = frPos.x + c2.offsetLeft;
          const y2 = frPos.y + c2.offsetTop + c2.offsetHeight / 2;

          const g = document.createElementNS(NS, 'g');
          const path = document.createElementNS(NS, 'path');
          const dot = document.createElementNS(NS, 'circle');
          const arr = document.createElementNS(NS, 'path');

          path.setAttribute('d', \`M \${x1.toFixed(1)} \${y1.toFixed(1)} L \${x2.toFixed(1)} \${y2.toFixed(1)}\`);
          path.setAttribute('fill', 'none');
          path.setAttribute('stroke', '#0D99FF');
          path.setAttribute('stroke-width', '4');
          path.setAttribute('stroke-linecap', 'round');

          dot.setAttribute('class', 'wdot');
          dot.setAttribute('cx', x1.toFixed(1));
          dot.setAttribute('cy', y1.toFixed(1));
          dot.setAttribute('r', '6');

          // Sleek tech arrowhead pointing right (+X)
          arr.setAttribute('class', 'warr');
          arr.setAttribute('d', 'M 0 0 L -13 -7 L -9 0 L -13 7 Z');
          arr.setAttribute('transform', \`translate(\${x1.toFixed(1)}, \${y1.toFixed(1)})\`);
          arr.style.opacity = '0';
          g.style.opacity = '0';

          g.append(path, dot, arr);
          svg.append(g);

          const len = Math.max(1, path.getTotalLength() || (x2 - x1));
          path.style.strokeDasharray = len;
          path.style.strokeDashoffset = len;

          // Timing sub-range allocation:
          // Cluster 0 intra phase: 0.05 to 0.45 -> step 0: 0.05..0.25, step 1: 0.25..0.45
          // Cluster 1 intra phase: 0.75 to 0.93 -> step 0: 0.75..0.93
          const baseStart = cIdx === 0 ? 0.05 : 0.75;
          const baseEnd = cIdx === 0 ? 0.45 : 0.93;
          const stepSpan = (baseEnd - baseStart) / Math.max(1, cardGaps);
          const startP = baseStart + j * stepSpan;
          const endP = startP + stepSpan;

          allFlows.push({
            type: 'intra',
            clusterIndex: cIdx,
            stepIndex: j,
            startP,
            endP,
            x1, y1, x2, y2,
            path, dot, arr, g, len
          });
        }
      });

      // 2. Inter-cluster Bridge flows (from last card of cluster cIdx to first card of cluster cIdx + 1)
      for (let cIdx = 0; cIdx < clusters.length - 1; cIdx++) {
        const frA = frames[cIdx];
        const frB = frames[cIdx + 1];
        if (!frA || !frB) continue;
        const cardsA = Array.from(frA.querySelectorAll('.prj-card'));
        const cardsB = Array.from(frB.querySelectorAll('.prj-card'));
        const lastCard = cardsA[cardsA.length - 1];
        const firstCard = cardsB[0];

        const posA = box(cIdx);
        const posB = box(cIdx + 1);

        const x1 = posA.x + (lastCard ? (lastCard.offsetLeft + lastCard.offsetWidth) : posA.w);
        const y1 = posA.y + (lastCard ? (lastCard.offsetTop + lastCard.offsetHeight / 2) : posA.h / 2);
        const x2 = posB.x + (firstCard ? firstCard.offsetLeft : 0) - 18;
        const y2 = posB.y + (firstCard ? (firstCard.offsetTop + firstCard.offsetHeight / 2) : posB.h / 2);

        const right = posB.x > posA.x + posA.w * 0.6;
        const dStr = right
          ? \`M \${x1.toFixed(1)} \${y1.toFixed(1)} C \${(x1 + 220).toFixed(1)} \${y1.toFixed(1)}, \${(x2 - 220).toFixed(1)} \${y2.toFixed(1)}, \${x2.toFixed(1)} \${y2.toFixed(1)}\`
          : \`M \${x1.toFixed(1)} \${y1.toFixed(1)} C \${x1.toFixed(1)} \${(y1 + 260).toFixed(1)}, \${x2.toFixed(1)} \${(y2 - 260).toFixed(1)}, \${x2.toFixed(1)} \${y2.toFixed(1)}\`;

        const g = document.createElementNS(NS, 'g');
        const path = document.createElementNS(NS, 'path');
        const dot = document.createElementNS(NS, 'circle');
        const arr = document.createElementNS(NS, 'path');

        path.setAttribute('d', dStr);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', '#0D99FF');
        path.setAttribute('stroke-width', '4');
        path.setAttribute('stroke-linecap', 'round');

        dot.setAttribute('class', 'wdot');
        dot.setAttribute('cx', x1.toFixed(1));
        dot.setAttribute('cy', y1.toFixed(1));
        dot.setAttribute('r', '8');

        arr.setAttribute('class', 'warr');
        arr.setAttribute('d', right ? \`M \${(x2 + 18).toFixed(1)} \${y2.toFixed(1)} l-22 -13 v26 z\` : \`M \${x2.toFixed(1)} \${(y2 + 18).toFixed(1)} l-13 -22 h26 z\`);
        arr.style.opacity = '0';
        g.style.opacity = '0';

        g.append(path, dot, arr);
        svg.append(g);

        const len = Math.max(1, path.getTotalLength() || 600);
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;

        // Bridge timing: draws during cluster transition 0.45 to 0.75
        const startP = 0.45;
        const endP = 0.75;

        allFlows.push({
          type: 'bridge',
          clusterIndex: cIdx,
          startP,
          endP,
          x1, y1, x2, y2,
          path, dot, arr, g, len
        });
      }
    };

    setTimeout(build, 80);
    setTimeout(build, 400);
    addEventListener('resize', build);
    addEventListener('load', build);

    // Re-run build whenever card images load to guarantee pixel-perfect alignment
    frames.forEach(f => {
      f.querySelectorAll('img').forEach(im => {
        if (!im.complete) im.addEventListener('load', build, { once: true });
      });
    });

    wrap.style.height = (clusters.length * 150 + 60) + 'vh';
    $('#wkNt').textContent = '/ ' + pad(clusters.length);

    // Diode field initialization & interactive liquid simulation
    const field = diode($('#wkPx'), { target: pin });
    if (field && field.setVis) {
      field.setVis(true);
    }

    pin.addEventListener('pointermove', e => {
      if (field && field.onMove) field.onMove(e);
    });

    pin.addEventListener('pointerdown', e => {
      if (field && field.ripple) {
        const b = $('#wkPx').getBoundingClientRect();
        field.ripple(e.clientX - b.left, e.clientY - b.top);
      }
    });

    // Make clusters clickable to jump smoothly between Cluster 01 and Cluster 02
    frames.forEach((fr, i) => {
      fr.style.cursor = 'pointer';
      fr.addEventListener('click', (e) => {
        if (e.target.closest('a, button')) return;
        const total = wrap.offsetHeight - innerHeight;
        const targetP = i === 0 ? 0.20 : 0.80;
        const destY = wrap.getBoundingClientRect().top + window.scrollY + total * targetP;
        if (lenis && lenis.scrollTo) {
          lenis.scrollTo(destY);
        } else {
          window.scrollTo({ top: destY, behavior: 'smooth' });
        }
      });
    });

    const cntHud = $('#wkHud .cnt');
    if (cntHud) {
      cntHud.style.cursor = 'pointer';
      cntHud.addEventListener('click', () => {
        const nextIdx = focus === 0 ? 1 : 0;
        const total = wrap.offsetHeight - innerHeight;
        const targetP = nextIdx === 0 ? 0.20 : 0.80;
        const destY = wrap.getBoundingClientRect().top + window.scrollY + total * targetP;
        if (lenis && lenis.scrollTo) {
          lenis.scrollTo(destY);
        } else {
          window.scrollTo({ top: destY, behavior: 'smooth' });
        }
      });
    }

    const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const fit = (r, top, bot, pad, k = 1) => {
      const vw = pin.clientWidth, vh = pin.clientHeight;
      const s = Math.min((vw - pad * 2) / r.w, (vh - top - bot) / r.h) * k;
      return {
        s,
        x: vw / 2 - (r.x + r.w / 2) * s,
        y: top + (vh - top - bot) / 2 - (r.y + r.h / 2) * s
      };
    };

    let focus = -1;

    (function frame() {
      requestAnimationFrame(frame);
      if (!onScr(wrap)) return;

      const r = wrap.getBoundingClientRect(), vh = innerHeight;
      const totalScroll = Math.max(1, wrap.offsetHeight - vh);
      const p = Math.max(0, Math.min(1, -r.top / totalScroll));
      const vw = pin.clientWidth, mob = vw < 760;

      const inA = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.9)));
      const outA = Math.max(0, Math.min(1, r.bottom / (vh * 0.9)));
      pin.style.setProperty('--in', Math.min(inA, outA).toFixed(3));

      if (field && field.setVis && inA > 0.05) {
        field.setVis(true);
      }

      const nav = document.querySelector('.tb'), nb = nav ? nav.getBoundingClientRect().bottom : 70;
      const top = Math.max(nb + 46, mob ? 112 : 120), bot = mob ? 92 : 84, pad = mob ? 16 : 60;
      const FK = !mob ? 0.92 : 1;
      hud.style.top = (Math.max(nb, 0) + 14) + 'px';

      // Cluster segment navigation:
      // n = 2 clusters, seg = 0.5 each
      const n = clusters.length;
      const seg = 1 / n;
      const k = Math.min(n - 1, Math.floor(p / seg));
      const local = clamp((p - k * seg) / seg);

      const from = k === 0 ? fit(view(0), top + 40, bot, pad, 0.65) : fit(view(k - 1), top, bot, pad, FK);
      const to = fit(view(k), top, bot, pad, FK);
      const m = clamp(local / 0.50);
      const e = ease(m);
      const hop = k === 0 ? 0 : Math.sin(Math.PI * m) * 0.12;

      const s0 = lerp(from.s, to.s, e);
      const cam = {
        s: s0 * (1 - hop),
        x: lerp(from.x, to.x, e),
        y: lerp(from.y, to.y, e)
      };

      if (hop > 0) {
        const cx = vw / 2, cy = pin.clientHeight / 2;
        cam.x = cx - (cx - cam.x) * (cam.s / s0);
        cam.y = cy - (cy - cam.y) * (cam.s / s0);
      }

      world.style.transform = 'translate(' + cam.x.toFixed(2) + 'px,' + cam.y.toFixed(2) + 'px) scale(' + cam.s.toFixed(5) + ')';

      // Target zoom percentage
      $('#wkZoom').textContent = Math.round((cam.s / to.s) * 100) + '%';
      hud.classList.toggle('go', p > 0.04);

      // Active Cluster focus: switches to cluster 2 when transition is half-way (p >= 0.58)
      const f = p >= 0.58 ? 1 : 0;
      if (f !== focus) {
        focus = f;
        frames.forEach((fr, i) => {
          fr.classList.toggle('on', i === f);
        });
        const expCnt = pad(f + 1);
        const numEl = $('#wkN');
        if (numEl && numEl.textContent !== expCnt) {
          numEl.textContent = expCnt;
        }
      }

      // Sequential connection line animations on scroll:
      // Intra-cluster: PRJ 01 -> PRJ 02 -> PRJ 03
      // Bridge: PRJ 03 -> Cluster 02 (PRJ 04)
      // Intra-cluster: PRJ 04 -> PRJ 05
      allFlows.forEach(fl => {
        let t = 0;
        if (p >= fl.endP) {
          t = 1;
        } else if (p > fl.startP) {
          t = (p - fl.startP) / (fl.endP - fl.startP);
        }

        fl.path.style.strokeDashoffset = fl.len * (1 - t);

        if (fl.type === 'intra') {
          const currX = fl.x1 + (fl.x2 - fl.x1) * t;
          fl.arr.setAttribute('transform', 'translate(' + currX.toFixed(1) + ', ' + fl.y1.toFixed(1) + ')');
          fl.arr.style.opacity = t > 0.04 ? '1' : '0';
          fl.g.style.opacity = t > 0 ? '1' : '0';
        } else if (fl.type === 'bridge') {
          fl.arr.style.opacity = t > 0.92 ? '1' : '0';
          fl.g.style.opacity = (t >= 1 && p > 0.75) ? '0.35' : (t > 0 ? '1' : '0');
        }
      });
    })();
  });\n\n  `;

const newCode = code.slice(0, idx1) + replacement + code.slice(idx2);
fs.writeFileSync(indexPath, newCode, 'utf8');
console.log('Successfully updated index.html with intra and bridge flows!');

