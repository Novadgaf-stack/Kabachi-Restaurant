export interface PhotoAsset {
  id: string;
  name: string;
  url: string;
  alt: string;
  category: 'dish' | 'section' | 'room' | 'gallery';
  comment: string;
}

export const PHOTOS: PhotoAsset[] = [
  // 12 Dishes (Starters, Rice, Noodles, Chicken, Beef, Seafood, Drinks)
  {
    id: 'starter-spring-rolls',
    name: 'Crispy Spring Rolls',
    url: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?auto=format&fit=crop&w=800&q=80',
    alt: 'Golden crispy vegetable spring rolls with sweet dipping sauce',
    category: 'dish',
    comment: '// PLACEHOLDER — replace with real photo of Crispy Vegetable Spring Rolls',
  },
  {
    id: 'starter-dim-sum',
    name: 'Steamed Prawn & Chicken Dumplings',
    url: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=800&q=80',
    alt: 'Steamed Cantonese dumplings in a traditional bamboo basket',
    category: 'dish',
    comment: '// PLACEHOLDER — replace with real photo of Steamed Dim Sum Dumplings',
  },
  {
    id: 'rice-special-fried',
    name: 'Kabachi Special Fried Rice',
    url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80',
    alt: 'Wok-tossed special fried rice with prawns, beef, and spring onions',
    category: 'dish',
    comment: '// PLACEHOLDER — replace with real photo of Kabachi Special Fried Rice',
  },
  {
    id: 'rice-yang-chow',
    name: 'Yang Chow Fried Rice',
    url: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80',
    alt: 'Traditional Yang Chow egg fried rice with diced vegetables',
    category: 'dish',
    comment: '// PLACEHOLDER — replace with real photo of Yang Chow Fried Rice',
  },
  {
    id: 'noodles-singapore',
    name: 'Singapore Rice Noodles',
    url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    alt: 'Curry spiced Singapore vermicelli noodles with vegetables and shrimp',
    category: 'dish',
    comment: '// PLACEHOLDER — replace with real photo of Singapore Rice Noodles',
  },
  {
    id: 'noodles-chow-mein',
    name: 'Beef Chow Mein',
    url: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
    alt: 'Wok-fried egg noodles with tender marinated beef and bean sprouts',
    category: 'dish',
    comment: '// PLACEHOLDER — replace with real photo of Beef Chow Mein',
  },
  {
    id: 'chicken-szechuan-pepper',
    name: 'Szechuan Spicy Pepper Chicken',
    url: 'https://images.unsplash.com/photo-1625938145744-e380515399b7?auto=format&fit=crop&w=800&q=80',
    alt: 'Crispy diced chicken tossed with red peppers, Szechuan peppercorns, and aromatics',
    category: 'dish',
    comment: '// PLACEHOLDER — replace with real photo of Szechuan Pepper Chicken',
  },
  {
    id: 'chicken-sweet-sour',
    name: 'Sweet & Sour Crispy Chicken',
    url: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
    alt: 'Tender chicken glazed in classic sweet and sour sauce with bell peppers',
    category: 'dish',
    comment: '// PLACEHOLDER — replace with real photo of Sweet and Sour Chicken',
  },
  {
    id: 'beef-hot-garlic',
    name: 'Shredded Beef in Hot Garlic Sauce',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    alt: 'Thinly sliced beef with garlic, chili, and dark soy reduction',
    category: 'dish',
    comment: '// PLACEHOLDER — replace with real photo of Shredded Beef in Hot Garlic Sauce',
  },
  {
    id: 'beef-ginger-scallion',
    name: 'Crispy Beef with Ginger & Scallions',
    url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    alt: 'Flash-fried crispy beef tossed with fresh ginger strips and young scallions',
    category: 'dish',
    comment: '// PLACEHOLDER — replace with real photo of Crispy Ginger Beef',
  },
  {
    id: 'seafood-salt-pepper-prawns',
    name: 'Salt & Pepper Jumbo Prawns',
    url: 'https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=800&q=80',
    alt: 'Deep-fried jumbo tiger prawns tossed with rock salt, cracked black pepper, and fresh chili',
    category: 'dish',
    comment: '// PLACEHOLDER — replace with real photo of Salt & Pepper Jumbo Prawns',
  },
  {
    id: 'drinks-hibiscus-spritz',
    name: 'Chilled Hibiscus Citrus Spritz',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    alt: 'Chilled ruby hibiscus spritz over crushed ice with fresh lime wheel',
    category: 'dish',
    comment: '// PLACEHOLDER — replace with real photo of Chilled Hibiscus Citrus Spritz',
  },

  // Sections
  {
    id: 'hero-dish',
    name: 'Hero Featured Wok Dish',
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
    alt: 'Editorial warm close-up of sizzling wok noodles and fresh dim sum',
    category: 'section',
    comment: '// PLACEHOLDER — replace with real photo of Kabachi signature dish for Hero',
  },
  {
    id: 'restaurant-interior',
    name: 'Restaurant Dining Room',
    url: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Warm ambient dining room with timber tables and warm lanterns',
    category: 'section',
    comment: '// PLACEHOLDER — replace with real photo of Kabachi Restaurant main dining floor',
  },
  {
    id: 'bar-interior',
    name: 'The Bar at Kabachi',
    url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80',
    alt: 'Warmly lit brass and timber cocktail bar counter with spirits and glassware',
    category: 'section',
    comment: '// PLACEHOLDER — replace with real photo of Kabachi Bar & Lounge counter',
  },
  {
    id: 'lodge-room',
    name: 'Lodge Boutique Rooms',
    url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
    alt: 'Calm upstairs guest room with crisp white linens and minimalist warm lighting',
    category: 'room',
    comment: '// PLACEHOLDER — replace with real photo of Kabachi Lodge guest rooms upstairs',
  },

  // Gallery
  {
    id: 'gallery-kitchen-wok',
    name: 'Live Wok Kitchen',
    url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    alt: 'Authentic chef handling high heat wok station',
    category: 'gallery',
    comment: '// PLACEHOLDER — replace with real photo of Kabachi wok kitchen station',
  },
  {
    id: 'gallery-dim-sum-close',
    name: 'Handcrafted Dim Sum',
    url: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=800&q=80',
    alt: 'Close up of handmade dumplings and dipping sauces',
    category: 'gallery',
    comment: '// PLACEHOLDER — replace with real photo of Kabachi fresh appetizers',
  },
  {
    id: 'gallery-craft-drinks',
    name: 'Chilled Spirits & Signature Cocktails',
    url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    alt: 'Handcrafted cocktail served over carved ice at the bar',
    category: 'gallery',
    comment: '// PLACEHOLDER — replace with real photo of Kabachi signature drinks',
  },
  {
    id: 'gallery-room-detail',
    name: 'Upstairs Suite Atmosphere',
    url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80',
    alt: 'Clean modern boutique hotel room interior upstairs',
    category: 'gallery',
    comment: '// PLACEHOLDER — replace with real photo of Kabachi upstairs suite',
  },
];

export function getPhotoById(id: string): PhotoAsset {
  const found = PHOTOS.find((p) => p.id === id);
  if (!found) {
    return PHOTOS[0];
  }
  return found;
}
