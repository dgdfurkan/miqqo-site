# Yayın

Site Cloudflare Workers üzerinde, statik dosya olarak yayınlanıyor. Adres: `https://miqqo-site.frkngndz60.workers.dev`.

## Neden Worker kodu yok

Proje tamamen statik. `npm run build` sonunda `dist/` içinde HTML, CSS, JS, görsel ve video çıkıyor. Repodaki `wrangler.jsonc` yalnızca bu klasörü işaret ediyor, çalışan bir Worker script'i yok:

```jsonc
{
  "name": "miqqo-site",
  "compatibility_date": "2026-09-01",
  "assets": { "directory": "./dist/client", "not_found_handling": "404-page" }
}
```

Worker kodu ancak ileride yönetim paneli, Firebase'e yazma veya form gönderimi gerekirse yazılır.

## Kurulumun kritik noktası: görseller

Cloudflare'in Workers onboarding'i Astro projesine bir SSR adapter'ı ekleyebiliyor. O zaman görseller build sırasında üretilmiyor, sayfalara `/_image?href=...&f=webp` biçiminde çalışma zamanı adresleri yazılıyor. Workers tarafında sharp olmadığı için bu adreslerin hepsi 404 dönüyor ve sitede logo dahil bütün görseller kayboluyor. Bir kez yaşandı ve ölçüldü: canlı sayfada 309 adet `_image` isteği, sıfır webp.

İki koruma var:

1. `astro.config.mjs` içinde `output: 'static'` ve sharp servisi açıkça yazılı.
2. `wrangler.jsonc` repoda: deploy, `dist/` klasörünü statik asset olarak alır.

Doğrulama komutu, build sonrası çıktı sıfır olmalı:

```bash
grep -o '_image?' dist/client/index.html | wc -l
```

Canlı siteyi denetlemek için:

```bash
node scripts/istek-denetimi.mjs --base https://miqqo-site.frkngndz60.workers.dev --paths /,/menu --views desktop
```

## Panel ayarları

Workers & Pages > miqqo-site > Settings:

| Ayar | Değer |
|---|---|
| Build command | `npm run build` |
| Build output directory | `dist/client` (panelde böyle bir alan varsa) |
| Deploy command | `npx wrangler deploy` |
| Node sürümü | 22 (depoda `.nvmrc` var, gerekirse `NODE_VERSION = 22`) |
| Branch | `main` |

Framework preset'i sonradan değiştirme. Adapter ekleyen bir ön ayar seçilirse görsel sorunu geri gelir.

## GitHub'a push otomatik deploy

Git bağlantısı kurulduktan sonra ek ayar gerekmiyor:

- `main` dalına push: build başlar, bitince canlı adres güncellenir.
- Başka dal veya pull request: ayrı önizleme sürümü çıkar, canlıya dokunmaz.
- Build patlarsa canlı sürüm ayakta kalır. Panelden eski bir sürüme dönülebilir.

Yerelden yayına çıkarmanın tek adımı:

```bash
git add -A && git commit -m "mesaj" && git push
```

## Alan adı

`cigercimiqqo.com` şu an Cloudflare'de değil, nameserver'ları `domainhizmetleri.net` ve adreste eski site duruyor. Workers'a özel alan adı bağlamak için alan adının DNS'i Cloudflare'e taşınmalı:

1. Cloudflare hesabına alan adını ekle, verdiği iki nameserver'ı kayıt operatöründe yaz.
2. DNS aktifleşince Workers & Pages > miqqo-site > Settings > Domains & Routes: `cigercimiqqo.com` ve `www.cigercimiqqo.com`.
3. Taşımadan önce son kontrolü `workers.dev` adresinde yap, eski site yayında kalsın.
4. `astro.config.mjs` içindeki `site` değeri `https://cigercimiqqo.com`. Alan adı değişirse burayı da güncelle, yoksa sitemap ve canonical yanlış adresi gösterir.

## Önbellek

`public/_headers` dosyası build çıktısına kopyalanıyor:

- `/_astro/*` bir yıl ve `immutable`: bu dosyaların adında içerik damgası var.
- `/video/*` bir gün: klipler damga taşımıyor, aynı adla yeni video koyulursa bir gün içinde yenilenir.
- `/media.json` önbelleklenmiyor: yönetim panelinden yapılan değişiklik anında yansısın diye.

## Kontrol listesi (her yayından önce)

```bash
npm run build
node scripts/istek-denetimi.mjs --base http://localhost:4399 --paths /,/menu,/iletisim
node scripts/bosluk-olcumu.mjs --base http://localhost:4399
node scripts/sicrama-testi.mjs --base http://localhost:4399
node scripts/shot.mjs --base http://localhost:4399 --views mobile,tablet,desktop --scroll 0,1200,2400 --clean
```

Önizleme sunucusu: `npx astro preview --port 4399`. Ayrıntılı görsel denetim: `.claude/skills/gorsel-denetim/SKILL.md`.

Not: `npm run check` şu an çalışmıyor, `@astrojs/check` ve `typescript` kurulu değil. Tip kontrolü isteniyorsa bu iki paket eklenmeli.
