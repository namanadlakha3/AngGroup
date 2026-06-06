import { motion } from 'framer-motion';
import { MessageSquare, ListChecks, MapPin, FileCheck, ArrowRight, ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const STEPS = [
  {
    icon: MessageSquare,
    number: '01',
    title: 'Share Your Requirement',
    description: 'Tell us your budget, preferred area, property type, and move-in timeline. Takes just 5 minutes.',
  },
  {
    icon: ListChecks,
    number: '02',
    title: 'Get a Verified Shortlist',
    description: 'We match you with the best options — a clean shortlist, not 50 random listings.',
  },
  {
    icon: MapPin,
    number: '03',
    title: 'Personal Site Visit',
    description: 'Our team personally takes you to the site. We show original records on the first visit.',
  },
  {
    icon: FileCheck,
    number: '04',
    title: 'Documentation & Possession',
    description: 'We guide you through paperwork step by step. Many clients get possession within 30–45 days.',
  },
];

function StepCard({ step, index }: { step: typeof STEPS[0]; index: number }) {
  const Icon = step.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative bg-white/5 border border-white/8 rounded-2xl p-5 md:p-6 overflow-hidden
                 hover:border-[#C9A84C]/40 hover:bg-white/8 transition-all duration-300 cursor-default h-full"
    >
      {/* Decorative watermark number */}
      <div className="absolute -bottom-2 -right-1 text-[72px] font-black leading-none
                      text-white/[0.04] select-none pointer-events-none font-sans">
        {step.number}
      </div>

      {/* Step pill */}
      <div className="inline-flex items-center bg-[#C9A84C]/10 border border-[#C9A84C]/25
                      rounded-full px-2.5 py-1 mb-4">
        <span className="text-[10px] font-bold tracking-widest text-[#C9A84C] uppercase">
          Step {step.number}
        </span>
      </div>

      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/20
                      flex items-center justify-center mb-4
                      group-hover:bg-[#C9A84C] group-hover:border-[#C9A84C] transition-all duration-300">
        <Icon size={18} className="text-[#C9A84C] group-hover:text-[#1A1A1A] transition-colors duration-300" />
      </div>

      {/* Text */}
      <h3 className="text-sm font-semibold text-white mb-2 leading-snug
                     group-hover:text-[#E8D08A] transition-colors duration-300">
        {step.title}
      </h3>
      <p className="text-white/45 text-sm leading-relaxed font-light">
        {step.description}
      </p>
    </motion.div>
  );
}

export default function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24 bg-[#1A1A1A] relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-[700px] h-[400px] bg-[#C9A84C]/6 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <p className="section-label justify-center mb-4" style={{ color: '#C9A84C' }}>
            <span style={{ color: '#C9A84C' }}>{t('how.label', 'Simple Process')}</span>
          </p>
          <h2 className="text-3xl md:text-5xl font-serif font-medium text-white mb-4 leading-tight">
            {t('how.title_1', 'How It')}{' '}
            <span className="text-[#C9A84C]">{t('how.title_2', 'Works')}</span>
          </h2>
          <p className="text-white/50 text-base md:text-lg font-light leading-relaxed">
            {t('how.desc', 'From your first call to getting possession — we are with you at every step.')}
          </p>
        </div>

        {/* ── Mobile: single column stacked with down-arrows ── */}
        <div className="flex flex-col gap-3 md:hidden">
          {STEPS.map((step, i) => (
            <div key={i}>
              <StepCard step={step} index={i} />
              {i < STEPS.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="w-px h-3 bg-[#C9A84C]/20" />
                    <ArrowDown size={13} className="text-[#C9A84C]/40" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Desktop: 4-column row with right-arrows between ── */}
        <div className="hidden md:flex items-stretch gap-3">
          {STEPS.map((step, i) => (
            <div key={i} className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-1 min-w-0">
                <StepCard step={step} index={i} />
              </div>
              {i < STEPS.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.35, duration: 0.3 }}
                  className="shrink-0 w-7 h-7 rounded-full bg-[#1A1A1A] border border-[#C9A84C]/30
                             flex items-center justify-center"
                >
                  <ArrowRight size={12} className="text-[#C9A84C]" />
                </motion.div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-10 md:mt-12 text-center"
        >
          <a
            href="https://wa.me/918442083670"
            target="_blank"
            rel="noreferrer"
            className="btn-gold inline-flex items-center gap-2.5 px-6 md:px-8 py-3.5 md:py-4 text-sm"
          >
            <MessageSquare size={15} />
            {t('how.cta', "Start the Process — It's Free")}
          </a>
          <p className="text-xs text-white/30 mt-3 font-light tracking-wide px-4">
            {t('how.cta_sub', 'No registration needed · No broker fee · Response within 1 hour')}
          </p>
        </motion.div>

      </div>
    </section>
  );
}
