// Yönetim paneli köprüsü. Site açılışında `/media.json` varsa okunur ve
// `data-media-id` taşıyan görsel, video ve oynatma listeleri o dosyadaki adreslerle
// değiştirilir. Dosya yoksa hiçbir şey olmaz, yerel medya kullanılır.
//
// Beklenen biçim:
// {
//   "klip-koz":  { "url": "https://.../koz.mp4", "poster": "https://.../koz.jpg" },
//   "urun-ciger-sis": { "url": "https://i.ibb.co/xxx/ciger-sis.jpg" }
// }

export interface MedyaKaydi {
  url?: string;
  poster?: string;
}

export type MedyaTablosu = Record<string, MedyaKaydi>;

let tablo: MedyaTablosu = {};
const dinleyiciler = new Set<(t: MedyaTablosu) => void>();

export const medyaKaydi = (id?: string | null): MedyaKaydi | undefined => (id ? tablo[id] : undefined);

export function medyaDegisince(geri: (t: MedyaTablosu) => void) {
  dinleyiciler.add(geri);
  if (Object.keys(tablo).length) geri(tablo);
}

function uygulaGorsel(el: HTMLImageElement, kayit: MedyaKaydi) {
  if (!kayit.url) return;
  // Astro srcset üretiyor; dış kaynağa geçerken temizlenmeli
  el.removeAttribute('srcset');
  el.removeAttribute('sizes');
  el.closest('picture')?.querySelectorAll('source').forEach((s) => s.remove());
  el.src = kayit.url;
}

function uygulaVideo(el: HTMLVideoElement, kayit: MedyaKaydi) {
  if (kayit.poster) el.poster = kayit.poster;
  if (!kayit.url) return;
  el.dataset.src = kayit.url;
  if (el.src) el.src = kayit.url;
}

function uygulaListe(el: HTMLElement, t: MedyaTablosu) {
  const ham = el.dataset.playlist;
  if (!ham) return;
  try {
    const liste = JSON.parse(ham) as { id: string; src: string; poster: string }[];
    const yeni = liste.map((k) => {
      const kayit = t[k.id];
      return kayit ? { ...k, src: kayit.url ?? k.src, poster: kayit.poster ?? k.poster } : k;
    });
    el.dataset.playlist = JSON.stringify(yeni);
  } catch {}
}

function uygula(t: MedyaTablosu) {
  tablo = t;
  document.querySelectorAll<HTMLElement>('[data-media-id]').forEach((el) => {
    const kayit = t[el.dataset.mediaId ?? ''];
    if (!kayit) return;
    if (el instanceof HTMLImageElement) uygulaGorsel(el, kayit);
    else if (el instanceof HTMLVideoElement) uygulaVideo(el, kayit);
    el.dataset.mediaOverridden = 'true';
  });
  document.querySelectorAll<HTMLElement>('[data-playlist]').forEach((el) => uygulaListe(el, t));
  dinleyiciler.forEach((geri) => geri(t));
}

export const medyaHazir: Promise<MedyaTablosu> = (async () => {
  try {
    const yanit = await fetch('/media.json', { cache: 'no-cache' });
    if (!yanit.ok) return {};
    const veri = (await yanit.json()) as MedyaTablosu;
    if (veri && typeof veri === 'object') uygula(veri);
    return tablo;
  } catch {
    return {};
  }
})();
