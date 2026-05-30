import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="pt-32 pb-20 min-h-screen bg-chocolate-900 text-cream">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <p className="text-gold-500 text-sm tracking-[0.3em] uppercase mb-3 font-medium">
            Legal Information
          </p>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold text-cream mb-6">
            Privacy <span className="gold-gradient-text">Policy</span>
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-gold-500 to-gold-400 mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 sm:p-10 border border-gold-500/10 shadow-2xl prose prose-invert prose-gold max-w-none"
        >
          <p className="text-sm text-cream-dark/60 mb-8">Last Updated: October 2024</p>

          <h2 className="text-2xl font-heading font-semibold text-gold-500 mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-cream/80 leading-relaxed mb-6">
            When you visit Sharp SK Brownies, place an order, or contact us, we collect personal information that you provide to us voluntarily. This includes your name, email address, phone number, shipping address, and payment details.
          </p>

          <h2 className="text-2xl font-heading font-semibold text-gold-500 mt-8 mb-4">2. Payment Information Handling</h2>
          <p className="text-cream/80 leading-relaxed mb-6">
            All online transactions are processed through secure payment gateways (like Razorpay). We do not store your credit card or sensitive payment credentials on our servers. Your payment information is encrypted and handled securely by the payment processor.
          </p>

          <h2 className="text-2xl font-heading font-semibold text-gold-500 mt-8 mb-4">3. How We Use Your Data</h2>
          <p className="text-cream/80 leading-relaxed mb-6">
            We use the information we collect to fulfill your orders, send automated order status updates via WhatsApp, communicate with you regarding customer support inquiries, and occasionally send promotional materials if you have opted in.
          </p>

          <h2 className="text-2xl font-heading font-semibold text-gold-500 mt-8 mb-4">4. Data Protection</h2>
          <p className="text-cream/80 leading-relaxed mb-8">
            We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties.
          </p>

          <div className="mt-12 p-6 bg-chocolate-800/30 rounded-xl border border-chocolate-700/50 text-center">
            <p className="text-cream-dark mb-4">Need to exercise your data rights?</p>
            <Link to="/contact" className="text-gold-500 font-semibold hover:underline">
              Contact our Privacy Team
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
