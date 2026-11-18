export const SITE_NAME = 'Zynox Gadgets';
export const SITE_TAGLINE = 'The Ultimate Gadget Destination';
export const SITE_DESCRIPTION = 'Zynox Gadgets – The premier authentic gadget & consumer tech destination in Bangladesh. Official smartphones, smartwatches, earbuds, laptops, chargers, and tech lifestyle accessories.';
export const HOTLINE_NUMBER = '+880 1700-ZYNOXG';
export const WHATSAPP_NUMBER = '8801700996633';
export const SUPPORT_EMAIL = 'support@zynoxgadgets.com';
export const STORE_ADDRESS = 'Zynox Tower, Level 4, Dhanmondi 27, Dhaka - 1209, Bangladesh';

export const BRAND_COLOR_MAP: Record<string, { brandColor: string; accentColor: string; textColor: string; badgeColor: string }> = {
  apple: { brandColor: '#1D1D1F', accentColor: '#424245', textColor: '#FFFFFF', badgeColor: '#F5F5F7' },
  samsung: { brandColor: '#1428A0', accentColor: '#2C58F4', textColor: '#FFFFFF', badgeColor: '#EBF0FF' },
  xiaomi: { brandColor: '#FF6900', accentColor: '#E05D00', textColor: '#FFFFFF', badgeColor: '#FFF3EB' },
  redmi: { brandColor: '#FF4A00', accentColor: '#E63E00', textColor: '#FFFFFF', badgeColor: '#FFF0EB' },
  realme: { brandColor: '#FFC915', accentColor: '#DDAA00', textColor: '#1F2937', badgeColor: '#FFFBEA' },
  oneplus: { brandColor: '#EB0028', accentColor: '#C40021', textColor: '#FFFFFF', badgeColor: '#FDE8EB' },
  google: { brandColor: '#4285F4', accentColor: '#3367D6', textColor: '#FFFFFF', badgeColor: '#ECF3FE' },
  huawei: { brandColor: '#CF0A2C', accentColor: '#A80824', textColor: '#FFFFFF', badgeColor: '#FAEBEE' },
  oppo: { brandColor: '#046A38', accentColor: '#03542C', textColor: '#FFFFFF', badgeColor: '#EBF5F0' },
  vivo: { brandColor: '#415FFF', accentColor: '#2848F0', textColor: '#FFFFFF', badgeColor: '#EEF1FF' },
  infinix: { brandColor: '#2EB774', accentColor: '#23945D', textColor: '#FFFFFF', badgeColor: '#EFFBF5' },
  tecno: { brandColor: '#0066FF', accentColor: '#0052CC', textColor: '#FFFFFF', badgeColor: '#E6F0FF' },
  walton: { brandColor: '#004899', accentColor: '#003366', textColor: '#FFFFFF', badgeColor: '#E6EDF5' },
  symphony: { brandColor: '#E31B23', accentColor: '#B8151B', textColor: '#FFFFFF', badgeColor: '#FCE8E9' },
  oraimo: { brandColor: '#00B050', accentColor: '#008C40', textColor: '#FFFFFF', badgeColor: '#E6F7EE' },
  anker: { brandColor: '#00A0E9', accentColor: '#0085C4', textColor: '#FFFFFF', badgeColor: '#E6F6FD' },
  baseus: { brandColor: '#F5A623', accentColor: '#D48812', textColor: '#1F2937', badgeColor: '#FEF6E9' },
  amazfit: { brandColor: '#FF4081', accentColor: '#E0356E', textColor: '#FFFFFF', badgeColor: '#FEECEF' },
  haylou: { brandColor: '#3498DB', accentColor: '#2980B9', textColor: '#FFFFFF', badgeColor: '#EBF5FB' },
  lenovo: { brandColor: '#E2231A', accentColor: '#C01A12', textColor: '#FFFFFF', badgeColor: '#FCE9E8' },
  hp: { brandColor: '#0096D6', accentColor: '#0077AB', textColor: '#FFFFFF', badgeColor: '#E6F5FB' },
  dell: { brandColor: '#007DB8', accentColor: '#006393', textColor: '#FFFFFF', badgeColor: '#E6F2F8' },
  asus: { brandColor: '#00539B', accentColor: '#003E75', textColor: '#FFFFFF', badgeColor: '#E6EEF5' },
  jbl: { brandColor: '#FF6600', accentColor: '#D95500', textColor: '#FFFFFF', badgeColor: '#FFF1E6' },
  sony: { brandColor: '#1A1A1A', accentColor: '#4A4A4A', textColor: '#FFFFFF', badgeColor: '#F4F4F4' },
};

export const POPULAR_BRANDS = [
  'Apple', 'Samsung', 'Xiaomi', 'Realme', 'OnePlus', 'Google',
  'Huawei', 'Oppo', 'Vivo', 'Infinix', 'Tecno', 'Walton',
  'Anker', 'Baseus', 'Amazfit', 'Haylou', 'Lenovo', 'HP', 'Dell', 'Asus', 'JBL', 'Sony'
];

export const CATEGORIES_LIST = [
  { name: 'Smartphones', nameBn: 'স্মার্টফোন', slug: 'smartphones', icon: 'Smartphone' },
  { name: 'Smart Watches', nameBn: 'স্মার্টওয়াচ', slug: 'smart-watches', icon: 'Watch' },
  { name: 'Earbuds & Audio', nameBn: 'ইয়ারবাড ও অডিও', slug: 'earbuds-headphones', icon: 'Headphones' },
  { name: 'Laptops', nameBn: 'ল্যাপটপ', slug: 'laptops', icon: 'Laptop' },
  { name: 'Tablets', nameBn: 'ট্যাবলেট', slug: 'tablets', icon: 'Tablet' },
  { name: 'Power Banks', nameBn: 'পাওয়ার ব্যাংক', slug: 'power-banks', icon: 'BatteryCharging' },
  { name: 'Chargers & Cables', nameBn: 'চার্জার ও ক্যাবল', slug: 'chargers-cables', icon: 'Zap' },
  { name: 'Accessories', nameBn: 'এক্সেসরিজ', slug: 'accessories', icon: 'ShieldCheck' },
  { name: 'Cameras', nameBn: 'ক্যামেরা', slug: 'cameras', icon: 'Camera' },
  { name: 'Gaming', nameBn: 'গেমিং', slug: 'gaming', icon: 'Gamepad2' },
];

export const DELIVERY_ZONES = {
  DHAKA: {
    name: 'Inside Dhaka',
    nameBn: 'ঢাকার ভিতরে',
    charge: 60,
    freeAbove: 2000,
    estimated: '24 - 48 Hours',
  },
  OUTSIDE_DHAKA: {
    name: 'Outside Dhaka',
    nameBn: 'ঢাকার বাইরে',
    charge: 120,
    freeAbove: 3000,
    estimated: '2 - 4 Days',
  },
};

export const BANGLADESH_DIVISIONS = [
  'Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Barisal', 'Sylhet', 'Rangpur', 'Mymensingh'
];
