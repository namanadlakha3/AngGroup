import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Search, Bed, Bath, Square, SlidersHorizontal,
  X, ChevronDown, IndianRupee, ArrowUpDown, Ruler
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Property } from '../types/property';

// ─── Types & Constants ────────────────────────────────────────────────────────

type SortOption = 'newest' | 'price_asc' | 'price_desc';

const STATUS_STYLES: Record<string, string> = {
  'Available':          'bg-emerald-500/90',
  'Ready to Move':      'bg-emerald-500/90',
  'Under Construction': 'bg-orange-500/90',
  'Under Offer':        'bg-amber-500/90',
  'Rented':             'bg-blue-500/90',
  'Sold':               'bg-red-500/90',
  'Off Market':         'bg-gray-500/90',
};

const STATUS_EMOJI: Record<string, string> = {
  'Available': '✅', 'Ready to Move': '🎉', 'Under Construction': '🔨',
  'Under Offer': '✋', 'Rented': '🔑', 'Sold': '🏷️', 'Off Market': '🚫',
};

const TYPE_EMOJI: Record<string, string> = {
  'Apartment': '🏢', 'Villa': '🏠', 'Independent House': '🏡', 'Plot': '🏗️',
  'Penthouse': '🏰', 'Studio': '🛋️', 'Duplex': '🏘️', 'Farmhouse': '🌾',
  'Commercial': '🏬', 'Warehouse': '🏭', 'Office Space': '💼', 'Shop': '🏪',
  'Townhouse': '🏚️',
};

const SORT_LABELS: Record<SortOption, string> = {
  'newest':     'Newest First',
  'price_asc':  'Price: Low to High',
  'price_desc': 'Price: High to Low',
};

// ─── Property Card ────────────────────────────────────────────────────────────

function PropertyCard({ property, index }: { property: Property; index: number }) {
  const typeEmoji = TYPE_EMOJI[property.type] || '🏠';
  const statusStyle = STATUS_STYLES[property.status] || 'bg-gray-500/90';
  const statusEmoji = STATUS_EMOJI[property.status] || '';

  // Use gallery[0] (primary) or fallback to image field
  const primaryImage = property.gallery?.[0] || property.image;

  // Pick the best area to show
  const areaDisplay = property.carpet_area || property.super_built_up_area || property.built_up_area || property.plot_area || property.area;

  const locationDisplay = property.locality
    ? `${property.locality}, ${property.city || ''}`
    : property.location;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      className="property-card group flex flex-col"
    >
      <Link to={`/properties/${property.id}`} className="flex flex-col h-full">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/3]">
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
              <span className="text-5xl opacity-30">{typeEmoji}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Type chip */}
          <div className="absolute top-4 right-4 gold-chip text-[10px]">
            {typeEmoji} {property.type}
          </div>

          {/* Status badge */}
          <div className={`absolute bottom-4 left-4 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 rounded-full ${statusStyle}`}>
            {statusEmoji} {property.status}
          </div>

          {/* Transaction type (if resale, show badge) */}
          {property.transaction_type === 'Resale' && (
            <div className="absolute top-4 left-4 bg-white/90 text-charcoal text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
              Resale
            </div>
          )}

          {/* Gallery count */}
          {(property.gallery?.length ?? 0) > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/60 text-white text-[10px] font-medium px-2 py-1 rounded-full flex items-center gap-1">
              📷 {property.gallery!.length}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col grow">
          {/* Title & Price */}
          <div className="flex justify-between items-start gap-3 mb-2">
            <h3 className="text-base font-semibold text-charcoal group-hover:text-gold transition-colors leading-snug line-clamp-2 flex-1">
              {property.title}
            </h3>
          </div>

          {/* Price */}
          <div className="mb-3">
            <div className="text-lg font-bold text-gold flex items-center gap-0.5">
              <IndianRupee size={14} strokeWidth={2.5} /> {property.price}
            </div>
            {property.price_per_sqft && (
              <div className="text-xs text-charcoal-muted mt-0.5">{property.price_per_sqft}</div>
            )}
            {property.is_negotiable && (
              <span className="inline-block text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded px-1.5 py-0.5 mt-1">
                Negotiable
              </span>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-charcoal-muted text-xs mb-4">
            <MapPin size={11} className="text-gold shrink-0" />
            <span className="truncate">{locationDisplay}</span>
          </div>

          {/* Highlighted feature (if any) */}
          {property.highlighted_features && property.highlighted_features.length > 0 && (
            <div className="mb-3 text-xs text-charcoal-muted bg-gold/5 border border-gold/15 rounded-lg px-3 py-1.5 line-clamp-1">
              ✨ {property.highlighted_features[0]}
            </div>
          )}

          {/* Stats strip */}
          <div className="mt-auto pt-3 border-t border-black/5 flex items-center gap-4 flex-wrap">
            {(property.bedrooms ?? 0) > 0 && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
                <Bed size={12} className="text-gold" /> {property.bedrooms} BHK
              </span>
            )}
            {(property.bathrooms ?? 0) > 0 && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
                <Bath size={12} className="text-gold" /> {property.bathrooms}
              </span>
            )}
            {areaDisplay && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-charcoal-muted uppercase tracking-wider">
                <Ruler size={11} className="text-gold" /> {areaDisplay}
              </span>
            )}
            {property.furnishing && property.furnishing !== 'Unfurnished' && (
              <span className="ml-auto text-[10px] bg-gray-100 text-charcoal-muted rounded px-2 py-0.5 font-medium">
                {property.furnishing === 'Fully Furnished' ? '✨ Fully Furnished' : '🛋️ Semi-Furnished'}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    async function fetchProperties() {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) setProperties(data);
      setIsLoading(false);
    }
    fetchProperties();
  }, []);

  // Derive filter options from actual data
  const types = useMemo(() => ['All', ...Array.from(new Set(properties.map(p => p.type)))], [properties]);
  const statuses = useMemo(() => ['All', ...Array.from(new Set(properties.map(p => p.status)))], [properties]);

  const filteredProperties = useMemo(() => {
    let result = properties.filter(p => {
      const q = searchQuery.toLowerCase();
      const matchSearch = !q ||
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        (p.city || '').toLowerCase().includes(q) ||
        (p.locality || '').toLowerCase().includes(q) ||
        (p.state || '').toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q);
      const matchType = selectedType === 'All' || p.type === selectedType;
      const matchStatus = selectedStatus === 'All' || p.status === selectedStatus;
      return matchSearch && matchType && matchStatus;
    });

    // Sort
    if (sortBy === 'price_asc') {
      result = [...result].sort((a, b) => (a.price_numeric ?? 0) - (b.price_numeric ?? 0));
    } else if (sortBy === 'price_desc') {
      result = [...result].sort((a, b) => (b.price_numeric ?? 0) - (a.price_numeric ?? 0));
    }
    // 'newest' is already sorted by DB

    return result;
  }, [properties, searchQuery, selectedType, selectedStatus, sortBy]);

  const hasActiveFilters = selectedType !== 'All' || selectedStatus !== 'All' || !!searchQuery;
  const clearFilters = () => { setSearchQuery(''); setSelectedType('All'); setSelectedStatus('All'); setSortBy('newest'); };

  return (
    <div className="min-h-screen py-10 pt-28">
      <div className="container mx-auto px-6">

        {/* Page Header */}
        <div className="mb-10">
          <p className="section-label mb-4 justify-start">
            <span>Curated For You</span>
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-medium text-charcoal mb-4 leading-tight">
            Our Properties
          </h1>
          <p className="text-charcoal-muted text-lg font-light max-w-2xl">
            Discover our curated collection of luxury real estate, blending royal aesthetics with modern comforts.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="glass-panel p-4 md:p-5 mb-10 space-y-4">
          {/* Top row: search + controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search */}
            <div className="search-wrap flex-1">
              <Search size={15} className="search-icon" />
              <input
                type="text"
                placeholder="Search by name, location, city, type..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingTop: '11px', paddingBottom: '11px', borderRadius: '50px' }}
              />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-full border transition-all shrink-0 ${
                showFilters || hasActiveFilters
                  ? 'bg-charcoal text-gold border-charcoal'
                  : 'bg-white text-charcoal border-gray-200 hover:border-gold/40'
              }`}
            >
              <SlidersHorizontal size={15} />
              Filters
              {hasActiveFilters && (
                <span className="w-5 h-5 bg-gold text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {[selectedType !== 'All', selectedStatus !== 'All', !!searchQuery].filter(Boolean).length}
                </span>
              )}
            </button>

            {/* Sort */}
            <div className="relative shrink-0">
              <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-muted pointer-events-none" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                className="form-input appearance-none text-sm"
                style={{ paddingLeft: '32px', paddingTop: '11px', paddingBottom: '11px', paddingRight: '32px' }}
              >
                {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted pointer-events-none" />
            </div>
          </div>

          {/* Expandable filter row */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-3 border-t border-gray-100 flex flex-wrap gap-3">
                  {/* Type filter chips */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal-muted shrink-0">Type:</span>
                    {types.map(t => (
                      <button key={t} onClick={() => setSelectedType(t)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                          selectedType === t
                            ? 'bg-charcoal text-gold border-charcoal'
                            : 'bg-white text-charcoal-muted border-gray-200 hover:border-gold/40'
                        }`}>
                        {t !== 'All' ? `${TYPE_EMOJI[t] || ''} ` : ''}{t}
                      </button>
                    ))}
                  </div>
                  {/* Status filter chips */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-charcoal-muted shrink-0">Status:</span>
                    {statuses.map(s => (
                      <button key={s} onClick={() => setSelectedStatus(s)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                          selectedStatus === s
                            ? 'bg-charcoal text-gold border-charcoal'
                            : 'bg-white text-charcoal-muted border-gray-200 hover:border-gold/40'
                        }`}>
                        {s !== 'All' ? `${STATUS_EMOJI[s] || ''} ` : ''}{s}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active filter pills */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap pt-1">
              {searchQuery && (
                <span className="flex items-center gap-1.5 bg-gold/10 text-amber-800 border border-gold/20 text-xs font-semibold rounded-full px-3 py-1">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}><X size={11} /></button>
                </span>
              )}
              {selectedType !== 'All' && (
                <span className="flex items-center gap-1.5 bg-charcoal/5 text-charcoal text-xs font-semibold rounded-full px-3 py-1 border border-charcoal/10">
                  {TYPE_EMOJI[selectedType]} {selectedType}
                  <button onClick={() => setSelectedType('All')}><X size={11} /></button>
                </span>
              )}
              {selectedStatus !== 'All' && (
                <span className="flex items-center gap-1.5 bg-charcoal/5 text-charcoal text-xs font-semibold rounded-full px-3 py-1 border border-charcoal/10">
                  {STATUS_EMOJI[selectedStatus]} {selectedStatus}
                  <button onClick={() => setSelectedStatus('All')}><X size={11} /></button>
                </span>
              )}
              <button onClick={clearFilters} className="text-xs text-charcoal-muted hover:text-red-500 underline transition-colors ml-1">
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results count */}
        {!isLoading && (
          <p className="text-sm text-charcoal-muted mb-6">
            Showing <span className="font-semibold text-charcoal">{filteredProperties.length}</span> {filteredProperties.length === 1 ? 'property' : 'properties'}
            {hasActiveFilters && ` · filtered from ${properties.length} total`}
          </p>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {isLoading ? (
            // Skeleton
            [...Array(6)].map((_, i) => (
              <div key={i} className="property-card overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-5 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                  <div className="flex gap-3 pt-3 border-t border-gray-100">
                    <div className="h-3 bg-gray-100 rounded w-16" />
                    <div className="h-3 bg-gray-100 rounded w-16" />
                  </div>
                </div>
              </div>
            ))
          ) : filteredProperties.length > 0 ? (
            filteredProperties.map((property, i) => (
              <PropertyCard key={property.id} property={property} index={i} />
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-charcoal-muted text-xl font-light mb-2">No properties match your filters.</p>
              <p className="text-charcoal-muted text-sm mb-6">Try adjusting your search or clearing filters.</p>
              <button onClick={clearFilters} className="btn-gold">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
