import type { ImageMetadata } from 'astro';

type Glob = Record<string, { default: ImageMetadata }>;

const collect = (files: Glob) => {
  const map = new Map<string, ImageMetadata>();
  for (const [path, mod] of Object.entries(files)) {
    const slug = path.split('/').pop()!.replace(/\.(jpe?g|png|webp|avif)$/i, '');
    map.set(slug, mod.default);
  }
  return map;
};

// Basılı menüden çıkarılan alfa kanallı kesimler
const food = collect(
  import.meta.glob<{ default: ImageMetadata }>('/src/assets/food/*.{jpg,jpeg,png,webp}', { eager: true })
);
// Ajans çekimleri: gerçek tabak fotoğrafları
const products = collect(
  import.meta.glob<{ default: ImageMetadata }>('/src/assets/products/*.{jpg,jpeg,png,webp}', { eager: true })
);
// Dükkan: dış cephe, salon, tabela, sofra, ocak
const venue = collect(
  import.meta.glob<{ default: ImageMetadata }>('/src/assets/venue/*.{jpg,jpeg,png,webp}', { eager: true })
);

const get = (map: Map<string, ImageMetadata>, slug: string, folder: string) => {
  const image = map.get(slug);
  if (!image) throw new Error(`Görsel bulunamadı: src/assets/${folder}/${slug}`);
  return image;
};

export const foodImage = (slug: string) => get(food, slug, 'food');
export const hasFoodImage = (slug?: string): slug is string => !!slug && food.has(slug);

export const productImage = (slug: string) => get(products, slug, 'products');
export const hasProductImage = (slug?: string): slug is string => !!slug && products.has(slug);

export const venueImage = (slug: string) => get(venue, slug, 'venue');

/** Gerçek çekim varsa onu, yoksa basılı menü kesimini verir. */
export function dishImage(slug: string): ImageMetadata {
  return products.get(slug) ?? get(food, slug, 'food');
}

export const hasDishImage = (slug?: string): slug is string => !!slug && (products.has(slug) || food.has(slug));
