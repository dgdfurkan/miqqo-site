import type { ImageMetadata } from 'astro';

const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/food/*.{jpg,jpeg,png,webp}', {
  eager: true,
});

const bySlug = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(files)) {
  const slug = path.split('/').pop()!.replace(/\.(jpe?g|png|webp)$/i, '');
  bySlug.set(slug, mod.default);
}

export function foodImage(slug: string): ImageMetadata {
  const image = bySlug.get(slug);
  if (!image) throw new Error(`Görsel bulunamadı: src/assets/food/${slug}`);
  return image;
}

export function hasFoodImage(slug: string | undefined): slug is string {
  return !!slug && bySlug.has(slug);
}
