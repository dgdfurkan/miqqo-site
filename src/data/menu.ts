// Menü verisi. Tek kaynak: işletmenin basılı menüsü "Miqqo Menüüüü (4).pdf" (10 sayfa).
// Fiyat, porsiyon, kalori ve alerjen bilgileri o dosyadan birebir alındı.
// cigercimiqqo.com üzerindeki eski menü güncel değil, oradan veri alınmaz.
// Güncelleme akışı: .claude/skills/menu-guncelle/SKILL.md
// image: src/assets/food/ altındaki dosyanın uzantısız adı (PDF'ten gelen alfa kanallı ürün fotoğrafı).

export type MenuTag = 'populer' | 'imza';

export interface MenuVariant {
  label: string;
  price: number;
  note?: string;
  kcal?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  subtitle?: string;
  price?: number;
  variants?: MenuVariant[];
  description?: string;
  ingredients?: string;
  kcal?: string;
  allergens?: string[];
  image?: string;
  // Alfa kanalı olmayan, arka planı görünen fotoğraf: kesim gibi değil, çerçeveli gösterilir.
  framed?: boolean;
  tags?: MenuTag[];
}

export interface MenuCategory {
  id: string;
  name: string;
  short: string;
  note?: string;
  items: MenuItem[];
}

const glutenSut = ['Gluten', 'Süt'];

export const menu: MenuCategory[] = [
  {
    id: 'corbalar',
    name: 'Çorbalar',
    short: 'Çorbalar',
    items: [
      {
        id: 'mercimek',
        name: 'Mercimek',
        price: 199,
        ingredients: 'Kırmızı mercimek, soğan, kemik suyu, tereyağı, tuz',
        kcal: '~220',
        allergens: glutenSut,
      },
      {
        id: 'iskembe',
        name: 'İşkembe',
        price: 199,
        ingredients: 'İşkembe, terbiye, kemik suyu, tereyağı, tuz; yanında sarımsak ve sirke',
        kcal: '~280',
        allergens: glutenSut,
        tags: ['populer'],
      },
      {
        id: 'tavuk-suyu',
        name: 'Tavuk Suyu',
        price: 199,
        ingredients: 'Tavuk, terbiye, kemik suyu, tereyağı, tuz; yanında sarımsak ve sirke',
        kcal: '~260',
        allergens: glutenSut,
      },
      {
        id: 'tuzlama',
        name: 'Tuzlama',
        price: 249,
        ingredients: 'İri boyutlu işkembe, terbiye, kemik suyu, tereyağı, tuz; yanında sarımsak ve sirke',
        kcal: '~330',
        allergens: glutenSut,
      },
      {
        id: 'atom',
        name: 'Atom',
        price: 299,
        ingredients:
          'İşkembe, kelle paça, tuzlama, ayak paça, terbiye, kemik suyu, tereyağı, tuz; yanında sarımsak ve sirke',
        kcal: '~420',
        allergens: glutenSut,
      },
      {
        id: 'kelle-paca',
        name: 'Kelle Paça',
        price: 299,
        ingredients: 'Kelle paça eti, terbiye, kemik suyu, tereyağı, tuz; yanında sarımsak ve sirke',
        kcal: '~330',
        allergens: glutenSut,
      },
      {
        id: 'ayak-paca',
        name: 'Ayak Paça',
        price: 299,
        ingredients: 'Ayak paça, terbiye, kemik suyu, tereyağı, tuz; yanında sarımsak ve sirke',
        kcal: '~340',
        allergens: glutenSut,
      },
      {
        id: 'damar',
        name: 'Damar',
        price: 299,
        ingredients: 'Dana işkembe damar bölümü, terbiye, kemik suyu, tereyağı, tuz; yanında sarımsak ve sirke',
        kcal: '~400',
        allergens: glutenSut,
      },
      {
        id: 'curuk',
        name: 'Çürük',
        price: 350,
        ingredients:
          'Kelle eti, yanak ve baş bölgesindeki yumuşak etler, terbiye, kemik suyu, tereyağı, tuz; yanında sarımsak ve sirke',
        kcal: '~420',
        allergens: glutenSut,
      },
      {
        id: 'az-corba-mercimek',
        name: 'Az Çorba',
        price: 149,
        description: 'Yarım porsiyon. Mercimek, İşkembe veya Tavuk Suyu.',
      },
      {
        id: 'az-corba-ozel',
        name: 'Az Çorba',
        price: 225,
        description: 'Yarım porsiyon. Atom, Kelle Paça, Ayak Paça, Tuzlama, Damar veya Çürük.',
      },
    ],
  },
  {
    id: 'ara-sicaklar',
    name: 'Ara Sıcaklar',
    short: 'Ara Sıcak',
    items: [
      {
        id: 'icli-kofte',
        name: 'İçli Köfte',
        price: 190,
        ingredients: 'İnce bulgur, yumurta, kıyma, soğan, baharat, ceviz',
        kcal: '~320',
        allergens: ['Gluten', 'Ceviz', 'Yumurta'],
        image: 'icli-kofte',
      },
      {
        id: 'patates-kizartmasi',
        name: 'Patates Kızartması',
        price: 190,
        ingredients: 'Patates, yağ, tuz',
        kcal: '~430',
        image: 'patates-kizartmasi',
      },
      {
        id: 'kasarli-mantar',
        name: 'Kaşarlı Mantar',
        price: 300,
        ingredients: 'Mantar, kaşar peyniri, tereyağı, baharat',
        kcal: '~390',
        allergens: ['Süt'],
        image: 'kasarli-mantar',
      },
    ],
  },
  {
    id: 'durumler',
    name: 'Dürümler',
    short: 'Dürümler',
    note: 'İkram eşliğinde servis edilir.',
    items: [
      {
        id: 'et-sis-durum',
        name: 'Et Şiş Dürüm',
        ingredients: '%100 dana eti, kıvırcık, maydanoz, soğan, domates, lavaş',
        kcal: '~650',
        allergens: glutenSut,
        image: 'et-sis-durum',
        variants: [
          { label: 'Eko', price: 600 },
          { label: 'Porsiyon', price: 750 },
        ],
      },
      {
        id: 'ciger-sis-durum',
        name: 'Ciğer Şiş Dürüm',
        ingredients: 'Ciğer, kıvırcık, maydanoz, soğan, domates, lavaş',
        kcal: '~580',
        allergens: glutenSut,
        image: 'ciger-sis-durum',
        tags: ['populer'],
        variants: [
          { label: 'Eko', price: 475 },
          { label: 'Porsiyon', price: 575 },
        ],
      },
      {
        id: 'adana-urfa-durum',
        name: 'Adana / Urfa',
        ingredients: '%60 dana eti, %20 kuzu eti, %20 kuyruk yağı, kıvırcık, maydanoz, soğan, domates, lavaş',
        kcal: '~630',
        allergens: glutenSut,
        image: 'adana-urfa-durum',
        tags: ['populer'],
        variants: [
          { label: 'Eko', price: 475 },
          { label: 'Porsiyon', price: 575 },
        ],
      },
      {
        id: 'tavuk-sis-durum',
        name: 'Tavuk Şiş Dürüm',
        ingredients: 'Tavuk eti, kıvırcık, maydanoz, soğan, domates, lavaş',
        kcal: '~520',
        allergens: glutenSut,
        image: 'tavuk-sis-durum',
        variants: [
          { label: 'Eko', price: 350 },
          { label: 'Porsiyon', price: 425 },
        ],
      },
      {
        id: 'et-doner-durum',
        name: 'Et Döner Dürüm',
        price: 475,
        ingredients: '%100 dana eti, kıvırcık, maydanoz, soğan, domates, lavaş',
        kcal: '~610',
        allergens: glutenSut,
        image: 'et-doner-durum',
      },
      {
        id: 'tavuk-doner-durum',
        name: 'Tavuk Döner Dürüm',
        price: 350,
        ingredients: 'Tavuk eti, kıvırcık, maydanoz, soğan, domates, lavaş',
        kcal: '~540',
        allergens: glutenSut,
        image: 'tavuk-doner-durum',
      },
    ],
  },
  {
    id: 'ekonomik-durumler',
    name: 'Ekonomik Dürümler',
    short: 'Ekonomik',
    note: 'Ayran dahil, ikramsız.',
    items: [
      {
        id: 'kofte-durum-ekonomik',
        name: 'Köfte Dürüm',
        price: 275,
        ingredients: 'Köfte (dana eti, galeta unu, soğan, sarımsak), kıvırcık, maydanoz, soğan, domates, lavaş',
        kcal: '~590',
        allergens: ['Gluten'],
        image: 'kofte-durum',
      },
      {
        id: 'ciger-sis-durum-ekonomik',
        name: 'Ciğer Şiş Dürüm',
        price: 275,
        ingredients: 'Ciğer, kıvırcık, maydanoz, soğan, domates, lavaş',
        kcal: '~630',
        allergens: ['Gluten'],
        image: 'ciger-sis-durum',
      },
      {
        id: 'adana-urfa-durum-ekonomik',
        name: 'Adana / Urfa',
        price: 275,
        ingredients: '%60 dana eti, %20 kuzu eti, %20 kuyruk yağı, kıvırcık, maydanoz, soğan, domates, lavaş',
        kcal: '~620',
        allergens: ['Gluten'],
        image: 'adana-urfa-durum',
      },
      {
        id: 'sucuk-durum-ekonomik',
        name: 'Sucuk Dürüm',
        price: 275,
        ingredients: 'Dana sucuk, kıvırcık, maydanoz, soğan, domates, lavaş',
        kcal: '~590',
        allergens: ['Gluten'],
        image: 'sucuk-durum',
      },
      {
        id: 'tavuk-sis-durum-ekonomik',
        name: 'Tavuk Şiş Dürüm',
        price: 250,
        ingredients: 'Tavuk eti, kıvırcık, maydanoz, soğan, domates, lavaş',
        kcal: '~610',
        allergens: glutenSut,
        image: 'tavuk-sis-durum',
      },
      {
        id: 'tavuk-doner-durum-ekonomik',
        name: 'Tavuk Döner Dürüm',
        price: 250,
        ingredients: 'Tavuk eti, kıvırcık, maydanoz, soğan, domates, lavaş',
        kcal: '~540',
        allergens: glutenSut,
        image: 'tavuk-doner-durum',
      },
    ],
  },
  {
    id: 'kebaplar',
    name: 'Kebaplar',
    short: 'Kebaplar',
    items: [
      {
        id: 'adana-kebap',
        name: 'Adana Kebap',
        subtitle: 'Acılı',
        price: 675,
        ingredients:
          'Adana kebap (%60 dana eti, %20 kuzu eti, %20 kuyruk yağı), pilav, patates kızartması, köz domates, köz biber ile servis edilir',
        kcal: '~860',
        allergens: ['Gluten'],
        image: 'adana-kebap',
      },
      {
        id: 'urfa-kebap',
        name: 'Urfa Kebap',
        subtitle: 'Acısız',
        price: 675,
        ingredients:
          'Urfa kebap (%60 dana eti, %20 kuzu eti, %20 kuyruk yağı), pilav, patates kızartması, köz domates, köz biber ile servis edilir',
        kcal: '~840',
        allergens: ['Gluten'],
        image: 'urfa-kebap',
      },
      {
        id: 'izgara-kofte',
        name: 'Izgara Köfte',
        ingredients:
          'Izgara köfte (dana eti, galeta unu, soğan, sarımsak), pilav, patates kızartması, köz domates, köz biber ile servis edilir',
        kcal: '~910',
        allergens: ['Gluten'],
        image: 'izgara-kofte',
        variants: [
          { label: 'Çocuk', price: 450 },
          { label: 'Porsiyon', price: 675 },
        ],
      },
      {
        id: 'ciger-sis',
        name: 'Ciğer Şiş',
        price: 690,
        ingredients: '8 şiş ciğer şiş',
        kcal: '~840',
        allergens: glutenSut,
        image: 'ciger-sis',
        tags: ['populer'],
      },
      {
        id: 'et-sis',
        name: 'Et Şiş',
        price: 850,
        ingredients: '8 şiş et şiş',
        kcal: '~930',
        allergens: glutenSut,
        image: 'et-sis',
      },
      {
        id: 'special-sis',
        name: 'Special Şiş',
        price: 775,
        ingredients: '4 şiş et şiş, 4 şiş ciğer şiş',
        kcal: '~910',
        allergens: glutenSut,
        image: 'special-sis-tabak',
      },
      {
        id: 'karisik-izgara',
        name: 'Karışık Izgara',
        price: 1250,
        ingredients:
          '1 şiş patlıcan kebabı, 1 şiş Adana, 2 şiş et şiş, 2 şiş ciğer şiş, 3 tike tavuk, 2 adet kanat, 2 adet köfte, pilav, patates kızartması, köz domates, köz biber ile servis edilir',
        kcal: '~1380',
        allergens: glutenSut,
        image: 'karisik-izgara',
        tags: ['populer'],
      },
      {
        id: 'kuzu-pirzola',
        name: 'Kuzu Pirzola',
        price: 1100,
        ingredients: 'Kuzu pirzola, pilav, patates kızartması, köz domates, köz biber ile servis edilir',
        kcal: '~1120',
        allergens: glutenSut,
        image: 'kuzu-pirzola',
      },
      {
        id: 'dana-kulbasti',
        name: 'Dana Külbastı',
        price: 900,
        ingredients: 'Dana külbastı, pilav, patates kızartması, köz domates, köz biber ile servis edilir',
        kcal: '~980',
        allergens: glutenSut,
        image: 'dana-kulbasti',
      },
      {
        id: 'tavuk-kanat',
        name: 'Tavuk Kanat',
        price: 590,
        ingredients: 'Tavuk kanat, pilav, patates kızartması, köz domates, köz biber ile servis edilir',
        kcal: '~780',
        allergens: glutenSut,
        image: 'tavuk-kanat',
      },
      {
        id: 'tavuk-pirzola',
        name: 'Tavuk Pirzola',
        price: 550,
        ingredients: 'Tavuk pirzola, pilav, patates kızartması, köz domates, köz biber ile servis edilir',
        kcal: '~760',
        allergens: glutenSut,
        image: 'tavuk-pirzola',
      },
      {
        id: 'tavuk-sis',
        name: 'Tavuk Şiş',
        ingredients: 'Tavuk şiş, pilav, patates kızartması, köz domates, köz biber ile servis edilir',
        kcal: '~720',
        allergens: glutenSut,
        image: 'tavuk-sis',
        tags: ['populer'],
        variants: [
          { label: 'Çocuk', price: 350 },
          { label: 'Porsiyon', price: 500 },
        ],
      },
    ],
  },
  {
    id: 'pideler',
    name: 'Pideler',
    short: 'Pideler',
    items: [
      {
        id: 'lahmacun',
        name: 'Lahmacun',
        subtitle: 'Adet',
        price: 300,
        ingredients: 'İnce hamur, kıyma, domates, maydanoz, biber, soğan, sarımsak, baharat',
        kcal: '~360',
        allergens: ['Gluten'],
        image: 'lahmacun',
      },
      {
        id: 'kiymali-pide',
        name: 'Kıymalı Pide',
        price: 475,
        ingredients: 'Pide hamuru, kıyma, domates, biber, soğan, maydanoz, baharat',
        kcal: '~890',
        allergens: ['Gluten'],
        image: 'kiymali-pide',
      },
      {
        id: 'kiymali-kasarli-pide',
        name: 'Kıymalı Kaşarlı Pide',
        price: 525,
        ingredients: 'Pide hamuru, kıyma, kaşar peyniri, domates, maydanoz, biber',
        kcal: '~1030',
        allergens: glutenSut,
        image: 'kiymali-kasarli-pide',
      },
      {
        id: 'kasarli-pide',
        name: 'Kaşarlı Pide',
        price: 450,
        ingredients: 'Pide hamuru, kaşar peyniri',
        kcal: '~820',
        allergens: glutenSut,
        image: 'kasarli-pide',
      },
      {
        id: 'kusbasili-pide',
        name: 'Kuşbaşılı Pide',
        price: 650,
        ingredients: 'Pide hamuru, kuşbaşı et, domates, biber, baharat',
        kcal: '~980',
        allergens: ['Gluten'],
        image: 'kusbasili-pide',
      },
      {
        id: 'kusbasili-kasarli-pide',
        name: 'Kuşbaşılı Kaşarlı Pide',
        price: 690,
        ingredients: 'Pide hamuru, kuşbaşı et, kaşar peyniri, domates, biber',
        kcal: '~1120',
        allergens: glutenSut,
        image: 'kusbasili-kasarli-pide',
      },
      {
        id: 'karisik-pide',
        name: 'Karışık Pide',
        price: 650,
        ingredients: 'Pide hamuru, kıyma, kuşbaşı et, kaşar peyniri, domates, biber, soğan, maydanoz, baharat',
        kcal: '~1180',
        allergens: glutenSut,
        image: 'karisik-pide',
      },
      {
        id: 'tavuk-kusbasili-pide',
        name: 'Tavuk Kuşbaşılı Pide',
        price: 475,
        ingredients: 'Pide hamuru, tavuk kuşbaşı, domates, biber, baharat',
        kcal: '~920',
        allergens: glutenSut,
        image: 'tavuk-kusbasili-pide',
      },
      {
        id: 'mantarli-kasarli-pide',
        name: 'Mantarlı Kaşarlı Pide',
        price: 475,
        ingredients: 'Pide hamuru, mantar, kaşar peyniri, domates, biber, baharat',
        kcal: '~850',
        allergens: glutenSut,
        image: 'mantarli-kasarli-pide',
      },
      {
        id: 'sucuklu-kasarli-pide',
        name: 'Sucuklu Kaşarlı Pide',
        price: 500,
        ingredients: 'Pide hamuru, sucuk, kaşar peyniri, baharat',
        kcal: '~1040',
        allergens: glutenSut,
        image: 'sucuklu-kasarli-pide',
      },
      {
        id: 'et-donerli-kapali-pide',
        name: 'Et Dönerli Kaşarlı Kapalı',
        price: 550,
        ingredients: 'Pide hamuru, et döner, kaşar peyniri, baharat',
        kcal: '~960',
        allergens: glutenSut,
        image: 'et-donerli-kapali-pide',
      },
      {
        id: 'tavuk-donerli-kapali-pide',
        name: 'Tavuk Dönerli Kaşarlı Kapalı',
        price: 450,
        ingredients: 'Pide hamuru, tavuk döner, kaşar peyniri, baharat',
        kcal: '~900',
        allergens: glutenSut,
        image: 'tavuk-donerli-kapali-pide',
      },
    ],
  },
  {
    id: 'tavalar',
    name: 'Tavalar',
    short: 'Tavalar',
    items: [
      {
        id: 'sac-tava',
        name: 'Saç Tava',
        ingredients: 'Et veya tavuk, közlenmiş domates, közlenmiş biber',
        kcal: 'Tavuk ~760, Et ~950',
        allergens: glutenSut,
        image: 'sac-tava',
        variants: [
          { label: 'Tavuk', price: 600, kcal: '~760' },
          { label: 'Et', price: 850, kcal: '~950' },
        ],
      },
      {
        id: 'coban-kavurma',
        name: 'Çoban Kavurma',
        ingredients: 'Et veya tavuk, közlenmiş domates, közlenmiş biber, soğan, sarımsak',
        kcal: 'Tavuk ~730, Et ~910',
        allergens: glutenSut,
        image: 'coban-kavurma',
        variants: [
          { label: 'Tavuk', price: 600, kcal: '~730' },
          { label: 'Et', price: 850, kcal: '~910' },
        ],
      },
      {
        id: 'yaprak-ciger',
        name: 'Yaprak Ciğer',
        price: 690,
        ingredients: 'Yaprak ciğer, un, tereyağı, sıvı yağ, baharat',
        kcal: '~780',
        allergens: glutenSut,
        image: 'yaprak-ciger',
      },
      {
        id: 'arnavut-ciger',
        name: 'Arnavut Ciğer',
        price: 690,
        ingredients: 'Dana ciğer, un, tereyağı, sıvı yağ, baharat',
        kcal: '~820',
        allergens: glutenSut,
        image: 'arnavut-ciger',
      },
      {
        id: 'kiremitte-kofte',
        name: 'Kiremitte Köfte',
        price: 750,
        ingredients: 'Köfte, közlenmiş domates, köy biberi, kapya, kaşar',
        kcal: '~860',
        allergens: glutenSut,
        image: 'kiremitte-kofte',
      },
      {
        id: 'kiremitte-tavuk',
        name: 'Kiremitte Tavuk',
        price: 575,
        ingredients: 'Tavuk, közlenmiş domates, köy biberi, kapya',
        kcal: '~740',
        allergens: glutenSut,
        image: 'kiremitte-tavuk',
      },
    ],
  },
  {
    id: 'miqqo-tava',
    name: 'Miqqo Tava',
    short: 'Miqqo Tava',
    items: [
      {
        id: 'miqqo-tava',
        name: 'Miqqo Tava',
        subtitle: 'Ciğer',
        price: 690,
        ingredients: 'Ciğer, tereyağı, sıvı yağ, kapya biber, köy biberi, soğan, baharat',
        kcal: '~900',
        allergens: glutenSut,
        image: 'miqqo-tava',
        framed: true,
        tags: ['imza'],
      },
    ],
  },
  {
    id: 'kiloluk',
    name: 'Avantajlı Kiloluk Menüler',
    short: 'Kiloluk',
    note: 'Yayık ayran hediyelidir.',
    items: [
      {
        id: 'izgara-kofte-kiloluk',
        name: 'Izgara Köfte',
        ingredients: 'Izgara köfte, yayık ayran hediyelidir',
        allergens: ['Gluten'],
        image: 'izgara-kofte-kiloluk',
        variants: [
          { label: '500 gr', price: 1000, note: '2 yayık ayran hediye', kcal: '~1500' },
          { label: '1 kg', price: 1650, note: '4 yayık ayran hediye', kcal: '~3000' },
        ],
      },
      {
        id: 'tavuk-kanat-kiloluk',
        name: 'Tavuk Kanat',
        ingredients: 'Tavuk kanat, yayık ayran hediyelidir',
        allergens: glutenSut,
        image: 'tavuk-kanat-kiloluk',
        variants: [
          { label: '500 gr', price: 950, note: '2 yayık ayran hediye', kcal: '~1250' },
          { label: '1 kg', price: 1500, note: '4 yayık ayran hediye', kcal: '~2500' },
        ],
      },
      {
        id: 'tavuk-sis-kiloluk',
        name: 'Tavuk Şiş',
        ingredients: 'Tavuk şiş, yayık ayran hediyelidir',
        allergens: glutenSut,
        image: 'tavuk-sis-kiloluk',
        variants: [
          { label: '500 gr', price: 750, note: '2 yayık ayran hediye', kcal: '~1000' },
          { label: '1 kg', price: 1200, note: '4 yayık ayran hediye', kcal: '~2000' },
        ],
      },
    ],
  },
  {
    id: 'tatlilar',
    name: 'Tatlılar',
    short: 'Tatlılar',
    items: [
      {
        id: 'kunefe',
        name: 'Künefe',
        price: 300,
        ingredients: 'Tel kadayıf, künefe peyniri, tereyağı, şerbet, Antep fıstığı',
        kcal: '~630',
        allergens: ['Gluten', 'Süt', 'Antep fıstığı'],
      },
      {
        id: 'kizarmis-dondurma',
        name: 'Kızarmış Dondurma',
        price: 300,
        ingredients: 'Panelenmiş dondurma, çikolata sos',
        kcal: '~430',
        allergens: ['Gluten', 'Süt', 'Yumurta'],
      },
      {
        id: 'katmer',
        name: 'Katmer',
        price: 350,
        ingredients: 'Katmer hamuru, kaymak, tereyağı, şeker, Antep fıstığı',
        kcal: '~780',
        allergens: ['Gluten', 'Süt', 'Antep fıstığı'],
      },
      {
        id: 'sufle',
        name: 'Sufle',
        price: 350,
        ingredients: 'Bitter çikolata, tereyağı, un, yumurta, şeker',
        kcal: '~520',
        allergens: ['Gluten', 'Süt', 'Yumurta'],
      },
      {
        id: 'firin-sutlac',
        name: 'Fırın Sütlaç',
        price: 200,
        ingredients: 'Süt, pirinç, şeker, nişasta',
        kcal: '~260',
        allergens: ['Süt'],
      },
      {
        id: 'porsiyon-baklava',
        name: 'Porsiyon Baklava',
        price: 350,
        ingredients: 'İnce yufka, tereyağı, şerbet, Antep fıstığı veya ceviz',
        kcal: '~420',
        allergens: ['Gluten', 'Süt', 'Sert kabuklu yemiş'],
      },
    ],
  },
  {
    id: 'icecekler',
    name: 'İçecekler',
    short: 'İçecekler',
    items: [
      { id: 'kola-fanta', name: 'Kola - Fanta', price: 90, description: 'Ürüne göre değişir.', kcal: '~80-150' },
      { id: 'sprite-cappy', name: 'Sprite - Cappy', price: 90, description: 'Ürüne göre değişir.', kcal: '~80-150' },
      {
        id: 'yayik-ayran',
        name: 'Yayık Ayran',
        price: 65,
        ingredients: 'Yoğurt, su, tuz',
        kcal: '~90',
        allergens: ['Süt'],
      },
      {
        id: 'kutu-ayran',
        name: 'Kutu Ayran',
        price: 75,
        ingredients: 'Yoğurt, su, tuz',
        kcal: '~65',
        allergens: ['Süt'],
      },
      {
        id: 'salgam-suyu',
        name: 'Şalgam Suyu',
        price: 75,
        ingredients: 'Şalgam, mor havuç, su, tuz, acı biber',
        kcal: '~15',
      },
      { id: 'turk-kahvesi', name: 'Türk Kahvesi', price: 120, ingredients: 'Türk kahvesi', kcal: '~7' },
      {
        id: 'nescafe',
        name: 'Nescafe',
        price: 120,
        ingredients: 'Kahve, su; isteğe bağlı süt ve şeker',
        kcal: '~5-60',
        allergens: ['Süt'],
      },
      {
        id: 'semaverde-cay',
        name: 'Semaverde Çay',
        subtitle: '2 kişilik',
        price: 300,
        ingredients: 'Çay',
        kcal: '~10-20',
      },
      { id: 'su', name: 'Su', subtitle: '0,5 lt', price: 35, ingredients: 'İçme suyu', kcal: '0' },
    ],
  },
];

export function findItem(id: string): MenuItem | undefined {
  for (const category of menu) {
    const item = category.items.find((i) => i.id === id);
    if (item) return item;
  }
  return undefined;
}

// Listelerde gösterilecek en düşük fiyat.
export function basePrice(item: MenuItem): number | undefined {
  if (item.price !== undefined) return item.price;
  return item.variants?.reduce((min, v) => Math.min(min, v.price), Infinity);
}

// Öne çıkan kartlarda tam porsiyon fiyatı gösterilir: varyant listesinin sonu
// (Eko / Porsiyon, Çocuk / Porsiyon, 500 gr / 1 kg sıralamasında porsiyon sonda).
export function portionPrice(item: MenuItem): number | undefined {
  return item.price ?? item.variants?.at(-1)?.price;
}
