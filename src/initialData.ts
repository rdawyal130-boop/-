import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  // حلويات
  {
    id: 'sweet-1',
    name: 'شوكولاتة جالاكسي بالتمر ميني',
    category: 'حلويات',
    price: 32000,
    retailPrice: 38000,
    unit: 'كرتونة (24 علبة)',
    stock: 50,
    code: 'SH-GLX-01',
    description: 'شوكولاتة حليب جالاكسي الفاخرة محشوة بالتمر الطبيعي، جودة عالية ومحبوبة جداً.'
  },
  {
    id: 'sweet-2',
    name: 'بسكويت دايجستف الشوفان الأصلي',
    category: 'حلويات',
    price: 18500,
    retailPrice: 22000,
    unit: 'كرتونة (12 باكيت)',
    stock: 75,
    code: 'SH-DIG-02',
    description: 'بسكويت دايجستف نخالة الشوفان المقرمش، مثالي للشاي والضيافة.'
  },
  {
    id: 'sweet-3',
    name: 'كيك اليمامة فانيليا وشوكولاتة',
    category: 'حلويات',
    price: 14000,
    retailPrice: 18000,
    unit: 'كرتونة (24 قطعة)',
    stock: 120,
    code: 'SH-YAM-03',
    description: 'كيك اليمامة الإسفنجي الطازج المحشو بكريمة الفانيليا اللذيذة.'
  },

  // ألبان
  {
    id: 'dairy-1',
    name: 'حليب كالم دير كامل الدسم 1 لتر',
    category: 'ألبان',
    price: 15000,
    retailPrice: 18000,
    unit: 'صندوق (12 علبة)',
    stock: 90,
    code: 'DY-MILK-01',
    description: 'حليب معقم طويل الأمد كامل الدسم غني بالكالسيوم والفيتامينات.'
  },
  {
    id: 'dairy-2',
    name: 'جبن مثلثات بوك الأصلي',
    category: 'ألبان',
    price: 24000,
    retailPrice: 28500,
    unit: 'كرتونة (40 علبة)',
    stock: 60,
    code: 'DY-PUCK-02',
    description: 'جبن كريمي سهل الدهن مثلثات بوك الشهير للأطفال والمدارس.'
  },
  {
    id: 'dairy-3',
    name: 'قشطة المائدة بوك 170 غرام',
    category: 'ألبان',
    price: 22000,
    retailPrice: 26000,
    unit: 'صندوق (24 علبة)',
    stock: 80,
    code: 'DY-CREAM-03',
    description: 'قشطة قيمر طبيعية وشهية مناسبة للحلويات والتروية اليومية.'
  },

  // أجراس
  {
    id: 'bell-1',
    name: 'مربى المشمش التركي الفاخر',
    category: 'أجراس',
    price: 28000,
    retailPrice: 34000,
    unit: 'صندوق (12 مرطبان)',
    stock: 35,
    code: 'BL-JAM-01',
    description: 'مربى مشمش محضر من قطع الفواكه الطازجة بجودة تركية عالية.'
  },
  {
    id: 'bell-2',
    name: 'طحينية الكسيح الممتازة',
    category: 'أجراس',
    price: 45000,
    retailPrice: 52000,
    unit: 'كرتونة (12 علبة)',
    stock: 25,
    code: 'BL-TAH-02',
    description: 'طحينة سمسم صافي 100% غنية ومثالية لتحضير المقبلات.'
  },

  // سكائر
  {
    id: 'cig-1',
    name: 'سكائر مارلبورو أحمر فليب موريس',
    category: 'سكائر',
    price: 245000,
    retailPrice: 260000,
    unit: 'صندوق (10 كروز)',
    stock: 15,
    code: 'CG-MAR-01',
    description: 'سجائر مارلبورو كلاسيك الأحمر الشهير بجودته العالية ونكهته الأصلية.'
  },
  {
    id: 'cig-2',
    name: 'سكائر وينستون كلاسيك بلو',
    category: 'سكائر',
    price: 165000,
    retailPrice: 180000,
    unit: 'صندوق (10 كروز)',
    stock: 20,
    code: 'CG-WIN-02',
    description: 'سجائر وينستون بلو الأصلية ذات الفلتر الفاخر والنكهة المتوازنة.'
  },

  // الغذائية
  {
    id: 'grocery-1',
    name: 'أرز بسمتي هندي درجة أولى حبة طويلة',
    category: 'الغذائية',
    price: 35000,
    retailPrice: 42000,
    unit: 'كيس (20 كغم)',
    stock: 100,
    code: 'GR-RICE-01',
    description: 'أرز بسمتي ناصع البياض ذو نكهة زكية وحبة طويلة ممتازة للعوائل والولائم.'
  },
  {
    id: 'grocery-2',
    name: 'زيت طبخ عافية ذرة نقي',
    category: 'الغذائية',
    price: 48000,
    retailPrice: 54000,
    unit: 'كرتونة (6 عبوات × 1.5 لتر)',
    stock: 45,
    code: 'GR-OIL-02',
    description: 'زيت ذرة نقي خفيف ومثالي للقلي والطهي الصحي وخالٍ من الكوليسترول.'
  },
  {
    id: 'grocery-3',
    name: 'معكرونة أنقرة الإيطالية',
    category: 'الغذائية',
    price: 11500,
    retailPrice: 15000,
    unit: 'كرتونة (20 كيس)',
    stock: 150,
    code: 'GR-PAST-03',
    description: 'معكرونة فاخرة محضرة من سميد القمح القاسي، لا تلتصق وسريعة الطهي.'
  },

  // لحوم
  {
    id: 'meat-1',
    name: 'صدر دجاج ساديا مجمد بدون عظم',
    category: 'لحوم',
    price: 64000,
    retailPrice: 72000,
    unit: 'كرتونة (10 أكياس × 1 كغم)',
    stock: 30,
    code: 'MT-SAD-01',
    description: 'صدور دجاج مجمدة من ساديا، طرية ونظيفة ومجهزة للطبخ المباشر.'
  },
  {
    id: 'meat-2',
    name: 'برجر بقري أمريكانا جامبو',
    category: 'لحوم',
    price: 38000,
    retailPrice: 45000,
    unit: 'كرتونة (12 علبة)',
    stock: 40,
    code: 'MT-AME-02',
    description: 'همبرغر بقري جامبو بهارات شرقية غني وممتاز للوجبات السريعة والسندويشات.'
  }
];

export const DEFAULT_CATEGORIES = [
  { id: 'all', name: 'الكل' },
  { id: 'حلويات', name: 'حلويات' },
  { id: 'ألبان', name: 'ألبان' },
  { id: 'أجراس', name: 'أجراس' },
  { id: 'سكائر', name: 'سكائر' },
  { id: 'الغذائية', name: 'الغذائية' },
  { id: 'لحوم', name: 'لحوم' }
];
