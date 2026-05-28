import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
  const { t } = useTranslation();

  const faqs = [
    {
      question: t('home.faq_q1', 'How do I schedule a home tour?'),
      answer: t('home.faq_a1', 'Use the "Schedule a Tour" section to pick a date and time slot. Our team confirms the visit and shares the address and agent details.'),
    },
    {
      question: t('home.faq_q2', 'Are listings verified?'),
      answer: t('home.faq_a2', 'Yes, all our listings undergo a rigorous verification process checking legal documents and physical conditions before they are published.'),
    },
    {
      question: t('home.faq_q3', 'Do you help with loans and paperwork?'),
      answer: t('home.faq_a3', 'Absolutely. We have tied up with leading banks to provide quick home loan approvals, and our legal team handles all the documentation.'),
    },
    {
      question: t('home.faq_q4', 'Can I shortlist multiple properties?'),
      answer: t('home.faq_a4', 'Yes, you can browse and shortlist as many properties as you like, and we can schedule a combined site visit for all of them.'),
    },
  ];

  return (
    <section className="py-20 md:py-28">
      <div className="container mx-auto px-6 max-w-3xl">

        <div className="text-center mb-14">
          <p className="section-label justify-center mb-5">
            <span>{t('home.faq_label', 'FAQ')}</span>
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-5 leading-tight">
            {t('home.faq_title', 'Frequently Asked Questions')}
          </h2>
          <p className="text-charcoal-muted text-lg font-light">
            {t('home.faq_desc', 'Quick answers about tours, listings, and how we work.')}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                openIndex === index
                  ? 'border-gold/30 shadow-[0_4px_20px_rgba(184,134,11,0.08)] bg-white'
                  : 'border-black/8 bg-white hover:border-gold/20'
              }`}
            >
              <button
                className="w-full px-7 py-5 text-left flex justify-between items-center gap-4 focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-charcoal text-base">{faq.question}</span>
                <ChevronDown
                  size={18}
                  className={`text-gold shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28 }}
                  >
                    <div className="px-7 pb-6 pt-1 text-charcoal-muted leading-relaxed text-sm border-t border-black/5">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
