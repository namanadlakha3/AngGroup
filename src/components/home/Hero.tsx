import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 140]);
  const opacity = useTransform(scrollY, [0, 280], [1, 0]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const stats = [
    { value: '1,200+', label: t('home.stat_properties', 'Properties Listed') },
    { value: '500+', label: t('home.stat_clients', 'Happy Clients') },
    { value: '19+', label: t('home.stat_years', 'Years of Trust') },
  ];

  return (
    <section className="relative h-screen flex flex-col items-center overflow-hidden bg-charcoal">

      {/* Background Video with parallax */}
      <motion.div style={{ y }} className="absolute inset-0 z-0 scale-110">
        <div className="absolute inset-0 bg-charcoal/55 z-10" />
        {/* Subtle gold vignette at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-charcoal/80 to-transparent z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Content – pushed down ~20% from center so video peeks above */}
      <motion.div
        style={{ opacity }}
        className="relative z-20 w-full container mx-auto px-6 text-center mt-[18vh]"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-6"
        >
          <span
            className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: '#E8C96A' }}
          >
            <span className="w-8 h-px bg-gold-glow inline-block opacity-60" />
            {t('home.hero_eyebrow', "Jaipur's Premier Real Estate")}
            <span className="w-8 h-px bg-gold-glow inline-block opacity-60" />
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-serif font-medium mb-6 leading-tight text-white max-w-4xl mx-auto"
        >
          {t('home.hero_title_1', 'Find Your Perfect')}<br />
          <span className="text-gradient-gold italic">{t('home.hero_title_royal', 'Royal')}</span> {t('home.hero_title_2', 'Home')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-lg md:text-xl max-w-xl mx-auto mb-10 text-white/65 font-light tracking-wide"
        >
          {t('home.hero_desc', 'Premium plots, villas & apartments in Jaipur — blending Rajasthani heritage with modern comfort.')}
        </motion.p>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="max-w-3xl mx-auto"
        >
          <form
            onSubmit={e => { e.preventDefault(); navigate('/properties'); }}
            className="flex flex-col md:flex-row bg-white/95 backdrop-blur-md rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.25)] border border-white/20"
          >
            <div className="flex-1 border-b md:border-b-0 md:border-r border-black/8 px-6 py-4">
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gold mb-1.5">{t('home.search_location', 'Location')}</label>
              <select className="w-full bg-transparent text-charcoal font-semibold text-sm focus:outline-none appearance-none cursor-pointer">
                <option>{t('home.search_loc_opt', 'Jaipur Properties')}</option>
              </select>
            </div>
            <div className="flex-1 border-b md:border-b-0 md:border-r border-black/8 px-6 py-4">
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gold mb-1.5">{t('home.search_type', 'Property Type')}</label>
              <select className="w-full bg-transparent text-charcoal font-semibold text-sm focus:outline-none appearance-none cursor-pointer">
                <option>{t('home.search_type_plot', 'Plot')}</option>
                <option>{t('home.search_type_house', 'House')}</option>
                <option>{t('home.search_type_apartment', 'Apartment')}</option>
                <option>{t('home.search_type_farmhouse', 'Farmhouse')}</option>
              </select>
            </div>
            <div className="flex-1 px-6 py-4">
              <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-gold mb-1.5">{t('home.search_budget', 'Budget')}</label>
              <select className="w-full bg-transparent text-charcoal font-semibold text-sm focus:outline-none appearance-none cursor-pointer">
                <option>{t('home.search_budget_opt', 'Select Range')}</option>
                <option>Under ₹20 Lakh</option>
                <option>₹20L – ₹30L</option>
                <option>₹30L – ₹60L</option>
                <option>₹60L – ₹1 Cr</option>
                <option>Above ₹1 Cr</option>
              </select>
            </div>
            <button
              type="submit"
              className="btn-gold"
              style={{ borderRadius: '0' }}
            >
              <Search size={16} /> {t('home.search_explore', 'Explore')}
            </button>
          </form>
        </motion.div>
      </motion.div>

      {/* Stats bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 hidden md:block border-t border-white/8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-3 divide-x divide-white/8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
                className="flex flex-col items-center justify-center py-6"
              >
                <span className="text-2xl font-serif font-medium text-gold-glow mb-0.5">{stat.value}</span>
                <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 z-20 md:hidden"
      >
        <ChevronDown className="text-white/40 animate-bounce" size={24} />
      </motion.div>

    </section>
  );
}
