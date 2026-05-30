import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Search, Bed, Bath, SlidersHorizontal,
  X, ChevronDown, IndianRupee, Ruler,
  MoveRight, Building2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Property } from '../types/property';
import { useTranslation } from 'react-i18next';

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

type SortOption = 'newest' | 'price_asc' | 'price_desc';

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  'Available':          { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-400' },
  'Ready to Move':      { bg: 'bg-emerald-50',  text: 'text-emerald-700', dot: 'bg-emerald-400' },
  'Under Construction': { bg: 'bg-amber-50',    text: 'text-amber-700',   dot: 'bg-amber-400'   },
  'Under Offer':        { bg: 'bg-orange-50',   text: 'text-orange-700',  dot: 'bg-orange-400'  },
  'Rented':             { bg: 'bg-blue-50',     text: 'text-blue-700',    dot: 'bg-blue-400'    },
  'Sold':               { bg: 'bg-red-50',      text: 'text-red-700',     dot: 'bg-red-400'     },
  'Off Market':         { bg: 'bg-gray-100',    text: 'text-gray-600',    dot: 'bg-gray-400'    },
};

const TYPE_EMOJI: Record<string, string> = {
  'Apartment': '🏢', 'Villa': '🏠', 'Independent House': '🏡', 'Plot': '🏗️',
  'Penthouse': '🏰', 'Studio': '🛋️', 'Duplex': '🏘️', 'Farmhouse': '🌾',
  'Commercial': '🏬', 'Warehouse': '🏭', 'Office Space': '💼', 'Shop': '🏪',
  'Townhouse': '🏚️',
};

const STATUS_EMOJI: Record<string, string> = {
  'Available': '✅', 'Ready to Move': '🎉', 'Under Construction': '🔨',
  'Under Offer': '✋', 'Rented': '🔑', 'Sold': '🏷️', 'Off Market': '🚫',
};

const SORT_LABELS: Record<SortOption, string> = {
  'newest':     'Newest First',
  'price_asc':  'Price ↑',
  'price_desc': 'Price ↓',
};

// ─────────────────────────────────────────────────────────────────────────────
// PROPERTY CARD
// ─────────────────────────────────────────────────────────────────────────────

function PropertyCard({ property, index, featured = false }: {
  property: Property; index: number; featured?: boolean;
}) {
  const primaryImage = property.gallery?.[0] || property.image;
  const areaDisplay = property.carpet_area || property.super_built_up_area
    || property.built_up_area || property.plot_area || property.area;
  const locationDisplay = property.locality
    ? `${property.locality}${property.city ? `, ${property.city}` : ''}`
    : property.location;
  const statusStyle = STATUS_COLORS[property.status] || STATUS_COLORS['Off Market'];
  const { t } = useTranslation();
  const isPlot = property.type === 'Plot';

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.45), ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link to={`/properties/${property.id}`} className="block">
        {/* ── IMAGE ───────────────────────────────────────────────────────── */}
        <div className={`relative overflow-hidden rounded-2xl bg-gray-100 ${featured ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-ivory-100 to-ivory-200">
              <span className="text-6xl opacity-20 mb-2">{TYPE_EMOJI[property.type] || '🏠'}</span>
              <span className="text-xs font-semibold text-charcoal-muted uppercase tracking-wider opacity-40">{property.type}</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

          {/* Top right: type badge */}
          <div className="absolute top-4 right-4">
            <span className="gold-chip text-[9px] tracking-[0.12em]">
              {TYPE_EMOJI[property.type] || ''} {property.type}
            </span>
          </div>

          {/* Top left: transaction type */}
          {property.transaction_type === 'Resale' && (
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 backdrop-blur-sm text-charcoal text-[9px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded">
                {t('props.resale', 'Resale')}
              </span>
            </div>
          )}

          {/* Bottom: price overlaid on image for featured card */}
          {featured && (
            <div className="absolute bottom-5 left-5 right-5">
              <div className="text-white/70 text-[10px] font-semibold uppercase tracking-[0.15em] mb-0.5">{t('props.asking_price', 'Asking Price')}</div>
              <div className="text-white text-3xl font-serif flex items-baseline gap-1">
                <IndianRupee size={18} strokeWidth={1.5} /> {property.price}
              </div>
            </div>
          )}

          {/* Photo count pill */}
          {(property.gallery?.length ?? 0) > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
              {property.gallery!.length} {t('props.photos', 'Photos')}
            </div>
          )}
        </div>

        {/* ── CONTENT ─────────────────────────────────────────────────────── */}
        <div className="mt-4 px-1">
          {/* Status + Location row */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5 text-charcoal-muted text-xs font-medium">
              <MapPin size={11} className="text-gold shrink-0" />
              <span className="truncate max-w-[200px]">{locationDisplay}</span>
            </div>
            <div className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusStyle.dot}`} />
              {property.status}
            </div>
          </div>

          {/* Title */}
          <h3 className={`font-serif text-charcoal leading-snug mb-3 group-hover:text-[#C9A84C] transition-colors duration-300 ${featured ? 'text-2xl' : 'text-lg'}`}>
            {property.title}
          </h3>

          {/* Price (non-featured) */}
          {!featured && (
            <div className="mb-3">
              <div className="flex items-baseline gap-1">
                <IndianRupee size={13} className="text-[#C9A84C]" strokeWidth={2.5} />
                <span className="text-xl font-serif text-[#C9A84C]">{property.price}</span>
              </div>
              {property.price_per_sqft && (
                <div className="text-xs text-charcoal-muted mt-0.5">{property.price_per_sqft}</div>
              )}
            </div>
          )}

          {/* Specs strip */}
          <div className="flex items-center gap-4">
            {!isPlot && (property.bedrooms ?? 0) > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-charcoal-muted font-medium">
                <Bed size={13} className="text-gold/80" />
                {property.bedrooms} {t('props.bed', 'Bed')}
              </span>
            )}
            {!isPlot && (property.bathrooms ?? 0) > 0 && (
              <span className="flex items-center gap-1.5 text-xs text-charcoal-muted font-medium">
                <Bath size={13} className="text-gold/80" />
                {property.bathrooms} {t('props.bath', 'Bath')}
              </span>
            )}
            {areaDisplay && (
              <span className="flex items-center gap-1.5 text-xs text-charcoal-muted font-medium">
                <Ruler size={12} className="text-gold/80" />
                {areaDisplay}
              </span>
            )}
            {property.is_negotiable && (
              <span className="ml-auto text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                {t('props.negotiable', 'Negotiable')}
              </span>
            )}
          </div>

          {/* CTA underline on hover */}
          <div className="mt-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-charcoal-muted group-hover:text-gold transition-colors duration-300">
            {t('props.view_details', 'View Details')}
            <MoveRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
          </div>

          {/* Gold underline accent */}
          <div className="mt-2 h-px bg-gradient-to-r from-gold/30 via-gold/60 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </div>
      </Link>
    </motion.article>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON CARD
// ─────────────────────────────────────────────────────────────────────────────

function SkeletonCard({ featured = false }: { featured?: boolean }) {
  return (
    <div className="animate-pulse">
      <div className={`rounded-2xl bg-gray-100 ${featured ? 'aspect-[16/10]' : 'aspect-[4/3]'}`} />
      <div className="mt-4 px-1 space-y-2.5">
        <div className="flex justify-between items-center">
          <div className="h-3 bg-gray-100 rounded w-32" />
          <div className="h-5 bg-gray-100 rounded-full w-20" />
        </div>
        <div className="h-5 bg-gray-100 rounded w-3/4" />
        <div className="h-6 bg-gray-100 rounded w-1/3" />
        <div className="flex gap-4">
          <div className="h-3 bg-gray-100 rounded w-16" />
          <div className="h-3 bg-gray-100 rounded w-16" />
          <div className="h-3 bg-gray-100 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FILTER CHIP
// ─────────────────────────────────────────────────────────────────────────────

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 whitespace-nowrap ${
        active
          ? 'bg-[#1A1A1A] text-[#E8D08A] border-[#1A1A1A] shadow-sm'
          : 'bg-transparent text-charcoal-muted border-black/10 hover:border-[#C9A84C]/40 hover:text-charcoal'
      }`}
    >
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) setProperties(data);
        setIsLoading(false);
      });
  }, []);

  const types = useMemo(() =>
    ['All', ...Array.from(new Set(properties.map(p => p.type)))], [properties]);
  const statuses = useMemo(() =>
    ['All', ...Array.from(new Set(properties.map(p => p.status)))], [properties]);

  const filtered = useMemo(() => {
    let result = properties.filter(p => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q ||
        (p.title || '').toLowerCase().includes(q) ||
        (p.location || '').toLowerCase().includes(q) ||
        (p.city || '').toLowerCase().includes(q) ||
        (p.locality || '').toLowerCase().includes(q) ||
        (p.state || '').toLowerCase().includes(q) ||
        (p.type || '').toLowerCase().includes(q);
      return matchSearch
        && (selectedType === 'All' || p.type === selectedType)
        && (selectedStatus === 'All' || p.status === selectedStatus);
    });

    if (sortBy === 'price_asc')  result = [...result].sort((a, b) => (a.price_numeric ?? 0) - (b.price_numeric ?? 0));
    if (sortBy === 'price_desc') result = [...result].sort((a, b) => (b.price_numeric ?? 0) - (a.price_numeric ?? 0));
    return result;
  }, [properties, searchQuery, selectedType, selectedStatus, sortBy]);

  const hasFilters = selectedType !== 'All' || selectedStatus !== 'All' || !!searchQuery;
  const clearAll = () => { setSearchQuery(''); setSelectedType('All'); setSelectedStatus('All'); setSortBy('newest'); };

  // First card is "featured" (wider) when we have a clean 3-col layout

  return (
    <div className="min-h-screen">

      {/* ── HERO HEADER ─────────────────────────────────────────────── */}
      <div className="relative pt-32 pb-16 overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 10% 50%, rgba(184,134,11,0.05) 0%, transparent 70%), radial-gradient(ellipse 50% 70% at 90% 20%, rgba(184,134,11,0.04) 0%, transparent 60%)'
          }}
        />

        <div className="container mx-auto px-6 md:px-10">
          <div className="max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="section-label mb-6 justify-start"
            >
              <span>{t('props.curated', 'Curated Portfolio')}</span>
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="text-5xl md:text-7xl font-serif font-medium text-charcoal leading-[1.05] mb-6"
            >
              {t('props.title_1', 'Exceptional')}<br />
              <span className="text-gradient-gold italic">{t('props.title_2', 'Properties')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-charcoal-muted text-lg font-light max-w-xl leading-relaxed"
            >
              {t('props.desc', 'Each listing hand-selected for its architectural merit, location, and investment potential.')}
            </motion.p>
          </div>
        </div>
      </div>

      {/* ── FILTER BAR ──────────────────────────────────────────────── */}
      <div className="sticky top-16 z-30 bg-ivory-50/95 backdrop-blur-lg border-b border-black/5 shadow-sm">
        <div className="container mx-auto px-6 md:px-10 py-3">
          <div className="flex items-center gap-3">

            {/* Search */}
            <div className="search-wrap flex-1 max-w-sm">
              <Search size={14} className="search-icon" style={{ color: '#B8860B' }} />
              <input
                type="text"
                placeholder={t('props.search_placeholder', 'Search properties, cities, types...')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="form-input text-sm"
                style={{
                  paddingTop: '9px', paddingBottom: '9px',
                  borderRadius: '8px', background: 'white',
                  fontSize: '0.8125rem'
                }}
              />
            </div>

            {/* Divider */}
            <div className="h-5 w-px bg-black/10 hidden sm:block" />

            {/* Type chips (scrollable) */}
            <div className="hidden md:flex items-center gap-2 overflow-x-auto hide-scrollbar flex-1">
              {types.slice(0, 6).map(t_type => (
                <FilterChip key={t_type} label={t_type === 'All' ? t('props.all_types', 'All Types') : `${TYPE_EMOJI[t_type] || ''} ${t_type}`}
                  active={selectedType === t_type} onClick={() => setSelectedType(t_type)} />
              ))}
            </div>

            {/* Advanced filters toggle */}
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all shrink-0 ${
                showFilters || hasFilters
                  ? 'bg-[#1A1A1A] text-[#E8D08A] border-[#1A1A1A]'
                  : 'border-black/10 text-charcoal-muted hover:border-[#C9A84C]/40 hover:text-charcoal'
              }`}
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">{t('props.filters', 'Filters')}</span>
              {hasFilters && (
                <span className="w-4 h-4 bg-gold text-white rounded-full text-[9px] font-bold flex items-center justify-center leading-none">
                  {[selectedType !== 'All', selectedStatus !== 'All', !!searchQuery].filter(Boolean).length}
                </span>
              )}
            </button>

            {/* Sort */}
            <div className="relative shrink-0">
              <select value={sortBy} onChange={e => setSortBy(e.target.value as SortOption)}
                className="form-input appearance-none text-xs font-semibold pr-7"
                style={{ paddingTop: '9px', paddingBottom: '9px', paddingRight: '28px', paddingLeft: '12px', minWidth: '130px', background: 'white' }}>
                {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([v, l]) => (
                  <option key={v} value={v}>{t(`props.sort_${v}`, l)}</option>
                ))}
              </select>
              <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-charcoal-muted pointer-events-none" />
            </div>
          </div>

          {/* Expanded filter panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="pt-3 pb-1 border-t border-black/5 mt-3 flex flex-wrap gap-x-8 gap-y-3">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-charcoal-muted mb-2">{t('props.prop_type', 'Property Type')}</p>
                    <div className="flex flex-wrap gap-2">
                      {types.map(t => (
                        <FilterChip key={t} label={t === 'All' ? 'All' : `${TYPE_EMOJI[t] || ''} ${t}`}
                          active={selectedType === t} onClick={() => setSelectedType(t)} />
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-charcoal-muted mb-2">{t('props.availability', 'Availability')}</p>
                    <div className="flex flex-wrap gap-2">
                      {statuses.map(s => (
                        <FilterChip key={s} label={s === 'All' ? 'All' : `${STATUS_EMOJI[s] || ''} ${s}`}
                          active={selectedStatus === s} onClick={() => setSelectedStatus(s)} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Active filter strip */}
        <AnimatePresence>
          {hasFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="container mx-auto px-6 md:px-10 pb-2.5 flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-muted">{t('props.active_filters', 'Active:')}</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 bg-gold/10 border border-gold/20 text-[11px] font-semibold text-amber-800 rounded-full px-3 py-0.5">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="opacity-60 hover:opacity-100"><X size={10} /></button>
                  </span>
                )}
                {selectedType !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 bg-charcoal/5 border border-black/8 text-[11px] font-semibold text-charcoal rounded-full px-3 py-0.5">
                    {TYPE_EMOJI[selectedType]} {selectedType}
                    <button onClick={() => setSelectedType('All')} className="opacity-60 hover:opacity-100"><X size={10} /></button>
                  </span>
                )}
                {selectedStatus !== 'All' && (
                  <span className="inline-flex items-center gap-1.5 bg-charcoal/5 border border-black/8 text-[11px] font-semibold text-charcoal rounded-full px-3 py-0.5">
                    {STATUS_EMOJI[selectedStatus]} {selectedStatus}
                    <button onClick={() => setSelectedStatus('All')} className="opacity-60 hover:opacity-100"><X size={10} /></button>
                  </span>
                )}
                <button onClick={clearAll} className="text-[11px] text-charcoal-muted hover:text-red-500 transition-colors underline ml-1">{t('props.clear_all', 'Clear all')}</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── RESULTS COUNT ───────────────────────────────────────────── */}
      <div className="container mx-auto px-6 md:px-10 pt-10 pb-4">
        {!isLoading && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-charcoal-muted">
              <span className="font-semibold text-charcoal text-base">{filtered.length}</span>
              {' '}{filtered.length === 1 ? t('props.property', 'property') : t('props.properties', 'properties')}
              {hasFilters && <span className="text-charcoal-muted"> · {t('props.from_total', 'from {{total}} total', { total: properties.length })}</span>}
            </p>
            <div className="h-px flex-1 mx-6 bg-gradient-to-r from-transparent via-black/8 to-transparent" />
          </div>
        )}
      </div>

      {/* ── PROPERTY GRID ───────────────────────────────────────────── */}
      <div className="container mx-auto px-6 md:px-10 pb-24">
        {isLoading ? (
          /* Skeleton */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            <div className="md:col-span-2 lg:col-span-1"><SkeletonCard featured /></div>
            {[...Array(5)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          /* Empty state */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="py-32 text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building2 size={28} className="text-gray-300" />
            </div>
            <h3 className="text-2xl font-serif text-charcoal mb-2">{t('props.no_results', 'No results found')}</h3>
            <p className="text-charcoal-muted text-sm mb-8 leading-relaxed">
              {t('props.no_results_desc', 'No properties match your current filters. Try broadening your search.')}
            </p>
            <button onClick={clearAll} className="btn-gold">{t('props.clear_filters', 'Clear Filters')}</button>
          </motion.div>
        ) : (
          /* Masonry-style editorial grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
            {filtered.map((property, i) => {
              // First card spans 2 columns on desktop for editorial feel
              const isFeatured = i === 0 && filtered.length > 2;
              return (
                <div key={property.id} className={isFeatured ? 'lg:col-span-2' : ''}>
                  <PropertyCard property={property} index={i} featured={isFeatured} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
