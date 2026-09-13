// Istek denetimi: sayfadaki basarisiz istekleri, konsol hatalarini ve
// gercekten yuklenmemis gorsel/video elemanlarini listeler.
// Kullanim (preview veya dev sunucu acikken):
//   node scripts/istek-denetimi.mjs --base http://localhost:4399 --paths /,/menu,/iletisim
//   node scripts/istek-denetimi.mjs --views mobile

import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : (args[i + 1]?.startsWith('--') ? true : args[i + 1]) ?? true;
};

const base = String(flag('base', 'http://localhost:4399'));
const paths = String(flag('paths', '/')).split(',');
const views = String(flag('views', 'mobile,desktop')).split(',');

const viewports = {
  mobile: { width: 375, height: 812, isMobile: true },
  desktop: { width: 1440, height: 900, isMobile: false },
};

const browser = await chromium.launch({ channel: 'chrome' });
let toplamSorun = 0;

for (const view of views) {
  const vp = viewports[view];
  if (!vp) throw new Error(`Bilinmeyen genislik: ${view}`);

  for (const p of paths) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
      locale: 'tr-TR',
      timezoneId: 'Europe/Istanbul',
      colorScheme: 'dark',
    });
    // Duyuru panosu ekrani kapatmasin.
    await context.addInitScript(() => {
      try {
        localStorage.setItem('miqqo-duyuru', String(Date.now()));
      } catch {}
    });

    const page = await context.newPage();
    const kotuYanit = [];
    const patlayan = [];
    const konsol = [];

    page.on('response', (r) => {
      if (r.status() >= 400) kotuYanit.push(`${r.status()} ${r.url()}`);
    });
    page.on('requestfailed', (r) => {
      patlayan.push(`${r.failure()?.errorText ?? 'bilinmeyen'} ${r.url()}`);
    });
    page.on('console', (m) => {
      if (m.type() === 'error') konsol.push(m.text());
    });
    page.on('pageerror', (e) => konsol.push(`pageerror: ${e.message}`));

    await page.goto(base + p, { waitUntil: 'load', timeout: 60000 });

    // Tembel yuklenen medya tetiklensin: sayfayi adim adim sonuna kadar kaydir.
    await page.evaluate(async () => {
      const adim = Math.round(window.innerHeight * 0.8);
      for (let y = 0; y <= document.body.scrollHeight; y += adim) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 220));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 400));
    });
    await page.waitForTimeout(2500);

    const medya = await page.evaluate(() => {
      const gorseller = [...document.querySelectorAll('img')].map((el) => ({
        src: el.currentSrc || el.getAttribute('src') || '(yok)',
        id: el.dataset.mediaId ?? null,
        w: el.naturalWidth,
        h: el.naturalHeight,
        bitti: el.complete,
        gizli: el.offsetParent === null && getComputedStyle(el).position !== 'fixed',
      }));
      const videolar = [...document.querySelectorAll('video')].map((el) => ({
        src: el.currentSrc || el.getAttribute('src') || el.dataset.src || '(yok)',
        id: el.dataset.mediaId ?? null,
        readyState: el.readyState,
        networkState: el.networkState,
        duraklatildi: el.paused,
        an: Number(el.currentTime.toFixed(2)),
        hata: el.error ? `${el.error.code}: ${el.error.message}` : null,
      }));
      // Kaydirma bittikten sonra hala gorunmez kalan oge: reveal takilmis demektir.
      const gizliKalan = [...document.querySelectorAll('section *')]
        .filter((el) => {
          const s = getComputedStyle(el);
          if (s.visibility !== 'hidden' && Number(s.opacity) > 0.02) return false;
          const r = el.getBoundingClientRect();
          return r.width > 40 && r.height > 20;
        })
        .slice(0, 25)
        .map((el) => `${el.tagName.toLowerCase()}.${String(el.className || '-')}`.slice(0, 90));
      const bolumler = [...document.querySelectorAll('section')].map((el) => ({
        ad: el.id || String(el.className).split(' ')[0] || '-',
        h: Math.round(el.getBoundingClientRect().height),
      }));
      return { gorseller, videolar, gizliKalan, bolumler };
    });

    const bozukGorsel = medya.gorseller.filter((g) => g.bitti && g.w === 0);
    const yuklenmeyen = medya.gorseller.filter((g) => !g.bitti);
    const bozukVideo = medya.videolar.filter((v) => v.hata || (v.src !== '(yok)' && v.readyState === 0 && v.networkState === 3));

    const sorun = kotuYanit.length + patlayan.length + konsol.length + bozukGorsel.length + bozukVideo.length;
    toplamSorun += sorun;

    console.log(`\n### ${view} ${p}`);
    console.log(`img: ${medya.gorseller.length} (bozuk ${bozukGorsel.length}, tamamlanmayan ${yuklenmeyen.length}) | video: ${medya.videolar.length} (bozuk ${bozukVideo.length})`);
    if (kotuYanit.length) console.log('4xx/5xx:\n  ' + kotuYanit.slice(0, 15).join('\n  '));
    if (patlayan.length) console.log('patlayan istek:\n  ' + patlayan.slice(0, 15).join('\n  '));
    if (konsol.length) console.log('konsol hatasi:\n  ' + konsol.slice(0, 10).join('\n  '));
    if (bozukGorsel.length) console.log('bozuk gorsel:\n  ' + bozukGorsel.slice(0, 15).map((g) => `${g.id ?? '-'} ${g.src}`).join('\n  '));
    if (yuklenmeyen.length) console.log('tamamlanmayan gorsel:\n  ' + yuklenmeyen.slice(0, 15).map((g) => `${g.id ?? '-'} ${g.src}`).join('\n  '));
    if (bozukVideo.length) console.log('bozuk video:\n  ' + bozukVideo.slice(0, 15).map((v) => `${v.id ?? '-'} ${v.src} hata=${v.hata} ready=${v.readyState} net=${v.networkState}`).join('\n  '));
    if (medya.videolar.length) {
      console.log('video durumu:\n  ' + medya.videolar.map((v) => `${(v.src.split('/').pop() ?? '-').padEnd(44)} ready=${v.readyState} net=${v.networkState} duraklatildi=${v.duraklatildi} an=${v.an}`).join('\n  '));
    }
    if (medya.gizliKalan.length) {
      console.log(`gizli kalan oge (${medya.gizliKalan.length}):\n  ` + medya.gizliKalan.join('\n  '));
      toplamSorun += medya.gizliKalan.length;
    }
    console.log('bolum yuksekligi:\n  ' + medya.bolumler.map((b) => `${b.ad}=${b.h}`).join('  '));
    if (!sorun && !medya.gizliKalan.length) console.log('sorun yok');

    await context.close();
  }
}

await browser.close();
console.log(`\n=== toplam sorun: ${toplamSorun}`);
