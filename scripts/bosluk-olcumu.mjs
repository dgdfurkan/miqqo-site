// Bosluk olcumu: her bolumde icerigin bittigi yer ile bolumun bittigi yer arasindaki
// olu alani listeler. Amac "sayfa bos kalmis" hissi veren yerleri sayiyla bulmak.
// Kullanim: node scripts/bosluk-olcumu.mjs --base http://localhost:4399 --views mobile,desktop

import { chromium } from 'playwright-core';

const args = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : (args[i + 1]?.startsWith('--') ? true : args[i + 1]) ?? true;
};

const base = String(flag('base', 'http://localhost:4399'));
const views = String(flag('views', 'mobile,desktop')).split(',');
const yol = String(flag('path', '/'));

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
  await context.addInitScript(() => {
    try {
      localStorage.setItem('miqqo-duyuru', String(Date.now()));
    } catch {}
  });

  const page = await context.newPage();
  await page.goto(base + yol, { waitUntil: 'load', timeout: 60000 });
  await page.evaluate(async () => {
    const adim = Math.round(window.innerHeight * 0.8);
    for (let y = 0; y <= document.body.scrollHeight; y += adim) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 200));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
  await page.waitForTimeout(1200);

  const rapor = await page.evaluate(() => {
    const sayfaUstu = window.scrollY;
    const mutlak = (el) => {
      const r = el.getBoundingClientRect();
      return { ust: r.top + sayfaUstu, alt: r.bottom + sayfaUstu, h: r.height };
    };

    // Bolum bazinda: en alttaki gorunur icerik ile bolum alt kenari arasindaki bosluk.
    const bolumler = [...document.querySelectorAll('section')].map((sec) => {
      const kutu = mutlak(sec);
      let enAlt = kutu.ust;
      sec.querySelectorAll('*').forEach((el) => {
        const s = getComputedStyle(el);
        if (s.visibility === 'hidden' || s.display === 'none' || Number(s.opacity) < 0.05) return;
        const r = el.getBoundingClientRect();
        if (r.width < 8 || r.height < 8) return;
        // Tam bolum boyu kaplayan sus katmanlarini sayma.
        if (r.height >= kutu.h - 2) return;
        const alt = r.bottom + sayfaUstu;
        if (alt > enAlt && alt <= kutu.alt + 1) enAlt = alt;
      });
      return {
        ad: sec.id || String(sec.className).split(' ')[0] || '-',
        // Mutlak üst konum: pinlenmiş bölümler kendi yüksekliğinden fazla kaydırma
        // tükettiği için ekran görüntüsü konumu yükseklik toplamıyla bulunamıyor.
        ust: Math.round(kutu.ust),
        h: Math.round(kutu.h),
        altBosluk: Math.round(kutu.alt - enAlt),
      };
    });

    // Ocaklar panelleri ayri: sticky tasarimda son panelin alti bos kaliyor mu.
    const ocaklar = [...document.querySelectorAll('[data-ocak]')].map((p, i) => {
      const kutu = mutlak(p);
      const ic = p.querySelector('[data-ocak-inner]');
      const icKutu = ic ? mutlak(ic) : null;
      return {
        sira: i,
        h: Math.round(kutu.h),
        icerikH: icKutu ? Math.round(icKutu.h) : 0,
        altBosluk: icKutu ? Math.round(kutu.alt - icKutu.alt) : 0,
      };
    });

    // Sevilenler seridi: baslik hucresi ve kart yuksekligi.
    const serit = document.querySelector('[data-pan-track]');
    const bas = document.querySelector('.sevilen__head');
    const kart = document.querySelector('[data-pan-card]');
    let sevilen = null;
    if (serit) {
      const sr = serit.getBoundingClientRect();
      const hucreler = [...serit.children].map((el) => {
        const r = el.getBoundingClientRect();
        return {
          ad: String(el.className).split(' ')[0] || el.tagName.toLowerCase(),
          ust: Math.round(r.top - sr.top),
          alt: Math.round(sr.bottom - r.bottom),
          h: Math.round(r.height),
        };
      });
      sevilen = {
        seritH: Math.round(sr.height),
        baslikH: bas ? Math.round(bas.getBoundingClientRect().height) : 0,
        kartH: kart ? Math.round(kart.getBoundingClientRect().height) : 0,
        // Serit icinde en ust ve en alt icerik ile serit kenarlari arasindaki olu alan.
        ustBosluk: hucreler.length ? Math.min(...hucreler.map((h) => h.ust)) : 0,
        altBosluk: hucreler.length ? Math.min(...hucreler.map((h) => h.alt)) : 0,
        hucreler,
      };
    }

    return { bolumler, ocaklar, sevilen, sayfaH: document.body.scrollHeight };
  });

  console.log(`\n### ${view} ${yol}  (sayfa ${rapor.sayfaH}px)`);
  console.log('bolum: yukseklik / alt bosluk');
  rapor.bolumler
    .slice()
    .sort((a, b) => b.altBosluk - a.altBosluk)
    .forEach((b) =>
      console.log(
        `  ${b.ad.padEnd(16)} ust=${String(b.ust).padStart(6)}  h=${String(b.h).padStart(5)}  altBosluk=${String(b.altBosluk).padStart(5)}`
      )
    );
  console.log('ocak panelleri:');
  rapor.ocaklar.forEach((o) => console.log(`  panel ${o.sira}: h=${o.h} icerik=${o.icerikH} altBosluk=${o.altBosluk}`));
  if (rapor.sevilen) {
    const s = rapor.sevilen;
    console.log(`sevilenler: serit=${s.seritH} baslik=${s.baslikH} kart=${s.kartH} ustBosluk=${s.ustBosluk} altBosluk=${s.altBosluk}`);
    console.log('  hucreler: ' + s.hucreler.map((h) => `${h.ad}(h=${h.h} ust=${h.ust} alt=${h.alt})`).join('  '));
  }

  await context.close();
}

await browser.close();
