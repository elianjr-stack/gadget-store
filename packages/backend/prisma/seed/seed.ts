import { PrismaClient, UserRole, StockStatus, BannerPosition, CouponType, DeliveryZone } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Admin User ──
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@12345', 12);
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@zynoxgadgets.com' },
    update: {},
    create: {
      name: process.env.ADMIN_NAME || 'Zynox Admin',
      email: process.env.ADMIN_EMAIL || 'admin@zynoxgadgets.com',
      phone: '01700996633',
      password: adminPassword,
      role: UserRole.OWNER,
      emailVerified: true,
      phoneVerified: true,
    },
  });
  console.log('✅ Admin user created');

  // ── Brands with Dynamic Color System ──
  const brandsData = [
    { name: 'Apple', slug: 'apple', logo: 'https://res.cloudinary.com/demo/image/upload/brands/apple.svg', description: 'Minimalist innovation and premium ecosystem', website: 'https://apple.com', brandColor: '#1D1D1F', accentColor: '#424245', textColor: '#FFFFFF', badgeColor: '#F5F5F7', sortOrder: 1 },
    { name: 'Samsung', slug: 'samsung', logo: 'https://res.cloudinary.com/demo/image/upload/brands/samsung.svg', description: 'Galaxy AI smartphones, smartwatches and tabs', website: 'https://samsung.com', brandColor: '#1428A0', accentColor: '#2C58F4', textColor: '#FFFFFF', badgeColor: '#EBF0FF', sortOrder: 2 },
    { name: 'Xiaomi', slug: 'xiaomi', logo: 'https://res.cloudinary.com/demo/image/upload/brands/xiaomi.svg', description: 'Smart living and high-spec affordable tech', website: 'https://mi.com', brandColor: '#FF6900', accentColor: '#E05D00', textColor: '#FFFFFF', badgeColor: '#FFF3EB', sortOrder: 3 },
    { name: 'Redmi', slug: 'redmi', logo: 'https://res.cloudinary.com/demo/image/upload/brands/redmi.svg', description: 'Performance and power for everyday champions', website: 'https://mi.com/redmi', brandColor: '#FF4A00', accentColor: '#E63E00', textColor: '#FFFFFF', badgeColor: '#FFF0EB', sortOrder: 4 },
    { name: 'Realme', slug: 'realme', logo: 'https://res.cloudinary.com/demo/image/upload/brands/realme.svg', description: 'Dare to Leap - trendsetting smart devices', website: 'https://realme.com', brandColor: '#FFC915', accentColor: '#DDAA00', textColor: '#1F2937', badgeColor: '#FFFBEA', sortOrder: 5 },
    { name: 'OnePlus', slug: 'oneplus', logo: 'https://res.cloudinary.com/demo/image/upload/brands/oneplus.svg', description: 'Never Settle - fluid flagships and fast charging', website: 'https://oneplus.com', brandColor: '#EB0028', accentColor: '#C40021', textColor: '#FFFFFF', badgeColor: '#FDE8EB', sortOrder: 6 },
    { name: 'Google', slug: 'google', logo: 'https://res.cloudinary.com/demo/image/upload/brands/google.svg', description: 'Google Pixel AI camera phones and gadgets', website: 'https://store.google.com', brandColor: '#4285F4', accentColor: '#3367D6', textColor: '#FFFFFF', badgeColor: '#ECF3FE', sortOrder: 7 },
    { name: 'Huawei', slug: 'huawei', logo: 'https://res.cloudinary.com/demo/image/upload/brands/huawei.svg', description: 'Pioneering telecommunications and wearable technology', website: 'https://huawei.com', brandColor: '#CF0A2C', accentColor: '#A80824', textColor: '#FFFFFF', badgeColor: '#FAEBEE', sortOrder: 8 },
    { name: 'Oppo', slug: 'oppo', logo: 'https://res.cloudinary.com/demo/image/upload/brands/oppo.svg', description: 'Inspiration Ahead - camera innovation and VOOC flash charge', website: 'https://oppo.com', brandColor: '#046A38', accentColor: '#03542C', textColor: '#FFFFFF', badgeColor: '#EBF5F0', sortOrder: 9 },
    { name: 'Vivo', slug: 'vivo', logo: 'https://res.cloudinary.com/demo/image/upload/brands/vivo.svg', description: 'ZEISS imaging portraits and futuristic slim design', website: 'https://vivo.com', brandColor: '#415FFF', accentColor: '#2848F0', textColor: '#FFFFFF', badgeColor: '#EEF1FF', sortOrder: 10 },
    { name: 'Infinix', slug: 'infinix', logo: 'https://res.cloudinary.com/demo/image/upload/brands/infinix.svg', description: 'Empowering future tech for young creators', website: 'https://infinixmobility.com', brandColor: '#2EB774', accentColor: '#23945D', textColor: '#FFFFFF', badgeColor: '#EFFBF5', sortOrder: 11 },
    { name: 'Tecno', slug: 'tecno', logo: 'https://res.cloudinary.com/demo/image/upload/brands/tecno.svg', description: 'Stop At Nothing - stylish smartphones and accessories', website: 'https://tecno-mobile.com', brandColor: '#0066FF', accentColor: '#0052CC', textColor: '#FFFFFF', badgeColor: '#E6F0FF', sortOrder: 12 },
    { name: 'Walton', slug: 'walton', logo: 'https://res.cloudinary.com/demo/image/upload/brands/walton.svg', description: 'Proudly Bangladeshi electronics and gadget giant', website: 'https://waltonbd.com', brandColor: '#004899', accentColor: '#003366', textColor: '#FFFFFF', badgeColor: '#E6EDF5', sortOrder: 13 },
    { name: 'Symphony', slug: 'symphony', logo: 'https://res.cloudinary.com/demo/image/upload/brands/symphony.svg', description: 'Reliable everyday mobile brand of Bangladesh', website: 'https://symphony.com.bd', brandColor: '#E31B23', accentColor: '#B8151B', textColor: '#FFFFFF', badgeColor: '#FCE8E9', sortOrder: 14 },
    { name: 'Oraimo', slug: 'oraimo', logo: 'https://res.cloudinary.com/demo/image/upload/brands/oraimo.svg', description: 'Keep Exploring - Smart accessories, TWS, and heavy-duty power', website: 'https://oraimo.com', brandColor: '#00B050', accentColor: '#008C40', textColor: '#FFFFFF', badgeColor: '#E6F7EE', sortOrder: 15 },
    { name: 'Anker', slug: 'anker', logo: 'https://res.cloudinary.com/demo/image/upload/brands/anker.svg', description: 'Charge Fast, Live More - PowerIQ, GaN & Soundcore audio', website: 'https://anker.com', brandColor: '#00A0E9', accentColor: '#0085C4', textColor: '#FFFFFF', badgeColor: '#E6F6FD', sortOrder: 16 },
    { name: 'Baseus', slug: 'baseus', logo: 'https://res.cloudinary.com/demo/image/upload/brands/baseus.svg', description: 'Base on User - stylish GaN chargers, cables, and desk setups', website: 'https://baseus.com', brandColor: '#F5A623', accentColor: '#D48812', textColor: '#1F2937', badgeColor: '#FEF6E9', sortOrder: 17 },
    { name: 'Amazfit', slug: 'amazfit', logo: 'https://res.cloudinary.com/demo/image/upload/brands/amazfit.svg', description: 'Up Your Game - Zepp OS fitness and military-grade smartwatches', website: 'https://amazfit.com', brandColor: '#FF4081', accentColor: '#E0356E', textColor: '#FFFFFF', badgeColor: '#FEECEF', sortOrder: 18 },
    { name: 'Haylou', slug: 'haylou', logo: 'https://res.cloudinary.com/demo/image/upload/brands/haylou.svg', description: 'Wireless lifestyle smartwatches and ANC earbuds', website: 'https://haylou.com', brandColor: '#3498DB', accentColor: '#2980B9', textColor: '#FFFFFF', badgeColor: '#EBF5FB', sortOrder: 19 },
    { name: 'Lenovo', slug: 'lenovo', logo: 'https://res.cloudinary.com/demo/image/upload/brands/lenovo.svg', description: 'ThinkPad, Legion gaming, and Legion Go handhelds', website: 'https://lenovo.com', brandColor: '#E2231A', accentColor: '#C01A12', textColor: '#FFFFFF', badgeColor: '#FCE9E8', sortOrder: 20 },
    { name: 'HP', slug: 'hp', logo: 'https://res.cloudinary.com/demo/image/upload/brands/hp.svg', description: 'Spectre, Envy, and Omen laptops and accessories', website: 'https://hp.com', brandColor: '#0096D6', accentColor: '#0077AB', textColor: '#FFFFFF', badgeColor: '#E6F5FB', sortOrder: 21 },
    { name: 'Dell', slug: 'dell', logo: 'https://res.cloudinary.com/demo/image/upload/brands/dell.svg', description: 'Dell XPS, Alienware and Inspiron series', website: 'https://dell.com', brandColor: '#007DB8', accentColor: '#006393', textColor: '#FFFFFF', badgeColor: '#E6F2F8', sortOrder: 22 },
    { name: 'Asus', slug: 'asus', logo: 'https://res.cloudinary.com/demo/image/upload/brands/asus.svg', description: 'ROG Strix, TUF gaming and ZenBook OLED laptops', website: 'https://asus.com', brandColor: '#00539B', accentColor: '#003E75', textColor: '#FFFFFF', badgeColor: '#E6EEF5', sortOrder: 23 },
    { name: 'JBL', slug: 'jbl', logo: 'https://res.cloudinary.com/demo/image/upload/brands/jbl.svg', description: 'Pro sound Bluetooth speakers, party speakers & headphones', website: 'https://jbl.com', brandColor: '#FF6600', accentColor: '#D95500', textColor: '#FFFFFF', badgeColor: '#FFF1E6', sortOrder: 24 },
    { name: 'Sony', slug: 'sony', logo: 'https://res.cloudinary.com/demo/image/upload/brands/sony.svg', description: 'WH-1000XM headphones, Alpha cameras & PlayStation', website: 'https://sony.com', brandColor: '#1A1A1A', accentColor: '#4A4A4A', textColor: '#FFFFFF', badgeColor: '#F4F4F4', sortOrder: 25 },
  ];

  const brands: Record<string, string> = {};
  for (const b of brandsData) {
    const brand = await prisma.brand.upsert({ where: { slug: b.slug }, update: {}, create: { ...b, isActive: true } });
    brands[b.slug] = brand.id;
  }
  console.log(`✅ ${brandsData.length} brands created`);

  // ── Categories ──
  const categoriesData = [
    { name: 'Smartphones', nameBn: 'স্মার্টফোন', slug: 'smartphones', icon: '📱', sortOrder: 1 },
    { name: 'Smart Watches', nameBn: 'স্মার্টওয়াচ', slug: 'smart-watches', icon: '⌚', sortOrder: 2 },
    { name: 'Earbuds & Headphones', nameBn: 'ইয়ারবাড ও হেডফোন', slug: 'earbuds-headphones', icon: '🎧', sortOrder: 3 },
    { name: 'Laptops', nameBn: 'ল্যাপটপ', slug: 'laptops', icon: '💻', sortOrder: 4 },
    { name: 'Tablets', nameBn: 'ট্যাবলেট', slug: 'tablets', icon: '📲', sortOrder: 5 },
    { name: 'Power Banks', nameBn: 'পাওয়ার ব্যাংক', slug: 'power-banks', icon: '🔋', sortOrder: 6 },
    { name: 'Chargers & Cables', nameBn: 'চার্জার ও ক্যাবল', slug: 'chargers-cables', icon: '🔌', sortOrder: 7 },
    { name: 'Accessories', nameBn: 'আনুষাঙ্গিক', slug: 'accessories', icon: '🎒', sortOrder: 8 },
    { name: 'Cameras', nameBn: 'ক্যামেরা', slug: 'cameras', icon: '📷', sortOrder: 9 },
    { name: 'Gaming', nameBn: 'গেমিং', slug: 'gaming', icon: '🎮', sortOrder: 10 },
  ];

  const categories: Record<string, string> = {};
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: { ...c, isActive: true } });
    categories[c.slug] = cat.id;
  }
  console.log(`✅ ${categoriesData.length} categories created`);

  // ── Sample Products ──
  const productsData = [
    {
      name: 'iPhone 15 Pro Max',
      nameBn: 'আইফোন ১৫ প্রো ম্যাক্স',
      slug: 'iphone-15-pro-max',
      sku: 'APL-IP15PM-256',
      brandSlug: 'apple',
      categorySlug: 'smartphones',
      price: 185000,
      discountPrice: 178000,
      stockQuantity: 25,
      shortDescription: 'The most powerful iPhone yet with A17 Pro chip, titanium design, and Action button.',
      warrantyMonths: 12,
      emiAvailable: true,
      emiMonths: [3, 6, 12],
      isFeatured: true,
      isNewArrival: true,
      tags: ['iphone', 'apple', 'flagship', '5g'],
      images: [
        { url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800', alt: 'iPhone 15 Pro Max Black Titanium', isMain: true },
        { url: 'https://images.unsplash.com/photo-1691892548011-d6e2f76c92a3?w=800', alt: 'iPhone 15 Pro Max Side View', isMain: false },
      ],
      variants: [
        { type: 'STORAGE', name: '256GB', value: '256gb', price: 178000, stock: 10, isDefault: true },
        { type: 'STORAGE', name: '512GB', value: '512gb', price: 198000, stock: 8 },
        { type: 'STORAGE', name: '1TB', value: '1tb', price: 218000, stock: 5 },
        { type: 'REGION', name: 'Official BD', value: 'official-bd', stock: 15, isDefault: true },
        { type: 'REGION', name: 'International', value: 'international', stock: 10 },
      ],
      specifications: [
        { group: 'Display', name: 'Screen Size', value: '6.7 inches Super Retina XDR', sortOrder: 1 },
        { group: 'Display', name: 'Resolution', value: '2796 x 1290 pixels', sortOrder: 2 },
        { group: 'Display', name: 'Technology', value: 'LTPO Super Retina XDR OLED', sortOrder: 3 },
        { group: 'Processor', name: 'Chipset', value: 'Apple A17 Pro (3nm)', sortOrder: 4 },
        { group: 'Processor', name: 'CPU', value: 'Hexa-core', sortOrder: 5 },
        { group: 'Processor', name: 'GPU', value: 'Apple GPU (6-core)', sortOrder: 6 },
        { group: 'Memory', name: 'RAM', value: '8 GB', sortOrder: 7 },
        { group: 'Memory', name: 'Storage', value: '256GB / 512GB / 1TB', sortOrder: 8 },
        { group: 'Camera', name: 'Main Camera', value: '48 MP + 12 MP + 12 MP', sortOrder: 9 },
        { group: 'Camera', name: 'Front Camera', value: '12 MP TrueDepth', sortOrder: 10 },
        { group: 'Battery', name: 'Capacity', value: '4422 mAh', sortOrder: 11 },
        { group: 'Battery', name: 'Charging', value: '27W wired, 15W MagSafe', sortOrder: 12 },
        { group: 'Connectivity', name: '5G', value: 'Yes', sortOrder: 13 },
        { group: 'Connectivity', name: 'Wi-Fi', value: 'Wi-Fi 6E', sortOrder: 14 },
        { group: 'Build', name: 'Body Material', value: 'Titanium frame, textured matte glass back', sortOrder: 15 },
        { group: 'OS', name: 'Operating System', value: 'iOS 17', sortOrder: 16 },
      ],
    },
    {
      name: 'Samsung Galaxy S24 Ultra',
      nameBn: 'স্যামসাং গ্যালাক্সি এস২৪ আল্ট্রা',
      slug: 'samsung-galaxy-s24-ultra',
      sku: 'SAM-S24U-256',
      brandSlug: 'samsung',
      categorySlug: 'smartphones',
      price: 165000,
      discountPrice: 158000,
      stockQuantity: 30,
      shortDescription: 'The Galaxy S24 Ultra with built-in S Pen, 200MP camera and Snapdragon 8 Gen 3.',
      warrantyMonths: 12,
      emiAvailable: true,
      emiMonths: [3, 6, 12],
      isFeatured: true,
      isBestSeller: true,
      tags: ['samsung', 'galaxy', 's24', 'flagship', 's-pen'],
      images: [
        { url: 'https://images.unsplash.com/photo-1707930524337-408abc9f8fd0?w=800', alt: 'Samsung Galaxy S24 Ultra', isMain: true },
      ],
      variants: [
        { type: 'STORAGE', name: '256GB', value: '256gb', price: 158000, stock: 15, isDefault: true },
        { type: 'STORAGE', name: '512GB', value: '512gb', price: 178000, stock: 10 },
        { type: 'REGION', name: 'Official BD', value: 'official-bd', stock: 20, isDefault: true },
        { type: 'REGION', name: 'International', value: 'international', stock: 10 },
      ],
      specifications: [
        { group: 'Display', name: 'Screen Size', value: '6.8 inches Dynamic AMOLED 2X', sortOrder: 1 },
        { group: 'Display', name: 'Resolution', value: '3088 x 1440 pixels QHD+', sortOrder: 2 },
        { group: 'Processor', name: 'Chipset', value: 'Snapdragon 8 Gen 3 (4nm)', sortOrder: 3 },
        { group: 'Memory', name: 'RAM', value: '12 GB', sortOrder: 4 },
        { group: 'Camera', name: 'Main Camera', value: '200 MP + 50 MP + 12 MP + 10 MP', sortOrder: 5 },
        { group: 'Battery', name: 'Capacity', value: '5000 mAh', sortOrder: 6 },
        { group: 'Battery', name: 'Charging', value: '45W wired, 15W wireless', sortOrder: 7 },
        { group: 'OS', name: 'Operating System', value: 'Android 14, One UI 6.1', sortOrder: 8 },
      ],
    },
    {
      name: 'Xiaomi 14 Ultra',
      nameBn: 'শাওমি ১৪ আল্ট্রা',
      slug: 'xiaomi-14-ultra',
      sku: 'XIA-14U-512',
      brandSlug: 'xiaomi',
      categorySlug: 'smartphones',
      price: 135000,
      discountPrice: 128000,
      stockQuantity: 20,
      shortDescription: 'Pro-grade Leica cameras with 1-inch variable aperture, Snapdragon 8 Gen 3.',
      warrantyMonths: 12,
      emiAvailable: true,
      emiMonths: [3, 6, 12],
      isFeatured: true,
      isNewArrival: true,
      tags: ['xiaomi', 'leica', 'flagship', 'photography'],
      images: [
        { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800', alt: 'Xiaomi 14 Ultra', isMain: true },
      ],
      variants: [
        { type: 'STORAGE', name: '512GB', value: '512gb', price: 128000, stock: 20, isDefault: true },
        { type: 'REGION', name: 'International', value: 'international', stock: 20, isDefault: true },
      ],
      specifications: [
        { group: 'Display', name: 'Screen Size', value: '6.73 inches LTPO OLED', sortOrder: 1 },
        { group: 'Processor', name: 'Chipset', value: 'Snapdragon 8 Gen 3', sortOrder: 2 },
        { group: 'Memory', name: 'RAM', value: '16 GB', sortOrder: 3 },
        { group: 'Camera', name: 'Main Camera', value: '50 MP (1-inch) + 50 MP + 50 MP + 50 MP Leica', sortOrder: 4 },
        { group: 'Battery', name: 'Capacity', value: '5300 mAh', sortOrder: 5 },
        { group: 'Battery', name: 'Charging', value: '90W wired, 80W wireless', sortOrder: 6 },
      ],
    },
    {
      name: 'Apple Watch Series 9',
      nameBn: 'অ্যাপল ওয়াচ সিরিজ ৯',
      slug: 'apple-watch-series-9',
      sku: 'APL-AWS9-45MM',
      brandSlug: 'apple',
      categorySlug: 'smart-watches',
      price: 55000,
      discountPrice: 52000,
      stockQuantity: 40,
      shortDescription: 'Smarter. Brighter. Mightier. Apple Watch Series 9 with S9 chip.',
      warrantyMonths: 12,
      emiAvailable: true,
      emiMonths: [3, 6],
      isFeatured: true,
      isBestSeller: true,
      tags: ['apple watch', 'smartwatch', 'fitness', 'health'],
      images: [
        { url: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=800', alt: 'Apple Watch Series 9', isMain: true },
      ],
      variants: [
        { type: 'SIZE', name: '41mm', value: '41mm', price: 48000, stock: 20 },
        { type: 'SIZE', name: '45mm', value: '45mm', price: 52000, stock: 20, isDefault: true },
        { type: 'COLOR', name: 'Midnight', value: 'midnight', stock: 15, isDefault: true },
        { type: 'COLOR', name: 'Starlight', value: 'starlight', stock: 12 },
        { type: 'COLOR', name: 'PRODUCT RED', value: 'red', stock: 8 },
      ],
      specifications: [
        { group: 'Display', name: 'Size', value: '41mm or 45mm Always-On Retina LTPO OLED', sortOrder: 1 },
        { group: 'Processor', name: 'Chip', value: 'Apple S9 SiP with 64-bit dual-core processor', sortOrder: 2 },
        { group: 'Health', name: 'Sensors', value: 'Optical heart sensor, Blood oxygen, ECG, Temperature', sortOrder: 3 },
        { group: 'Battery', name: 'Life', value: 'Up to 18 hours', sortOrder: 4 },
        { group: 'Connectivity', name: 'Features', value: 'GPS, Wi-Fi, Bluetooth 5.3, NFC', sortOrder: 5 },
        { group: 'Build', name: 'Water Resistance', value: '50 metres WR', sortOrder: 6 },
      ],
    },
    {
      name: 'Samsung Galaxy Watch 6 Classic',
      nameBn: 'স্যামসাং গ্যালাক্সি ওয়াচ ৬ ক্লাসিক',
      slug: 'samsung-galaxy-watch-6-classic-47mm',
      sku: 'SAM-GW6C-47',
      brandSlug: 'samsung',
      categorySlug: 'smart-watches',
      price: 45000,
      discountPrice: 42000,
      stockQuantity: 35,
      shortDescription: 'Classic rotating bezel smartwatch with comprehensive health tracking.',
      warrantyMonths: 12,
      isFeatured: false,
      isBestSeller: true,
      tags: ['samsung', 'smartwatch', 'galaxy watch'],
      images: [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', alt: 'Samsung Galaxy Watch 6 Classic', isMain: true }],
      variants: [
        { type: 'SIZE', name: '43mm', value: '43mm', price: 38000, stock: 18 },
        { type: 'SIZE', name: '47mm', value: '47mm', price: 42000, stock: 17, isDefault: true },
      ],
      specifications: [
        { group: 'Display', name: 'Size', value: '1.5" Super AMOLED', sortOrder: 1 },
        { group: 'Processor', name: 'Chip', value: 'Exynos W930 Dual-Core 1.4GHz', sortOrder: 2 },
        { group: 'Health', name: 'Sensors', value: 'Heart rate, Blood oxygen, ECG, Body composition', sortOrder: 3 },
        { group: 'Battery', name: 'Life', value: 'Up to 40 hours', sortOrder: 4 },
      ],
    },
    {
      name: 'AirPods Pro (2nd Generation)',
      nameBn: 'এয়ারপডস প্রো (২য় প্রজন্ম)',
      slug: 'airpods-pro-2nd-generation',
      sku: 'APL-APP2-USB',
      brandSlug: 'apple',
      categorySlug: 'earbuds-headphones',
      price: 32000,
      discountPrice: 29500,
      stockQuantity: 60,
      shortDescription: 'Up to 2x more Active Noise Cancellation. Adaptive Audio for full immersion.',
      warrantyMonths: 12,
      emiAvailable: false,
      isFeatured: true,
      isBestSeller: true,
      tags: ['airpods', 'anc', 'wireless', 'apple'],
      images: [{ url: 'https://images.unsplash.com/photo-1603351154351-5e2d0600bb77?w=800', alt: 'AirPods Pro 2nd Gen', isMain: true }],
      variants: [
        { type: 'REGION', name: 'Official BD', value: 'official-bd', stock: 35, isDefault: true },
        { type: 'REGION', name: 'International', value: 'international', stock: 25 },
      ],
      specifications: [
        { group: 'Audio', name: 'Active Noise Cancellation', value: 'Yes, up to 2x stronger', sortOrder: 1 },
        { group: 'Audio', name: 'Driver', value: 'Apple H2 chip', sortOrder: 2 },
        { group: 'Battery', name: 'Earbuds Life', value: 'Up to 6 hours (ANC on)', sortOrder: 3 },
        { group: 'Battery', name: 'Total Life', value: 'Up to 30 hours with case', sortOrder: 4 },
        { group: 'Connectivity', name: 'Bluetooth', value: '5.3', sortOrder: 5 },
        { group: 'Features', name: 'Water Resistance', value: 'IPX4', sortOrder: 6 },
      ],
    },
    {
      name: 'Anker 737 Power Bank (PowerCore 26K)',
      nameBn: 'অ্যাঙ্কার ৭৩৭ পাওয়ার ব্যাংক',
      slug: 'anker-737-powercore-26k',
      sku: 'ANK-737-26K',
      brandSlug: 'anker',
      categorySlug: 'power-banks',
      price: 8500,
      discountPrice: 7800,
      stockQuantity: 100,
      shortDescription: '140W Output, 26,800mAh capacity. Fast charging for laptops and phones.',
      warrantyMonths: 18,
      isFlashDeal: true,
      isBestSeller: true,
      tags: ['power bank', 'anker', 'fast charging', '140w'],
      images: [{ url: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800', alt: 'Anker 737 Power Bank', isMain: true }],
      variants: [],
      specifications: [
        { group: 'Power', name: 'Capacity', value: '26,800 mAh', sortOrder: 1 },
        { group: 'Power', name: 'Max Output', value: '140W', sortOrder: 2 },
        { group: 'Power', name: 'Ports', value: '2x USB-C, 1x USB-A', sortOrder: 3 },
        { group: 'Features', name: 'Display', value: 'LED display with charge status', sortOrder: 4 },
      ],
    },
    {
      name: 'Realme GT 6',
      nameBn: 'রিয়েলমি জিটি ৬',
      slug: 'realme-gt-6',
      sku: 'REL-GT6-256',
      brandSlug: 'realme',
      categorySlug: 'smartphones',
      price: 65000,
      discountPrice: 62000,
      stockQuantity: 45,
      shortDescription: 'Snapdragon 8s Gen 3, 120W charging, premium gaming performance.',
      warrantyMonths: 12,
      emiAvailable: true,
      emiMonths: [3, 6],
      isNewArrival: true,
      tags: ['realme', 'gaming', 'snapdragon', 'fast charging'],
      images: [{ url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800', alt: 'Realme GT 6', isMain: true }],
      variants: [
        { type: 'STORAGE', name: '256GB', value: '256gb', price: 62000, stock: 25, isDefault: true },
        { type: 'STORAGE', name: '512GB', value: '512gb', price: 70000, stock: 20 },
      ],
      specifications: [
        { group: 'Processor', name: 'Chipset', value: 'Snapdragon 8s Gen 3 (4nm)', sortOrder: 1 },
        { group: 'Memory', name: 'RAM', value: '12 GB', sortOrder: 2 },
        { group: 'Display', name: 'Screen', value: '6.78 inches AMOLED 144Hz', sortOrder: 3 },
        { group: 'Battery', name: 'Capacity', value: '5500 mAh', sortOrder: 4 },
        { group: 'Battery', name: 'Charging', value: '120W SuperVOOC', sortOrder: 5 },
      ],
    },
    {
      name: 'MacBook Air M3',
      nameBn: 'ম্যাকবুক এয়ার এম৩',
      slug: 'macbook-air-m3-13-inch',
      sku: 'APL-MBA-M3-256',
      brandSlug: 'apple',
      categorySlug: 'laptops',
      price: 145000,
      discountPrice: 138000,
      stockQuantity: 15,
      shortDescription: 'Supercharged by M3 chip. Up to 18 hours of battery. Fanless design.',
      warrantyMonths: 12,
      emiAvailable: true,
      emiMonths: [6, 12, 18],
      isFeatured: true,
      isBestSeller: true,
      tags: ['macbook', 'apple', 'laptop', 'm3', 'ultrabook'],
      images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', alt: 'MacBook Air M3', isMain: true }],
      variants: [
        { type: 'STORAGE', name: '256GB SSD', value: '256gb', price: 138000, stock: 8, isDefault: true },
        { type: 'STORAGE', name: '512GB SSD', value: '512gb', price: 158000, stock: 7 },
        { type: 'COLOR', name: 'Midnight', value: 'midnight', stock: 8, isDefault: true },
        { type: 'COLOR', name: 'Starlight', value: 'starlight', stock: 7 },
      ],
      specifications: [
        { group: 'Processor', name: 'Chip', value: 'Apple M3 with 8-core CPU', sortOrder: 1 },
        { group: 'Memory', name: 'Unified Memory', value: '8GB or 16GB', sortOrder: 2 },
        { group: 'Storage', name: 'SSD', value: '256GB to 2TB', sortOrder: 3 },
        { group: 'Display', name: 'Screen', value: '13.6" Liquid Retina, 2560x1664', sortOrder: 4 },
        { group: 'Battery', name: 'Life', value: 'Up to 18 hours', sortOrder: 5 },
        { group: 'Connectivity', name: 'Ports', value: '2x USB-C (Thunderbolt), MagSafe 3', sortOrder: 6 },
        { group: 'Build', name: 'Weight', value: '1.24 kg', sortOrder: 7 },
      ],
    },
    {
      name: 'Baseus 65W GaN Charger',
      nameBn: 'বেসাস ৬৫ওয়াট গ্যান চার্জার',
      slug: 'baseus-65w-gan-charger',
      sku: 'BAS-GAN65-3PORT',
      brandSlug: 'baseus',
      categorySlug: 'chargers-cables',
      price: 2800,
      discountPrice: 2500,
      stockQuantity: 200,
      shortDescription: '3-port GaN fast charger with 65W output for laptop, phone and tablet simultaneously.',
      warrantyMonths: 12,
      isFlashDeal: true,
      isBestSeller: true,
      tags: ['charger', 'gan', 'fast charging', 'baseus', '65w'],
      images: [{ url: 'https://images.unsplash.com/photo-1606229365485-93a3b8ee0385?w=800', alt: 'Baseus 65W GaN Charger', isMain: true }],
      variants: [],
      specifications: [
        { group: 'Power', name: 'Total Output', value: '65W max', sortOrder: 1 },
        { group: 'Ports', name: 'USB-C', value: '2x USB-C (PD 65W)', sortOrder: 2 },
        { group: 'Ports', name: 'USB-A', value: '1x USB-A (QC 3.0)', sortOrder: 3 },
        { group: 'Build', name: 'Technology', value: 'GaN II', sortOrder: 4 },
      ],
    },
  ];

  for (const p of productsData) {
    const { images, variants, specifications, brandSlug, categorySlug, ...productData } = p;
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } });
    if (!existing) {
      const priceNum = Number(productData.price);
      const discountNum = productData.discountPrice ? Number(productData.discountPrice) : undefined;
      const costNum = Math.round(priceNum * 0.82);
      const barcodeVal = '880' + Math.floor(1000000000 + Math.random() * 9000000000).toString();

      const product = await prisma.product.create({
        data: {
          ...productData,
          costPrice: costNum as any,
          barcode: barcodeVal,
          brandId: brands[brandSlug],
          categoryId: categories[categorySlug],
          price: priceNum as any,
          discountPrice: discountNum as any,
          discountPercent: discountNum
            ? Math.round(((priceNum - discountNum) / priceNum) * 100)
            : undefined,
          isActive: true,
          images: { create: images.map((img, i) => ({ ...img, sortOrder: i })) },
          variants: variants?.length ? { create: variants.map((v, i) => ({ ...v, type: v.type as any, sortOrder: i, price: v.price as any })) } : undefined,
          specifications: specifications?.length ? { create: specifications } : undefined,
        },
      });
    }
  }
  console.log(`✅ ${productsData.length} products created`);

  // ── Delivery Charges ──
  await prisma.deliveryCharge.upsert({
    where: { id: 'dhaka-charge' },
    update: {},
    create: { id: 'dhaka-charge', zone: DeliveryZone.DHAKA, charge: 60 as any, freeAbove: 2000 as any, isActive: true },
  });
  await prisma.deliveryCharge.upsert({
    where: { id: 'outside-dhaka-charge' },
    update: {},
    create: { id: 'outside-dhaka-charge', zone: DeliveryZone.OUTSIDE_DHAKA, charge: 120 as any, freeAbove: 3000 as any, isActive: true },
  });
  console.log('✅ Delivery charges created');

  // ── Districts (all 64 Bangladesh districts) ──
  const districts = [
    { name: 'Dhaka', nameBn: 'ঢাকা', division: 'Dhaka', zone: DeliveryZone.DHAKA },
    { name: 'Gazipur', nameBn: 'গাজীপুর', division: 'Dhaka', zone: DeliveryZone.DHAKA },
    { name: 'Narayanganj', nameBn: 'নারায়ণগঞ্জ', division: 'Dhaka', zone: DeliveryZone.DHAKA },
    { name: 'Narsingdi', nameBn: 'নরসিংদী', division: 'Dhaka', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Munshiganj', nameBn: 'মুন্সিগঞ্জ', division: 'Dhaka', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Manikganj', nameBn: 'মানিকগঞ্জ', division: 'Dhaka', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Faridpur', nameBn: 'ফরিদপুর', division: 'Dhaka', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Gopalganj', nameBn: 'গোপালগঞ্জ', division: 'Dhaka', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Rajbari', nameBn: 'রাজবাড়ী', division: 'Dhaka', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Madaripur', nameBn: 'মাদারীপুর', division: 'Dhaka', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Shariatpur', nameBn: 'শরীয়তপুর', division: 'Dhaka', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Kishoreganj', nameBn: 'কিশোরগঞ্জ', division: 'Dhaka', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Tangail', nameBn: 'টাঙ্গাইল', division: 'Dhaka', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Chattogram', nameBn: 'চট্টগ্রাম', division: 'Chattogram', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: "Cox's Bazar", nameBn: "কক্সবাজার", division: 'Chattogram', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Rangamati', nameBn: 'রাঙামাটি', division: 'Chattogram', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Bandarban', nameBn: 'বান্দরবান', division: 'Chattogram', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Khagrachhari', nameBn: 'খাগড়াছড়ি', division: 'Chattogram', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Feni', nameBn: 'ফেনী', division: 'Chattogram', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Noakhali', nameBn: 'নোয়াখালী', division: 'Chattogram', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Comilla', nameBn: 'কুমিল্লা', division: 'Chattogram', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Chandpur', nameBn: 'চাঁদপুর', division: 'Chattogram', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া', division: 'Chattogram', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Lakshmipur', nameBn: 'লক্ষ্মীপুর', division: 'Chattogram', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Sylhet', nameBn: 'সিলেট', division: 'Sylhet', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Moulvibazar', nameBn: 'মৌলভীবাজার', division: 'Sylhet', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Habiganj', nameBn: 'হবিগঞ্জ', division: 'Sylhet', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Sunamganj', nameBn: 'সুনামগঞ্জ', division: 'Sylhet', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Rajshahi', nameBn: 'রাজশাহী', division: 'Rajshahi', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Chapainawabganj', nameBn: 'চাঁপাইনবাবগঞ্জ', division: 'Rajshahi', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Natore', nameBn: 'নাটোর', division: 'Rajshahi', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Naogaon', nameBn: 'নওগাঁ', division: 'Rajshahi', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Bogura', nameBn: 'বগুড়া', division: 'Rajshahi', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Joypurhat', nameBn: 'জয়পুরহাট', division: 'Rajshahi', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Pabna', nameBn: 'পাবনা', division: 'Rajshahi', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Sirajganj', nameBn: 'সিরাজগঞ্জ', division: 'Rajshahi', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Khulna', nameBn: 'খুলনা', division: 'Khulna', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Bagerhat', nameBn: 'বাগেরহাট', division: 'Khulna', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Satkhira', nameBn: 'সাতক্ষীরা', division: 'Khulna', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Jessore', nameBn: 'যশোর', division: 'Khulna', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Narail', nameBn: 'নড়াইল', division: 'Khulna', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Magura', nameBn: 'মাগুরা', division: 'Khulna', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Jhenaidah', nameBn: 'ঝিনাইদহ', division: 'Khulna', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Kushtia', nameBn: 'কুষ্টিয়া', division: 'Khulna', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Chuadanga', nameBn: 'চুয়াডাঙ্গা', division: 'Khulna', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Meherpur', nameBn: 'মেহেরপুর', division: 'Khulna', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Barisal', nameBn: 'বরিশাল', division: 'Barisal', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Bhola', nameBn: 'ভোলা', division: 'Barisal', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Patuakhali', nameBn: 'পটুয়াখালী', division: 'Barisal', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Pirojpur', nameBn: 'পিরোজপুর', division: 'Barisal', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Jhalokati', nameBn: 'ঝালকাঠি', division: 'Barisal', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Barguna', nameBn: 'বরগুনা', division: 'Barisal', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Rangpur', nameBn: 'রংপুর', division: 'Rangpur', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Dinajpur', nameBn: 'দিনাজপুর', division: 'Rangpur', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Gaibandha', nameBn: 'গাইবান্ধা', division: 'Rangpur', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Kurigram', nameBn: 'কুড়িগ্রাম', division: 'Rangpur', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Lalmonirhat', nameBn: 'লালমনিরহাট', division: 'Rangpur', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Nilphamari', nameBn: 'নীলফামারী', division: 'Rangpur', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Panchagarh', nameBn: 'পঞ্চগড়', division: 'Rangpur', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Thakurgaon', nameBn: 'ঠাকুরগাঁও', division: 'Rangpur', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Mymensingh', nameBn: 'ময়মনসিংহ', division: 'Mymensingh', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Jamalpur', nameBn: 'জামালপুর', division: 'Mymensingh', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Netrokona', nameBn: 'নেত্রকোনা', division: 'Mymensingh', zone: DeliveryZone.OUTSIDE_DHAKA },
    { name: 'Sherpur', nameBn: 'শেরপুর', division: 'Mymensingh', zone: DeliveryZone.OUTSIDE_DHAKA },
  ];

  for (const d of districts) {
    await prisma.district.upsert({ where: { name: d.name }, update: {}, create: d });
  }
  console.log(`✅ ${districts.length} districts created`);

  // ── Banners ──
  const bannersData = [
    { title: 'New iPhone 15 Pro Max', titleBn: 'নতুন আইফোন ১৫ প্রো ম্যাক্স', subtitle: 'Titanium. So strong. So light. So Pro.', subtitleBn: 'টাইটানিয়াম। শক্তিশালী। হালকা।', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1920', link: '/products/iphone-15-pro-max', position: BannerPosition.HERO, sortOrder: 1, isActive: true },
    { title: 'Samsung Galaxy S24 Ultra', titleBn: 'স্যামসাং গ্যালাক্সি এস২৪ আল্ট্রা', subtitle: 'AI-powered Galaxy. Now with S Pen.', subtitleBn: 'এআই চালিত গ্যালাক্সি। এস পেন সহ।', image: 'https://images.unsplash.com/photo-1707930524337-408abc9f8fd0?w=1920', link: '/products/samsung-galaxy-s24-ultra', position: BannerPosition.HERO, sortOrder: 2, isActive: true },
    { title: 'MacBook Air M3', titleBn: 'ম্যাকবুক এয়ার এম৩', subtitle: 'Supercharged by M3. Impossibly thin.', subtitleBn: 'এম৩ দ্বারা পরিচালিত। অবিশ্বাস্যভাবে পাতলা।', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1920', link: '/products/macbook-air-m3-13-inch', position: BannerPosition.HERO, sortOrder: 3, isActive: true },
  ];

  for (const b of bannersData) {
    await prisma.banner.create({ data: b }).catch(() => {});
  }
  console.log('✅ Banners created');

  // ── Coupons ──
  await prisma.coupon.create({ data: { code: 'WELCOME10', type: CouponType.PERCENTAGE, value: 10 as any, minOrderAmount: 2000 as any, maxDiscount: 1000 as any, usageLimit: 1000, isActive: true } }).catch(() => {});
  await prisma.coupon.create({ data: { code: 'SAVE500', type: CouponType.FIXED_AMOUNT, value: 500 as any, minOrderAmount: 5000 as any, usageLimit: 500, isActive: true } }).catch(() => {});
  await prisma.coupon.create({ data: { code: 'GADGET20', type: CouponType.PERCENTAGE, value: 20 as any, minOrderAmount: 10000 as any, maxDiscount: 3000 as any, usageLimit: 200, isActive: true } }).catch(() => {});
  console.log('✅ Coupons created');

  // ── Site Settings ──
  const settings = [
    { key: 'site.name', value: 'Zynox Gadgets', group: 'general' },
    { key: 'site.tagline', value: 'The Ultimate Gadget Destination in Bangladesh', group: 'general' },
    { key: 'site.email', value: 'support@zynoxgadgets.com', group: 'general' },
    { key: 'site.phone', value: '+880 1700-ZYNOXG', group: 'general' },
    { key: 'site.whatsapp', value: '+8801700996633', group: 'general' },
    { key: 'site.address', value: 'Zynox Tower, Level 4, Dhanmondi 27, Dhaka - 1209, Bangladesh', group: 'general' },
    { key: 'site.currency', value: 'BDT', group: 'general' },
    { key: 'site.currency_symbol', value: '৳', group: 'general' },
    { key: 'seo.meta_title', value: 'Zynox Gadgets | Premier Gadget & Electronics Store in Bangladesh', group: 'seo' },
    { key: 'seo.meta_description', value: 'Shop original smartphones, smartwatches, earbuds, laptops & tech accessories from Apple, Samsung, Xiaomi, Anker, Baseus with official warranty & fast delivery across Bangladesh.', group: 'seo' },
  ];
  for (const s of settings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
  }
  console.log('✅ Settings created');

  // ── Sample Business Expenses ──
  const expensesData = [
    { title: 'Dhanmondi Showroom & Warehouse Rent', category: 'Rent', amount: 65000 as any, paymentMethod: 'Bank Transfer', notes: 'Monthly flagship outlet lease', createdById: admin.id },
    { title: 'Store Staff & Logistics Team Salaries', category: 'Salaries', amount: 120000 as any, paymentMethod: 'Bank Transfer', notes: 'Monthly payroll for 6 staff', createdById: admin.id },
    { title: 'High-speed Fiber Internet & Utilities', category: 'Utilities', amount: 14500 as any, paymentMethod: 'bKash', notes: 'Showroom electricity and 100Mbps dedicated fiber', createdById: admin.id },
    { title: 'Custom Anti-shock Bubble Packaging', category: 'Packaging', amount: 18000 as any, paymentMethod: 'Cash', notes: '2000 units branded safe transit boxes & wrap', createdById: admin.id },
    { title: 'Facebook & Google Search Ad Campaigns', category: 'Marketing', amount: 45000 as any, paymentMethod: 'Card', notes: 'Meta Advantage+ and Google Shopping ads', createdById: admin.id },
    { title: 'Cloud Infrastructure & High-Availability Servers', category: 'Maintenance', amount: 9500 as any, paymentMethod: 'Card', notes: 'API server, Postgres replication & S3 media storage', createdById: admin.id },
    { title: 'Pathao & Steadfast Parcel Consumables', category: 'Shipping', amount: 8200 as any, paymentMethod: 'Cash', notes: 'Thermal airway bill rolls and tamper-evident courier bags', createdById: admin.id },
  ];

  for (const exp of expensesData) {
    await prisma.expense.create({ data: exp }).catch(() => {});
  }
  console.log('✅ Sample business expenses created');

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
