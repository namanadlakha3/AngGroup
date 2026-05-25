export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  image: string;
  type: string;
  status: 'Ready to Move' | 'Under Construction';
  bedrooms: number;
  bathrooms: number;
  area: string;
  description: string;
  amenities: string[];
  gallery: string[];
}

export const mockProperties: Property[] = [
  {
    id: '1',
    title: 'Modern Family Home',
    location: 'Prime residential area',
    price: '₹ 85 Lakh',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'House',
    status: 'Ready to Move',
    bedrooms: 3,
    bathrooms: 2,
    area: '1 Garage',
    description: 'A beautiful modern family home situated in a prime residential area. Features spacious rooms and contemporary finishing.',
    amenities: ['1 Garage', 'Spacious Garden', 'Modern Kitchen'],
    gallery: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
    ]
  },
  {
    id: '2',
    title: 'Minimal Apartment',
    location: 'City center',
    price: '₹ 52 Lakh',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Apartment',
    status: 'Ready to Move',
    bedrooms: 2,
    bathrooms: 2,
    area: 'Balcony',
    description: 'A sleek minimal apartment perfectly located in the city center. Ideal for young professionals.',
    amenities: ['Balcony', 'City View', 'Security'],
    gallery: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
    ]
  },
  {
    id: '3',
    title: 'Luxury Villa',
    location: 'Gated community',
    price: '₹ 2.4 Cr',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Villa',
    status: 'Ready to Move',
    bedrooms: 4,
    bathrooms: 4,
    area: 'Pool included',
    description: 'An expansive luxury villa located in a highly secure gated community. Complete with a private pool and premium fittings.',
    amenities: ['Pool', 'Security', 'Private Garden'],
    gallery: [
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
    ]
  },
  {
    id: '4',
    title: 'Farm House',
    location: 'Prime residential area',
    price: '₹ 8 Cr',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Farmhouse',
    status: 'Ready to Move',
    bedrooms: 3,
    bathrooms: 2,
    area: '1 Garage',
    description: 'A grand farm house surrounded by nature, yet close enough to the prime residential area.',
    amenities: ['Large Open Land', '1 Garage', 'Nature Views'],
    gallery: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
    ]
  },
  {
    id: '5',
    title: "Resort's",
    location: 'City center',
    price: '₹ 52 Cr',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Resort',
    status: 'Ready to Move',
    bedrooms: 2,
    bathrooms: 2,
    area: 'Balcony',
    description: 'A spectacular resort property offering world-class amenities and incredible city access.',
    amenities: ['Balcony', 'Premium Services', 'Swimming Pool'],
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
    ]
  },
  {
    id: '6',
    title: 'Commercial Land',
    location: 'Gated community',
    price: '₹ 50 Lakh',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    type: 'Land',
    status: 'Ready to Move',
    bedrooms: 4,
    bathrooms: 4,
    area: 'Pool included',
    description: 'Premium commercial land within a gated setup. High appreciation potential for business owners.',
    amenities: ['Pool', 'Gated Setup', 'Security'],
    gallery: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80'
    ]
  }
];
