import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Bed, Bath, Check, ArrowLeft, Phone,
  MessageCircle, Ruler, IndianRupee, ChevronLeft, ChevronRight,
  X, Shield, Zap, Droplets, Car, Star, Home, Building2,
  Calendar, Compass, Tag, Sparkles, Calculator, ChevronDown, ChevronUp, Info, ExternalLink
} from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import type { Property } from '../types/property';
import { useTranslation } from 'react-i18next';

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

function SpecRow({ icon, label, value, t }: { icon: React.ReactNode; label: string; value?: string | number | boolean | null; t: any }) {
  if (!value && value !== 0 && value !== false) return null;
  const displayValue = typeof value === 'boolean' ? (value ? t('details.yes', 'Yes') : t('details.no', 'No')) : String(value);
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

// ─── Inline EMI Calculator ────────────────────────────────────────────────────

function calcEMI(principal: number, annualRate: number, months: number): number {
  if (principal <= 0 || months <= 0) return 0;
  if (annualRate === 0) return principal / months;
  const r = annualRate / 12 / 100;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

const fmtINR = (n: number) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.round(n));

const fmtLakhs = (n: number) => {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(2)} L`;
  return `₹${fmtINR(n)}`;
};

interface InlineSliderProps {
  min: number; max: number; step: number; value: number;
  onChange: (v: number) => void; color?: string;
}
function InlineSlider({ min, max, step, value, onChange, color = '#C9A84C' }: InlineSliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="relative w-full h-5 flex items-center group">
      <div className="absolute w-full h-1 rounded-full bg-black/8" />
      <div className="absolute h-1 rounded-full" style={{ width: `${pct}%`, background: color }} />
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="absolute w-full opacity-0 cursor-pointer h-full z-10" />
      <div className="absolute w-4 h-4 rounded-full border-2 bg-white shadow-sm transition-all group-hover:scale-110"
        style={{ left: `calc(${pct}% - ${pct * 0.16}px)`, borderColor: color, boxShadow: `0 2px 6px ${color}44` }} />
    </div>
  );
}

// ─── Price string parser ─────────────────────────────────────────────────────
// Converts display strings like "₹ 1.5 Cr", "45 L", "₹ 85,00,000" → raw number
function parsePriceString(raw?: string): number {
  if (!raw) return 0;
  const s = raw.replace(/[₹,\s]/g, '').toLowerCase();
  const crMatch = s.match(/^(\d+(?:\.\d+)?)(cr|crore|c)/);
  if (crMatch) return parseFloat(crMatch[1]) * 10_000_000;
  const lMatch = s.match(/^(\d+(?:\.\d+)?)(l|lakh|lakhs|lac|lacs)/);
  if (lMatch) return parseFloat(lMatch[1]) * 100_000;
  const kMatch = s.match(/^(\d+(?:\.\d+)?)(k|thousand)/);
  if (kMatch) return parseFloat(kMatch[1]) * 1_000;
  const plain = parseFloat(s);
  return isNaN(plain) ? 0 : plain;
}

function InlineEMICalculator({ price, t }: { price?: number; t: any }) {
  const [open, setOpen] = useState(false);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(15);

  const propertyPrice = price ?? 0;
  const loanAmt = useMemo(() => propertyPrice * (1 - downPct / 100), [propertyPrice, downPct]);
  const months = tenure * 12;
  const emi = useMemo(() => calcEMI(loanAmt, rate, months), [loanAmt, rate, months]);
  const totalPay = emi * months;
  const totalInt = totalPay - loanAmt;

  if (!propertyPrice) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#C9A84C]/15 overflow-hidden shadow-[0_2px_16px_rgba(0,0,0,0.06)]">
      {/* Header toggle */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#C9A84C]/4 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center">
            <Calculator size={13} className="text-[#C9A84C]" />
          </div>
          <span className="text-sm font-semibold text-charcoal">
            {t('emi.title', 'EMI Calculator')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!open && emi > 0 && (
            <span className="text-xs font-bold text-[#C9A84C]">
              ~{fmtLakhs(emi)}/mo
            </span>
          )}
          {open ? <ChevronUp size={15} className="text-charcoal-muted" /> : <ChevronDown size={15} className="text-charcoal-muted" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="border-t border-black/5"
          >
            <div className="p-5 space-y-5">
              {/* Property Price (read-only) */}
              <div className="bg-[#1A1A1A]/4 rounded-xl px-4 py-3 flex items-center justify-between">
                <span className="text-xs text-charcoal-muted font-medium">
                  {t('emi.property_price', 'Property Price')}
                </span>
                <span className="text-sm font-bold text-charcoal">{fmtLakhs(propertyPrice)}</span>
              </div>

              {/* Down Payment */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-charcoal-muted">
                    {t('emi.down_payment', 'Down Payment')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-charcoal-muted">{fmtLakhs(loanAmt)} {t('emi.loan_amt', 'loan')}</span>
                    <span className="text-xs font-bold text-charcoal bg-black/5 px-2 py-0.5 rounded-full">{downPct}%</span>
                  </div>
                </div>
                <InlineSlider min={5} max={80} step={5} value={downPct} onChange={setDownPct} color="#1A1A1A" />
                <div className="flex justify-between mt-1 text-[10px] text-charcoal-muted/60">
                  <span>5%</span><span>80%</span>
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-charcoal-muted">
                    {t('emi.interest_rate', 'Interest Rate')}
                  </span>
                  <span className="text-xs font-bold text-charcoal bg-black/5 px-2 py-0.5 rounded-full">{rate}% p.a.</span>
                </div>
                <InlineSlider min={6} max={16} step={0.5} value={rate} onChange={setRate} />
                <div className="flex justify-between mt-1 text-[10px] text-charcoal-muted/60">
                  <span>6%</span><span>16%</span>
                </div>
                {/* Quick presets */}
                <div className="flex gap-1.5 mt-2.5 flex-wrap">
                  {[7.5, 8, 8.5, 9, 9.5].map(r => (
                    <button key={r} onClick={() => setRate(r)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${rate === r ? 'bg-[#C9A84C] text-[#1A1A1A] border-[#C9A84C]' : 'border-black/10 text-charcoal-muted hover:border-[#C9A84C]/40'}`}>
                      {r}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Tenure */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-charcoal-muted">
                    {t('emi.tenure', 'Loan Tenure')}
                  </span>
                  <span className="text-xs font-bold text-charcoal bg-black/5 px-2 py-0.5 rounded-full">{tenure} {t('emi.years', 'yrs')}</span>
                </div>
                <InlineSlider min={1} max={30} step={1} value={tenure} onChange={setTenure} color="#1A1A1A" />
                <div className="flex justify-between mt-1 text-[10px] text-charcoal-muted/60">
                  <span>1 yr</span><span>30 yrs</span>
                </div>
                {/* Quick presets */}
                <div className="flex gap-1.5 mt-2.5">
                  {[10, 15, 20, 25, 30].map(y => (
                    <button key={y} onClick={() => setTenure(y)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${tenure === y ? 'bg-[#1A1A1A] text-[#E8D08A] border-[#1A1A1A]' : 'border-black/10 text-charcoal-muted hover:border-black/20'}`}>
                      {y}Y
                    </button>
                  ))}
                </div>
              </div>

              {/* Result */}
              <div className="bg-[#1A1A1A] rounded-xl p-4 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#C9A84C]/15 rounded-full blur-2xl" />
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C9A84C]/70 mb-1">
                    {t('emi.monthly_emi', 'Monthly EMI')}
                  </p>
                  <p className="text-2xl font-sans font-bold text-white">
                    {fmtLakhs(emi)}
                  </p>
                  <div className="mt-3 pt-3 border-t border-white/8 grid grid-cols-2 gap-2 text-[10px]">
                    <div>
                      <p className="text-white/40 mb-0.5">{t('emi.principal', 'Principal')}</p>
                      <p className="text-white/80 font-semibold">{fmtLakhs(loanAmt)}</p>
                    </div>
                    <div>
                      <p className="text-white/40 mb-0.5">{t('emi.total_interest', 'Interest')}</p>
                      <p className="text-[#E8D08A] font-semibold">{fmtLakhs(totalInt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tip */}
              <div className="flex gap-2 text-[10px] text-charcoal-muted/70 leading-relaxed">
                <Info size={12} className="text-[#C9A84C] shrink-0 mt-0.5" />
                {t('emi.tip', 'Estimate only. Actual EMI may vary by lender.')}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
  const { t } = useTranslation();

  // Lead form state
  const [leadForm, setLeadForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadStatus, setLeadStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name.trim() || !leadForm.phone.trim()) return;
    setLeadSubmitting(true);
    const { error } = await supabase.from('leads').insert([{
      property_id: id || null,
      property_title: property?.title || '',
      name: leadForm.name.trim(),
      phone: leadForm.phone.trim(),
      email: leadForm.email.trim() || null,
      message: leadForm.message.trim() || null,
      status: 'new',
    }]);
    setLeadSubmitting(false);
    if (error) {
      setLeadStatus('error');
    } else {
      setLeadStatus('success');
      setLeadForm({ name: '', phone: '', email: '', message: '' });
    }
  };

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
          <span className="text-sm text-charcoal-muted">{t('details.loading', 'Loading property...')}</span>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🏚️</div>
          <h2 className="text-3xl font-serif text-charcoal mb-4">{t('details.not_found', 'Property Not Found')}</h2>
          <Link to="/properties" className="text-gold underline font-medium">{t('details.return', 'Return to Properties')}</Link>
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
          <ArrowLeft size={14} /> {t('details.back', 'Back to Properties')}
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
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-serif font-medium text-charcoal leading-tight">
              {property.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-charcoal-muted">
              <MapPin size={16} className="text-gold shrink-0" />
              <span className="text-base font-light leading-snug">{locationFull}</span>
              {property.map_link && (
                <a
                  href={property.map_link}
                  target="_blank"
                  rel="noreferrer"
                  title="View on Google Maps"
                  className="inline-flex items-center gap-1 text-xs font-bold text-white bg-gold hover:bg-gold-light px-2.5 py-1 rounded-full transition-colors shadow-sm shrink-0"
                >
                  <MapPin size={11} /> View Map <ExternalLink size={10} />
                </a>
              )}
            </div>
          </div>

          <div className="md:text-right shrink-0">
            <div className="text-xs font-bold uppercase tracking-widest text-charcoal-muted mb-1">{t('details.asking_price', 'Asking Price')}</div>
            <div className="text-2xl md:text-4xl font-sans font-bold text-[#C9A84C] flex items-center md:justify-end gap-0.5">
              {property.price}
            </div>
            {property.price_per_sqft && (
              <div className="text-sm text-charcoal-muted mt-1">{property.price_per_sqft}</div>
            )}
            {property.maintenance && (
              <div className="text-sm text-charcoal-muted">{t('details.maintenance', 'Maintenance')}: ₹ {property.maintenance}</div>
            )}
            {property.is_negotiable && (
              <span className="inline-block mt-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                ✅ {t('details.negotiable', 'Price Negotiable')}
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
                  📷 {activeImage + 1} / {images.length} · {t('details.expand', 'Click to expand')}
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
                        ? 'border-[#C9A84C] shadow-[0_4px_12px_rgba(201,168,76,0.25)]'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}>
                    <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <div className="absolute top-1 left-1 bg-gold/90 text-white text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Star size={7} fill="white" /> {t('details.primary', 'Primary')}
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
              <div className="bg-gradient-to-br from-[#C9A84C]/8 to-transparent border border-[#C9A84C]/20 rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
                  <Sparkles size={18} className="text-gold" /> {t('details.highlights', 'Key Highlights')}
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
                property.bedrooms && property.bedrooms > 0 && { icon: <Bed size={22} className="text-gold" />, value: `${property.bedrooms} BHK`, label: t('details.bedrooms', 'Bedrooms') },
                property.bathrooms && property.bathrooms > 0 && { icon: <Bath size={22} className="text-gold" />, value: property.bathrooms, label: t('details.bathrooms', 'Bathrooms') },
                areaDisplay && { icon: <Ruler size={22} className="text-gold" />, value: areaDisplay, label: t('details.area', 'Area') },
                property.balconies && property.balconies > 0 && { icon: <Home size={22} className="text-gold" />, value: property.balconies, label: t('details.balconies', 'Balconies') },
              ].filter(Boolean).map((stat: any) => (
                <div key={stat.label} className="flex flex-col items-center justify-center py-5 px-3 bg-white rounded-2xl border border-black/6 text-center">
                  {stat.icon}
                  <span className="font-bold text-lg text-charcoal mt-2 leading-tight">{stat.value}</span>
                  <span className="text-[10px] uppercase tracking-widest text-charcoal-muted font-bold mt-1">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-black/6 p-5 md:p-7">
              <h2 className="text-xl md:text-2xl font-serif font-medium text-charcoal mb-4">{t('details.about', 'About this Property')}</h2>
              <p className="text-charcoal-muted leading-relaxed text-sm md:text-base font-light whitespace-pre-line">{property.description}</p>
            </div>

            {/* Property Specifications */}
            <div className="bg-white rounded-2xl border border-black/6 p-5 md:p-7">
              <h2 className="text-xl md:text-2xl font-serif font-medium text-charcoal mb-5">{t('details.prop_details', 'Property Details')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <div>
                  <SpecRow icon={<Building2 size={14} />} label={t('details.type', 'Property Type')} value={`${typeEmoji} ${property.type}`} t={t} />
                  <SpecRow icon={<Tag size={14} />} label={t('details.transaction', 'Transaction')} value={property.transaction_type} t={t} />
                  <SpecRow icon={<Calendar size={14} />} label={t('details.age', 'Age of Property')} value={property.age_of_property} t={t} />
                  <SpecRow icon={<Calendar size={14} />} label={t('details.possession', 'Possession')} value={property.possession_status} t={t} />
                  <SpecRow icon={<Compass size={14} />} label={t('details.facing', 'Facing')} value={property.facing} t={t} />
                  <SpecRow icon={<Home size={14} />} label={t('details.furnishing', 'Furnishing')} value={property.furnishing} t={t} />
                  <SpecRow icon={<Car size={14} />} label={t('details.parking', 'Parking')} value={property.parking} t={t} />
                </div>
                <div>
                  {property.floor_number !== undefined && property.floor_number !== null && (
                    <SpecRow icon={<Building2 size={14} />} label={t('details.floor', 'Floor')} value={`${property.floor_number}${property.total_floors ? ` ${t('details.of', 'of')} ${property.total_floors}` : ''}`} t={t} />
                  )}
                  <SpecRow icon={<Ruler size={14} />} label={t('details.super_built_up', 'Super Built-up')} value={property.super_built_up_area} t={t} />
                  <SpecRow icon={<Ruler size={14} />} label={t('details.built_up', 'Built-up Area')} value={property.built_up_area} t={t} />
                  <SpecRow icon={<Ruler size={14} />} label={t('details.carpet', 'Carpet Area')} value={property.carpet_area} t={t} />
                  <SpecRow icon={<Ruler size={14} />} label={t('details.plot_area', 'Plot Area')} value={property.plot_area} t={t} />
                  <SpecRow icon={<Droplets size={14} />} label={t('details.water', 'Water Supply')} value={property.water_supply} t={t} />
                  <SpecRow icon={<Zap size={14} />} label={t('details.power', 'Power Backup')} value={property.power_backup} t={t} />
                  <SpecRow icon={<Shield size={14} />} label={t('details.gated', 'Gated Community')} value={property.gated_community} t={t} />
                </div>
              </div>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-white rounded-2xl border border-black/6 p-5 md:p-7">
                <h2 className="text-xl md:text-2xl font-serif font-medium text-charcoal mb-5">
                  {t('details.amenities', 'Amenities')} <span className="text-sm md:text-base font-sans font-normal text-charcoal-muted">({property.amenities.length})</span>
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

            {/* ─── EMI Calculator ─── */}
            <InlineEMICalculator
              price={property.price_numeric ?? parsePriceString(property.price)}
              t={t}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-4">
              {/* Contact card */}
              <div className="bg-white rounded-2xl border border-[#C9A84C]/15 shadow-[0_4px_32px_rgba(0,0,0,0.08)] p-7">
                <h3 className="text-2xl font-serif font-medium text-charcoal mb-1">{t('details.interested', 'Interested?')}</h3>
                <p className="text-charcoal-muted text-sm mb-6 font-light">{t('details.schedule', 'Schedule a private viewing or request a callback.')}</p>

                {leadStatus === 'success' ? (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check size={24} className="text-emerald-600" />
                    </div>
                    <h4 className="font-semibold text-charcoal mb-1">{t('details.received', 'Request Received!')}</h4>
                    <p className="text-sm text-charcoal-muted mb-4">{t('details.shortly', "We'll get back to you shortly.")}</p>
                    <button
                      onClick={() => setLeadStatus('idle')}
                      className="text-xs text-gold underline font-medium"
                    >
                      {t('details.another', 'Submit another enquiry')}
                    </button>
                  </div>
                ) : (
                  <form className="space-y-3" onSubmit={handleLeadSubmit}>
                    <div>
                      <input
                        type="text"
                        placeholder={t('details.name', 'Your Name *')}
                        value={leadForm.name}
                        onChange={e => setLeadForm(f => ({ ...f, name: e.target.value }))}
                        required
                        className="form-input"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder={t('details.phone', 'Phone Number *')}
                        value={leadForm.phone}
                        onChange={e => setLeadForm(f => ({ ...f, phone: e.target.value }))}
                        required
                        className="form-input"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder={t('details.email', 'Email Address')}
                        value={leadForm.email}
                        onChange={e => setLeadForm(f => ({ ...f, email: e.target.value }))}
                        className="form-input"
                      />
                    </div>
                    <div>
                      <textarea
                        placeholder={t('details.message', 'Message (Optional)')}
                        rows={3}
                        value={leadForm.message}
                        onChange={e => setLeadForm(f => ({ ...f, message: e.target.value }))}
                        className="form-input resize-none"
                      />
                    </div>
                    {leadStatus === 'error' && (
                      <p className="text-xs text-red-500">{t('details.error', 'Something went wrong. Please try again.')}</p>
                    )}
                    <button
                      type="submit"
                      disabled={leadSubmitting}
                      className="btn-gold w-full disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {leadSubmitting ? t('details.submitting', 'Submitting…') : t('details.callback', 'Request Callback')}
                    </button>
                  </form>
                )}

                <div className="mt-6 pt-5 border-t border-black/5 space-y-3">
                  <a href="tel:+918442083670" className="btn-outline w-full justify-center">
                    <Phone size={15} /> {t('details.call_us', 'Call Us Now')}
                  </a>
                  <a href="https://wa.me/918442083670" target="_blank" rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-[#25D366] text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-[#128C7E] transition-colors">
                    <MessageCircle size={15} /> {t('mobile.whatsapp', 'WhatsApp')}
                  </a>
                </div>
              </div>

              {/* Location mini-card */}
              {(property.city || property.locality) && (
                <div className="bg-white rounded-2xl border border-black/6 p-5">
                  <h4 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
                    <MapPin size={14} className="text-gold" /> {t('details.location', 'Location')}
                  </h4>
                  <p className="text-sm text-charcoal-muted leading-relaxed">
                    {[property.locality, property.city, property.state, property.pincode].filter(Boolean).join(', ')}
                  </p>
                  {property.map_link && (() => {
                      /**
                       * Convert any Google Maps share URL into an embeddable src.
                       * Strategy:
                       *  1. If it already contains output=embed → use as-is.
                       *  2. For /maps/place/PLACE/@lat,lng,zoom → build
                       *     maps.google.com/maps?q=PLACE&ll=lat,lng&z=zoom&output=embed
                       *  3. Fallback: append &output=embed to whatever URL we have.
                       */
                      let embedSrc = '';
                      try {
                        const raw = property.map_link!;

                        // Already an embed URL
                        if (raw.includes('output=embed')) {
                          embedSrc = raw;
                        } else {
                          // Try to extract place name, lat, lng, zoom from /place/NAME/@lat,lng,zoom
                          const placeMatch = raw.match(/\/maps\/place\/([^/]+)\/@(-?\d+\.\d+),(-?\d+\.\d+),(\d+)/);
                          if (placeMatch) {
                            const [, place, lat, lng, zoom] = placeMatch;
                            const q = decodeURIComponent(place.replace(/\+/g, ' '));
                            embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(q)}&ll=${lat},${lng}&z=${zoom}&output=embed`;
                          } else {
                            // Generic fallback — just add output=embed
                            const url = new URL(raw);
                            url.searchParams.set('output', 'embed');
                            embedSrc = url.toString();
                          }
                        }
                      } catch {
                        embedSrc = property.map_link!;
                      }

                      return (
                        <>
                          <div className="mt-3 rounded-xl overflow-hidden border border-black/6 shadow-sm" style={{ height: 220 }}>
                            <iframe
                              src={embedSrc}
                              width="100%"
                              height="220"
                              style={{ border: 0 }}
                              allowFullScreen
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                              title="Property Location"
                            />
                          </div>
                          <a
                            href={property.map_link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-gold hover:text-gold-light transition-colors"
                          >
                            <ExternalLink size={12} /> Open in Google Maps
                          </a>
                        </>
                      );
                    })()
                  }
                </div>
              )}

              {/* Price breakdown mini-card */}
              <div className="bg-[#C9A84C]/6 border border-[#C9A84C]/20 rounded-2xl p-5">
                <h4 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
                  <IndianRupee size={14} className="text-gold" /> {t('details.price_summary', 'Price Summary')}
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-muted">{t('details.asking_price', 'Asking Price')}</span>
                    <span className="font-bold text-charcoal">{property.price}</span>
                  </div>
                  {property.price_per_sqft && (
                    <div className="flex justify-between text-sm">
                      <span className="text-charcoal-muted">{t('details.rate', 'Rate')}</span>
                      <span className="font-semibold text-charcoal">{property.price_per_sqft}</span>
                    </div>
                  )}
                  {property.maintenance && (
                    <div className="flex justify-between text-sm">
                      <span className="text-charcoal-muted">{t('details.maintenance', 'Maintenance')}</span>
                      <span className="font-semibold text-charcoal">{property.maintenance}{t('details.mo', '/mo')}</span>
                    </div>
                  )}
                  {property.is_negotiable && (
                    <div className="pt-2 border-t border-gold/20 text-xs text-emerald-700 font-semibold flex items-center gap-1">
                      <Check size={11} /> {t('details.negotiable', 'Price is negotiable')}
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
