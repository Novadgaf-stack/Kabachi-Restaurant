import { getPhotoById } from './photos';

export interface MenuItem {
  id: string;
  name: string;
  category: 'Starters' | 'Rice' | 'Noodles' | 'Chicken' | 'Beef' | 'Seafood' | 'Drinks';
  description: string;
  price: number; // in Naira (integer, no decimals)
  photoId: string;
  isPopular?: boolean;
  soldOut?: boolean;
  comment: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  fee: number; // in Naira
  estimatedMinutes: string;
}

export const RESTAURANT_INFO = {
  name: 'Kabachi Chinese Restaurant, Bar & Lodge',
  shortName: 'Kabachi',
  tagline: 'Chinese food, cold drinks, and rooms upstairs.',
  headline: 'Chinese food, cold drinks, and rooms upstairs.',
  subheadline: 'Order for delivery or pickup in {{CITY}}. Open {{HOURS}}.',
  city: 'Lagos', // {{CITY}}
  address: '3b Adekunle Lawal Rd, Ikoyi, Lagos 101232, Lagos, Nigeria', // {{ADDRESS}}
  phone: '+234 905 841 4398', // {{PHONE}}
  whatsappNumber: '2349058414398', // {{WHATSAPP_NUMBER}}
  whatsappCatalogUrl: 'https://wa.me/c/41253228032088',
  email: 'kabachichinese@gmail.com',
  hours: '11:30 AM – 10:30 PM Daily', // {{HOURS}}
  openHour: 11.5, // 11:30 AM
  closeHour: 22.5, // 10:30 PM
  minOrder: 5000, // {{MIN_ORDER}} (₦5,000)
  mapUrl: 'https://maps.google.com/?q=3b+Adekunle+Lawal+Rd+Ikoyi+Lagos+Nigeria',
  instagram: 'https://www.instagram.com/officialkabachi',
  facebook: 'https://web.facebook.com/people/The-Stack-Lekki/100089729140093/#',
  bankTransferDetails: {
    bankName: '{{BANK_NAME}}',
    accountNumber: '{{ACCOUNT_NUMBER}}',
    accountName: 'Kabachi Chinese Restaurant & Bar',
    note: 'Use your Order Reference as transfer description or send screenshot on WhatsApp.',
  },
};

// Exactly 12 items across Starters / Rice / Noodles / Chicken / Beef / Seafood / Drinks
// Each item explicitly marked // REPLACE
export const MENU_ITEMS: MenuItem[] = [
  // Starters (2 items)
  {
    id: 'kb-01',
    name: 'Steamed Prawn & Chicken Dim Sum',
    category: 'Starters',
    description: 'Fresh minced prawn and seasoned chicken steamed in delicate wonton wrappers.',
    price: 6500, // ₦6,500
    photoId: 'starter-dim-sum',
    isPopular: true,
    comment: '// REPLACE: Item 1 of 12 — Starters',
  },
  {
    id: 'kb-02',
    name: 'Crispy Vegetable Spring Rolls',
    category: 'Starters',
    description: 'Golden fried rolls filled with julienne cabbage, carrots, and wood ear mushrooms.',
    price: 4500, // ₦4,500
    photoId: 'starter-spring-rolls',
    isPopular: false,
    comment: '// REPLACE: Item 2 of 12 — Starters',
  },

  // Rice (2 items)
  {
    id: 'kb-03',
    name: 'Kabachi Special Fried Rice',
    category: 'Rice',
    description: 'House wok rice with chopped tiger prawns, shredded beef, eggs, and spring onion.',
    price: 9000, // ₦9,000
    photoId: 'rice-special-fried',
    isPopular: true,
    comment: '// REPLACE: Item 3 of 12 — Rice',
  },
  {
    id: 'kb-04',
    name: 'Yang Chow Fried Rice',
    category: 'Rice',
    description: 'Classic fragrant jasmine rice wok-tossed with egg ribbons and sweet garden peas.',
    price: 7500, // ₦7,500
    photoId: 'rice-yang-chow',
    isPopular: false,
    comment: '// REPLACE: Item 4 of 12 — Rice',
  },

  // Noodles (2 items)
  {
    id: 'kb-05',
    name: 'Singapore Rice Noodles',
    category: 'Noodles',
    description: 'Thin vermicelli noodles wok-charred with mild yellow curry, bell peppers, and shrimp.',
    price: 8500, // ₦8,500
    photoId: 'noodles-singapore',
    isPopular: true,
    comment: '// REPLACE: Item 5 of 12 — Noodles',
  },
  {
    id: 'kb-06',
    name: 'Beef Chow Mein Noodles',
    category: 'Noodles',
    description: 'Traditional egg noodles stir-fried with marinated flank beef slices and dark soy.',
    price: 8000, // ₦8,000
    photoId: 'noodles-chow-mein',
    isPopular: false,
    comment: '// REPLACE: Item 6 of 12 — Noodles',
  },

  // Chicken (2 items)
  {
    id: 'kb-07',
    name: 'Szechuan Pepper Chicken',
    category: 'Chicken',
    description: 'Crisp boneless chicken wok-tossed with fiery red chilies and cracked Szechuan peppers.',
    price: 7500, // ₦7,500
    photoId: 'chicken-szechuan-pepper',
    isPopular: true,
    comment: '// REPLACE: Item 7 of 12 — Chicken',
  },
  {
    id: 'kb-08',
    name: 'Sweet & Sour Crispy Chicken',
    category: 'Chicken',
    description: 'Battered tender chicken breasts coated in tangy pineapple plum reduction.',
    price: 7000, // ₦7,000
    photoId: 'chicken-sweet-sour',
    isPopular: false,
    comment: '// REPLACE: Item 8 of 12 — Chicken',
  },

  // Beef (2 items)
  {
    id: 'kb-09',
    name: 'Shredded Beef in Hot Garlic Sauce',
    category: 'Beef',
    description: 'Tender prime beef strips sauteed with crushed garlic, green peppers, and chili paste.',
    price: 8500, // ₦8,500
    photoId: 'beef-hot-garlic',
    isPopular: true,
    comment: '// REPLACE: Item 9 of 12 — Beef',
  },
  {
    id: 'kb-10',
    name: 'Crispy Beef with Ginger & Scallions',
    category: 'Beef',
    description: 'Caramelized crispy shredded beef flash-fried with fresh ginger matchsticks and scallions.',
    price: 8500, // ₦8,500
    photoId: 'beef-ginger-scallion',
    isPopular: false,
    comment: '// REPLACE: Item 10 of 12 — Beef',
  },

  // Seafood (1 item)
  {
    id: 'kb-11',
    name: 'Salt & Pepper Jumbo Prawns',
    category: 'Seafood',
    description: 'Whole tiger prawns wok-tossed with coarse rock salt, black pepper, and sliced chilies.',
    price: 12500, // ₦12,500
    photoId: 'seafood-salt-pepper-prawns',
    isPopular: true,
    comment: '// REPLACE: Item 11 of 12 — Seafood',
  },

  // Drinks (1 item)
  {
    id: 'kb-12',
    name: 'Chilled Hibiscus Citrus Spritz',
    category: 'Drinks',
    description: 'House-brewed ruby zobo infusion with crushed lime, ginger zest, and sparkling tonic over ice.',
    price: 2500, // ₦2,500
    photoId: 'drinks-hibiscus-spritz',
    isPopular: false,
    comment: '// REPLACE: Item 12 of 12 — Drinks',
  },
];

export const CATEGORIES: Array<MenuItem['category']> = [
  'Starters',
  'Rice',
  'Noodles',
  'Chicken',
  'Beef',
  'Seafood',
  'Drinks',
];

// Comprehensive Ikoyi & Lagos delivery district interface
export interface IkoyiDistrict {
  id: string;
  name: string;
  group: 'Central Ikoyi (Fastest)' | 'Ikoyi Gated Estates' | 'Victoria Island & Lagos Island' | 'Lekki Corridor' | 'Lagos Mainland';
  fee: number; // in Naira (integer)
  estimatedMinutes: string;
  securityNote?: string;
}

// Lookup object of Ikoyi districts & surrounding delivery destinations
export const IKOYI_DISTRICTS_LOOKUP: Record<string, IkoyiDistrict> = {
  'gerard-kingsway': {
    id: 'gerard-kingsway',
    name: 'Gerard Road / Kingsway (Alfred Rewane), Ikoyi',
    group: 'Central Ikoyi (Fastest)',
    fee: 1200,
    estimatedMinutes: '15–25 mins',
    securityNote: 'Adjacent to our Adekunle Lawal Rd kitchen — rapid dispatch',
  },
  'old-ikoyi': {
    id: 'old-ikoyi',
    name: 'Old Ikoyi (Bourbillon / Queens Drive / Alexander)',
    group: 'Central Ikoyi (Fastest)',
    fee: 1200,
    estimatedMinutes: '20–30 mins',
    securityNote: 'Direct delivery to residential compounds and offices',
  },
  'parkview': {
    id: 'parkview',
    name: 'Parkview Estate, Ikoyi',
    group: 'Ikoyi Gated Estates',
    fee: 1500,
    estimatedMinutes: '20–30 mins',
    securityNote: 'Estate security gate pass code required for dispatch rider entry',
  },
  'banana-island': {
    id: 'banana-island',
    name: 'Banana Island, Ikoyi',
    group: 'Ikoyi Gated Estates',
    fee: 2500,
    estimatedMinutes: '25–40 mins',
    securityNote: 'Banana Island security gate code required for rider clearance',
  },
  'osborne-1-2': {
    id: 'osborne-1-2',
    name: 'Osborne Foreshore Phase 1 & 2, Ikoyi',
    group: 'Ikoyi Gated Estates',
    fee: 1800,
    estimatedMinutes: '20–35 mins',
    securityNote: 'Estate gate access code needed for delivery entry',
  },
  'dolphin-estate': {
    id: 'dolphin-estate',
    name: 'Dolphin Estate & Osborne Extension, Ikoyi',
    group: 'Ikoyi Gated Estates',
    fee: 1500,
    estimatedMinutes: '20–30 mins',
    securityNote: 'Gate clearance check at Dolphin entrance',
  },
  'awolowo-falomo': {
    id: 'awolowo-falomo',
    name: 'Awolowo Road / Falomo / Onikan Axis',
    group: 'Central Ikoyi (Fastest)',
    fee: 1500,
    estimatedMinutes: '20–30 mins',
    securityNote: 'Direct street dispatch',
  },
  'victoria-island': {
    id: 'victoria-island',
    name: 'Victoria Island (VI) / Oniru',
    group: 'Victoria Island & Lagos Island',
    fee: 2200,
    estimatedMinutes: '30–45 mins',
    securityNote: 'Dispatched via Falomo Bridge corridor',
  },
  'lagos-island': {
    id: 'lagos-island',
    name: 'Lagos Island / Marina / CMS',
    group: 'Victoria Island & Lagos Island',
    fee: 2000,
    estimatedMinutes: '30–45 mins',
    securityNote: 'Direct dispatch across Five Cowries / Marina',
  },
  'lekki-phase-1': {
    id: 'lekki-phase-1',
    name: 'Lekki Phase 1 (via Lekki-Ikoyi Link Bridge)',
    group: 'Lekki Corridor',
    fee: 2800,
    estimatedMinutes: '35–50 mins',
    securityNote: 'Express dispatch via Lekki-Ikoyi Link Bridge toll route',
  },
  'lekki-phase-2': {
    id: 'lekki-phase-2',
    name: 'Lekki Phase 2 / Ikate / Chevron / Agungi',
    group: 'Lekki Corridor',
    fee: 3800,
    estimatedMinutes: '45–65 mins',
    securityNote: 'Lekki-Epe Expressway corridor dispatch',
  },
  'mainland-ikeja': {
    id: 'mainland-ikeja',
    name: 'Mainland (Ikeja / Surulere / Yaba)',
    group: 'Lagos Mainland',
    fee: 4500,
    estimatedMinutes: '50–80 mins',
    securityNote: 'Mainland express dispatch via Third Mainland Bridge',
  },
};

/**
 * Helper function to determine delivery fees and dispatch details based on the Ikoyi district lookup.
 * @param districtId Key of the district in IKOYI_DISTRICTS_LOOKUP
 * @returns IkoyiDistrict object with fee, estimatedMinutes, and security notes
 */
export function getDeliveryFeeByDistrict(districtId: string): IkoyiDistrict {
  if (districtId && IKOYI_DISTRICTS_LOOKUP[districtId]) {
    return IKOYI_DISTRICTS_LOOKUP[districtId];
  }
  // Default to central Ikoyi if unknown
  return IKOYI_DISTRICTS_LOOKUP['gerard-kingsway'];
}

// Delivery zone lookup table (derived from district lookup for backward compatibility)
export const DELIVERY_ZONES: DeliveryZone[] = Object.values(IKOYI_DISTRICTS_LOOKUP).map(d => ({
  id: d.id,
  name: d.name,
  fee: d.fee,
  estimatedMinutes: d.estimatedMinutes,
}));

// Three full-width alternating photo-and-text rows for Restaurant / Bar / Lodge
// Each has 2 sentences plus one link
export const BRAND_PILLARS = [
  {
    id: 'restaurant',
    label: 'RESTAURANT',
    title: 'Authentic Chinese kitchen fired to order.',
    description:
      'Our wok chefs prepare Cantonese classics, hot garlic specialties, and fresh dim sum daily. Dine in with family or order your favourite boxes directly to your door.',
    linkText: 'Explore the full menu',
    linkHref: '/menu',
    photoId: 'restaurant-interior',
    comment: '// PLACEHOLDER — replace with real photo of Kabachi Restaurant dining area',
  },
  {
    id: 'bar',
    label: 'BAR',
    title: 'Cold beers, spirits, and relaxed evenings.',
    description:
      'Unwind after work with chilled local brews, fine whiskies, and refreshing house cocktails. A quiet, comfortable lounge to watch the game or catch up with friends.',
    linkText: 'Order drinks with your meal',
    linkHref: '/menu',
    photoId: 'bar-interior',
    comment: '// PLACEHOLDER — replace with real photo of Kabachi Bar & Lounge',
  },
  {
    id: 'lodge',
    label: 'LODGE',
    title: 'Private rooms upstairs in central Ikoyi.',
    description:
      'Quiet air-conditioned rooms designed for business travellers and weekend visitors in Lagos. Enjoy 24-hour security, reliable power, and hot Chinese dining just downstairs.',
    linkText: 'Ask about a room on WhatsApp',
    linkHref: `https://wa.me/${RESTAURANT_INFO.whatsappNumber}?text=${encodeURIComponent('Hello Kabachi Lodge, I would like to inquire about room availability and rates.')}`,
    isExternal: true,
    photoId: 'lodge-room',
    comment: '// PLACEHOLDER — replace with real photo of Kabachi Lodge guest rooms',
  },
];

// Rooms block details
export const ROOMS_INFO = {
  label: 'ROOMS UPSTAIRS',
  title: 'Comfortable lodge accommodation in Ikoyi.',
  description:
    'Clean, private en-suite bedrooms located directly above the restaurant on Adekunle Lawal Road. Ideal for travellers needing secure lodging with warm hospitality and room-service dining.',
  features: [
    '24/7 uninterrupted power & standby generators',
    'En-suite bathrooms with hot water showers',
    'High-speed WiFi and air-conditioning',
    'Direct room service from the Kabachi kitchen',
  ],
  whatsappButtonText: 'Ask about a room',
  whatsappMessage: 'Hello Kabachi Lodge, I would like to inquire about room availability, rates, and check-in times.',
};

// Gallery assets
export const GALLERY_ITEMS = [
  { photoId: 'gallery-kitchen-wok', caption: 'High heat wok station' },
  { photoId: 'gallery-dim-sum-close', caption: 'Handmade daily dim sum' },
  { photoId: 'gallery-craft-drinks', caption: 'Chilled bar beverages' },
  { photoId: 'gallery-room-detail', caption: 'Upstairs lodge retreat' },
];

// Naira currency formatter: formatted ₦12,500. No decimals. Never $ or 0.00.
export function formatNaira(amount: number): string {
  const rounded = Math.round(amount);
  return `₦${rounded.toLocaleString('en-NG')}`;
}

// Operating hours check (Lagos time UTC+1 / WAT)
export function isStoreOpen(): boolean {
  // Can be tested; returns true during standard opening hours 11:30 AM to 10:30 PM WAT
  try {
    const now = new Date();
    // Convert to Lagos time (UTC+1)
    const utcHours = now.getUTCHours() + now.getUTCMinutes() / 60;
    const lagosHours = (utcHours + 1) % 24;
    return lagosHours >= RESTAURANT_INFO.openHour && lagosHours <= RESTAURANT_INFO.closeHour;
  } catch {
    return true;
  }
}
