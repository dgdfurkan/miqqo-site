# Medya yönetimi

Sitedeki bütün fotoğraf ve videoların bir kimliği var. Kod bu kimlikleri HTML'e
`data-media-id` olarak yazıyor. Böylece ileride bir yönetim paneli (Firebase, imgbb,
Cloudflare R2, fark etmez) kaynağı değiştirebiliyor, kod veya derleme gerekmiyor.

## Kaynaklar nerede

| Tür | Yer | Not |
|---|---|---|
| Ürün fotoğrafları | `src/assets/products/<menü-kimliği>.jpg` | Ajans çekimleri, 1800 px |
| Basılı menü kesimleri | `src/assets/food/<menü-kimliği>.png` | Alfa kanallı, menü listesindeki küçük görseller |
| Dükkan kareleri | `src/assets/venue/<ad>.jpg` | Cephe, tabela, salon, çocuk alanı, sofra, ocak |
| Videolar | `public/video/<ad>.mp4` + `<ad>-poster.jpg` | Sessiz, 720p, faststart |
| Kayıt listesi | `src/data/media.ts` | Klip kimlikleri, başlıklar, havuzlar |

Ham malzeme (`assets/`, 600 MB) depoda değil, yalnız yerelde.

## Kimlik biçimi

| Kimlik | Neyi gösterir |
|---|---|
| `hero-still` | Hero'daki sabit fotoğraf (videolar yüklenmezse görünen kare) |
| `klip-*` | Videolar. Listesi `src/data/media.ts` içindeki `klipler` dizisi |
| `urun-<menü-kimliği>` | Gerçek ürün fotoğrafı (ör. `urun-ciger-sis`) |
| `kesim-<menü-kimliği>` | Basılı menü kesimi (menü listesindeki küçük görsel) |
| `mekan-<ad>` | Dükkan karesi (ör. `mekan-cephe-aksam`) |

Sayfadaki bütün kimlikleri görmek için tarayıcı konsolunda:

```js
[...document.querySelectorAll('[data-media-id]')].map((e) => e.dataset.mediaId);
```

## Yönetim panelinden değiştirme

Site açılışında `/media.json` dosyası varsa okunur ve eşleşen kimliklerin kaynağı
değiştirilir. Dosya yoksa hiçbir şey olmaz, yerel medya kullanılır.

`public/media.json` (veya panelin ürettiği aynı adresteki dosya):

```json
{
  "klip-koz": {
    "url": "https://ornek-depo.com/koz.mp4",
    "poster": "https://ornek-depo.com/koz.jpg"
  },
  "urun-ciger-sis": { "url": "https://i.ibb.co/xxxx/ciger-sis.jpg" },
  "mekan-cephe-aksam": { "url": "https://i.ibb.co/yyyy/cephe.jpg" }
}
```

Kurallar:

- `url` fotoğraf için doğrudan görsel adresi, video için mp4 adresi olmalı.
- `poster` yalnız videolarda kullanılır, verilmezse yerel poster kalır.
- Bir kimlik dosyada yoksa yerel kaynağıyla devam eder, yani kısmi güncelleme serbest.
- Dış adres verildiğinde Astro'nun ürettiği `srcset` temizlenir; boyut optimizasyonu
  o adresi veren tarafın işi olur. imgbb gibi servislerde yüklerken 1600-1800 px yeter.
- Hero'daki oynatma listesi de aynı kimliklerle güncellenir.

Uygulayan kod: `src/scripts/media.ts`. Çağrısı `src/layouts/Base.astro` içinde, yani
bütün sayfalarda geçerli.

## Yeni medya eklemek

1. Video: `ffmpeg` ile kodla (komut `CLAUDE.md` içinde), `public/video/` altına koy.
2. `src/data/media.ts` içindeki `klipler` dizisine kimlik, dosya adı, başlık ve metin ekle.
3. Hangi havuzda görünsün, onu seç: `heroKlipleri`, `mutfakKlipleri`, `panoKlipleri`.
4. Fotoğraf: `src/assets/products` veya `src/assets/venue` altına menü kimliğiyle koy;
   ürün fotoğrafları otomatik olarak menü detayında ve panoda kullanılır.

## Duyuru panosu

Panonun kartları `panoKlipleri` ve `panoGorselleri` havuzlarından geliyor. Günün
tohumu İstanbul tarihinden üretiliyor: aynı gün herkeste aynı hikâye, ertesi gün
farklı sıra ve farklı kartlar. Her panoda en az iki video var. Ayrıntı:
`docs/tasarim-sistemi.md` içindeki "Günün duyuru panosu" bölümü.
