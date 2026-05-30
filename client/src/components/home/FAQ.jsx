import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What are your delivery timings?',
    answer:
      'We deliver in Pondicherry from 10 AM to 9 PM, 7 days a week. More delivery locations are coming soon.',
  },
  {
    question: 'Do you offer bulk orders?',
    answer:
      'Yes! We offer special pricing for bulk orders. Contact us on WhatsApp at +91 6374923162 for bulk order pricing and customizations.',
  },
  {
    question: 'Are your brownies eggless?',
    answer:
      'We offer both egg and eggless options. Please specify your preference when placing your order, and we will prepare accordingly.',
  },
  {
    question: 'What is the minimum order?',
    answer:
      'Minimum order is just 1 piece for Pondicherry delivery. Order as many or as few brownies as you like.',
  },
  {
    question: 'How do I track my order?',
    answer:
      "You'll receive real-time order updates via WhatsApp after placing your order. We keep you informed every step of the way!",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-chocolate-900 via-chocolate-800/20 to-chocolate-900" />

      <div className="max-w-3xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold-500 text-sm tracking-[0.3em] uppercase mb-3 font-medium"
          >
            Got Questions?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-cream mb-4"
          >
            Frequently Asked <span className="gold-gradient-text">Questions</span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-24 h-0.5 bg-gradient-to-r from-gold-500 to-gold-400 mx-auto"
          />
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between p-6 text-left group"
              >
                <span className="text-cream font-medium pr-4 group-hover:text-gold-500 transition-colors duration-300">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown
                    size={20}
                    className={`transition-colors duration-300 ${
                      openIndex === index ? 'text-gold-500' : 'text-cream-dark/40'
                    }`}
                  />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 border-t border-chocolate-700/30 pt-4">
                      <p className="text-cream-dark/60 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
