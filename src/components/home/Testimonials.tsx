import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function Testimonials() {
  const { t } = useTranslation();

  const testimonials = [
    {
      name: 'Aarav Sharma',
      role: t('home.test_role_buyer', 'Home Buyer'),
      text: t('home.test_text_1', 'The listings were accurate and the tour booking was super quick. We found our home in two weekends.'),
    },
    {
      name: 'Nisha Verma',
      role: t('home.test_role_tenant', 'Tenant'),
      text: t('home.test_text_2', 'Transparent pricing and helpful agents. The process felt simple and stress-free from day one.'),
    },
    {
      name: 'Rahul Singh',
      role: t('home.test_role_investor', 'Investor'),
      text: t('home.test_text_3', 'Great local knowledge and honest advice. I appreciated the clear paperwork and fast follow-ups.'),
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-charcoal relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/8 blur-[80px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="section-label justify-center mb-5" style={{ color: '#D4A017' }}>
            <span style={{ color: '#D4A017' }}>{t('home.test_label', 'Client Stories')}</span>
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-white mb-5 leading-tight">
            {t('home.test_title_1', 'People Love Working')}<br />{t('home.test_title_2', 'With ANG Group')}
          </h2>
          <p className="text-white/60 text-lg font-light">
            {t('home.test_desc', 'Real feedback from real clients — buying, renting, and investing made easier.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative p-8 rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm hover:bg-white/8 hover:border-gold/30 transition-all duration-300"
            >
              {/* Gold quote mark */}
              <div className="text-6xl font-serif leading-none text-gold/30 mb-4">"</div>
              <p className="text-white/80 text-base leading-relaxed font-light mb-8 italic">
                {testimonial.text}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-gold font-bold text-sm">
                  {testimonial.name[0]}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{testimonial.name}</div>
                  <div className="text-gold/80 text-xs uppercase tracking-widest font-bold mt-0.5">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
