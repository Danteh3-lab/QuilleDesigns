import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const [mode = 'stills', ...args] = process.argv.slice(2);
const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1'));
const exe = path.join(process.env.LOCALAPPDATA, 'ms-playwright/chromium-1217/chrome-win64/chrome.exe');
const browser = await chromium.launch({ executablePath: exe, args: ['--allow-file-access-from-files', '--disable-gpu-vsync', '--force-color-profile=srgb'] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
page.on('console', m => console.log('[page]', m.text()));
page.on('pageerror', e => console.log('[pageerror]', e.message));
await page.goto(pathToFileURL(path.join(here, 'promo.html')).href);
await page.evaluate(() => window.READY);
const stage = await page.$('#stage');

if (mode === 'stills') {
  mkdirSync(path.join(here, 'stills'), { recursive: true });
  for (const a of args) {
    const t = parseFloat(a);
    await page.evaluate(t => window.seek(t), t);
    await stage.screenshot({ path: path.join(here, 'stills', `t${t.toFixed(2).padStart(5, '0')}.png`) });
  }
} else {
  const FPS = +(args[0] || 60), SUB = +(args[1] || 4), SHUTTER = .6, DUR = 20;
  const out = args[2] || path.join(here, 'video_silent.mp4');
  const N = DUR * FPS, F0 = +(args[3] || 0), F1 = +(args[4] || N);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS * SUB), '-i', '-',
    '-vf', SUB > 1 ? `tmix=frames=${SUB},select='eq(mod(n\,${SUB})\,${SUB - 1})',setpts=N/${FPS}/TB` : 'null',
    '-r', String(FPS), '-c:v', 'libx264', '-preset', 'slow', '-crf', '15', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const t0 = Date.now();
  for (let f = F0; f < F1; f++) {
    for (let k = 0; k < SUB; k++) {
      const t = (f + (SUB > 1 ? (k / (SUB - 1) - .5) * SHUTTER : 0)) / FPS;
      await page.evaluate(t => window.seek(t), Math.max(0, Math.min(DUR - 1e-4, t)));
      const buf = await page.screenshot({ type: 'jpeg', quality: 94, clip: { x: 0, y: 0, width: 1920, height: 1080 } });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    if (f % 60 === 0) console.log(`frame ${f}/${N}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log('done', out, ((Date.now() - t0) / 1000).toFixed(0) + 's');
}
await browser.close();
