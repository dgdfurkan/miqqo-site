// Medya kayıtları. Her öğenin bir kimliği var; site bu kimlikleri DOM'a
// `data-media-id` olarak yazıyor. İleride yönetim panelinden (Firebase, imgbb veya
// başka bir depo) gelen `/media.json` dosyası aynı kimliklere bakarak kaynağı
// değiştirebiliyor, kod değişmeden. Ayrıntı: docs/medya.md

export interface Klip {
  /** /media.json anahtarı */
  id: string;
  /** public/video altındaki dosya adı, uzantısız */
  dosya: string;
  baslik: string;
  metin: string;
}

export const klipler: Klip[] = [
  { id: 'klip-koz', dosya: 'fire-grill', baslik: 'Köz başında', metin: 'Ciğer şiş ateşin üstünde.' },
  { id: 'klip-firin', dosya: 'ocakta-pide', baslik: 'Odun fırınında', metin: 'Pide, fırının ağzında.' },
  { id: 'klip-tezgah', dosya: 'chef-prepping', baslik: 'Tezgâhta', metin: 'Şişler elde diziliyor.' },
  { id: 'klip-usta-eli', dosya: 'chef-slicing', baslik: 'Ustanın eli', metin: 'Et tezgâhta hazırlanıyor.' },
  { id: 'klip-tabak', dosya: 'sef-hazirladi-1', baslik: 'Tabak kuruluyor', metin: 'Servise hazır.' },
  { id: 'klip-mutfak-1', dosya: 'usta-mutfakta-yemek-hazirliyor-1', baslik: 'Mutfakta', metin: 'Sipariş hazırlanıyor.' },
  {
    id: 'klip-mutfak-2',
    dosya: 'usta-mutfakta-yemek-hazirliyor-2-solen',
    baslik: 'Mutfakta',
    metin: 'Tabaklar sıraya giriyor.',
  },
  { id: 'klip-mutfak-3', dosya: 'usta-mutfakta-yemek-hazirliyor-4', baslik: 'Mutfakta', metin: 'Son dokunuş.' },
  { id: 'klip-servis', dosya: 'usta-yemek-hazir-cani-caldi', baslik: 'Servis zamanı', metin: 'Yemek hazır.' },
  { id: 'klip-sofra', dosya: 'table-show-solen', baslik: 'Sofra kuruldu', metin: 'Mezeler, salata, sıcak lavaş.' },
  { id: 'klip-masa-1', dosya: 'masada-yemek-1-solen', baslik: 'Sofrada', metin: 'Tabaklar masaya geliyor.' },
  { id: 'klip-masa-2', dosya: 'masada-yemek-2-solen', baslik: 'Sofrada', metin: 'Sofra şenleniyor.' },
  { id: 'klip-masa-3', dosya: 'masada-yemek-3-solen', baslik: 'Sofrada', metin: 'Paylaşmak için.' },
  { id: 'klip-ayran', dosya: 'ayran-solen', baslik: 'Yanında ayran', metin: 'Yayık ayran, buz gibi.' },
];

export const klip = (id: string): Klip => {
  const bulunan = klipler.find((k) => k.id === id);
  if (!bulunan) throw new Error(`Klip bulunamadı: ${id}`);
  return bulunan;
};

export const klipSrc = (k: Klip) => `/video/${k.dosya}.mp4`;
export const klipPoster = (k: Klip) => `/video/${k.dosya}-poster.jpg`;

/** Hero'da döngüye giren klipler */
export const heroKlipleri = ['klip-koz', 'klip-firin', 'klip-usta-eli', 'klip-sofra'];

/** "Ocak başında" duvarındaki klipler */
export const mutfakKlipleri = [
  'klip-tezgah',
  'klip-mutfak-1',
  'klip-mutfak-2',
  'klip-mutfak-3',
  'klip-servis',
  'klip-masa-2',
];

/** Duyuru panosunun klip havuzu: günün tohumu buradan seçiyor, hepsi sırayla ekrana çıkıyor */
export const panoKlipleri = klipler.map((k) => k.id);

/** Duyuru panosunun fotoğraf havuzu: src/assets/products altındaki gerçek çekimler */
export const panoGorselleri = [
  'ciger-sis',
  'adana-kebap',
  'karisik-izgara',
  'kuzu-pirzola',
  'special-sis',
  'kusbasili-pide',
  'iskembe',
  'kunefe',
  'kiremitte-kofte',
  'yaprak-ciger',
  'tavuk-kanat',
  'sac-kavurma',
];

/** Mekan bölümündeki dükkan kareleri */
export const mekanKareleri = [
  { slug: 'cephe-aksam', alt: 'Ciğerci Miqqo dükkanının akşam ışıklı cephesi', baslik: 'Malazgirt 1071 Caddesi', yer: 'buyuk' },
  { slug: 'tabela', alt: 'Çatıdaki ışıklı Ciğerci Miqqo tabelası', baslik: 'Tabelayı görünce durun', yer: 'dikey' },
  { slug: 'salon-1', alt: 'Salonda dolu masalar', baslik: 'Aile masaları', yer: 'genis' },
  { slug: 'cocuk-alani', alt: 'Salonun içindeki çocuk oyun alanı', baslik: 'Çocuk oyun alanı', yer: 'kucuk' },
  { slug: 'salon-3', alt: 'Salonun geniş açıdan görünümü', baslik: 'Yüz kişilik salon', yer: 'kucuk' },
  { slug: 'cephe-gunduz', alt: 'Dükkanın gündüz cephesi', baslik: 'Gündüz', yer: 'kucuk' },
  { slug: 'salon-2', alt: 'Salonda pencere kenarı masalar', baslik: 'Pencere kenarı', yer: 'kucuk' },
  { slug: 'sofra', alt: 'Masada mezeler, salata ve pide', baslik: 'Sofra', yer: 'genis' },
  { slug: 'ocak', alt: 'Ocakta sıralanmış ciğer şişler', baslik: 'Ocak', yer: 'dikey' },
] as const;
