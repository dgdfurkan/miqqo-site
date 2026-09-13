// Reklam kuşağı ve panodaki reklam kareleri. Bütün fiyatlar menüden türetiliyor,
// uydurma kampanya yok: çorbaların taban fiyatı, ekonomik dürümlerin tek fiyatı ve
// dürümlerin ikram notu gerçek menüde böyle duruyor.
// Yönetim panelinden değiştirilecek metinler bu dosyada toplu duruyor.
import { menu } from './menu';

export type KampanyaBicimi = 'tabela' | 'afis' | 'satir';

// Kuşağın günlere dağılımı: tabela sabah tarafı, afiş en reklam gibi olanı,
// satır ise araya giren kısa duyuru. Sıra günün tohumuyla seçiliyor.
export const kampanyaBicimleri: KampanyaBicimi[] = ['afis', 'tabela', 'satir'];

const kategori = (id: string) => menu.find((c) => c.id === id)!;

const corbalar = kategori('corbalar');
const ekonomik = kategori('ekonomik-durumler');
const durumler = kategori('durumler');

const corbaFiyatlari = corbalar.items.map((item) => item.price).filter((p): p is number => typeof p === 'number');

// Kampanyada öne çıkan fiyat: en az iki çorbanın paylaştığı en düşük fiyat.
// İki deneme yanlış çıktı ve ikisi de ölçümle yakalandı: en düşük fiyat alınınca
// tek kalemlik "Az Çorba" (149) seçiliyor, en sık fiyat alınınca en pahalı grup
// (299, dört kalem) seçiliyordu. Reklamda öne çıkması gereken 199'luk üçlü.
const fiyatSayimi = new Map<number, number>();
corbaFiyatlari.forEach((fiyat) => fiyatSayimi.set(fiyat, (fiyatSayimi.get(fiyat) ?? 0) + 1));

export const corbaTabanFiyat = [...fiyatSayimi.entries()]
  .filter(([, adet]) => adet >= 2)
  .sort((a, b) => a[0] - b[0])[0][0];
export const corbaTabanAdlari = corbalar.items
  .filter((item) => item.price === corbaTabanFiyat)
  .map((item) => item.name);

export const ekonomikFiyat = ekonomik.items.find((item) => typeof item.price === 'number')!.price!;
export const ekonomikAdlari = ekonomik.items.map((item) => item.name);
export const ekonomikNot = ekonomik.note ?? '';

export const durumEkoFiyat = Math.min(
  ...durumler.items
    .map((item) => item.variants?.[0]?.price ?? item.price)
    .filter((p): p is number => typeof p === 'number')
);
export const durumNot = durumler.note ?? '';

export interface PanoReklami {
  id: string;
  ustyazi: string;
  baslik: string;
  metin: string;
  fiyat: number;
  fiyatNotu: string;
  // src/assets/products veya src/assets/food altındaki dosyanın uzantısız adı
  gorsel: string;
  link: string;
  linkYazisi: string;
}

export const panoReklamlari: PanoReklami[] = [
  {
    id: 'reklam-corba',
    ustyazi: 'Kazan sabah kaynar',
    baslik: 'Sabah çorbası',
    metin: `${corbaTabanAdlari.join(', ')}. Hepsi aynı fiyat.`,
    fiyat: corbaTabanFiyat,
    fiyatNotu: 'tek fiyat',
    gorsel: 'iskembe',
    link: '/menu#corbalar',
    linkYazisi: 'Çorba menüsü',
  },
  {
    id: 'reklam-ekonomik',
    ustyazi: ekonomik.name,
    baslik: 'Ayran dahil',
    metin: ekonomikNot,
    fiyat: ekonomikFiyat,
    fiyatNotu: 'hepsi tek fiyat',
    gorsel: 'kofte-durum',
    link: '/menu#ekonomik-durumler',
    linkYazisi: 'Ekonomik dürümler',
  },
  {
    id: 'reklam-ikram',
    ustyazi: durumler.name,
    baslik: 'Dürüm alana ikram var',
    metin: durumNot,
    fiyat: durumEkoFiyat,
    fiyatNotu: 'eko dürümden başlar',
    gorsel: 'et-sis-durum',
    link: '/menu#durumler',
    linkYazisi: 'Dürüm menüsü',
  },
];
