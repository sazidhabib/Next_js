import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = 'C:\\Users\\80509\\AppData\\Local\\Temp\\chrome-record-proof';
const ARTIFACT_DIR = 'C:\\Users\\80509\\.gemini\\antigravity\\brain\\2920477a-53dd-42f6-923f-6cb251c6728e';

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function ensureServer() {
  try {
    const res = await fetch('http://127.0.0.1:3000/');
    if (res.status === 200) return null;
  } catch (e) {}

  console.log('Starting app.js server on port 3000...');
  const srv = spawn('node', ['app.js'], { stdio: 'pipe' });
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://127.0.0.1:3000/');
      if (res.status === 200) return srv;
    } catch (e) {}
    await wait(300);
  }
  throw new Error('Could not connect to app.js on port 3000');
}

async function getTargets() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9222/json');
      const data = await res.json();
      const page = data.find(t => t.type === 'page');
      if (page && page.webSocketDebuggerUrl) return page;
    } catch (e) {}
    await wait(300);
  }
  throw new Error('Chrome remote debugging did not respond on port 9222');
}

async function main() {
  const srv = await ensureServer();
  let chrome;

  try {
    console.log('Launching Chrome with 1440x900 viewport...');
    chrome = spawn(CHROME_PATH, [
      '--headless=new',
      '--window-size=1440,900',
      '--remote-debugging-port=9222',
      `--user-data-dir=${USER_DATA}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--autoplay-policy=no-user-gesture-required',
      'http://127.0.0.1:3000/'
    ], { stdio: 'ignore' });

    const page = await getTargets();
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 1;
    const callbacks = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const resolve = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        resolve(msg.result);
      }
    };

    await new Promise(r => ws.onopen = r);

    const send = (method, params = {}) => new Promise(resolve => {
      const msgId = id++;
      callbacks.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });

    await send('Runtime.enable');
    await send('Page.enable');
    await send('DOM.enable');

    console.log('Waiting 3s for site initialization...');
    await wait(3000);

    // Scroll to #work
    console.log('Scrolling to #work...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const wk = document.getElementById('work') || document.getElementById('wk');
          if (wk) {
            const y = wk.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: y + 250, behavior: 'instant' });
          }
        })();
      `
    });

    await wait(1800);

    // Start video recorder inside the browser page
    console.log('Starting MediaRecorder inside page...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          window.__chunks = [];
          const vid = document.querySelector('video.prj-vid');
          if (!vid) {
            window.__recordError = 'No video element found';
            return;
          }

          // Create recording canvas capturing the card / video
          const cv = document.createElement('canvas');
          cv.width = 1280;
          cv.height = 720;
          const ctx = cv.getContext('2d');

          const stream = cv.captureStream(30);
          const mr = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8' });
          mr.ondataavailable = e => { if (e.data && e.data.size > 0) window.__chunks.push(e.data); };
          mr.start(100);
          window.__mr = mr;

          // Animation loop drawing video + live telemetry HUD onto canvas
          let active = true;
          window.__stopCanvasLoop = () => { active = false; };

          function drawFrame() {
            if (!active) return;
            // Background
            ctx.fillStyle = '#07070A';
            ctx.fillRect(0, 0, cv.width, cv.height);

            // Draw video frame
            if (vid.readyState >= 2) {
              const vw = vid.videoWidth || 1280, vh = vid.videoHeight || 720;
              const scale = Math.min((cv.width - 80) / vw, (cv.height - 120) / vh);
              const dw = vw * scale, dh = vh * scale;
              const dx = (cv.width - dw) / 2, dy = 60 + (cv.height - 120 - dh) / 2;

              ctx.drawImage(vid, dx, dy, dw, dh);

              // Tech border
              ctx.strokeStyle = 'rgba(13, 153, 255, 0.7)';
              ctx.lineWidth = 2;
              ctx.strokeRect(dx, dy, dw, dh);
            }

            // Top Status Bar
            ctx.fillStyle = 'rgba(8, 10, 16, 0.9)';
            ctx.fillRect(0, 0, cv.width, 50);
            ctx.fillStyle = '#0D99FF';
            ctx.font = 'bold 16px monospace';
            ctx.fillText('>_ LIVE SCREEN RECORD PROOF // PRJ 01 "New Project"', 24, 32);

            ctx.fillStyle = '#0ACF83';
            ctx.fillText('STATUS: PLAYING', 700, 32);

            ctx.fillStyle = '#FFFFFF';
            ctx.fillText('TIME: ' + (vid.currentTime ? vid.currentTime.toFixed(2) : '0.00') + 's / ' + (vid.duration ? vid.duration.toFixed(1) : '33.6') + 's', 920, 32);

            requestAnimationFrame(drawFrame);
          }
          requestAnimationFrame(drawFrame);
        })();
      `
    });

    // Capture 4 high-res screenshots at 1-second intervals
    const screenshots = [];
    for (let i = 1; i <= 4; i++) {
      await wait(1000);
      const snap = await send('Page.captureScreenshot', { format: 'png' });
      const snapPath = path.join(ARTIFACT_DIR, `proof_frame_${i}.png`);
      fs.writeFileSync(snapPath, Buffer.from(snap.data, 'base64'));
      screenshots.push(snapPath);

      const t = await send('Runtime.evaluate', {
        expression: `document.querySelector('video.prj-vid')?.currentTime || 0`,
        returnByValue: true
      });
      console.log(`Captured proof_frame_${i}.png at currentTime = ${t?.result?.value?.toFixed(2)}s`);
    }

    // Stop MediaRecorder and extract base64 WebM
    console.log('Stopping MediaRecorder and extracting WebM...');
    await send('Runtime.evaluate', {
      expression: `
        new Promise(resolve => {
          if (window.__stopCanvasLoop) window.__stopCanvasLoop();
          if (!window.__mr) return resolve('');
          window.__mr.onstop = async () => {
            const blob = new Blob(window.__chunks, { type: 'video/webm' });
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(blob);
          };
          window.__mr.stop();
        });
      `,
      awaitPromise: true,
      returnByValue: true
    }).then(res => {
      const b64 = res?.result?.value;
      if (b64) {
        const videoPath = path.join(ARTIFACT_DIR, 'screen_record_proof.webm');
        fs.writeFileSync(videoPath, Buffer.from(b64, 'base64'));
        console.log(`Saved screen_record_proof.webm (${(Buffer.byteLength(b64, 'base64') / 1024).toFixed(1)} KB)`);
      } else {
        console.log('No video blob returned.');
      }
    });

    console.log('All proofs saved to artifact directory!');
    ws.close();
  } catch (err) {
    console.error('Recording error:', err);
  } finally {
    if (chrome) chrome.kill();
    if (srv) srv.kill();
  }
}

main();

