import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function AboutPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen pt-28">

      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1590767955832-bf8c42bd3f58?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Jaipur Heritage"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/75" />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-transparent to-charcoal/60" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="section-label justify-center mb-6" style={{ color: '#D4A017' }}>
              <span style={{ color: '#D4A017' }}>{t('about.story', 'Our Story')}</span>
            </p>
            <h1 className="text-5xl md:text-7xl font-serif font-medium mb-8 leading-tight text-white">
              {t('about.title_1', 'A Legacy of Royal Heritage')}<br />{t('about.title_2', '& Modern Luxury')}
            </h1>
            <p className="text-lg md:text-xl text-white/75 font-light leading-relaxed max-w-2xl mx-auto">
              {t('about.desc', "Founded on the architectural principles of Rajasthan's majestic palaces, AngGroup brings timeless elegance to modern living spaces.")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 md:py-28 bg-ivory-100">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 md:p-12 bg-white rounded-2xl border border-black/6 hover:border-gold/25 hover:shadow-[0_8px_32px_rgba(184,134,11,0.08)] transition-all duration-300"
            >
              <div className="w-12 h-1 bg-gold rounded-full mb-6" />
              <h2 className="text-3xl font-serif font-medium text-charcoal mb-5">{t('about.vision_title', 'Our Vision')}</h2>
              <p className="text-charcoal-muted leading-relaxed text-lg font-light">
                {t('about.vision_desc', 'To be the pinnacle of luxury real estate in India, creating spaces that seamlessly blend historical grandeur with cutting-edge modern design, fostering communities that appreciate true craftsmanship.')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-10 md:p-12 bg-white rounded-2xl border border-black/6 hover:border-gold/25 hover:shadow-[0_8px_32px_rgba(184,134,11,0.08)] transition-all duration-300"
            >
              <div className="w-12 h-1 bg-gold rounded-full mb-6" />
              <h2 className="text-3xl font-serif font-medium text-charcoal mb-5">{t('about.mission_title', 'Our Mission')}</h2>
              <p className="text-charcoal-muted leading-relaxed text-lg font-light">
                {t('about.mission_desc', 'To deliver uncompromising quality, maintain absolute transparency, and provide an unparalleled customer experience by creating homes that are as deeply rooted in heritage as they are forward-looking.')}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <p className="section-label justify-center mb-5">
              <span>{t('about.leadership', 'Leadership')}</span>
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-charcoal leading-tight">
              {t('about.directors', 'Our Directors')}
            </h2>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <div className="flex flex-col md:flex-row items-stretch bg-white rounded-2xl border border-black/6 shadow-[0_4px_32px_rgba(0,0,0,0.06)] overflow-hidden">
              {/* Photo — Solid ivory background image from AI */}
              <div className="md:w-2/5 relative min-h-[280px] md:min-h-0 flex-shrink-0 bg-ivory-50 border-r border-black/6">
                <img
                  src="/gopal-singh.png"
                  alt="Gopal Singh – Director"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </div>

              {/* Content */}
              <div className="md:w-3/5 p-7 md:p-10 flex flex-col justify-center space-y-4">
                <h2 className="text-2xl md:text-3xl font-serif font-medium text-charcoal leading-tight">
                  Gopal Singh
                </h2>
                <p className="text-gold font-bold text-[10px] uppercase tracking-widest">{t('about.gopal_title', 'Director, Ang Group Builders & Developers')}</p>
                <div className="gold-divider" />
                <blockquote className="text-lg md:text-xl font-serif italic text-charcoal/70 leading-relaxed">
                  {t('about.gopal_quote', '"We don\'t build houses; we craft heirlooms. Every project is a tribute to Jaipur\'s incredible architectural legacy."')}
                </blockquote>
                <p className="text-charcoal-muted text-sm font-light leading-relaxed">
                  {t('about.gopal_desc', 'With over 19 years of experience in real estate, Gopal Singh has guided hundreds of clients toward confident, rewarding property investments built on trust and transparency.')}
                </p>
              </div>
            </div>
          </div>

          {/* Co-Directors */}
          <div className="max-w-3xl mx-auto">
              {/* Jitender Kataria Card */}
              <div className="flex flex-col sm:flex-row items-stretch bg-white rounded-xl border border-black/6 shadow-sm hover:shadow-[0_4px_24px_rgba(0,0,0,0.06)] transition-all overflow-hidden">
                <div className="sm:w-2/5 relative min-h-[200px] sm:min-h-[280px] flex-shrink-0 bg-ivory-50 border-b sm:border-b-0 sm:border-r border-black/6">
                  <img
                    src="/jitender-kataria.png"
                    alt="Jitender Kataria – Co-Director"
                    className="absolute inset-0 w-full h-full object-cover object-top"
                  />
                </div>
                <div className="sm:w-3/5 p-6 flex flex-col justify-center space-y-3">
                  <h3 className="text-xl font-serif font-medium text-charcoal leading-tight">
                    Jitender Kataria
                  </h3>
                  <p className="text-gold font-bold text-[9px] uppercase tracking-widest">{t('about.jitender_title', 'Co-Director')}</p>
                  <div className="w-8 h-px bg-gold/50" />
                  <p className="text-charcoal-muted text-xs font-light leading-relaxed">
                    {t('about.jitender_desc', 'Driving innovation and operational excellence to ensure every AngGroup project meets the highest standards of luxury and quality.')}
                  </p>
                </div>
              </div>
          </div>
        </div>
      </section>
      {/* Differentiators */}
      <section className="py-20 md:py-28 bg-ivory-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <p className="section-label justify-center mb-5">
              <span>{t('about.diff_label', 'The Difference')}</span>
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-medium text-charcoal leading-tight">
              {t('about.diff_title', 'The AngGroup Difference')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { num: '01', title: t('about.diff_1_title', 'Heritage Aesthetics'), desc: t('about.diff_1_desc', 'Inspired by jharokhas, courtyards, and sandstone artistry of the Pink City.') },
              { num: '02', title: t('about.diff_2_title', 'Uncompromising Quality'), desc: t('about.diff_2_desc', 'From Italian marble to smart home automation, we use only the finest materials.') },
              { num: '03', title: t('about.diff_3_title', 'Prime Locations'), desc: t('about.diff_3_desc', 'Carefully selected parcels of land ensuring high ROI and excellent connectivity.') },
              { num: '04', title: t('about.diff_4_title', 'Vastu Compliant'), desc: t('about.diff_4_desc', 'Every layout is meticulously planned to ensure positive energy and harmony.') },
              { num: '05', title: t('about.diff_5_title', 'Transparent Process'), desc: t('about.diff_5_desc', 'Clear communication, legal transparency, and timely deliveries.') },
              { num: '06', title: t('about.diff_6_title', 'Bespoke Customization'), desc: t('about.diff_6_desc', 'Tailor your living spaces to match your exact taste and lifestyle requirements.') },
            ].map((f, i) => (
              <motion.div
                key={f.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-8 bg-white rounded-2xl border border-black/6 hover:border-gold/25 hover:shadow-[0_8px_24px_rgba(184,134,11,0.08)] transition-all duration-300 group"
              >
                <div className="text-4xl font-serif text-gold/20 group-hover:text-gold/40 transition-colors font-medium mb-4">{f.num}</div>
                <h3 className="text-lg font-semibold text-charcoal mb-3">{f.title}</h3>
                <p className="text-charcoal-muted text-sm font-light leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
