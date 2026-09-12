---
name: menu-guncelle
description: Ciğerci Miqqo sitesinde menüyü güncelle. Fiyat değişikliği, yeni ürün, ürün kaldırma, kategori düzeni, ürün fotoğrafı değiştirme, kalori ve alerjen bilgisi güncelleme işlerinde kullan. "Fiyatları zamla", "şu ürünü ekle", "bu artık yok", "fotoğrafı değiştir" gibi isteklerde tetiklenir.
---

# Menü güncelleme

Gerçek menü, işletmenin basılı menü PDF'i ("Miqqo Menüüüü (4).pdf"). cigercimiqqo.com üzerindeki eski menü güncel değil, oradan veri alınmaz. Yeni bir baskı dosyası gelirse fiyatları ve ürünleri ondan al.

Sitedeki menünün tek kaynağı `src/data/menu.ts`. Sitede menü üç yerde görünür: `/menu` sayfası (tamamı), ana sayfadaki "En çok sevilenler" şeridi (seçili altı ürün) ve "Kiloluk menüler" bölümü. Üçü de aynı veriden okur, ayrı ayrı düzenleme yapılmaz.

## Veri şekli

```ts
{
  id: 'ciger-sis',            // benzersiz, Türkçe karakter yok, görsel dosya adıyla aynı
  name: 'Ciğer Şiş',
  subtitle: 'Acılı',          // istege bagli, ad yanında küçük etiket
  price: 690,                 // tek fiyat. Varyantlı üründe price yazılmaz
  variants: [                 // 500 gr / 1 kg gibi seçenekler
    { label: '500 gr', price: 1000, note: '2 yayık ayran hediye', kcal: '~1500' },
  ],
  description: 'Yarım porsiyon.',
  ingredients: 'Ciğer, tereyağı, sıvı yağ, kapya biber, soğan, baharat',
  kcal: '~900',               // sayı değil metin, "~" işaretiyle
  allergens: ['Gluten', 'Süt'],
  image: 'ciger-sis',         // src/assets/food/ciger-sis.jpg dosyasının uzantısız adı
  tags: ['populer'],          // 'populer' | 'imza'
}
```

## Adımlar

1. **Neyin değiştiğini netleştir.** Fiyat mı, ürün mü, kategori mi? Birden çok fiyat değişiyorsa listeyi kullanıcıdan tek seferde al.
2. **`src/data/menu.ts` içinde ilgili satırı bul** (`rg "Ciğer Şiş" src/data/menu.ts`). Dosyanın tamamını okuma, yalnız ilgili kategoriyi oku.
3. **Yalnız değişen alanı düzenle.** Kategori sırası, id'ler ve alan adları aynı kalsın; id değişirse eski bağlantılar ve görsel eşlemesi kırılır.
4. Yeni ürün ekliyorsan: kategorinin `items` dizisine, basılı menüdeki sırayla ekle. Fotoğraf varsa `src/assets/food/<id>.jpg` olarak koy ve `image: '<id>'` yaz. Fotoğraf yoksa `image` alanını hiç yazma, satır çatal ikonuyla görünür.
5. Ürün kalktıysa satırı sil ve `rg "<id>" src` ile başka yerde geçip geçmediğine bak (`Sevilenler.astro` içindeki `ids` listesi).
6. **Doğrula:**
   ```bash
   npm run build
   node scripts/shot.mjs --paths /menu --views mobile,desktop --scroll 0,1500
   ```
   Ekran görüntülerini aç, değişen satırı gözle kontrol et.
7. Fiyat zammı gibi toplu değişikliklerde kullanıcıya kısa bir özet ver: kaç ürün, hangi kategoriler, örnek iki satır.

## Dikkat

- Fiyatlar sayı, TL işareti ve binlik ayırıcı koda yazılmaz. `formatPrice` biçimler: `690` → `₺690`, `1250` → `₺1.250`.
- Kalori ve alerjen bilgisi basılı menüden gelir. Uydurma, bilmiyorsan alanı boş bırak.
- Ana sayfadaki "En çok sevilenler" listesi gerçek veriye dayanır (Google'da popüler işaretli ve paket platformlarında en çok sipariş edilenler). Sıralamayı keyfi değiştirme, değiştireceksen `docs/marka-arastirmasi.md` içindeki dayanağı da güncelle.
- Uzun tire kullanma. Ürün adlarında ayırıcı gerekiyorsa kısa tire.
