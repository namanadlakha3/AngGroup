import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, SlidersHorizontal, Search, Bed, Bath, Square } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockProperties } from '../data/mockProperties';

const TYPES = ['All', 'Luxury Villa', 'Premium Apartment', 'Independent House', 'Commercial Space'];

export default function PropertiesPage() {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProperties = mockProperties.filter(p => {
    const matchType = filter === 'All' || p.type === filter;
    const matchSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className="min-h-screen py-10 pt-28">
      <div className="container mx-auto px-6">

        {/* Page Header */}
        <div className="mb-12">
          <p className="section-label mb-4 justify-start">
            <span>Curated For You</span>
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-medium text-charcoal mb-4 leading-tight">
            Our Properties
          </h1>
          <p className="text-charcoal-muted text-lg font-light max-w-2xl">
            Discover our curated collection of luxury real estate in Jaipur, blending royal aesthetics with modern comforts.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-5 mb-12 glass-panel p-4 md:p-5">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 hide-scrollbar">
            <SlidersHorizontal size={16} className="text-gold shrink-0 mr-1" />
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-4 py-2 text-xs whitespace-nowrap uppercase tracking-widest font-bold rounded-full transition-all duration-200 ${
                  filter === t
                    ? 'bg-gold text-white shadow-md'
                    : 'bg-ivory-100 text-charcoal-muted hover:bg-ivory-200 hover:text-charcoal'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72 shrink-0">
            <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted" />
            <input
              type="text"
              placeholder="Search location or property..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="form-input !pl-10 rounded-full"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property, i) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: Math.min(i * 0.05, 0.3) }}
                className="property-card group"
              >
                <Link to={`/properties/${property.id}`} className="flex flex-col h-full">
                  {/* Image */}
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    <div className="absolute top-4 right-4 gold-chip">{property.type}</div>
                    <div className="absolute bottom-4 left-4 bg-charcoal/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-[0.1em] px-3 py-1.5 rounded-full">
                      {property.status}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col grow">
                    <div className="flex justify-between items-start gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-charcoal group-hover:text-gold transition-colors leading-snug line-clamp-2">
                        {property.title}
                      </h3>
                      <div className="text-lg font-bold text-gold whitespace-nowrap shrink-0">
                        {property.price}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-charcoal-muted text-sm mb-5">
                      <MapPin size={13} className="text-gold shrink-0" />
                      <span className="truncate">{property.location}</span>
                    </div>

                    <div className="mt-auto pt-4 border-t border-black/6 flex items-center gap-5">
                      {property.bedrooms > 0 && (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-charcoal-muted uppercase tracking-wider">
                          <Bed size={13} className="text-gold" /> {property.bedrooms}
                        </span>
                      )}
                      {property.bathrooms > 0 && (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-charcoal-muted uppercase tracking-wider">
                          <Bath size={13} className="text-gold" /> {property.bathrooms}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 text-xs font-bold text-charcoal-muted uppercase tracking-wider">
                        <Square size={13} className="text-gold" /> {property.area}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-24 text-center">
              <p className="text-charcoal-muted text-xl font-light mb-4">No properties match your filters.</p>
              <button
                onClick={() => { setFilter('All'); setSearchQuery(''); }}
                className="btn-gold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
