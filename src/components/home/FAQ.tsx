import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function FAQ() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
  const { t } = useTranslation();

  const faqs = [
    {
      question: t('home.faq_new_q1', 'It feels too expensive for me right now.'),
      answer: t('home.faq_new_a1', 'We understand. That\'s why we first understand your budget and then show you only what fits — not properties above your range. We also help you understand if EMI or installment-based payment options are available. Many buyers who "waited for the right time" later found prices had gone up. One conversation with us costs nothing.\n\nShare your budget range with us — we\'ll show you what\'s genuinely available in that range.'),
    },
    {
      question: t('home.faq_new_q2', 'I don\'t know much about property buying.'),
      answer: t('home.faq_new_a2', 'That\'s actually the best time to come to us. We explain everything in simple terms — from what to check in documents, to what questions to ask, to how registry works. 90% of our clients were first-time buyers. You don\'t need to know anything before calling us.\n\nWe walk you through the entire process step by step — no jargon, no confusion.'),
    },
    {
      question: t('home.faq_new_q3', '⏳ Let me think about it / I\'ll come back later.'),
      answer: t('home.faq_new_a3', 'Absolutely your right. But here\'s what we\'ve seen: good plots at a fair price get booked fast. If you\'re 60–70% sure, a site visit costs you nothing but 2 hours. Seeing the plot in person answers far more questions than thinking alone. There\'s no obligation to buy on a visit.\n\nBook a free site visit — just 2 hours, zero commitment. You\'ll have far more clarity after.'),
    },
    {
      question: t('home.faq_new_q4', 'Will this property actually work for my needs?'),
      answer: t('home.faq_new_a4', 'Tell us what you need — family home, investment, rental income, farmhouse, or business space. We\'ll match you with options that genuinely fit, not just whatever is available. We don\'t push a property that doesn\'t suit you — a happy client sends us referrals, a pushed sale doesn\'t.\n\nCall us and describe your situation — we\'ll tell you honestly if we have something suitable.'),
    },
    {
      question: t('home.faq_new_q5', 'What if something goes wrong after I buy?'),
      answer: t('home.faq_new_a5', 'We encourage all buyers to get independent legal verification before finalizing. We show you all available documents upfront. Our reputation in Jaipur is built on honest dealings over 19+ years — but we always recommend you do your own due diligence alongside.\n\nWe show documents on Day 1. Independent legal check is always recommended and we support that process.'),
    },
    {
      question: t('home.faq_new_q6', 'How long does the whole process take?'),
      answer: t('home.faq_new_a6', 'From first visit to possession, our recent buyers have got it done in 30–45 days when documents are in order. The timeline depends on your decision speed, document readiness, and the specific property. We guide you at every step so nothing gets stuck or delayed unnecessarily.\n\nOur clients Aarav Sharma (30 days) and Ankit Sachdeva (45 days) got full possession including registry done quickly.'),
    },
    {
      question: t('home.faq_new_q7', 'Is this actually a good investment or will I lose money?'),
      answer: t('home.faq_new_a7', 'We don\'t make return promises — nobody should. What we do is show you areas with solid fundamentals: road connectivity, upcoming infrastructure, historical price trends, and rental demand. We help you understand the logic — you make the call. Many of our repeat clients started with one plot and came back for more after seeing real appreciation.\n\nWe explain the price logic and location fundamentals clearly. You decide based on facts, not pressure.'),
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#FDFCF7]">
      <div className="container mx-auto px-6 max-w-3xl">

        <div className="text-center mb-14">
          <p className="section-label justify-center mb-5">
            <span>{t('home.faq_label_new', 'Common Questions')}</span>
          </p>
          <h2 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-5 leading-tight">
            {t('home.faq_title_new', 'Every Question a Buyer Has Before Investing')}
          </h2>
          <p className="text-charcoal-muted text-lg font-light">
            {t('home.faq_desc_new', 'We know what worries buyers. Here are honest answers — no marketing fluff.')}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === index
                  ? 'border-[#C9A84C]/35 shadow-[0_4px_24px_rgba(201,168,76,0.1)] bg-white'
                  : 'border-black/7 bg-white hover:border-[#C9A84C]/20'
                }`}
            >
              <button
                className="w-full px-7 py-5 text-left flex justify-between items-center gap-4 focus:outline-none"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-charcoal text-base">{faq.question}</span>
                <ChevronDown
                  size={18}
                  className={`text-[#C9A84C] shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
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
                    <div className="px-7 pb-6 pt-1 text-charcoal-muted leading-relaxed text-sm border-t border-black/5 whitespace-pre-wrap">
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
