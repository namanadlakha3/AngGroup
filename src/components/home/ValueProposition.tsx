import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const features = [
  'Vastu-Compliant Architecture',
  'Premium Sandstone & Marble Finishes',
  'Smart Home Automation Readiness',
  'Uncompromising Security & Privacy',
];

export default function ValueProposition() {
  return (
    <section className="py-20 md:py-28 bg-ivory-100">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="flex-1 w-full"
          >
            <div className="relative max-w-lg mx-auto">
              {/* Gold frame offset */}
              <div className="absolute -top-4 -left-4 w-full h-full rounded-2xl border-2 border-gold/30" />
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Luxury Real Estate"
                className="relative z-10 w-full aspect-[4/5] object-cover rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
              />
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -right-6 z-20 bg-white rounded-xl shadow-lg border border-gold/15 px-6 py-4">
                <div className="text-3xl font-serif font-medium text-gold mb-0.5">19+</div>
                <div className="text-xs uppercase tracking-widest font-bold text-charcoal-muted">Years Experience</div>
              </div>
            </div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="flex-1 space-y-8"
          >
            <p className="section-label justify-start">
              <span>Our Legacy</span>
            </p>

            <h2 className="text-4xl md:text-5xl font-serif font-medium text-charcoal leading-tight">
              A Symphony of{' '}
              <em className="not-italic text-gradient-gold">Palatial Heritage</em>
              {' '}& Modern Luxury
            </h2>

            <p className="text-charcoal-muted text-lg leading-relaxed font-light">
              At AngGroup, we don't just build homes; we curate lifestyles. Deeply rooted in the regal architectural traditions of Jaipur, our properties are a testament to exquisite craftsmanship, grand spaces, and a timeless aesthetic.
            </p>

            <ul className="space-y-3 mt-4">
              {features.map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center shrink-0">
                    <Check size={11} className="text-gold" strokeWidth={3} />
                  </div>
                  <span className="text-charcoal font-medium text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
