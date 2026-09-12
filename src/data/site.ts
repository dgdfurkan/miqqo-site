// İşletme bilgileri. Telefon, adres, saat veya link değişince yalnız bu dosya güncellenir.
// Kaynak ve teyit notları: docs/marka-arastirmasi.md

export const site = {
  name: 'Ciğerci Miqqo',
  shortName: 'Miqqo',
  url: 'https://cigercimiqqo.com',
  description:
    "Eryaman'da köz ciğer şiş, Adana ve Urfa kebap, odun ateşinde pide ve kemik suyu çorbalar. Her gün 07:00'den 02:00'ye kadar açık.",
  slogan: 'Etin en güzel hali',

  phone: {
    display: '0312 272 13 09',
    href: 'tel:+903122721309',
  },
  email: 'mi@cigercimiqqo.com',

  address: {
    street: 'Malazgirt 1071 Cad. No:18/D',
    district: 'Şehit Osman Avcı Mah.',
    city: 'Etimesgut',
    province: 'Ankara',
    postalCode: '06820',
    area: 'Eryaman',
  },
  geo: { lat: 39.9767435, lng: 32.6565801 },

  // 0 = Pazar. Kapanış gece yarısından sonraysa ertesi güne taşar.
  hours: [
    { day: 0, open: '08:30', close: '02:00' },
    { day: 1, open: '07:00', close: '02:00' },
    { day: 2, open: '07:00', close: '02:00' },
    { day: 3, open: '07:00', close: '02:00' },
    { day: 4, open: '07:00', close: '02:00' },
    { day: 5, open: '07:00', close: '02:00' },
    { day: 6, open: '07:00', close: '02:00' },
  ],
  timeZone: 'Europe/Istanbul',

  priceRange: '₺400-600',

  rating: {
    value: 4.4,
    count: 1250,
    source: 'Google',
    checkedAt: '2026-09-12',
  },

  links: {
    instagram: 'https://www.instagram.com/eryaman_miqqo/',
    instagramHandle: '@eryaman_miqqo',
    facebook: 'https://www.facebook.com/cigercimiqqoeryaman/',
    googleMaps: 'https://www.google.com/maps?cid=12695601367241679176',
    directions:
      'https://www.google.com/maps/dir/?api=1&destination=Ci%C4%9Ferci+Miqqo%2C+Malazgirt+1071+Cd.+No%3A18%2FD%2C+Etimesgut%2FAnkara',
    googleReview: 'https://g.page/r/CUhhZ-gt1i-wEBM/review',
    mapEmbed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3057.3880432027436!2d32.65457614350083!3d39.97743278458852!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xb02fd62de8676148!2sCi%C4%9Ferci+Miqqo!5e0!3m2!1str!2str!4v1553323768929',
  },

  delivery: [
    { name: 'Yemeksepeti', href: 'https://www.yemeksepeti.com/restaurant/yujt/cigerci-miqqo' },
    {
      name: 'Migros Yemek',
      href: 'https://www.migros.com.tr/yemek/cigerci-miqqo-etimesgut-sehit-osman-avci-mah-st-27cc0',
    },
  ],
} as const;

export const dayNames = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'] as const;

export function formatPrice(value: number): string {
  return `₺${value.toLocaleString('tr-TR')}`;
}

export const fullAddress = `${site.address.district}, ${site.address.street}, ${site.address.postalCode} ${site.address.city}/${site.address.province}`;
