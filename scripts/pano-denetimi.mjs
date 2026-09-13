// Pano (story) denetimi: duyuru panosunu zorla açar, kartların görsel ve video
// durumunu ölçer. Amaç "kare simsiyah görünüyor" şikayetini sayıyla bulmak.
// Kullanim: node scripts/pano-denetimi.mjs --base http://localhost:4399 --views mobile,desktop

import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const args = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : (args[i + 1]?.startsWith('--') ? true : args[i + 1]) ?? true;
};

const base = String(flag('base', 'http://localhost:4399'));
const views = String(flag('views', 'mobile,desktop')).split(',');
const bekle = Number(flag('bekle', 9000));
// --shot <dizin> verilirse açılışta ve bekleme sonrasında kare alınır.
const kareDizin = flag('shot', null);

const viewports = {
  mobile: { width: 375, height: 812, isMobile: true },
  desktop: { width: 1440, height: 900, isMobile: false },
};

const browser = await chromium.launch({ channel: 'chrome' });

for (const view of views) {
  const vp = viewports[view];
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: vp.isMobile,
    hasTouch: vp.isMobile,
    locale: 'tr-TR',
    timezoneId: 'Europe/Istanbul',
    colorScheme: 'dark',
  });

  const page = await context.newPage();
  const kotu = [];
  page.on('response', (r) => {
    if (r.status() >= 400) kotu.push(`${r.status()} ${r.url().split('/').pop()}`);
  });
  page.on('requestfailed', (r) => kotu.push(`${r.failure()?.errorText} ${r.url().split('/').pop()}`));

  const konsol = [];
  page.on('console', (m) => m.type() === 'error' && konsol.push(m.text()));
  page.on('pageerror', (e) => konsol.push(`pageerror: ${e.message}`));

  await page.goto(base + '/', { waitUntil: 'load', timeout: 60000 });
  // Pano kendi açılmazsa (bugünün kaydı varsa) footer bağlantısıyla aç.
  await page.waitForTimeout(2000);
  const acikMi = await page.evaluate(() => !!document.querySelector('dialog[open]'));
  if (!acikMi) {
    const dugme = await page.$('[data-duyuru-open]');
    if (dugme) {
      await dugme.scrollIntoViewIfNeeded();
      await dugme.click();
    }
  }
  await page.waitForTimeout(1500);

  const olc = async (etiket) =>
    page.evaluate((et) => {
      const d = document.querySelector('dialog[open]');
      if (!d) return { etiket: et, panoAcik: false };
      const kartlar = [...d.querySelectorAll('[data-pano-kart], .pano__kart, article')].map((el) => {
        const s = getComputedStyle(el);
        const img = el.querySelector('img');
        const video = el.querySelector('video');
        return {
          aktif: el.classList.contains('is-active') || el.dataset.aktif === 'true',
          kartOpacity: Number(s.opacity),
          gorunur: s.visibility,
          img: img
            ? {
                op: Number(getComputedStyle(img).opacity),
                isaretli: img.classList.contains('is-yuklendi'),
                bitti: img.complete,
                w: img.naturalWidth,
                src: (img.currentSrc || img.getAttribute('src') || '-').split('/').pop(),
              }
            : null,
          video: video
            ? {
                op: Number(getComputedStyle(video).opacity),
                ready: video.readyState,
                net: video.networkState,
                duraklatildi: video.paused,
                an: Number(video.currentTime.toFixed(2)),
                src: (video.currentSrc || video.getAttribute('src') || video.dataset.src || '-').split('/').pop(),
              }
            : null,
        };
      });
      return { etiket: et, panoAcik: true, kartSayisi: kartlar.length, kartlar };
    }, etiket);

  const ilk = await olc('acilis');
  if (kareDizin) {
    await mkdir(kareDizin, { recursive: true });
    await page.screenshot({ path: `${kareDizin}/pano-${view}-acilis.png` });
  }
  await page.waitForTimeout(bekle);
  const sonra = await olc(`${bekle}ms sonra`);
  if (kareDizin) {
    await page.screenshot({ path: `${kareDizin}/pano-${view}-sonra.png` });
  }

  console.log(`\n### ${view}`);
  for (const r of [ilk, sonra]) {
    console.log(`-- ${r.etiket}: panoAcik=${r.panoAcik} kart=${r.kartSayisi ?? 0}`);
    (r.kartlar ?? []).forEach((k, i) => {
      const g = k.img ? `img(op=${k.img.op} isaretli=${k.img.isaretli} bitti=${k.img.bitti} w=${k.img.w} ${k.img.src})` : 'img yok';
      const v = k.video ? `video(op=${k.video.op} ready=${k.video.ready} net=${k.video.net} duraklatildi=${k.video.duraklatildi} an=${k.video.an} ${k.video.src})` : 'video yok';
      console.log(`   kart ${i} aktif=${k.aktif} kartOp=${k.kartOpacity} ${k.gorunur} | ${g} | ${v}`);
    });
  }
  if (kotu.length) console.log('kotu istek:\n  ' + [...new Set(kotu)].slice(0, 10).join('\n  '));
  if (konsol.length) console.log('konsol:\n  ' + [...new Set(konsol)].slice(0, 6).join('\n  '));

  await context.close();
}

await browser.close();
