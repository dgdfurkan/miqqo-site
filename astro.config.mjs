// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cigercimiqqo.com',
  integrations: [sitemap()],
  // Ekran görüntüsü denetimlerinde araç çubuğu sayfanın üstüne binmesin.
  devToolbar: { enabled: false },
  vite: {
    plugins: [tailwindcss()],
  },
});
