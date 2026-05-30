import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Testimonials() {
  const { t } = useTranslation();

  const testimonials = [
    {
      name: 'Aarav Sharma',
      role: t('home.test_new_role_1', 'Plot Buyer • Jaipur'),
      text: t('home.test_new_text_1', 'We bought a 200 Sq Yd plot in Narayam City 8 through ANG Group. Documents were clear, registry was done in 30 days. Highly recommended.'),
      initials: 'AS',
    },
    {
      name: 'Rahul Singh',
      role: t('home.test_new_role_2', 'Investor • Jaipur'),
      text: t('home.test_new_text_2', 'No broker, no hidden charges. The team showed us original land records on our very first visit. That\'s what built our trust.'),
      initials: 'RS',
    },
    {
      name: 'Priyal & Suresh Gupta',
      role: t('home.test_new_role_3', 'Plot Buyers • Jaipur'),
      text: t('home.test_new_text_3', 'We were confused between 3 societies. ANG Group\'s team personally took us for a site visit and helped us decide. Best decision we made.'),
      initials: 'PG',
    },
    {
      name: 'Ankit Sachdeva',
      role: t('home.test_new_role_4', 'Home Buyer • Jaipur'),
      text: t('home.test_new_text_4', 'We were looking for a ready home within our budget for over a year. ANG Group showed us exactly what we needed, handled all the paperwork and we got possession within 45 days.'),
      initials: 'AS',
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-ivory-100 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-0 left-0 w-80 h-80 bg-[#C9A84C]/8 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#C9A84C]/6 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="section-label justify-center mb-5">
            <span>{t('home.test_label_new', 'Real Stories')}</span>
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-5 leading-tight">
            {t('home.test_title_new', 'What Our Clients Say')}
          </h2>
          <p className="text-charcoal-muted text-lg font-light">
            {t('home.test_desc_new', 'Real words from real buyers — no scripts, no fake reviews.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-white rounded-2xl border border-black/6 p-7 hover:border-[#C9A84C]/30 hover:shadow-[0_8px_32px_rgba(201,168,76,0.1)] transition-all duration-300 group"
            >
              {/* Stars */}
              <div className="flex items-center gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={13} className="text-[#C9A84C] fill-[#C9A84C]" />
                ))}
              </div>
              {/* Quote */}
              <p className="text-charcoal/80 text-base leading-relaxed font-light mb-7 italic">
                "{testimonial.text}"
              </p>
              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-black/5">
                <div className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-[#C9A84C]/30 flex items-center justify-center text-[#E8D08A] font-bold text-xs flex-shrink-0">
                  {testimonial.initials}
                </div>
                <div>
                  <div className="text-charcoal font-semibold text-sm">{testimonial.name}</div>
                  <div className="text-[#C9A84C] text-[10px] uppercase tracking-widest font-bold mt-0.5">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
