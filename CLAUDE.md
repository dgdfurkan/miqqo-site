# Ciğerci Miqqo web sitesi

Eryaman/Etimesgut'taki Ciğerci Miqqo (ciğer, kebap, pide, çorba) için statik, mobil öncelikli, bol hareketli tanıtım ve menü sitesi. Yayın hedefi `https://cigercimiqqo.com`.

## Çalışma kuralları

- Kullanıcıyla Türkçe konuş. Sitedeki bütün metinler Türkçe.
- `kod-disiplini` skill'i her işte geçerli: hedefli oku, küçük yama, doğrulamadan "oldu" deme.
- Uzun tire (—) ve ayırıcı olarak kısa tire (–) hem sohbette hem sitede yasak. Teslimden önce: `rg "—|–" src docs`.
- Tasarım işine başlamadan önce oku: `docs/tasarim-sistemi.md` (token, tipografi, yerleşim, hareket kuralları) ve `docs/marka-arastirmasi.md` (işletme bilgileri, ses tonu, işletmenin kendi sloganları).
- Kurulu tasarım skill'leri: `frontend-design` (Anthropic) ve `design-taste-frontend` (anti-slop kontrol listesi). Bu projede şu farklarla uygulanır:
  - Stack Next.js + Motion değil, Astro + GSAP + Lenis. React yok.
  - İkonlar `@iconify-json/ph` (Phosphor) üzerinden `src/components/Icon.astro` ile. Elle SVG ikon çizilmez.
  - Tema yalnız koyu; marka böyle (logo, basılı menü, tabela).
  - Slogan uydurulmaz; işletmenin kendi cümleleri kullanılır.

## Komutlar

```bash
npm run dev      # http://localhost:4321
npm run build    # dist/ statik çıktı
npm run preview  # build sonrası önizleme
npm run check    # astro check (tip kontrolü)
```

## Stack

- Astro 7 (statik çıktı, Rust derleyici: kapanmamış etiket hata verir; satır içi elemanlar arası boşluk için `{" "}`)
- Tailwind CSS v4 (`@tailwindcss/vite`), token'lar `src/styles/global.css` içinde `@theme` bloğunda
- GSAP 3 + ScrollTrigger, Lenis (yumuşak kaydırma, yalnız hassas işaretçili cihaz ve hareket azaltma kapalıyken)
- Fontlar self-host: `@fontsource-variable/big-shoulders` (başlık), `@fontsource-variable/figtree` (metin)
- Görseller `astro:assets` (`<Picture>`), `sharp`
- `@astrojs/sitemap`

## Dizinler

```
src/
  data/site.ts        işletme bilgisi: telefon, adres, saatler, linkler, Google puanı
  data/menu.ts        menü: kategoriler, ürünler, fiyat, içerik, kalori, alerjen, görsel
  assets/food/        ürün fotoğrafları (ürün adıyla)
  assets/brand/       logo varyantları (koyu zeminde yalnız miqqo-wordmark.png ve miqqo-logo-light.png)
  components/         Astro bileşenleri (bölüm başına bir dosya)
  layouts/Base.astro  head, SEO, JSON-LD, header, footer, grain, global script
  scripts/            istemci tarafı modüller (motion, hero, menu, status)
  styles/global.css   Tailwind, token'lar, taban stiller
  pages/              index, menu, iletisim, 404
docs/                 araştırma ve tasarım sistemi
public/               favicon, ikonlar, robots.txt
```

## Veri güncelleme

- Fiyat, ürün, kategori: `src/data/menu.ts`. Kaynak, işletmenin basılı menü PDF'i; eski web sitesi menüsü güncel değil. Adım adım akış için `menu-guncelle` skill'i.
- Ürün fotoğrafları basılı menüden çıkarılmış alfa kanallı kesimler. Çerçeveli fotoğraf gibi değil, `stage` ve `cutout` sınıflarıyla koyu zeminde durur.
- Telefon, saat, adres, link, Google puanı: `src/data/site.ts`. Google puanını güncellerken `rating.checkedAt` tarihini de değiştir.
- Fotoğraf değiştirmek: aynı dosya adıyla ilgili klasöre koy. Üç koleksiyon var ve `src/lib/images.ts` üçünü de tarar:
  - `src/assets/products/` ajans çekimleri, gerçek tabak fotoğrafları (dosya adı menü kimliği)
  - `src/assets/food/` basılı menüden çıkarılan alfa kanallı kesimler (menü listesindeki küçük görseller)
  - `src/assets/venue/` dükkan: cephe, tabela, salon, çocuk alanı, sofra, ocak
  `dishImage(slug)` gerçek çekimi, yoksa kesimi döndürür.
- Ham malzeme (`assets/`, 600 MB) ve basılı menü PDF'i git dışında, yalnız yerelde. İşlenmiş hâlleri depoda.
- `.gitignore` desenleri köke sabitli: `/assets/` ve `/*.pdf`. Baştaki bölü silinirse desen her dizin seviyesinde eşleşir, `src/assets/` de depo dışında kalır. O hâlde yerelde build geçer ama Cloudflare `UNRESOLVED_IMPORT` ile patlar. Yeni desen eklerken kökü kastediyorsan bölüyü koy.
- Yeni video eklerken:
  ```bash
  ffmpeg -i "assets/<ad>.mp4" -an -vf "scale=1280:-2:flags=lanczos" -c:v libx264 -crf 27 -preset slow \
    -pix_fmt yuv420p -movflags +faststart "public/video/<slug>.mp4"
  ffmpeg -ss 0.5 -i "assets/<ad>.mp4" -frames:v 1 -vf "scale=1280:-2" -q:v 5 "public/video/<slug>-poster.jpg"
  ```
  Sonra `src/components/Mutfak.astro` içindeki listeye ekle.

## Hareket kuralları (özet)

- Kaydırmaya bağlı her şey GSAP ScrollTrigger ile. `window.addEventListener('scroll')` yasak.
- Yalnız `transform`, `opacity`, `clip-path` animasyonu.
- Animasyonlu elemana CSS'ten transform verme; transform'un tek sahibi GSAP. Ön durum gizleme `visibility: hidden` ile, animasyon `autoAlpha` ile yapılır. Sebebi `docs/tasarim-sistemi.md` içindeki hareket kurallarında.
- Her animasyon `gsap.matchMedia()` içinde `(prefers-reduced-motion: no-preference)` koşuluna bağlı; azaltılmış harekette içerik düz ve eksiksiz görünmeli.
- Yeni hareket eklerken `docs/tasarim-sistemi.md` içindeki "Hareket" tablosuna nedenini yaz. Nedeni tek cümleyle yazılamıyorsa ekleme.

## Doğrulama

Bir işi bitti saymadan önce:
1. `npm run build` hatasız, ardından `grep -o '_image?' dist/index.html | wc -l` sıfır. Sıfır değilse görseller build sırasında üretilmemiş demektir ve yayında hepsi 404 verir (sebebi `docs/yayin.md`).
2. Dev sunucuda 375, 768 ve 1440 px genişlikte ekran görüntüsü al, gözle incele (`gorsel-denetim` skill'i).
3. Hareket azaltma açıkken sayfa çalışıyor.
4. `rg "—|–" src` boş.

## Açık konular (sahibinden teyit)

- Adres: eski sitede "No:16/37", Google'da "No:18/D". Sitede Google'daki var.
- "Çorbacı Miqqo" ayrı marka mı?
- Instagram'daki ajans çekimlerinin ve dükkan cephesi fotoğrafının orijinal dosyaları.
- Yayın: GitHub Pages (özel alan adı için `public/CNAME`) veya başka bir statik host. Analytics tercihi (eski UA kodu ölü).
