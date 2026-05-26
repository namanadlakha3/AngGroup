import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Bed, Bath, Square, Check, ArrowLeft, Phone,
  MessageCircle, Ruler, IndianRupee, ChevronLeft, ChevronRight,
  X, Shield, Zap, Droplets, Car, Star, Home, Building2,
  Calendar, Compass, Tag, Sparkles
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Property } from '../types/property';

const TYPE_EMOJI: Record<string, string> = {
  'Apartment': '🏢', 'Villa': '🏠', 'Independent House': '🏡', 'Plot': '🏗️',
  'Penthouse': '🏰', 'Studio': '🛋️', 'Duplex': '🏘️', 'Farmhouse': '🌾',
  'Commercial': '🏬', 'Warehouse': '🏭', 'Office Space': '💼', 'Shop': '🏪',
  'Townhouse': '🏚️',
};

const AMENITY_EMOJI: Record<string, string> = {
  'Swimming Pool': '🏊', 'Gymnasium': '💪', 'Clubhouse': '🏛️', 'Spa & Sauna': '🧖',
  'Yoga Deck': '🧘', 'Library': '📚', 'Cinema Room': '🎬', 'Rooftop Terrace': '🌇',
  "Kids' Play Area": '🎠', "Kids' Pool": '🐬', 'Cycling Track': '🚴',
  '24/7 Security': '🛡️', 'CCTV Surveillance': '📹', 'Intercom': '📞',
  'Gated Entry': '🚧', 'Fire Safety': '🚒', 'Power Backup': '⚡',
  'Solar Power': '☀️', 'Rainwater Harvesting': '💧', 'EV Charging': '🔌',
  'Gas Pipeline': '🔥', 'Lift / Elevator': '🛗', 'Covered Parking': '🅿️',
  'Visitor Parking': '🚗', 'Housekeeping': '🧹', 'Concierge': '🤵',
  'Smart Home': '📱', 'Central AC': '❄️', 'Pet Friendly': '🐕',
  'Garden / Park': '🌿', 'Jogging Track': '🏃', 'Badminton Court': '🏸',
  'Tennis Court': '🎾', 'Basketball Court': '🏀', 'Cricket Pitch': '🏏',
  'Sea View': '🌊', 'Mountain View': '⛰️', 'City View': '🌃',
  'Garden View': '🌺', 'Pool View': '💦',
};

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ images, index, onClose }: {
  images: string[]; index: number; onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrent(c => (c + 1) % images.length);
      if (e.key === 'ArrowLeft') setCurrent(c => (c - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [images, onClose]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10">
        <X size={18} />
      </button>
      <button onClick={e => { e.stopPropagation(); setCurrent(c => (c - 1 + images.length) % images.length); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10">
        <ChevronLeft size={20} />
      </button>
      <img src={images[current]} alt={`Photo ${current + 1}`} className="max-w-full max-h-full object-contain rounded-lg"
        onClick={e => e.stopPropagation()} />
      <button onClick={e => { e.stopPropagation(); setCurrent(c => (c + 1) % images.length); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10">
        <ChevronRight size={20} />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        {current + 1} / {images.length}
      </div>
    </motion.div>
  );
}

// ─── Spec Row ─────────────────────────────────────────────────────────────────

function SpecRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | number | boolean | null }) {
  if (!value && value !== 0 && value !== false) return null;
  const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value);
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-2.5 text-charcoal-muted text-sm">
        <span className="text-gold shrink-0">{icon}</span>
        {label}
      </div>
      <span className="text-sm font-semibold text-charcoal text-right max-w-[60%]">{displayValue}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchProperty() {
      if (id) {
        const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
        if (!error && data) setProperty(data);
      }
      setIsLoading(false);
    }
    fetchProperty();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-charcoal-muted">Loading property...</span>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🏚️</div>
          <h2 className="text-3xl font-serif text-charcoal mb-4">Property Not Found</h2>
          <Link to="/properties" className="text-gold underline font-medium">Return to Properties</Link>
        </div>
      </div>
    );
  }

  // Gallery: use gallery array (primary first), fallback to image
  const images: string[] = property.gallery?.length
    ? property.gallery
    : property.image ? [property.image] : [];

  const typeEmoji = TYPE_EMOJI[property.type] || '🏠';
  const locationFull = [property.locality, property.city, property.state, property.pincode].filter(Boolean).join(', ')
    || property.location;
  const areaDisplay = property.carpet_area || property.super_built_up_area || property.built_up_area || property.plot_area || property.area;

  return (
    <div className="min-h-screen pb-24 pt-24">
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox images={images} index={lightboxIndex} onClose={() => setLightboxIndex(null)} />
        )}
      </AnimatePresence>

      {/* Back */}
      <div className="container mx-auto px-6 mb-5">
        <Link to="/properties" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-charcoal-muted hover:text-gold transition-colors">
          <ArrowLeft size={14} /> Back to Properties
        </Link>
      </div>

      {/* Title & Price header */}
      <div className="container mx-auto px-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-black/5 pb-8">
          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="gold-chip">{typeEmoji} {property.type}</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-charcoal-muted px-2 py-1 bg-gray-100 rounded-full">
                {property.status}
              </span>
              {property.transaction_type && property.transaction_type !== 'New Property' && (
                <span className="text-[10px] uppercase tracking-widest font-bold text-charcoal-muted px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                  {property.transaction_type}
                </span>
              )}
              {property.rera_number && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full flex items-center gap-1">
                  <Shield size={10} /> RERA: {property.rera_number}
                </span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-charcoal leading-tight">
              {property.title}
            </h1>
            <div className="flex items-start gap-2 text-charcoal-muted">
              <MapPin size={18} className="text-gold mt-0.5 shrink-0" />
              <span className="text-lg font-light">{locationFull}</span>
            </div>
          </div>

          <div className="md:text-right shrink-0">
            <div className="text-sm font-bold uppercase tracking-widest text-charcoal-muted mb-1">Asking Price</div>
            <div className="text-4xl md:text-5xl font-serif font-medium text-gold flex items-center md:justify-end gap-1">
              <IndianRupee size={30} strokeWidth={2} /> {property.price}
            </div>
            {property.price_per_sqft && (
              <div className="text-sm text-charcoal-muted mt-1">{property.price_per_sqft}</div>
            )}
            {property.maintenance && (
              <div className="text-sm text-charcoal-muted">Maintenance: ₹ {property.maintenance}</div>
            )}
            {property.is_negotiable && (
              <span className="inline-block mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                ✅ Price Negotiable
              </span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Gallery */}
      {images.length > 0 && (
        <div className="container mx-auto px-6 mb-12">
          <div className="flex flex-col gap-3">
            {/* Main image */}
            <div
              className="w-full aspect-[16/9] md:aspect-[21/9] bg-gray-100 rounded-2xl overflow-hidden relative shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-black/5 cursor-zoom-in"
              onClick={() => setLightboxIndex(activeImage)}
            >
              <img
                src={images[activeImage]}
                alt={property.title}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              {images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-2">
                  📷 {activeImage + 1} / {images.length} · Click to expand
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto custom-scrollbar pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`relative shrink-0 w-28 md:w-36 aspect-[4/3] overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                      activeImage === i
                        ? 'border-gold shadow-[0_4px_12px_rgba(184,134,11,0.2)]'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}>
                    <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <div className="absolute top-1 left-1 bg-gold/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Star size={7} fill="white" /> Primary
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">

            {/* Highlighted Features */}
            {property.highlighted_features && property.highlighted_features.length > 0 && (
              <div className="bg-gradient-to-br from-gold/5 to-transparent border border-gold/20 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
                  <Sparkles size={18} className="text-gold" /> Key Highlights
                </h2>
                <ul className="space-y-2.5">
                  {property.highlighted_features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-charcoal">
                      <div className="w-5 h-5 bg-gold/10 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={10} className="text-gold" strokeWidth={3} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                property.bedrooms && property.bedrooms > 0 && { icon: <Bed size={22} className="text-gold" />, value: `${property.bedrooms} BHK`, label: 'Bedrooms' },
                property.bathrooms && property.bathrooms > 0 && { icon: <Bath size={22} className="text-gold" />, value: property.bathrooms, label: 'Bathrooms' },
                areaDisplay && { icon: <Ruler size={22} className="text-gold" />, value: areaDisplay, label: 'Area' },
                property.balconies && property.balconies > 0 && { icon: <Home size={22} className="text-gold" />, value: property.balconies, label: 'Balconies' },
              ].filter(Boolean).map((stat: any) => (
                <div key={stat.label} className="flex flex-col items-center justify-center py-5 px-3 bg-white rounded-2xl border border-black/6 text-center">
                  {stat.icon}
                  <span className="font-bold text-lg text-charcoal mt-2 leading-tight">{stat.value}</span>
                  <span className="text-[10px] uppercase tracking-widest text-charcoal-muted font-bold mt-1">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-black/6 p-7">
              <h2 className="text-2xl font-serif font-medium text-charcoal mb-4">About this Property</h2>
              <p className="text-charcoal-muted leading-relaxed text-base font-light whitespace-pre-line">{property.description}</p>
            </div>

            {/* Property Specifications */}
            <div className="bg-white rounded-2xl border border-black/6 p-7">
              <h2 className="text-2xl font-serif font-medium text-charcoal mb-5">Property Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <div>
                  <SpecRow icon={<Building2 size={14} />} label="Property Type" value={`${typeEmoji} ${property.type}`} />
                  <SpecRow icon={<Tag size={14} />} label="Transaction" value={property.transaction_type} />
                  <SpecRow icon={<Calendar size={14} />} label="Age of Property" value={property.age_of_property} />
                  <SpecRow icon={<Calendar size={14} />} label="Possession" value={property.possession_status} />
                  <SpecRow icon={<Compass size={14} />} label="Facing" value={property.facing} />
                  <SpecRow icon={<Home size={14} />} label="Furnishing" value={property.furnishing} />
                  <SpecRow icon={<Car size={14} />} label="Parking" value={property.parking} />
                </div>
                <div>
                  {property.floor_number !== undefined && property.floor_number !== null && (
                    <SpecRow icon={<Building2 size={14} />} label="Floor" value={`${property.floor_number}${property.total_floors ? ` of ${property.total_floors}` : ''}`} />
                  )}
                  <SpecRow icon={<Ruler size={14} />} label="Super Built-up" value={property.super_built_up_area} />
                  <SpecRow icon={<Ruler size={14} />} label="Built-up Area" value={property.built_up_area} />
                  <SpecRow icon={<Ruler size={14} />} label="Carpet Area" value={property.carpet_area} />
                  <SpecRow icon={<Ruler size={14} />} label="Plot Area" value={property.plot_area} />
                  <SpecRow icon={<Droplets size={14} />} label="Water Supply" value={property.water_supply} />
                  <SpecRow icon={<Zap size={14} />} label="Power Backup" value={property.power_backup} />
                  <SpecRow icon={<Shield size={14} />} label="Gated Community" value={property.gated_community} />
                </div>
              </div>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-2xl border border-black/6 p-7">
                <h2 className="text-2xl font-serif font-medium text-charcoal mb-6">
                  Amenities <span className="text-base font-sans font-normal text-charcoal-muted">({property.amenities.length})</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map(amenity => (
                    <div key={amenity} className="flex items-center gap-2.5 p-2.5 bg-gray-50/60 rounded-xl border border-gray-100">
                      <span className="text-base shrink-0">{AMENITY_EMOJI[amenity] || '✓'}</span>
                      <span className="text-charcoal text-sm font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-4">
              {/* Contact card */}
              <div className="bg-white rounded-2xl border border-black/8 shadow-[0_4px_32px_rgba(0,0,0,0.08)] p-7">
                <h3 className="text-2xl font-serif font-medium text-charcoal mb-1">Interested?</h3>
                <p className="text-charcoal-muted text-sm mb-6 font-light">Schedule a private viewing or request a callback.</p>

                <form className="space-y-3" onSubmit={e => e.preventDefault()}>
                  <input type="text" placeholder="Your Name" className="form-input" />
                  <input type="tel" placeholder="Phone Number" className="form-input" />
                  <input type="email" placeholder="Email Address" className="form-input" />
                  <textarea placeholder="Message (Optional)" rows={3} className="form-input resize-none" />
                  <button type="submit" className="btn-gold w-full">Request Callback</button>
                </form>

                <div className="mt-6 pt-5 border-t border-black/5 space-y-3">
                  <a href="tel:+918442083670" className="btn-outline w-full justify-center">
                    <Phone size={15} /> Call Us Now
                  </a>
                  <a href="https://wa.me/918442083670" target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-[#25D366] text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-[#128C7E] transition-colors">
                    <MessageCircle size={15} /> WhatsApp
                  </a>
                </div>
              </div>

              {/* Location mini-card */}
              {(property.city || property.locality) && (
                <div className="bg-white rounded-2xl border border-black/6 p-5">
                  <h4 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
                    <MapPin size={14} className="text-gold" /> Location
                  </h4>
                  <p className="text-sm text-charcoal-muted leading-relaxed">
                    {[property.locality, property.city, property.state, property.pincode].filter(Boolean).join(', ')}
                  </p>
                </div>
              )}

              {/* Price breakdown mini-card */}
              <div className="bg-gold/5 border border-gold/20 rounded-2xl p-5">
                <h4 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
                  <IndianRupee size={14} className="text-gold" /> Price Summary
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-muted">Asking Price</span>
                    <span className="font-bold text-charcoal">₹ {property.price}</span>
                  </div>
                  {property.price_per_sqft && (
                    <div className="flex justify-between text-sm">
                      <span className="text-charcoal-muted">Rate</span>
                      <span className="font-semibold text-charcoal">{property.price_per_sqft}</span>
                    </div>
                  )}
                  {property.maintenance && (
                    <div className="flex justify-between text-sm">
                      <span className="text-charcoal-muted">Maintenance</span>
                      <span className="font-semibold text-charcoal">₹ {property.maintenance}/mo</span>
                    </div>
                  )}
                  {property.is_negotiable && (
                    <div className="pt-2 border-t border-gold/20 text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <Check size={11} /> Price is negotiable
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
