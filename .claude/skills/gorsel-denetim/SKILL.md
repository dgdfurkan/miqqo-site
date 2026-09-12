---
name: gorsel-denetim
description: Ciğerci Miqqo sitesinde görsel ve teslim öncesi denetim. Tasarım değişikliği, yeni bölüm, animasyon veya stil düzenlemesinden sonra üç genişlikte ekran görüntüsü alıp kontrol listesini uygular. "Nasıl görünüyor", "mobilde kontrol et", "teslim öncesi bak" isteklerinde ve her tasarım işinin sonunda kullan.
---

# Görsel denetim

## 1. Ekran görüntüsü al

Dev sunucu açık olmalı (`npm run dev`, http://localhost:4321).

```bash
node scripts/shot.mjs --views mobile,tablet,desktop --scroll 0,1200,2400 --clean
node scripts/shot.mjs --paths /menu,/iletisim --views mobile,desktop --scroll 0,1500
node scripts/shot.mjs --views desktop --scroll 0 --reduced      # hareket azaltma
```

Betik sistemdeki Chrome'u kullanır, çıktı `.shots/` altına düşer. Uzun sayfalarda kaydırma değerlerini bölüm bölüm ver; pinlenen bölümler (En çok sevilenler) kaydırma mesafesini uzatır.

Ekran görüntülerini **aç ve gerçekten bak**. Dosya üretmek denetim değildir.

## 2. Kontrol listesi

Yerleşim:
- [ ] 375 px'te yatay kaydırma yok, metin kesilmiyor, butonlar tam genişlik ve tek satır.
- [ ] 768 px'te sticky ocak panelleri düzgün biniyor, fotoğraflar şerit gibi ezilmiyor.
- [ ] 1440 px'te hero tek ekranda: başlık iki satır, alt metin ve iki buton kaydırmasız görünür.
- [ ] Header tek satır, 80 px'i geçmiyor; logo, menü ve telefon butonu çakışmıyor.
- [ ] Fotoğraf oranları korunuyor, hiçbir görsel gerilmemiş.

Marka ve metin:
- [ ] Tek vurgu rengi (`koz`) kullanılmış, başka canlı renk yok.
- [ ] Butonlarda kontrast yeterli: turuncu zeminde kömür yazı, açık zeminde koyu yazı.
- [ ] `rg "—|–" src docs` boş.
- [ ] Metinler işletmenin kendi diliyle; uydurma slogan yok.
- [ ] Bölüm üstü küçük büyük harf etiket sayısı en fazla 2.

Hareket:
- [ ] Şiş hero başlığından geçiyor, harflerin bir kısmı önünde bir kısmı arkasında.
- [ ] Kaydırma ilerleme şişi sayfanın üstünde akıyor.
- [ ] `--reduced` görüntüsünde bütün içerik görünür, hiçbir şey gizli kalmamış.
- [ ] Konsol hatası yok (betik hata varsa yazdırır).

Erişilebilirlik:
- [ ] Klavyeyle menü, mobil menü ve ürün detayı açılıp Esc ile kapanıyor.
- [ ] Odak halkası görünür.
- [ ] Fotoğrafların alt metni Türkçe ve açıklayıcı; dekoratif olanlar boş alt.

## 3. Bitirme

```bash
npm run build
```

Hata varsa düzelt, sonra "oldu" de. Ekranda görmediğin bir şeyi düzeldi sayma; hangi görüntüde ne gördüğünü tek cümleyle yaz.
