export type ProductLocation = 'بان' | 'مخزن' | 'عرض' | '';

export interface ProductHistoryEntry {
  date: string;
  stock: number;
  price: number;
  action: string;
  user: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  priceCurrency?: 'USD' | 'IQD';
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: string;
  updatedBy?: string;
  color?: string;
  iconType?: 'fridge' | 'freezer' | 'stove' | 'water_cooler' | 'display_fridge' | 'display_freezer' | 'water_filter' | 'ac' | 'washing' | 'dishwasher' | 'washing_manual' | 'split' | 'cooler' | 'fan' | 'iron' | 'oven' | 'vacuum' | 'blender' | 'grinder' | 'juicer' | 'fryer' | 'sofa' | 'bedroom' | 'carpet_item' | 'default';
  customIconName?: string;
  imageUri?: string;
  location?: ProductLocation;
  description?: string;
  specs?: Record<string, string>;
  history?: ProductHistoryEntry[];
  lastAction?: string;
}

export interface DamagedItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  date: string;
  status: 'pending' | 'fixed' | 'replaced';
  sparePartImage?: string;
  notes?: string;
}

export interface SparePart {
  id: string;
  name: string;
  code: string;
  image: string;
  addedDate: string;
  notes?: string;
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'تەلاجەی سامسۆنگ 24 پێ',
    sku: 'REF-SAM-001',
    category: 'کارەبایی',
    stock: 12,
    minStock: 5,
    price: 850,
    priceCurrency: 'USD',
    status: 'In Stock',
    lastUpdated: '2024/04/28 | 10:30:15',
    updatedBy: 'مەریوان',
    iconType: 'fridge',
    imageUri: 'https://images.unsplash.com/photo-1571175432247-fe0626359eb3?q=80&w=1000&auto=format&fit=crop',
    location: 'بان',
    description: 'تەلاجەیەکی مۆدێرنی سامسۆنگ بە دیزاینێکی بێ وێنە و سیستەمی ساردکەرەوەی زیرەک. ئەم تەلاجەیە زۆر گونجاوە بۆ خێزانەکان.',
    specs: {
      'قەبارە': '24 پێ',
      'بەکارهێنانی کارەبا': 'A+++',
      'گەڕەنتی': '10 ساڵ',
      'ڕەنگ': 'زیوی'
    },
    history: [
      { date: '2024-04-20', stock: 15, price: 850, action: 'کڕینی نوێ', user: 'مەریوان' },
      { date: '2024-04-22', stock: 14, price: 850, action: 'فرۆشتن', user: 'ئاراس' },
      { date: '2024-04-25', stock: 12, price: 850, action: 'فرۆشتن', user: 'مەریوان' },
      { date: '2024-04-28', stock: 11, price: 850, action: 'فرۆشتن', user: 'ئاراس' },
      { date: '2024-04-30', stock: 10, price: 850, action: 'فرۆشتن', user: 'مەریوان' },
      { date: '2024-05-02', stock: 9, price: 850, action: 'فرۆشتن', user: 'ئاراس' },
    ]
  },
  {
    id: '2',
    name: 'موجەمیدەی بەکۆ 380 لتر',
    sku: 'FRZ-BEK-002',
    category: 'کارەبایی',
    stock: 8,
    minStock: 5,
    price: 450,
    priceCurrency: 'USD',
    status: 'In Stock',
    lastUpdated: '2024-04-29 | 11:20:05',
    updatedBy: 'مەریوان',
    iconType: 'freezer',
    imageUri: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop',
    location: 'مخزن',
    description: 'موجەمیدەی بەکۆ بە قەبارەیەکی گونجاو و هێزی زۆر بۆ بەستن. پارێزگاری لە خواردەمەنییەکان دەکات بۆ ماوەیەکی درێژ.',
    specs: {
      'لیتر': '380 لتر',
      'جۆری گاز': 'R600a',
      'گەڕەنتی': '5 ساڵ',
      'ڕەنگ': 'سپی'
    },
    history: [
      { date: '2024-04-15', stock: 10, price: 450, action: 'کڕینی نوێ', user: 'مەریوان' },
      { date: '2024-04-29', stock: 8, price: 450, action: 'فرۆشتن', user: 'مەریوان' },
      { date: '2024-05-01', stock: 7, price: 450, action: 'فرۆشتن', user: 'ئاراس' },
      { date: '2024-05-02', stock: 6, price: 450, action: 'فرۆشتن', user: 'مەریوان' },
    ]
  },
  {
    id: '3',
    name: 'تەباخی ئیتالی لۆفرا 5 چاو',
    sku: 'STV-LOF-003',
    category: 'کارەبایی',
    stock: 3,
    minStock: 5,
    price: 580,
    priceCurrency: 'USD',
    status: 'Low Stock',
    lastUpdated: '2024/04/27 | 09:15:30',
    updatedBy: 'ئاراس',
    iconType: 'stove',
    imageUri: 'https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?q=80&w=1000&auto=format&fit=crop',
    location: 'عرض',
    description: 'تەباخێکی ئیتالی کوالێتی بەرز بە 5 چاوی جیاواز. دیزاینێکی کلاسیک و جوان بۆ مەتبەخەکەت.',
    specs: {
      'چاو': '5 چاو',
      'جۆر': 'گاز',
      'گەڕەنتی': '2 ساڵ',
      'ڕەنگ': 'ستیل'
    }
  },
  {
    id: '4',
    name: 'سپلیت گری 2 تەن ئیپا',
    sku: 'AC-GREE-004',
    category: 'کارەبایی',
    stock: 0,
    minStock: 5,
    price: 620,
    priceCurrency: 'USD',
    status: 'Out of Stock',
    lastUpdated: '2024/04/25 | 16:45:12',
    updatedBy: 'مەریوان',
    iconType: 'ac',
    imageUri: 'https://images.unsplash.com/photo-1631548171120-d3a24107147b?q=80&w=1000&auto=format&fit=crop',
    location: 'مخزن',
    description: 'سپلیت گری بە هێزی 2 تەن، زۆر گونجاوە بۆ ژوورە گەورەکان و هۆڵەکان. زۆر کەم کارەبا بەکاردەهێنێت.',
    specs: {
      'تەن': '2 تەن',
      'جۆر': 'ئینڤێرتەر',
      'گەڕەنتی': '3 ساڵ',
      'ڕەنگ': 'سپی'
    }
  },
  {
    id: '5',
    name: 'قەنەفەی مۆدێرن 7 نەفەر',
    sku: 'FUR-SOF-005',
    category: 'موبلیات',
    stock: 2,
    minStock: 1,
    price: 1200,
    priceCurrency: 'USD',
    status: 'In Stock',
    lastUpdated: '2024/04/30 | 18:10:00',
    updatedBy: 'ئاراس',
    iconType: 'sofa',
    imageUri: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1000&auto=format&fit=crop',
    location: 'بان',
    description: 'قەنەفەی مۆدێرن و ئاسوودە بۆ دانیشتن. بە قوماشێکی کوالێتی بەرز دروستکراوە.',
    specs: {
      'نەفەر': '7 نەفەر',
      'قوماش': 'تورکی',
      'ڕەنگ': 'ڕەساسی'
    }
  },
  {
    id: '6',
    name: 'فەرشی تورکی 3*4',
    sku: 'CPT-TUR-006',
    category: 'فەرش',
    stock: 5,
    minStock: 2,
    price: 250,
    priceCurrency: 'USD',
    status: 'In Stock',
    lastUpdated: '2024/05/01 | 12:00:00',
    updatedBy: 'مەریوان',
    iconType: 'carpet_item',
    imageUri: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=1000&auto=format&fit=crop',
    location: 'عرض',
    description: 'فەرشی تورکی بە نەخشێکی جوان و کوالێتی بەرز. قەبارەکەی زۆر گونجاوە بۆ ژوورەکان.',
    specs: {
      'قەبارە': '3*4',
      'جۆر': 'تورکی',
      'ڕەنگ': 'ئاڵتونی'
    }
  },
];
