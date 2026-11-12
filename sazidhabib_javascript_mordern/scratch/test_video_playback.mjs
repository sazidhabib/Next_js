import { spawn } from 'child_process';
import http from 'http';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA = 'C:\\Users\\80509\\AppData\\Local\\Temp\\chrome-verify-playback';

// 1. Start App Server (app.js)
console.log('Starting app.js on port 3000...');
const server = spawn('node', ['app.js'], { stdio: 'pipe' });
server.stdout.on('data', d => console.log('[Server stdout]:', d.toString().trim()));
server.stderr.on('data', d => console.error('[Server stderr]:', d.toString().trim()));

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForServer() {
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch('http://127.0.0.1:3000/');
      if (res.status === 200) {
        console.log('App server is ready on http://127.0.0.1:3000/');
        return;
      }
    } catch (e) {}
    await wait(300);
  }
  throw new Error('Server did not start in time');
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

async function run() {
  let chrome;
  try {
    await waitForServer();

    console.log('Launching headless Chrome...');
    chrome = spawn(CHROME_PATH, [
      '--headless=new',
      '--remote-debugging-port=9222',
      `--user-data-dir=${USER_DATA}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--autoplay-policy=no-user-gesture-required',
      'http://127.0.0.1:3000/'
    ], { stdio: 'ignore' });

    const page = await getTargets();
    console.log('Connected to Chrome page:', page.webSocketDebuggerUrl);

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    let id = 1;
    const callbacks = new Map();
    const consoleLogs = [];

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const resolve = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        resolve(msg.result);
      }
      if (msg.method === 'Runtime.consoleAPICalled') {
        const text = msg.params.args.map(a => a.value || JSON.stringify(a)).join(' ');
        consoleLogs.push(`[${msg.params.type}] ${text}`);
      }
      if (msg.method === 'Runtime.exceptionThrown') {
        consoleLogs.push(`[EXCEPTION] ${JSON.stringify(msg.params.exceptionDetails)}`);
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

    console.log('Waiting 3s for page load & hydration...');
    await wait(3000);

    // Scroll to #work
    console.log('Scrolling to #work...');
    await send('Runtime.evaluate', {
      expression: `
        (() => {
          const wk = document.getElementById('work') || document.getElementById('wk');
          if (wk) {
            const y = wk.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: y + 200, behavior: 'instant' });
          }
        })();
      `
    });

    await wait(2000);

    const evalVideo = async () => {
      const res = await send('Runtime.evaluate', {
        expression: `
          (() => {
            const v = document.querySelector('video.prj-vid');
            const card = v ? v.closest('.prj-card') : null;
            const cluster = v ? v.closest('.wf') : null;
            const title = card ? card.querySelector('.prj-title')?.textContent : null;
            return {
              found: !!v,
              title: title,
              clusterIdx: cluster ? cluster.dataset.cluster : null,
              src: v ? (v.currentSrc || v.src) : null,
              paused: v ? v.paused : null,
              currentTime: v ? v.currentTime : null,
              duration: v ? v.duration : null,
              readyState: v ? v.readyState : null,
              networkState: v ? v.networkState : null,
              videoWidth: v ? v.videoWidth : null,
              videoHeight: v ? v.videoHeight : null,
              muted: v ? v.muted : null,
              error: v && v.error ? v.error.message : null
            };
          })();
        `,
        returnByValue: true
      });
      return res?.result?.value;
    };

    const s0 = await evalVideo();
    console.log('Sample 0 at Work section:', JSON.stringify(s0, null, 2));

    await wait(2000);

    const s1 = await evalVideo();
    console.log('Sample 1 (2.0 seconds later):', JSON.stringify(s1, null, 2));

    console.log('\n================ VERIFICATION RESULT ================');
    console.log('Video element present:', s1.found);
    console.log('Project title:', s1.title);
    console.log('Cluster index:', s1.clusterIdx);
    console.log('Video source URL:', s1.src);
    console.log('Video is paused:', s1.paused);
    console.log('Playback progress:', s0.currentTime, 's ->', s1.currentTime, 's');
    const isPlaying = !s1.paused && (s1.currentTime > s0.currentTime || s1.currentTime > 0);
    console.log('CONFIRMED PLAYING:', isPlaying);
    console.log('=====================================================\n');

    if (consoleLogs.length) {
      console.log('Console Logs:\n', consoleLogs.slice(-10).join('\n'));
    }

    ws.close();
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    if (chrome) chrome.kill();
    server.kill();
  }
}

run();
