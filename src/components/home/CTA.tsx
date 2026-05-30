import { motion } from 'framer-motion';
import { Phone, CalendarCheck, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function CTA() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-[#1A1A1A]">
      {/* Background gold accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#C9A84C]/8 rounded-full blur-[100px]" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-[#C9A84C]/6 rounded-full blur-[100px]" />
        {/* Top border line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/40 to-transparent" />
      </div>

      <div className="container mx-auto px-6 py-20 md:py-28 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#C9A84C] mb-8"
          >
            <span className="w-8 h-px bg-[#C9A84C]/50" />
            Ready to Take the Next Step?
            <span className="w-8 h-px bg-[#C9A84C]/50" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium text-white mb-6 leading-tight"
          >
            {t('home.cta_title', 'Still Thinking?')}{' '}
            <span className="text-gradient-gold italic">One Call Can Change That.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-white/55 font-light mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            {t('home.cta_desc', 'No pressure. No broker. Just honest advice and a free site visit — whenever you\'re ready.')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* Primary CTA */}
            <Link
              to="/contact"
              className="group flex items-center gap-3 bg-[#C9A84C] hover:bg-[#D4B86A] text-[#1A1A1A] font-bold text-[11px] uppercase tracking-[0.16em] px-8 py-4 rounded-lg transition-all duration-300 shadow-[0_4px_24px_rgba(201,168,76,0.3)] hover:shadow-[0_8px_32px_rgba(201,168,76,0.45)] hover:-translate-y-0.5 w-full sm:w-auto justify-center"
            >
              <CalendarCheck size={16} />
              {t('home.cta_btn_visit', 'Book Free Site Visit')}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>

            {/* Secondary CTA */}
            <a
              href="tel:+918442083670"
              className="flex items-center gap-3 border border-white/15 hover:border-[#C9A84C]/50 text-white/70 hover:text-[#E8D08A] font-bold text-[11px] uppercase tracking-[0.16em] px-8 py-4 rounded-lg transition-all duration-300 w-full sm:w-auto justify-center"
            >
              <Phone size={15} />
              {t('home.cta_btn_call', 'Call Now: +91 8442083670')}
            </a>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-14 pt-10 border-t border-white/8 grid grid-cols-3 gap-6 max-w-lg mx-auto"
          >
            {[
              { value: '19+', label: 'Years of Trust' },
              { value: '500+', label: 'Happy Clients' },
              { value: '0', label: 'Broker Charges' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-serif font-medium text-[#E8D08A] mb-1">{stat.value}</div>
                <div className="text-[9px] uppercase tracking-[0.18em] text-white/35 font-bold">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
