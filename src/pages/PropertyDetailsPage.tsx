import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, Check, ArrowLeft, Phone, MessageCircle } from 'lucide-react';
import { mockProperties } from '../data/mockProperties';
import { useState } from 'react';

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const property = mockProperties.find(p => p.id === id);
  const [activeImage, setActiveImage] = useState(0);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-serif text-charcoal mb-4">Property Not Found</h2>
          <Link to="/properties" className="text-gold underline font-medium">Return to Properties</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 pt-28">
      {/* Back & Breadcrumb */}
      <div className="container mx-auto px-6 mb-6">
        <Link to="/properties" className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-charcoal-muted hover:text-gold transition-colors">
          <ArrowLeft size={14} /> Back to Properties
        </Link>
      </div>

      {/* Header: Title & Price */}
      <div className="container mx-auto px-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between md:items-end gap-6 border-b border-black/5 pb-6">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <span className="gold-chip">{property.status}</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-charcoal-muted">{property.type}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-charcoal leading-tight">{property.title}</h1>
            <div className="flex items-center gap-2 text-charcoal-muted mt-2">
              <MapPin size={18} className="text-gold" />
              <span className="text-lg font-light">{property.location}</span>
            </div>
          </div>
          <div className="md:text-right shrink-0">
            <div className="text-sm font-bold uppercase tracking-widest text-charcoal-muted mb-1">Asking Price</div>
            <div className="text-4xl md:text-5xl font-serif font-medium text-gold">{property.price}</div>
          </div>
        </motion.div>
      </div>

      {/* Gallery */}
      <div className="container mx-auto px-6 mb-16">
        <div className="flex flex-col gap-4">
          {/* Main Cinematic Image */}
          <div className="w-full aspect-[16/9] md:aspect-[21/9] bg-ivory-100 rounded-2xl overflow-hidden relative shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-black/5">
            <img
              src={property.gallery[activeImage] || property.image}
              alt={property.title}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
          </div>
          
          {/* Thumbnails Strip */}
          <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2">
            {property.gallery.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative shrink-0 w-32 md:w-40 aspect-[4/3] overflow-hidden rounded-xl border-2 transition-all duration-200 ${
                  activeImage === i 
                    ? 'border-gold shadow-[0_4px_12px_rgba(184,134,11,0.2)]' 
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Gallery thumbnail ${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Main Details */}
          <div className="lg:col-span-2 space-y-10">

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: <Bed size={24} className="text-gold" />, value: property.bedrooms, label: 'Bedrooms' },
                { icon: <Bath size={24} className="text-gold" />, value: property.bathrooms, label: 'Bathrooms' },
                { icon: <Square size={24} className="text-gold" />, value: property.area, label: 'Area' },
              ].map(stat => (
                <div key={stat.label} className="flex flex-col items-center justify-center py-6 px-4 bg-white rounded-2xl border border-black/6 text-center">
                  {stat.icon}
                  <span className="font-bold text-xl text-charcoal mt-2">{stat.value}</span>
                  <span className="text-[10px] uppercase tracking-widest text-charcoal-muted font-bold mt-1">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-black/6 p-8">
              <h2 className="text-2xl font-serif font-medium text-charcoal mb-5">About this Property</h2>
              <p className="text-charcoal-muted leading-relaxed text-base font-light">{property.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl border border-black/6 p-8">
              <h2 className="text-2xl font-serif font-medium text-charcoal mb-6">Premium Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.amenities.map(amenity => (
                  <div key={amenity} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-gold" strokeWidth={3} />
                    </div>
                    <span className="text-charcoal text-sm font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-2xl border border-black/8 shadow-[0_4px_32px_rgba(0,0,0,0.08)] p-8">
              <h3 className="text-2xl font-serif font-medium text-charcoal mb-2">Interested?</h3>
              <p className="text-charcoal-muted text-sm mb-8 font-light">Schedule a private viewing or request a callback.</p>

              <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                <input type="text" placeholder="Your Name" className="form-input" />
                <input type="tel" placeholder="Phone Number" className="form-input" />
                <input type="email" placeholder="Email Address" className="form-input" />
                <textarea placeholder="Message (Optional)" rows={3} className="form-input resize-none" />
                <button type="submit" className="btn-gold w-full">Request Callback</button>
              </form>

              <div className="mt-8 pt-6 border-t border-black/5 space-y-3">
                <a
                  href="tel:+918442083670"
                  className="btn-outline w-full justify-center"
                >
                  <Phone size={15} /> Call Us Now
                </a>
                <a
                  href="https://wa.me/918442083670"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 px-6 bg-[#25D366] text-white font-bold text-xs uppercase tracking-widest rounded-full hover:bg-[#128C7E] transition-colors"
                >
                  <MessageCircle size={15} /> WhatsApp
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
