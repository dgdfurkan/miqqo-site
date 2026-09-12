# Ciğerci Miqqo

Eryaman/Etimesgut'taki Ciğerci Miqqo için statik site. Astro 7, Tailwind v4, GSAP ve Lenis.

```bash
npm install
npm run dev        # http://localhost:4321
npm run dev:lan    # ag uzerinden: http://<bilgisayarin-ip>:4322
npm run build      # dist/
```

- Menü verisi: `src/data/menu.ts` (kaynak: işletmenin basılı menü PDF'i)
- İşletme bilgileri: `src/data/site.ts`
- Tasarım kuralları: `docs/tasarim-sistemi.md`
- Marka ve pazar araştırması: `docs/marka-arastirmasi.md`
- Yayın ayarları: `docs/yayin.md`
- Ajans çekimleri ve videolar depoda tutulmuyor (`assets/` git dışında), işlenmiş hâlleri `src/assets/` ve `public/video/` altında.
