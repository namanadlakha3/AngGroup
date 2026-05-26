import { motion } from 'framer-motion';
import { MapPin, ArrowRight, Bed, Bath, Square } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import type { Property } from '../../types/property';

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .limit(3);
        
        if (error) throw error;
        if (data) setProperties(data);
      } catch (err) {
        console.error('Error fetching featured properties:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchFeatured();
  }, []);

  if (isLoading) return null;

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-6">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
          <div>
            <p className="section-label mb-4 justify-start">
              <span>Exquisite Collection</span>
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-charcoal leading-tight">
              Featured Properties
            </h2>
          </div>
          <Link
            to="/properties"
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-charcoal/70 hover:text-gold transition-colors whitespace-nowrap"
          >
            View All
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
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
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Type badge – top right */}
                  <div className="absolute top-4 right-4 gold-chip">
                    {property.type}
                  </div>
                  {/* Status badge – bottom left */}
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
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
                        <Bed size={13} className="text-gold" /> {property.bedrooms}
                      </span>
                    )}
                    {property.bathrooms > 0 && (
                      <span className="flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
                        <Bath size={13} className="text-gold" /> {property.bathrooms}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-charcoal-muted uppercase tracking-wider">
                      <Square size={13} className="text-gold" /> {property.area}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
