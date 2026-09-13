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

Yalnız `output: 'static'` yazmak yetmiyor: adapter eklendiğinde görsel servisini de eziyor, ölçtüm. Üç koruma birlikte duruyor:

1. `astro.config.mjs` içinde adapter bizim elimizde: `adapter: cloudflare({ imageService: 'compile' })`. Barındırma kendi adapter'ını eklemeye kalkmıyor, görseller build sırasında sharp ile üretiliyor.
2. Aynı dosyada `session: false`. Açık kalırsa adapter, wrangler ayarına id'siz bir `SESSION` KV binding'i yazıyor ve deploy o namespace'i aramaya kalkıyor.
3. `wrangler.jsonc` repoda: deploy `dist/client` klasörünü statik asset olarak alır.

Doğru kurulumda `npx wrangler deploy --dry-run` çıktısı "No bindings found" der ve asset sayısını yazar.

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

## Yerelden tek komutla deploy

Panel tarafı takılırsa yayına bu komutla çıkılır. Build alır, sonra `wrangler.jsonc` içindeki ayarla `dist/client` klasörünü Workers'a yükler:

```bash
npm run deploy
```

İlk çalıştırmada wrangler tarayıcıda Cloudflare girişi ister. Deploy bitince verdiği adresi açıp kontrol et.

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

Önizleme sunucusu: `npx astro preview --port 4399`. Arka planda kalıyor, yeni build'i göstermesi için `npx astro preview stop` ile kapatıp tekrar başlat. Ayrıntılı görsel denetim: `.claude/skills/gorsel-denetim/SKILL.md`.

Not: `npm run check` şu an çalışmıyor, `@astrojs/check` ve `typescript` kurulu değil. Tip kontrolü isteniyorsa bu iki paket eklenmeli.
