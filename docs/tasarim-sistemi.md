# Tasarım sistemi

Bu doküman sitenin görsel dilini tanımlar. Yeni bir bileşen, bölüm veya animasyon eklemeden önce oku. Kaynak araştırma: `docs/marka-arastirmasi.md`.

## Tasarım okuması

Eryaman'daki bir mahalle ciğercisi, kebapçısı ve pidecisi için yerel restoran sitesi. Kitle, telefonundan "nerede yesem, ne söylesem" diye bakan Eryaman ve Etimesgut sakinleri. Dil: kömür, köz ve dükkan tabelası. Teknik temel: Astro statik çıktı, Tailwind v4, GSAP ScrollTrigger, Lenis.

Kadranlar: `DESIGN_VARIANCE 7`, `MOTION_INTENSITY 8` (kullanıcı bol animasyon istedi), `VISUAL_DENSITY 4`.

Tema: yalnız koyu. Logo, basılı menü, dükkan tabelası ve Instagram içeriğinin tamamı koyu zeminde; marka bunu belirliyor. Açık tema yok, bölümler arası tema değişimi yok.

## Renk

| Token | Hex | Rol |
|---|---|---|
| `komur` | `#0F100E` | Sayfa zemini. Hafif yeşilimsi kül tonu, saf siyah değil. |
| `is` | `#191A17` | Yükseltilmiş yüzey: sheet, dialog, input. |
| `is-2` | `#24251F` | Hover ve seçili yüzey. |
| `kul` | `#9C9A90` | İkincil metin. Kömür üzerinde 6,9:1. |
| `lavas` | `#F1E8D8` | Ana metin. Kömür üzerinde 16:1. |
| `koz` | `#FC4824` | Tek vurgu rengi, logodan örneklendi. Kömür üzerinde 5,5:1. |

Kurallar:
- Vurgu rengi yalnız `koz`. Başka doygun renk girmez.
- `koz` zeminli butonun yazısı `komur`. Lavaş yazı `koz` üzerinde 3,4:1 ile AA'yı geçmiyor.
- Çizgiler `lavas` renginin %10-14 opaklığı. Pirinç ve altın tonları kullanılmaz.
- Köz parçacıkları için `#FF8A3D` ve `#FFC56B` yalnız canvas efektinde kullanılır, arayüzde değil.

Doku: sabit, `pointer-events: none` bir grain katmanı (SVG turbulence) ve hero ile sipariş bandında sıcak ışık düşüşü (radial gradient). Kaydırılan elemanlara filtre verilmez.

## Tipografi

| Rol | Font | Ayar |
|---|---|---|
| Başlık, fiyat, tabela | Big Shoulders Variable | 700-900, başlıklar büyük harf, satır aralığı 0.86-0.95 |
| Metin ve arayüz | Figtree Variable | 400, 500, 600; gövde 16-18 px, satır aralığı 1.55 |

- Fontlar `@fontsource-variable` paketlerinden self-host. Google Fonts linki yok.
- Big Shoulders dar ve tabela gibi; dükkan cephesindeki ve Instagram afişlerindeki kalın dar yazılarla aynı aileden bir his veriyor. Logonun italik yazısıyla yarışmaz.
- Türkçe büyük harf dönüşümü için `<html lang="tr">` zorunlu (i → İ).
- Ölçek (clamp): hero 64-184 px, h2 44-104 px, h3 28-44 px, gövde 16-18 px, küçük 14 px.
- Satır uzunluğu en fazla 62ch.
- Fiyat biçimi `₺690`, binlik ayırıcı nokta: `₺1.250`.

## Şekil

| Eleman | Köşe |
|---|---|
| Buton, chip, input, segment kontrol | Tam hap (`9999px`) |
| Fotoğraf | `20px` |
| Dialog ve alt sheet | `28px` |

Kart kutusu varsayılan değil. Gruplama boşluk ve tek çizgiyle yapılır. Gölge yok; derinlik ışık ve fotoğrafla gelir.

## Ortak parçalar

**`.mask`** (`global.css`): maskeden yükselen başlık satırı. Üstten 0.14em, alttan 0.18em pay bırakır; Ş, Ç, ğ harflerinin çengeli ve İ, Ü noktaları kesilmez. İçindeki eleman `data-rise` taşır, `.motion [data-rise]` ile JS gelmeden önce aşağıda bekletilir, betik yüklenmezse görünür kalır. Yeni bir yükselen başlık eklerken kendi maske CSS'ini yazma, bu sınıfı kullan.

**Fiyat rengi**: öne çıkan tek ürün (ana sayfa kartları, ürün detayı) fiyatı `koz`; menü listesindeki uzun fiyat kolonu `lavas`. Onlarca fiyatın hepsi turuncu olunca vurgu anlamını yitiriyor.

**Grid içinde fotoğraf**: grid hücresinde `aspect-ratio` ile `width: auto` birlikte çözülmüyor, fotoğraf şeride dönüyor. Masaüstü panellerinde genişliği kolona bırak, yüksekliği `clamp` ile sabitle, `object-fit: cover` kırpsın.

**JS ile üretilen eleman kapsamlı stil almıyor**: Astro, bileşenin `<style>` bloğundaki seçicilere `data-astro-cid-*` niteliği ekliyor. `document.createElement` ile üretilen eleman bu niteliği taşımadığı için kural hiç uygulanmıyor (duyuru panosundaki ilerleme çubukları bu yüzden 0 px yükseklikte kalmıştı). Çözüm: elemanı işaretlemede üret, JS yalnız durumunu değiştirsin. Zorunlu hallerde stil `:global()` ile yazılır.

**Astro `<Picture>` ve `<template>`**: `<template>` içindeki görseller klonlanana kadar indirilmiyor. Günün panosu ve menü detayı bu sayede bütün adayları sayfada tutup yalnız gösterileni yüklüyor.

## İmza öğesi: şiş

Logonun taşıyıcı motifi olan şiş (halka sap, ince gövde, sivri uç) sitenin tek cesur öğesi.
- Hero'da şiş soldan kayarak başlığın ilk satırındaki harflerin arasından geçer: bazı harflerin önünden, bazılarının arkasından.
- Header'ın altında kaydırma ilerlemesini gösteren ince şiş çizgisi.
- Menü sayfasında aktif kategoriyi gösteren kayan şiş göstergesi.

Başka dekoratif SVG çizilmez. İkonlar Phosphor setinden (`@iconify-json/ph`) gelir.

## Yerleşim

Kapsayıcı en fazla 1360 px, yan boşluk `clamp(20px, 4vw, 56px)`. Masaüstünde 12 kolon. 768 px altında her bölüm tek kolona iner.

Ana sayfa bölümleri ve yerleşim aileleri (her aile bir kez):

```
 1 Duyuru panosu    açılışta modal: günün seçkisi, günde bir kez
 2 Hero             asimetrik bölünmüş: sol 7 kolon tipografi + şiş, sağ 5 kolon fotoğraf
 3 Şerit            tek marquee, ürün adları, kaydırma hızına tepki verir
 4 Üç ocak          sticky stack: Mangal / Odun ateşi / Kazan, her panel tam yükseklik
 5 En çok sevilenler yatay kaydırma (masaüstü pin + scrub, mobil scroll-snap)
 6 Reklam kuşağı    günün biçimi: tabela / gazete ilanı / ilan satırı
 7 Ocak başında     sessiz video duvarı, asimetrik grid
 8 Mekan            dükkan fotoğrafları, bento
 9 Yorumlar         bento: Google puanı, iki kısa yorum, salon fotoğrafı, açık/kapalı durumu
10 Kiloluk menüler  segment kontrol (500 gr / 1 kg) ve fiyatları değişen liste
11 Sipariş bandı    tam genişlik, karartılmış sofra fotoğrafı, telefon ve platform linkleri
12 Konum            adres ve saatler solda, harita sağda
13 Footer           büyük logo, "Afiyet olsun."
```

## Günün duyuru panosu

Siteye girişte açılan modal. Kuralları:

- Gün kodu İstanbul saatine göre `YYYY-MM-DD`. Tohum bu koddan üretiliyor, yani **aynı gün bütün ziyaretçilerde aynı pano** çıkıyor, ertesi gün düzen ve ürünler değişiyor.
- Dört düzen var: tek kare, üçlü, dörtlü, klipli (bir sessiz video + iki tabak). Düzen ve ürün sıralaması tohumla seçiliyor.
- Günde bir kez gösterilir (`localStorage`, anahtar `miqqo-duyuru`). Footer'daki "Bugünün panosu" bağlantısı tekrar açar.
- Bütün adaylar `<template>` içinde duruyor; seçilmeyen kartlar klonlanırken kaldırıldığı için görselleri hiç indirilmiyor.
- Ekran görüntüsü ve performans ölçümlerinde pano bastırılır (`shot.mjs` varsayılan, görmek için `--duyuru`).

## Video kullanımı

- Kaynak klipler `assets/*.mp4` (depoda değil). Web sürümleri `public/video/` altında: sessiz, 720p, CRF 27, faststart, yanında poster JPG.
- `<video>` etiketleri `preload="none"` ve `data-src` ile durur; kaynak yalnız görünüşe yaklaşınca atanır, görünürden çıkınca duraklatılır, sekme arka plana geçince duraklatılır.
- Hareket azaltma açıkken otomatik oynatma yok, `controls` açılır.
- Hero'da video kullanılmıyor: ilk boyamayı geciktirmemesi için orada fotoğraf var.

Hero masaüstü:

```
[logo]        Menü   Sipariş   İletişim            [telefon butonu]
===================================================================== (şiş ilerleme)
 (● Şu an açık, 02:00'ye kadar)                  +------------------+
 ETİN EN                                         |                  |
 O=====[E]==[T]=İ=N===E=[N]=======================|====>  fotoğraf    |
 GÜZEL HALİ.                                     |                  |
 Eryaman'da köz ciğer, odun ateşinde pide,       |                  |
 kemik suyu çorbalar.                            +------------------+
 [Menüyü gör]  [0312 272 13 09]
```

Hero mobil:

```
[logo]            [tel] [≡]
● Şu an açık
ETİN EN
O=====================>
GÜZEL
HALİ.
kısa metin
[Menüyü gör]
[0312 272 13 09]
[fotoğraf 4:5]
```

Menü sayfası: başlık ve arama, yapışkan kategori çubuğu (şiş göstergeli), kategori başlıkları altında ürün satırları (varsa küçük fotoğraf, ad, içerik, fiyat). Satıra dokununca native `<dialog>` ile detay: büyük fotoğraf, içindekiler, kalori, alerjenler, "Telefonla sipariş".

## Metin kuralları

- Uzun tire ve kısa tire ayırıcı olarak yasak. Virgül, nokta, iki nokta kullanılır.
- Slogan uydurulmaz; `docs/marka-arastirmasi.md` içindeki işletme cümleleri kullanılır.
- Bölüm başı küçük büyük harf etiket (eyebrow) sayfa başına en fazla 2.
- Aynı niyet için tek etiket:

| Niyet | Etiket |
|---|---|
| Menüye git | Menüyü gör |
| Telefonla arama | 0312 272 13 09 (telefon ikonu, aria-label "Telefonla ara") |
| Paket platformları | Online sipariş |
| Harita | Yol tarifi al |
| Google yorumu | Google'da yorum yaz |

- Yorumlarda isim yazılmaz, kaynak "Google yorumu" olarak geçer. Alıntı en fazla 3 satır.
- Sayılar gerçek veriden gelir (Google puanı, menü fiyatları, saatler). Uydurma istatistik yok.

## Hareket

Kütüphaneler: GSAP 3 + ScrollTrigger (kaydırmaya bağlı her şey), Lenis (masaüstünde yumuşak kaydırma). `window.addEventListener('scroll')` yasak.

Easing: `expo.out` giriş, `power2.inOut` durum değişimi. Süreler: geri bildirim 0.25 s, açılma 0.6 s, hero sekansı 1.4 s toplam.

| Hareket | Neden |
|---|---|
| Hero giriş sekansı: fotoğraf maskeyle açılır, başlık satırları maskeden yükselir, şiş soldan geçer | Sayfanın tek sahnelenmiş anı; markanın şiş motifini tanıtır |
| Hero köz parçacıkları | Ocakbaşı atmosferi; hero görünmüyorsa durur |
| Header şiş ilerleme çizgisi | Sayfadaki konumu gösterir |
| Marquee hız ve yön tepkisi | Menünün genişliğini tek bakışta verir |
| Üç ocak sticky stack | Mutfağın üç ateşini sırayla anlatır |
| En çok sevilenler yatay pan | Ürünleri tek tek sahneye çıkarır |
| Kampanya tabelası: satırlar soldan girer, noktalı dolgu soldan sağa çizilir | Fiyatın hangi çorbaya ait olduğunu göz takip eder |
| Gazete ilanı: kağıt yerine oturur, başlık ve fiyat maskeden yükselir | Afiş duvara asılıyormuş hissini verir, fiyat en sonda gelir |
| İlan satırı: iki kural soldan sağa çizilir, cümle maskeden yükselir | Araya giren kısa duyuruyu açar, satırın sınırlarını çizer |
| Kiloluk fiyat geçişi | Seçimin fiyatı nasıl değiştirdiğini gösterir |
| Sipariş bandı fotoğraf parallax | Bant ile içerik arasında derinlik |
| Mobil menü açılışı, dialog açılışı | Durum değişimini gösterir |
| Menü kategori göstergesi | Hangi kategoride olunduğunu gösterir |
| Açık/kapalı durum noktası (nabız) | Gerçek durum bilgisi |

Kurallar:
- Yalnız `transform`, `opacity`, `clip-path` animasyonu.
- **Transform'un tek sahibi GSAP.** Animasyonlu bir elemana CSS'ten transform verilmez. GSAP hesaplanmış matrisi piksel cinsinden `y` bileşeni olarak okur; `yPercent` animasyonu yapıldığında o piksel değeri yerinde kalır ve eleman bitişte kaymış durur. JS gelmeden gizlenmesi gereken eleman `visibility: hidden` ile gizlenir (`.motion [data-rise]`), animasyon `autoAlpha` ile görünürlüğü kendi devralır.
- Yatay pan içindeki kartlara `containerAnimation` ile ikinci bir tetikleyici bağlanacaksa, pin sınıfı eklendiği tick'te kartların yatay konumu henüz ölçülemez; tetikleyiciler `start === end` ile bozuk kurulur. Bu tür eklentiler yerine pan'in kendi hareketi bırakıldı.
- `prefers-reduced-motion: reduce` altında: Lenis kapalı, parçacık yok, marquee durur, stack ve pan düz akışa döner, geçişler anında.
- Bölüm başına "aşağıdan belirme" alışkanlığı yok. Her bölümün hareketi kendi içeriğinden gelir.

## Gözden geçirme: jenerik varsayılana kayan kararlar ve düzeltmeleri

1. Tam ekran fotoğraf üstüne ortalanmış başlık düşünüldü. Hem en sık görülen hero, hem fotoğraflar yaklaşık 800 px genişliğinde. Asimetrik bölünmüş hero ve şişli başlıkla değiştirildi.
2. GitHub menüsündeki Cormorant Garamond ve pirinç çizgiler "premium restoran" varsayılanına kayıyordu (serif + pirinç). Yerine dükkan tabelası ve Instagram afişleriyle uyumlu dar sans (Big Shoulders) seçildi.
3. Çorba, kebap, pide için üç eşit kart düşünüldü. Tam yükseklikte üç panelli sticky stack'e çevrildi.
4. Koyu zemin ve tek canlı vurgu, yapay zeka sitelerinin sık kullandığı bir kombinasyon. Burada markanın kendisi (logo, basılı menü, tabela) olduğu için korundu; grain, köz ışığı, gerçek yemek fotoğrafı, lavaş tonlu metin ve şiş motifiyle markaya özgü hale getirildi.
5. Avatarlı yorum carousel'i düşünüldü. Uydurma isim ve avatar olmadan, gerçek Google puanını merkeze alan bento ile değiştirildi.
6. Kampanya kuşağı için ilk akla gelen indirim rozeti, yüzde etiketi ve üç eşit "fırsat kartı"; yapay zeka çıktısının en tanıdık kalıbı. Ödüllü restoran sitelerine bakıldı (Noma, Dishoom, Eleven Madison Park, Death & Co): hiçbiri fiyatı reklam olarak göstermiyor, fiyat sipariş akışının içinde duruyor. Bu yüzden referans web siteleri değil basılı ilan kültürü alındı: emaye fiyat tabelası, gazete ilanı ve ilan satırı. Yüzde indirim uydurulmadı; kampanyalar menüde gerçekten var olan şeyler (çorbaların tek fiyatı, ayran dahil ekonomik dürümler, dürümde ikram). Üç biçim aynı yerde durur, günün biçimi tur usulü seçilir: her üç günde üçü de bir kez çıkar.

## Teslim öncesi kontrol

- 375, 768, 1440 px genişlikte ekran görüntüsü alındı ve incelendi.
- Sayfada `—` veya ayırıcı `–` yok (`rg "—|–" src`).
- Eyebrow sayısı 2'yi geçmiyor.
- Tüm butonlarda kontrast AA.
- `prefers-reduced-motion` ile sayfa kırılmadan çalışıyor.
- Klavye ile menü, dialog ve mobil menü kullanılabiliyor; odak halkası görünür.
- `npm run build` hatasız.
