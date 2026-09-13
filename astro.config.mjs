// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cigercimiqqo.com',
  // Statik çıktı ve sharp açıkça yazılı. Barındırma tarafı bir SSR adapter'ı eklerse
  // görseller build sırasında üretilmiyor, /_image uç noktasına düşüyor ve Workers'ta
  // sharp olmadığı için hepsi 404 veriyor. Bu iki satır o durumu engelliyor.
  output: 'static',
  image: { service: { entrypoint: 'astro/assets/services/sharp' } },
  integrations: [sitemap()],
  // Ekran görüntüsü denetimlerinde araç çubuğu sayfanın üstüne binmesin.
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
