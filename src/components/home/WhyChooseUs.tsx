import { motion } from 'framer-motion';
import { MapPin, Tag, FileText, TrendingUp, Users, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function WhyChooseUs() {
  const { t } = useTranslation();

  const reasons = [
    {
      icon: <MapPin size={22} />,
      title: t('home.why_new_prime', 'Prime Locations'),
      description: t('home.why_new_prime_desc', 'Plots in fast-developing areas of Jaipur — Ajmer Road, Tonk Road, Jagatpura & more.'),
    },
    {
      icon: <Tag size={22} />,
      title: t('home.why_new_broker', 'No Broker Charges'),
      description: t('home.why_new_broker_desc', 'Direct-from-developer pricing. No hidden charges, no middlemen cutting into your budget.'),
    },
    {
      icon: <FileText size={22} />,
      title: t('home.why_new_docs', 'Clear Documentation'),
      description: t('home.why_new_docs_desc', 'We show original land records on the very first visit. Transparent paperwork guidance at every step.'),
    },
    {
      icon: <TrendingUp size={22} />,
      title: t('home.why_new_value', 'Long-Term Value'),
      description: t('home.why_new_value_desc', 'Properties in areas with strong appreciation history and future development potential.'),
    },
    {
      icon: <Users size={22} />,
      title: t('home.why_new_visits', 'Personal Site Visits'),
      description: t('home.why_new_visits_desc', 'Our team personally takes you for site visits — no rushing, no pressure. You decide at your pace.'),
    },
    {
      icon: <Target size={22} />,
      title: t('home.why_new_expert', '19+ Years Local Expertise'),
      description: t('home.why_new_expert_desc', 'Deep roots in Jaipur\'s property market. We know which areas are actually growing vs just marketed.'),
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#1A1A1A] relative overflow-hidden">
      {/* Subtle gold glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#C9A84C]/6 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="section-label justify-center mb-5" style={{ color: '#C9A84C' }}>
            <span style={{ color: '#C9A84C' }}>{t('home.why_label_new', 'Why Choose Us')}</span>
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-white mb-5 leading-tight">
            {t('home.why_title_new', 'A Better Way To Find Your Next Home')}
          </h2>
          <p className="text-white/55 text-lg font-light leading-relaxed">
            {t('home.why_desc_new', 'Experience seamless property investment with verified listings, clear paperwork guidance, and direct-from-developer pricing in Jaipur\'s fastest growing areas.')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="group p-7 bg-white/5 rounded-2xl border border-white/8 hover:border-[#C9A84C]/35 hover:bg-white/8 transition-all duration-300 cursor-default"
            >
              <div className="w-11 h-11 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/25 flex items-center justify-center text-[#E8D08A] mb-5 group-hover:bg-[#C9A84C] group-hover:text-[#1A1A1A] group-hover:border-[#C9A84C] transition-all duration-300">
                {reason.icon}
              </div>
              <h3 className="text-base font-semibold text-white mb-2.5 group-hover:text-[#E8D08A] transition-colors duration-300">{reason.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed font-light">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
