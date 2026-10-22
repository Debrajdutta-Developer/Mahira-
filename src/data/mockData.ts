export interface Product {
  id: string;
  title: string;
  subtitle: string;
  category: 'sarees' | 'kurtas' | 'kalamkari' | 'dupattas';
  collection: string;
  priceINR: number;
  originalPriceINR?: number;
  image: string;
  hoverImage?: string;
  badge?: string;
  description: string;
  craft: string;
  fabric: string;
  care: string;
  features: string[];
  isBestSeller?: boolean;
  isNewArrival?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    id: 'saree-01',
    title: 'Embroidered Zari Organza Saree',
    subtitle: 'Grace in every drape',
    category: 'sarees',
    collection: 'Kalakaari Collection',
    priceINR: 18500,
    originalPriceINR: 22000,
    image: '/assets/s5-p1.jpg',
    hoverImage: '/assets/s3-sarees.jpg',
    badge: 'Best Seller',
    description: 'An ethereal champagne organza saree woven with meticulous antique gold zari embroidery, floral jaal, and handcrafted scalloped borders.',
    craft: 'Hand Zardozi & Resham Threadwork',
    fabric: 'Pure Silk Organza',
    care: 'Dry clean only. Store in unbleached cotton muslin cloth.',
    features: ['Handcrafted scalloped edges', 'Includes unstitched silk blouse piece', 'Lightweight fluid drape (6.3 meters)'],
    isBestSeller: true,
    isNewArrival: true,
  },
  {
    id: 'kurta-02',
    title: 'Chanderi Silk Kurta Set',
    subtitle: 'Everyday elegance redefined',
    category: 'kurtas',
    collection: 'Festive Silhouettes',
    priceINR: 12800,
    originalPriceINR: 14500,
    image: '/assets/s5-p2.jpg',
    hoverImage: '/assets/s3-kurta.jpg',
    badge: 'Popular',
    description: 'Regal ivory and emerald silk straight kurta adorned with gota patti detailing, matched with tapered pants and a sheer organza dupatta.',
    craft: 'Gota Patti & Foil Hand Emboss',
    fabric: 'Chanderi Silk with Mulmul Lining',
    care: 'Gentle dry clean recommended.',
    features: ['Handcrafted potli buttons', 'Tapered comfortable trousers with pockets', 'Statement zari dupatta'],
    isBestSeller: true,
    isNewArrival: false,
  },
  {
    id: 'kalamkari-03',
    title: 'Handpainted Kalamkari Silk Saree',
    subtitle: 'Art that tells a story',
    category: 'kalamkari',
    collection: 'Kalakaari Heritage',
    priceINR: 24500,
    originalPriceINR: 28000,
    image: '/assets/s5-p3.jpg',
    hoverImage: '/assets/s2-card-kala.jpg',
    badge: 'Heritage Heirloom',
    description: 'Authentic Srikalahasti freehand pen Kalamkari rendered using natural vegetable dyes portraying botanical trees of life and temple motifs.',
    craft: 'Srikalahasti Freehand Pen Kalamkari',
    fabric: 'Tussar Handloom Silk',
    care: 'Dry clean only. Keep away from direct harsh perfume mist.',
    features: ['100% certified organic vegetable pigments', 'Signed by master artisan', 'Each piece is uniquely handcrafted'],
    isBestSeller: true,
    isNewArrival: true,
  },
  {
    id: 'dupatta-04',
    title: 'Heirloom Kalamkari Dupatta',
    subtitle: 'A touch of tradition',
    category: 'dupattas',
    collection: 'Kalakaari Dupattas',
    priceINR: 8900,
    originalPriceINR: 10500,
    image: '/assets/s5-p4.jpg',
    hoverImage: '/assets/s4-p3.jpg',
    badge: 'Limited Edition',
    description: 'A lavish statement drape adorned with intricate hand-painted motifs and rich antique gold border accents that elevate any kurta ensemble.',
    craft: 'Natural Botanical Block & Pen Work',
    fabric: 'Handspun Maheshwari Silk-Cotton',
    care: 'Dry clean only.',
    features: ['2.5 meter regal length', 'Finished with handcrafted silk tassels', 'Featherlight airy feel'],
    isBestSeller: false,
    isNewArrival: true,
  },
  {
    id: 'saree-05',
    title: 'Banarasi Katan Silk Saree',
    subtitle: 'Tradition in a new light',
    category: 'sarees',
    collection: 'Royal Heritage',
    priceINR: 28000,
    originalPriceINR: 32000,
    image: '/assets/s3-sarees.jpg',
    badge: 'Masterpiece',
    description: 'Woven on traditional pit looms in Varanasi, this gold and ruby brocade saree is an ode to centuries of royal Mughal and Indian weaving lineage.',
    craft: 'Kadhwa Handloom Weave',
    fabric: '100% Pure Katan Mulberry Silk',
    care: 'Dry clean only. Roll fold every 4 months to preserve silk sheen.',
    features: ['Certified Silk Mark authentic', 'Traditional meenakari motifs', 'Heavy grand pallu drape'],
    isBestSeller: true,
    isNewArrival: true,
  },
  {
    id: 'kurta-06',
    title: 'Gulmarg Anarkali Ensemble',
    subtitle: 'Poetic grace for grand celebrations',
    category: 'kurtas',
    collection: 'Festive Silhouettes',
    priceINR: 19500,
    image: '/assets/s3-kurta.jpg',
    badge: 'New Arrival',
    description: 'Flared 32-kali floor length Anarkali in jewel-toned emerald green with hand-embroidered dabka, sitara, and pearl motifs on the bodice.',
    craft: 'Dabka & Sitara Hand Embroidery',
    fabric: 'Raw Silk & Crushed Tissue',
    care: 'Dry clean only.',
    features: ['Flared 32-kali silhouette', 'Churidar pants and heavy net dupatta', 'Adjustable internal corset tie'],
    isBestSeller: false,
    isNewArrival: true,
  },
];

export const BEST_SELLERS_DATA = [
  {
    id: '01',
    number: '01 ──',
    title: 'Embroidered Sarees',
    subtitle: 'Grace in every drape.',
    category: 'sarees',
    image: '/assets/s5-p1.jpg',
    productId: 'saree-01',
  },
  {
    id: '02',
    number: '02 ──',
    title: 'Kurta Sets',
    subtitle: 'Everyday elegance redefined.',
    category: 'kurtas',
    image: '/assets/s5-p2.jpg',
    productId: 'kurta-02',
  },
  {
    id: '03',
    number: '03 ──',
    title: 'Kalakaari Sarees',
    subtitle: 'Handpainted heritage art.',
    category: 'kalamkari',
    image: '/assets/s5-p3.jpg',
    productId: 'kalamkari-03',
  },
  {
    id: '04',
    number: '04 ──',
    title: 'Heritage Dupattas',
    subtitle: 'A touch of tradition.',
    category: 'dupattas',
    image: '/assets/s5-p4.jpg',
    productId: 'dupatta-04',
  },
];

export const NEW_COLLECTIONS_DATA = [
  {
    tag: 'NEW COLLECTION',
    title: 'SAREES',
    description: 'Tradition in a new light.',
    image: '/assets/s3-sarees.jpg',
    category: 'sarees',
  },
  {
    tag: 'NEW COLLECTION',
    title: 'KURTA SETS',
    description: 'Everyday elegance, elevated.',
    image: '/assets/s3-kurta.jpg',
    category: 'kurtas',
  },
  {
    tag: 'NEW COLLECTION',
    title: 'DRESSES & SETS',
    description: 'Modern silhouettes for every you.',
    image: '/assets/s3-dresses.jpg',
    category: 'kurtas',
  },
];
