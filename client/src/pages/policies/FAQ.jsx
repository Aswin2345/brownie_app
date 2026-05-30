import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: "What are your delivery timelines?",
    answer: "Since our brownies are baked fresh to order, standard delivery within Pondicherry takes between 24 to 48 hours from the time your order is confirmed."
  },
  {
    question: "How should I store the brownies?",
    answer: "For the best experience, store our brownies in an airtight container at room temperature for up to 3 days. For longer storage, keep them refrigerated for up to 7 days, and microwave them for 10-15 seconds before eating for that fresh, gooey texture."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept Cash on Delivery (COD), Direct UPI payments, and all major Credit/Debit cards, Net Banking, and Wallets via our secure Razorpay integration."
  },
  {
    question: "Do you accept custom or bulk orders?",
    answer: "Yes! We love doing custom orders for birthdays, weddings, corporate events, or special gifts. Please contact us directly via our Contact page or WhatsApp us at least 3-4 days in advance."
  },
  {
    question: "Can I cancel my order?",
    answer: "Yes, you can cancel your order within 2 hours of placing it, as long as it hasn't entered the 'Preparing' stage. Please refer to our Refund & Cancellation policy for more details."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="pt-32 pb-20 min-h-screen bg-chocolate-900 text-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="text-gold-500 text-sm tracking-[0.3em] uppercase mb-3 font-medium">
            Got Questions?
          </p>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-cream mb-6">
            Frequently Asked <span className="gold-gradient-text">Questions</span>
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-gold-500 to-gold-400 mx-auto" />
        </motion.div>

        <div className="space-y-4 max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={index}
              className="glass-card border border-chocolate-800 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none bg-chocolate-900/50 hover:bg-chocolate-850/80 transition-colors"
              >
                <span className="font-heading font-semibold text-lg text-cream">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-gold-500 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 pt-2 text-cream-dark/80 leading-relaxed border-t border-chocolate-800/30">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-cream-dark mb-4">Still have questions?</p>
          <Link 
            to="/contact" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500/10 border border-gold-500/30 text-gold-500 rounded-full font-semibold hover:bg-gold-500 hover:text-chocolate-900 transition-all duration-300"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
