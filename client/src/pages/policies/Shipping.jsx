import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Shipping() {
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
            Shipping & <span className="gold-gradient-text">Delivery</span>
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

          <h2 className="text-2xl font-heading font-semibold text-gold-500 mt-8 mb-4">1. Delivery Areas</h2>
          <p className="text-cream/80 leading-relaxed mb-6">
            Currently, Aswin Brownies only delivers to addresses within <strong>Pondicherry (Puducherry)</strong>. Our system verifies your pincode (must start with 605) during checkout. We do not offer nationwide shipping at this time to ensure the freshness and quality of our products.
          </p>

          <h2 className="text-2xl font-heading font-semibold text-gold-500 mt-8 mb-4">2. Delivery Timelines</h2>
          <p className="text-cream/80 leading-relaxed mb-6">
            All our brownies are freshly baked to order. Standard delivery takes between <strong>24 to 48 hours</strong> from the time your order is confirmed. You will receive WhatsApp notifications when your order status changes to "Preparing" and "Out for Delivery".
          </p>

          <h2 className="text-2xl font-heading font-semibold text-gold-500 mt-8 mb-4">3. Shipping Charges</h2>
          <p className="text-cream/80 leading-relaxed mb-6">
            We currently offer <strong>Free Delivery</strong> on all orders within Pondicherry. The price you see on the menu is the final price you pay.
          </p>

          <h2 className="text-2xl font-heading font-semibold text-gold-500 mt-8 mb-4">4. Delayed Delivery Handling</h2>
          <p className="text-cream/80 leading-relaxed mb-8">
            While we strive to deliver on time, certain factors like severe weather conditions, strikes, or sudden high order volumes might cause minor delays. In the event of a significant delay, our team will proactively contact you via WhatsApp or Phone to provide a revised delivery timeline.
          </p>

          <div className="mt-12 p-6 bg-chocolate-800/30 rounded-xl border border-chocolate-700/50 text-center">
            <p className="text-cream-dark mb-4">Are you outside Pondicherry?</p>
            <Link to="/contact" className="text-gold-500 font-semibold hover:underline">
              Contact us for special bulk orders
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
