# Yayın

## Worker gerekiyor mu

Gerekmiyor. Site tamamen statik: `npm run build` sonunda `dist/` içinde HTML, CSS, JS, görsel ve video çıkıyor, sunucu tarafında çalışan kod yok. Cloudflare'de statik siteyi Pages yayınlar, Worker yazmaya gerek kalmaz.

Worker şu iş için gerekir: ileride yönetim paneli, Firebase yazma işlemi veya form gönderimi gibi sunucu tarafı bir uç nokta eklersek. O gün gelirse siteyi bozmadan ayrı bir Worker açılır ve `cigercimiqqo.com/api/*` yoluna bağlanır.

## Adım adım Cloudflare Pages kurulumu

Repo: `dgdfurkan/miqqo-site`, dal `main`, şu an **private**.

1. **GitHub erişimi**: Cloudflare panelinde Workers & Pages > Create > Pages > Connect to Git. GitHub hesabını bağlarken açılan izin ekranında "Only select repositories" seçip `miqqo-site` reposunu işaretle. Private repo için bu izin şart, aksi halde repo listede görünmez.
2. **Proje ayarları**:

   | Ayar | Değer |
   |---|---|
   | Project name | `miqqo-site` |
   | Production branch | `main` |
   | Framework preset | Astro |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | boş bırak |

3. **Node sürümü**: depoda `.nvmrc` var ve içinde `22` yazıyor, Cloudflare bunu okur. Yine de sorun çıkarsa Settings > Environment variables bölümüne `NODE_VERSION = 22` ekle.
4. **Save and Deploy**. İlk build 2 ile 4 dakika sürer, sonunda `miqqo-site.pages.dev` adresi çıkar. Alan adını bağlamadan önce kontrolü bu adreste yap.

Build sırasında `sharp` ile 40'tan fazla fotoğraf yeniden boyutlandırılıyor, ilk derleme bu yüzden yerelden yavaş olabilir. Cloudflare build önbelleği sonraki derlemelerde bu süreyi kısaltır.

## GitHub'a her push otomatik yayına gider

Git bağlantısı kurulduğu anda Cloudflare bir webhook takar, ayrıca bir şey yapmana gerek yok:

- `main` dalına push: production build başlar, bitince `cigercimiqqo.com` ve `pages.dev` adresi güncellenir.
- Başka bir dala push veya pull request: ayrı bir önizleme adresi üretilir (`<commit>.miqqo-site.pages.dev`), production'a dokunmaz. Riskli değişikliği önce orada dene.
- Bozuk build production'ı düşürmez, önceki sürüm ayakta kalır. Deployments listesinden herhangi bir eski sürüme "Rollback" ile tek tıkla dönülür.

Yerelden yayına çıkarmanın tek adımı bu yüzden şu:

```bash
git add -A && git commit -m "mesaj" && git push
```

Panelden build'i elle tetiklemek istersen: Deployments > sağ üstteki "Create deployment" veya son deployment satırında "Retry deployment".

## Alan adı

`astro.config.mjs` içindeki `site` değeri `https://cigercimiqqo.com`. Canonical bağlantılar, sitemap ve OG görselleri bu adrese göre üretiliyor.

1. Pages projesinde Custom domains > Set up a custom domain: `cigercimiqqo.com`, sonra `www.cigercimiqqo.com`.
2. Alan adı Cloudflare'de yönetiliyorsa DNS kaydını kendisi ekler. Başka bir kayıt operatöründeyse verdiği CNAME kaydını oraya gir.
3. Eski site hâlâ yayındaysa DNS'i taşımadan önce son kontrolü `pages.dev` adresinde yap.
4. Alan adı değişirse `site` değerini de güncelle, yoksa sitemap ve canonical yanlış adresi gösterir.

SSL sertifikasını Cloudflare otomatik üretir, elle bir iş yok.

## Önbellek

`public/_headers` dosyası Cloudflare'e ne kadar önbellekleyeceğini söylüyor:

- `/_astro/*` bir yıl ve `immutable`: bu dosyaların adında içerik damgası var, değişince adı da değişir.
- `/video/*` bir gün: klipler adında damga taşımıyor, aynı adla yeni video koyarsan bir gün içinde yenilenir. Hemen görünmesi gerekiyorsa panelden Caching > Purge Everything.
- `/media.json` önbelleklenmiyor: yönetim panelinden yapılan görsel ve video değişikliği anında yansısın diye.

## Kontrol listesi (her yayından önce)

```bash
npm run build
node scripts/shot.mjs --views mobile,tablet,desktop --scroll 0,1200,2400 --clean
node scripts/perf.mjs --paths /,/menu
```

CLAUDE.md içindeki uzun tire kontrolünü de çalıştır.

Ayrıntılı görsel denetim: `.claude/skills/gorsel-denetim/SKILL.md`.
