// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  site: 'https://cigercimiqqo.com',
  // Çıktı statik. Adapter burada duruyor çünkü barındırma tarafı kendi adapter'ını
  // eklediğinde görsel servisini de eziyor: görseller build sırasında üretilmiyor,
  // /_image uç noktasına düşüyor ve Workers'ta sharp olmadığı için hepsi 404 veriyor.
  // imageService: 'compile' görselleri build sırasında sharp ile ürettiriyor.
  // Ölçüm: adapter + compile ile 0 adet _image, 126 webp, 37 avif.
  output: 'static',
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: [sitemap()],
  // Ekran görüntüsü denetimlerinde araç çubuğu sayfanın üstüne binmesin.
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
