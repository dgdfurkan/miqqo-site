// Kaydırma akıcılığı ölçümü. Gerçek Chrome'da, CPU 4 kat yavaşlatılmış halde
// sayfayı baştan sona kaydırır ve kare sürelerini toplar.
// Kullanım (dev sunucu açıkken):  node scripts/perf.mjs  [--paths /,/menu] [--cpu 4]

import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};

const base = flag('base', 'http://localhost:4321');
const paths = String(flag('paths', '/')).split(',');
const cpu = Number(flag('cpu', 4));

const profiles = [
  { name: 'masaüstü 1440', viewport: { width: 1440, height: 900 }, scale: 1, mobile: false },
  { name: 'mobil 390', viewport: { width: 390, height: 844 }, scale: 2, mobile: true },
];

const recorder = () => {
  window.__perf = { frames: [], long: 0, longCount: 0 };
  let last = performance.now();
  const loop = (now) => {
    window.__perf.frames.push(now - last);
    last = now;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  try {
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        window.__perf.long += entry.duration;
        window.__perf.longCount += 1;
      }
    }).observe({ entryTypes: ['longtask'] });
  } catch {}
};

const percentile = (sorted, p) => sorted[Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * p))];

const browser = await chromium.launch({ channel: 'chrome' });
const rows = [];

for (const profile of profiles) {
  const context = await browser.newContext({
    viewport: profile.viewport,
    deviceScaleFactor: profile.scale,
    isMobile: profile.mobile,
    hasTouch: profile.mobile,
    locale: 'tr-TR',
    timezoneId: 'Europe/Istanbul',
  });
  await context.addInitScript(recorder);
  // Duyuru panosu kaydırmayı kilitliyor, ölçümde kapalı tutulur.
  await context.addInitScript(() => {
    try {
      const gun = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Istanbul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date());
      localStorage.setItem('miqqo-duyuru', gun);
    } catch {}
  });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: cpu });

  for (const target of paths) {
    await page.goto(base + target, { waitUntil: 'load' });
    await page.waitForTimeout(2500);
    await page.evaluate(() => {
      window.__perf.frames.length = 0;
      window.__perf.long = 0;
      window.__perf.longCount = 0;
    });

    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    const distance = Math.max(height - profile.viewport.height, 800);
    const chunks = Math.ceil(distance / 2000);

    for (let i = 0; i < chunks; i += 1) {
      await cdp.send('Input.synthesizeScrollGesture', {
        x: Math.round(profile.viewport.width / 2),
        y: Math.round(profile.viewport.height / 2),
        xDistance: 0,
        yDistance: -2000,
        speed: 1200,
        gestureSourceType: profile.mobile ? 'touch' : 'mouse',
      });
      await page.waitForTimeout(150);
    }
    await page.waitForTimeout(400);

    const perf = await page.evaluate(() => window.__perf);
    const frames = perf.frames.filter((f) => f > 0).sort((a, b) => a - b);
    const jank = frames.filter((f) => f > 32).length;
    rows.push({
      profil: profile.name,
      sayfa: target,
      kare: frames.length,
      'orta (ms)': percentile(frames, 0.5).toFixed(1),
      'p95 (ms)': percentile(frames, 0.95).toFixed(1),
      'en kötü (ms)': frames.at(-1).toFixed(1),
      'takılan kare %': ((jank / frames.length) * 100).toFixed(1),
      'uzun görev': `${perf.longCount} / ${perf.long.toFixed(0)} ms`,
    });
  }

  await context.close();
}

await browser.close();
console.log(`CPU ${cpu}x yavaşlatma, kaydırma jesti ile ölçüm:`);
console.table(rows);
console.log('Hedef: orta kare 16.7 ms civarı, takılan kare oranı %2 altı, uzun görev yok.');
