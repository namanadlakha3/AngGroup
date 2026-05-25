import { motion } from 'framer-motion';
import { MapPin, Tag, FileText, TrendingUp, CalendarCheck, ShieldCheck } from 'lucide-react';

const reasons = [
  {
    icon: <MapPin size={22} />,
    title: 'Prime Locations',
    description: 'Our plots are strategically located in fast-developing areas with high future growth potential.',
  },
  {
    icon: <Tag size={22} />,
    title: 'Affordable Pricing',
    description: 'We offer competitive pricing designed to suit every buyers budget without compromising on value.',
  },
  {
    icon: <FileText size={22} />,
    title: 'Clear Documentation',
    description: '100% legal plots with transparent paperwork, ensuring a safe and secure investment.',
  },
  {
    icon: <TrendingUp size={22} />,
    title: 'High Return Investment',
    description: 'An ideal choice for long-term investment with strong appreciation potential.',
  },
  {
    icon: <CalendarCheck size={22} />,
    title: 'Easy Booking Process',
    description: 'Hassle-free booking experience with complete support from our team at every step.',
  },
  {
    icon: <ShieldCheck size={22} />,
    title: 'Trusted by Customers',
    description: 'Trusted by numerous happy buyers for our quality, reliability, and commitment.',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-6">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="section-label justify-center mb-5">
            <span>Why Choose Us</span>
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-5 leading-tight">
            A Better Way To Find Your Next Home
          </h2>
          <p className="text-charcoal-muted text-lg font-light">
            ANG Group makes buying or renting easier with verified listings, honest guidance, and fast scheduling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="group p-8 bg-white rounded-2xl border border-black/6 hover:border-gold/30 hover:shadow-[0_8px_32px_rgba(184,134,11,0.1)] transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gold/8 border border-gold/20 flex items-center justify-center text-gold mb-6 group-hover:bg-gold group-hover:text-white group-hover:border-gold transition-all duration-300">
                {reason.icon}
              </div>
              <h3 className="text-lg font-semibold text-charcoal mb-3">{reason.title}</h3>
              <p className="text-charcoal-muted text-sm leading-relaxed font-light">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
