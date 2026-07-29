/**
 * Records the ERP autoplay walkthrough at true device resolution.
 *
 * Playwright's own recordVideo captures at the CSS viewport size and pads the
 * frame out to recordVideo.size, so it cannot give a high-DPI capture. CDP's
 * Page.startScreencast captures the compositor surface instead -- but only if
 * the surface is really that big: an *emulated* deviceScaleFactor raises
 * devicePixelRatio yet leaves the surface at CSS size, so the flag below is
 * what actually buys the 2x. With it, a 1280x720 layout casts at 2560x1440.
 *
 * Screencast frames only arrive when the page repaints, so a wallclock timer
 * resamples "whatever is on screen right now" into a constant-rate stream that
 * is piped straight into ffmpeg. No frame files on disk.
 *
 *   node record.mjs --out foo.mp4 [--width 1280] [--height 720] [--dsf 2]
 *                   [--fps 30] [--seconds N] [--captions] [--speed 0.8]
 *
 * The clip runs for as long as the walkthrough really takes -- the resampler
 * below is paced off the wallclock, so there is no way for it to come out
 * slower or faster than what a viewer would have seen. Use --speed to change
 * the pace on purpose (0.8 = a fifth slower); it is the demo's own ?speed.
 */
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';

const argv = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = argv.indexOf('--' + name);
  return i === -1 ? fallback : argv[i + 1];
};
const flag = (name) => argv.includes('--' + name);

const WIDTH = Number(arg('width', 1280));
const HEIGHT = Number(arg('height', 720));
const DSF = Number(arg('dsf', 2));
const FPS = Number(arg('fps', 30));
const OUT = arg('out', 'out.mp4');
const LIMIT = Number(arg('seconds', 0));          // 0 = run to completion
const BASE = arg('base', 'http://localhost:8123');
const CAPTIONS = flag('captions');
const SPEED = arg('speed', '');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const url = `${BASE}/student-homepage.html?demo=1` +
  (CAPTIONS ? '' : '&caption=0') +
  (SPEED ? '&speed=' + encodeURIComponent(SPEED) : '');
console.log(`[rec] ${WIDTH}x${HEIGHT} @${DSF}x -> ${WIDTH * DSF}x${HEIGHT * DSF}, ${FPS}fps`);
console.log(`[rec] ${url}`);

// Capture-time encoding has to stay cheap: every CPU cycle spent here is one
// the browser does not get, and a starved compositor casts fewer frames, which
// shows up directly as judder in the cursor. So this pass is ultrafast and
// near-lossless, and record.sh transcodes it properly afterwards.
const ffmpeg = spawn('ffmpeg', [
  '-y', '-hide_banner', '-loglevel', 'error',
  '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
  '-c:v', 'libx264', '-preset', 'ultrafast', '-qp', '12',
  '-pix_fmt', 'yuv420p',
  OUT
], { stdio: ['pipe', 'inherit', 'inherit'] });

const browser = await chromium.launch({
  args: [
    `--force-device-scale-factor=${DSF}`,
    `--window-size=${WIDTH},${HEIGHT}`,
    '--hide-scrollbars',
    // Measured on this box at 2560x1440: default raster casts ~18fps, which is
    // not enough to feed 30. The ANGLE/SwiftShader path casts ~46.
    '--use-gl=angle', '--use-angle=swiftshader'
  ]
});
const context = await browser.newContext({
  viewport: { width: WIDTH, height: HEIGHT },
  deviceScaleFactor: DSF,
  reducedMotion: 'no-preference'
});
const page = await context.newPage();
const cdp = await context.newCDPSession(page);

let latest = null;          // most recent decoded frame
let received = 0;
cdp.on('Page.screencastFrame', async ({ data, sessionId }) => {
  latest = Buffer.from(data, 'base64');
  received++;
  try { await cdp.send('Page.screencastFrameAck', { sessionId }); } catch { /* torn down */ }
});

async function startCast() {
  try {
    // quality 80: the frames are only an intermediate, and JPEG encode cost at
    // 3.7Mpx is a real share of the frame budget.
    await cdp.send('Page.startScreencast', {
      format: 'jpeg', quality: 80, everyNthFrame: 1,
      maxWidth: WIDTH * DSF, maxHeight: HEIGHT * DSF
    });
  } catch (e) { console.log('[rec] startScreencast:', e.message); }
}

// A cross-document navigation can end the cast; re-arm on every commit.
page.on('framenavigated', (frame) => { if (frame === page.mainFrame()) startCast(); });

await page.goto(url, { waitUntil: 'load' });
await startCast();

// Wait for the first real frame so the clip does not open on white.
for (let i = 0; i < 100 && !latest; i++) await sleep(50);

// ---- the resampler: one frame every 1/FPS of wallclock, into ffmpeg --------
let written = 0;
let stop = false;
const startedAt = Date.now();

const pump = (async () => {
  while (!stop) {
    const due = startedAt + (written * 1000) / FPS;
    const wait = due - Date.now();
    if (wait > 1) await sleep(wait);
    if (stop) break;
    if (latest) {
      if (!ffmpeg.stdin.write(latest)) {
        await new Promise((r) => ffmpeg.stdin.once('drain', r));
      }
      written++;
    } else {
      await sleep(10);
    }
  }
})();

// ---- wait for the walkthrough to finish -----------------------------------
const deadline = Date.now() + (LIMIT ? LIMIT * 1000 : 15 * 60 * 1000);
let done = false;
while (Date.now() < deadline) {
  await sleep(400);
  if (LIMIT) continue;                       // timed probe: just run the clock
  try {
    done = await page.evaluate(() => !!document.querySelector('.demo-cursor.done'));
  } catch { /* mid-navigation, try again */ }
  if (done) break;
}

if (done) {
  console.log('[rec] walkthrough complete, holding on the timetable');
  await sleep(4000);                          // let the final screen breathe
} else if (!LIMIT) {
  console.log('[rec] WARNING: finished on the deadline, not on the done marker');
}

stop = true;
await pump;
try { await cdp.send('Page.stopScreencast'); } catch { /* ignore */ }
await context.close();
await browser.close();

ffmpeg.stdin.end();
await new Promise((r) => ffmpeg.on('close', r));

const elapsed = (Date.now() - startedAt) / 1000;
console.log(`[rec] ${written} frames written, ${received} received from the page`);
console.log(`[rec] ${elapsed.toFixed(1)}s wallclock, cast rate ${(received / elapsed).toFixed(1)}fps`);
console.log(`[rec] -> ${OUT}`);
