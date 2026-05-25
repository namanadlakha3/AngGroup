import { motion } from 'framer-motion';
import { Phone, Mail, Building, MessageCircle, Star } from 'lucide-react';

export default function PartnersPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-label justify-center mb-4">
            <span>Leadership</span>
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-4 leading-tight">
            Our Partners
          </h1>
          <p className="text-charcoal-muted text-base font-light max-w-xl mx-auto">
            Meet the visionaries behind AngGroup, driving innovation and excellence in luxury real estate.
          </p>
        </div>

        {/* Main Card — more compact */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white rounded-2xl border border-black/6 shadow-[0_8px_40px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col md:flex-row"
        >
          {/* Photo – Solid ivory background image from AI */}
          <div className="md:w-5/12 relative min-h-[320px] md:min-h-0 flex-shrink-0 bg-ivory-50">
            <img
              src="/gopal-singh.png"
              alt="Gopal Singh"
              className="absolute inset-0 w-full h-full object-cover object-top"
            />
            {/* Mobile name overlay */}
            <div className="absolute bottom-4 left-5 md:hidden z-10">
              <h2 className="text-2xl font-serif text-charcoal drop-shadow-sm">Gopal Singh</h2>
              <p className="text-gold text-[10px] uppercase tracking-widest font-bold mt-0.5">Director</p>
            </div>
          </div>

          {/* Details */}
          <div className="md:w-7/12 p-7 md:p-10 flex flex-col justify-center">

            <div className="hidden md:block mb-5">
              <h2 className="text-3xl font-serif font-medium text-charcoal mb-1.5">Gopal Singh</h2>
              <p className="text-gold text-[10px] uppercase tracking-widest font-bold">Director — Ang Group Builders &amp; Developers</p>
            </div>

            <div className="gold-divider mb-6" />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="gold-chip">19+ Years Experience</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
                <Star size={9} fill="currentColor" /> Real Estate Expert
              </span>
            </div>

            <p className="text-charcoal-muted text-sm leading-relaxed font-light mb-7">
              Gopal Singh is a seasoned real estate professional with over{' '}
              <strong className="text-charcoal font-semibold">19 years of experience</strong>{' '}
              in the industry. He has guided hundreds of clients in making the right property investments with complete transparency and trust.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 mb-7">
              {[
                { value: '19+', label: 'Years' },
                { value: '500+', label: 'Clients' },
                { value: '50+', label: 'Projects' },
                { value: '100%', label: 'Legal' },
              ].map(stat => (
                <div key={stat.label} className="text-center py-3 px-2 bg-ivory-100 rounded-xl border border-black/5">
                  <div className="text-xl font-serif font-medium text-gold mb-0.5">{stat.value}</div>
                  <div className="text-[9px] uppercase tracking-widest font-bold text-charcoal-muted">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="space-y-2.5 mb-7 text-sm">
              {[
                { icon: <Phone size={14} />, label: 'Mobile', value: '+91 84420 83670' },
                { icon: <Building size={14} />, label: 'Office', value: '+91 94608 02222' },
                { icon: <Mail size={14} />, label: 'Email', value: 'ngbuild@gmail.com' },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-3 text-charcoal-muted">
                  <span className="text-gold">{c.icon}</span>
                  <span className="w-12 font-bold text-charcoal-muted text-[10px] uppercase tracking-widest">{c.label}</span>
                  <span className="font-medium text-charcoal text-sm">{c.value}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="tel:+918442083670" className="btn-outline flex-1 justify-center">
                <Phone size={14} /> Call Now
              </a>
              <a
                href="https://wa.me/918442083670"
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-[#25D366] text-white font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-[#128C7E] transition-colors"
              >
                <MessageCircle size={14} /> WhatsApp
              </a>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
