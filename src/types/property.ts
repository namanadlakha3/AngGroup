export interface Property {
  id: string;
  // ─── Core ──────────────────────────────────────────
  title: string;
  description: string;
  type: string;
  status: string;
  transaction_type?: string;

  // ─── Location ──────────────────────────────────────
  location: string;       // legacy full address
  locality?: string;
  city?: string;
  state?: string;
  pincode?: string;

  // ─── Pricing (INR) ─────────────────────────────────
  price: string;          // display string e.g. "₹ 1.5 Cr"
  price_numeric?: number; // raw number for sorting/filtering
  price_per_sqft?: string;
  maintenance?: string;
  is_negotiable?: boolean;

  // ─── Area ──────────────────────────────────────────
  area: string;           // legacy field
  super_built_up_area?: string;
  built_up_area?: string;
  carpet_area?: string;
  plot_area?: string;     // for plots

  // ─── Property Specs ────────────────────────────────
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  floor_number?: number;
  total_floors?: number;

  // ─── Features ──────────────────────────────────────
  facing?: string;
  furnishing?: string;
  parking?: string;
  age_of_property?: string;
  possession_status?: string;
  water_supply?: string;
  power_backup?: boolean;
  gated_community?: boolean;

  // ─── Media ─────────────────────────────────────────
  image: string;          // primary image URL
  gallery?: string[];     // all images (first is primary)

  // ─── Extras ────────────────────────────────────────
  amenities?: string[];
  highlighted_features?: string[];

  created_at: string;
}
