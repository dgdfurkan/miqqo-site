// Sicrama testi: kullanici sayfayi tek hamlede ortadan acarsa (hash baglantisi,
// yenileme, geri donus, hizli kaydirma) reveal animasyonlari tetiklenmeyip
// bolumler "visibility: hidden" kalabilir. Bu betik o durumu olcer.
// Kullanim: node scripts/sicrama-testi.mjs --base http://localhost:4399

import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : (args[i + 1]?.startsWith('--') ? true : args[i + 1]) ?? true;
};

const base = String(flag('base', 'http://localhost:4399'));
const views = String(flag('views', 'mobile,desktop')).split(',');

const viewports = {
  mobile: { width: 375, height: 812, isMobile: true },
  desktop: { width: 1440, height: 900, isMobile: false },
};

// Tek hamlede gidilecek noktalar: sayfa yuksekliginin orani.
const oranlar = [0.3, 0.5, 0.7, 0.9];

const browser = await chromium.launch({ channel: 'chrome' });

for (const view of views) {
  const vp = viewports[view];
  console.log(`\n### ${view}`);

  for (const oran of oranlar) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
      hasTouch: vp.isMobile,
      locale: 'tr-TR',
      timezoneId: 'Europe/Istanbul',
      colorScheme: 'dark',
    });
    await context.addInitScript(() => {
      try {
        localStorage.setItem('miqqo-duyuru', String(Date.now()));
      } catch {}
    });

    const page = await context.newPage();
    await page.goto(base + '/', { waitUntil: 'load', timeout: 60000 });

    // Tek hamle: araya kademe koymadan hedefe atla.
    const hedef = await page.evaluate((o) => {
      const y = Math.round(document.body.scrollHeight * o);
      window.scrollTo(0, y);
      return y;
    }, oran);
    await page.waitForTimeout(1500);

    const sonuc = await page.evaluate(() => {
      const gorunurAlanda = (el) => {
        const r = el.getBoundingClientRect();
        return r.bottom > 0 && r.top < window.innerHeight && r.width > 40 && r.height > 20;
      };
      const gizli = [];
      document.querySelectorAll('section *').forEach((el) => {
        if (!gorunurAlanda(el)) return;
        const s = getComputedStyle(el);
        if (s.visibility === 'hidden' || Number(s.opacity) < 0.05) {
          // Dekoratif katmanlar ve yedek video elemani sayilmaz.
          const ad = String(el.className);
          if (/ocak__shade|hero-medya__video/.test(ad)) return;
          gizli.push(`${el.tagName.toLowerCase()}.${ad || '-'}`.slice(0, 70));
        }
      });
      return { y: window.scrollY, gizli: [...new Set(gizli)] };
    });

    const durum = sonuc.gizli.length ? `GIZLI ${sonuc.gizli.length}: ${sonuc.gizli.slice(0, 6).join(' | ')}` : 'temiz';
    console.log(`  %${Math.round(oran * 100)} (y=${hedef}) -> ${durum}`);

    await context.close();
  }
}

await browser.close();
