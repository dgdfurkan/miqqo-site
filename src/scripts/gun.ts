// Günün kodu ve deterministik zar. Hem duyuru panosu hem kampanya kuşağı bunu
// kullanıyor: aynı gün bütün ziyaretçilerde aynı seçim çıkar, ertesi gün değişir.

export const gunKodu = (tarih = new Date()): string =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Istanbul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(tarih);

export const gunYazisi = (tarih = new Date()): string =>
  new Intl.DateTimeFormat('tr-TR', { timeZone: 'Europe/Istanbul', day: 'numeric', month: 'long' }).format(tarih);

// FNV-1a: kısa metinden sabit sayı üretir.
export const tohum = (metin: string): number => {
  let h = 2166136261;
  for (let i = 0; i < metin.length; i += 1) {
    h ^= metin.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

// mulberry32: tohumdan 0 ile 1 arası sayı dizisi.
export const zar = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const karistir = <T,>(dizi: T[], rand: () => number): T[] =>
  dizi
    .map((oge) => ({ oge, n: rand() }))
    .sort((a, b) => a.n - b.n)
    .map((x) => x.oge);

// Günün sırasındaki seçim. `ek` farklı yerlerin aynı gün aynı şeyi seçmesini önler.
export const gununSecimi = <T,>(dizi: T[], ek = '', gun = gunKodu()): T => dizi[tohum(gun + ek) % dizi.length];

// İstanbul gününün epoch gün sayısı.
export const gunIndeksi = (gun = gunKodu()): number => {
  const [yil, ay, gunNo] = gun.split('-').map(Number);
  return Math.floor(Date.UTC(yil, ay - 1, gunNo) / 86400000);
};

// Sırayla dolaşan seçim: her `dizi.length` günde her öğe tam bir kez çıkar, sıra
// blok başına tohumla kayar. Düz `tohum % n` kullanılınca dağılım bozuluyordu
// (21 günde 5 / 7 / 9), bu yüzden blok içi tur usulü seçim yapılıyor.
export const gununSirasi = <T,>(dizi: T[], gun = gunKodu()): T => {
  const i = gunIndeksi(gun);
  const blok = Math.floor(i / dizi.length);
  return dizi[(i + tohum(String(blok))) % dizi.length];
};
