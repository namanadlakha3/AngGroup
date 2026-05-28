import { motion } from 'framer-motion';
import { Phone, Mail, Building, MessageCircle, Star } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';

export default function PartnersPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-label justify-center mb-4">
            <span>{t('partners.leadership', 'Leadership')}</span>
          </p>
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-4 leading-tight">
            {t('partners.title', 'Our Partners')}
          </h1>
          <p className="text-charcoal-muted text-base font-light max-w-xl mx-auto">
            {t('partners.desc', 'Meet the visionaries behind AngGroup, driving innovation and excellence in luxury real estate.')}
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
              <p className="text-gold text-[10px] uppercase tracking-widest font-bold mt-0.5">{t('partners.director', 'Director')}</p>
            </div>
          </div>

          {/* Details */}
          <div className="md:w-7/12 p-7 md:p-10 flex flex-col justify-center">

            <div className="hidden md:block mb-5">
              <h2 className="text-3xl font-serif font-medium text-charcoal mb-1.5">Gopal Singh</h2>
              <p className="text-gold text-[10px] uppercase tracking-widest font-bold">{t('partners.director_full', 'Director — Ang Group Builders & Developers')}</p>
            </div>

            <div className="gold-divider mb-6" />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="gold-chip">{t('partners.experience_tag', '19+ Years Experience')}</span>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 border border-green-200 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
                <Star size={9} fill="currentColor" /> {t('partners.expert_tag', 'Real Estate Expert')}
              </span>
            </div>

            <p className="text-charcoal-muted text-sm leading-relaxed font-light mb-7">
              <Trans i18nKey="partners.gopal_desc">
                Gopal Singh is a seasoned real estate professional with over{' '}
                <strong className="text-charcoal font-semibold">19 years of experience</strong>{' '}
                in the industry. He has guided hundreds of clients in making the right property investments with complete transparency and trust.
              </Trans>
            </p>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2 mb-7">
              {[
                { value: '19+', label: t('partners.years', 'Years') },
                { value: '500+', label: t('partners.clients', 'Clients') },
                { value: '50+', label: t('partners.projects', 'Projects') },
                { value: '100%', label: t('partners.legal', 'Legal') },
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
                { icon: <Phone size={14} />, label: t('partners.mobile', 'Mobile'), value: '+91 84420 83670' },
                { icon: <Building size={14} />, label: t('partners.office', 'Office'), value: '+91 94608 02222' },
                { icon: <Mail size={14} />, label: t('partners.email', 'Email'), value: 'ngbuild@gmail.com' },
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
                <Phone size={14} /> {t('partners.call_now', 'Call Now')}
              </a>
              <a
                href="https://wa.me/918442083670"
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-[#25D366] text-white font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-[#128C7E] transition-colors"
              >
                <MessageCircle size={14} /> {t('partners.whatsapp', 'WhatsApp')}
              </a>
            </div>

          </div>
        </motion.div>

        {/* Co-Directors Section */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-serif font-medium text-charcoal">{t('partners.codirectors', 'Co-Directors')}</h3>
            <div className="w-12 h-1 bg-gold rounded-full mx-auto mt-4" />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Jitender Kataria */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-xl border border-black/6 shadow-sm hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col sm:flex-row transition-all"
            >
              <div className="sm:w-2/5 relative min-h-[240px] sm:min-h-0 flex-shrink-0 bg-ivory-50 border-b sm:border-b-0 sm:border-r border-black/6">
                <img
                  src="/jitender-kataria.png"
                  alt="Jitender Kataria"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
              </div>
              <div className="sm:w-3/5 p-6 flex flex-col justify-center">
                <h3 className="text-2xl font-serif font-medium text-charcoal mb-1">Jitender Kataria</h3>
                <p className="text-gold text-[9px] uppercase tracking-widest font-bold mb-4">{t('partners.codirector', 'Co-Director')}</p>
                
                <p className="text-charcoal-muted text-xs leading-relaxed font-light mb-5">
                  {t('partners.jitender_desc', 'Driving innovation and operational excellence to ensure every AngGroup project meets the highest standards of luxury, transparency, and architectural brilliance.')}
                </p>

                <div className="space-y-2 text-xs mb-5">
                  <div className="flex items-center gap-3 text-charcoal-muted">
                    <span className="text-gold"><Phone size={12} /></span>
                    <span className="font-medium text-charcoal">+91 79769 23208</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a href="tel:+917976923208" className="btn-outline flex-1 justify-center py-2 text-[10px]">
                    <Phone size={12} /> {t('partners.call', 'Call')}
                  </a>
                  <a
                    href="https://wa.me/917976923208"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[#25D366] text-white font-bold text-[10px] uppercase tracking-widest rounded-full hover:bg-[#128C7E] transition-colors"
                  >
                    <MessageCircle size={12} /> {t('partners.whatsapp', 'WhatsApp')}
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
}
