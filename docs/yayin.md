# Yayın

## Cloudflare Pages

Repo: `dgdfurkan/miqqo-site` (dal: `main`).

Cloudflare panelinde Workers & Pages > Create > Pages > Connect to Git ile bu repoyu seç, sonra:

| Ayar | Değer |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node sürümü | 22 (Environment variables: `NODE_VERSION = 22`) |

İlk kurulumdan sonra `main` dalına her push otomatik yayına gider, pull request'ler için önizleme bağlantısı üretilir.

## Alan adı

`astro.config.mjs` içindeki `site` değeri `https://cigercimiqqo.com`. Canonical bağlantılar, sitemap ve OG görselleri bu adrese göre üretiliyor. Alan adı Cloudflare'de bağlanınca:

1. Pages projesinde Custom domains > Set up a custom domain: `cigercimiqqo.com` ve `www.cigercimiqqo.com`.
2. Eski site başka bir sunucudaysa DNS kaydını taşımadan önce Pages önizleme adresinde son kontrolü yap.
3. Alan adı değişirse `site` değerini de güncelle, yoksa sitemap ve canonical yanlış adresi gösterir.

## Kontrol listesi (her yayından önce)

```bash
npm run build
node scripts/shot.mjs --views mobile,tablet,desktop --scroll 0,1200,2400 --clean
node scripts/perf.mjs --paths /,/menu
```

Ayrıntılı görsel denetim: `.claude/skills/gorsel-denetim/SKILL.md`.
