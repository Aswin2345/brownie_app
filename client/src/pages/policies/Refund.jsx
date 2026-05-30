import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Refund() {
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
            Refund & <span className="gold-gradient-text">Cancellation</span>
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

          <h2 className="text-2xl font-heading font-semibold text-gold-500 mt-8 mb-4">1. Cancellation Window</h2>
          <p className="text-cream/80 leading-relaxed mb-6">
            Since our brownies are freshly baked to order, we have a strict cancellation window. Orders can only be cancelled within <strong>2 hours</strong> of placing the order, provided the order status has not yet changed to "Preparing".
          </p>

          <h2 className="text-2xl font-heading font-semibold text-gold-500 mt-8 mb-4">2. Refund Eligibility</h2>
          <p className="text-cream/80 leading-relaxed mb-6">
            If you cancel your order within the allowed cancellation window, you are eligible for a full refund. Refunds will be processed back to your original payment method (Razorpay or UPI) within 5-7 business days. Cash on Delivery (COD) orders that are cancelled require no refund processing.
          </p>

          <h2 className="text-2xl font-heading font-semibold text-gold-500 mt-8 mb-4">3. Damaged Product Policy</h2>
          <p className="text-cream/80 leading-relaxed mb-6">
            We take utmost care in packaging our brownies. However, if your order arrives severely damaged or if you receive the wrong items, please contact us within <strong>24 hours</strong> of delivery. You will need to provide photographic evidence of the damaged product. Once verified, we will offer a replacement or a full refund.
          </p>

          <h2 className="text-2xl font-heading font-semibold text-gold-500 mt-8 mb-4">4. Contact Process for Disputes</h2>
          <p className="text-cream/80 leading-relaxed mb-8">
            To initiate a cancellation or raise a dispute regarding a damaged product, please message us directly on WhatsApp or use our contact form. Please include your Order ID in all communications to expedite the process.
          </p>

          <div className="mt-12 p-6 bg-chocolate-800/30 rounded-xl border border-chocolate-700/50 text-center">
            <p className="text-cream-dark mb-4">Need to cancel an order?</p>
            <Link to="/contact" className="text-gold-500 font-semibold hover:underline">
              Contact Support Immediately
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
