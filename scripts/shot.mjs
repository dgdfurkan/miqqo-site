// Görsel denetim: sistemdeki Chrome ile 375 / 768 / 1440 genişlikte ekran görüntüsü alır.
// Kullanım (dev sunucu açıkken):
//   node scripts/shot.mjs                        → / sayfası, üç genişlik, sayfa başı
//   node scripts/shot.mjs --paths /menu,/iletisim
//   node scripts/shot.mjs --views mobile --scroll 0,900,1800
//   node scripts/shot.mjs --full                 → tam sayfa
//   node scripts/shot.mjs --reduced              → hareket azaltma açıkken
// Çıktı: .shots/<sayfa>-<genislik>-<kaydirma>.png

import { chromium } from 'playwright-core';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : (args[i + 1]?.startsWith('--') ? true : args[i + 1]) ?? true;
};

const base = flag('base', 'http://localhost:4321');
const outDir = flag('out', '.shots');
const paths = String(flag('paths', '/')).split(',');
const scrolls = String(flag('scroll', '0')).split(',').map(Number);
const fullPage = args.includes('--full');
const reduced = args.includes('--reduced');
const clean = args.includes('--clean');

const allViewports = {
  mobile: { width: 375, height: 812, deviceScaleFactor: 2 },
  tablet: { width: 768, height: 1024, deviceScaleFactor: 2 },
  desktop: { width: 1440, height: 900, deviceScaleFactor: 1 },
};
const views = String(flag('views', 'mobile,tablet,desktop')).split(',');

const slug = (p) => (p === '/' ? 'anasayfa' : p.replace(/^\/|\/$/g, '').replace(/\//g, '-'));

if (clean) await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ channel: 'chrome' });
const written = [];

for (const view of views) {
  const viewport = allViewports[view];
  if (!viewport) throw new Error(`Bilinmeyen genişlik: ${view}`);

  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: viewport.deviceScaleFactor,
    isMobile: view === 'mobile',
    hasTouch: view !== 'desktop',
    reducedMotion: reduced ? 'reduce' : 'no-preference',
    locale: 'tr-TR',
    timezoneId: 'Europe/Istanbul',
    colorScheme: 'dark',
  });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
  page.on('pageerror', (error) => errors.push(String(error)));

  for (const target of paths) {
    await page.goto(base + target, { waitUntil: 'load' });
    await page.waitForTimeout(reduced ? 600 : 2200);

    for (const y of scrolls) {
      // Gerçek kaydırma kullanılır. qa.scrollTo, ScrollTrigger'ı yeniden hesaplayıp
      // kaydırmaya bağlı açılışları başa sardığı için sahte "yarım açılmış" kareler üretiyordu.
      await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
      await page.waitForTimeout(reduced ? 500 : 1500);

      const file = path.join(outDir, `${slug(target)}-${view}-${y}${reduced ? '-reduced' : ''}.png`);
      await page.screenshot({ path: file, fullPage });
      written.push(file);
    }
  }

  if (errors.length) console.log(`[${view}] konsol hataları:\n  ${errors.join('\n  ')}`);
  await context.close();
}

await browser.close();
console.log(written.join('\n'));
