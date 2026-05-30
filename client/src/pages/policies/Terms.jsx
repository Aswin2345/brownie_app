import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Terms() {
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
            Terms & <span className="gold-gradient-text">Conditions</span>
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

          <h2 className="text-2xl font-heading font-semibold text-gold-500 mt-8 mb-4">1. Website Usage Terms</h2>
          <p className="text-cream/80 leading-relaxed mb-6">
            By accessing and placing an order with Sharp SK Brownies, you confirm that you are in agreement with and bound by the terms of service contained in the Terms & Conditions outlined below. These terms apply to the entire website and any email or other type of communication between you and Sharp SK Brownies.
          </p>

          <h2 className="text-2xl font-heading font-semibold text-gold-500 mt-8 mb-4">2. Product Availability</h2>
          <p className="text-cream/80 leading-relaxed mb-6">
            All products are subject to availability. Since our brownies are freshly baked to order, there may be times when certain ingredients are unavailable, leading to a temporary suspension of specific menu items. We reserve the right to discontinue any product at any time.
          </p>

          <h2 className="text-2xl font-heading font-semibold text-gold-500 mt-8 mb-4">3. Pricing Policy</h2>
          <p className="text-cream/80 leading-relaxed mb-6">
            Prices for our products are subject to change without notice. We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time. We shall not be liable to you or to any third-party for any modification, price change, suspension, or discontinuance of the Service.
          </p>

          <h2 className="text-2xl font-heading font-semibold text-gold-500 mt-8 mb-4">4. Payment Terms</h2>
          <p className="text-cream/80 leading-relaxed mb-6">
            We offer Cash on Delivery (COD), Direct UPI, and Razorpay online payments. All online payments must be completed successfully before the order enters the preparation stage. In the event of a payment failure, the order will remain in a pending state until payment is verified.
          </p>

          <h2 className="text-2xl font-heading font-semibold text-gold-500 mt-8 mb-4">5. Limitation of Liability</h2>
          <p className="text-cream/80 leading-relaxed mb-8">
            Sharp SK Brownies shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our products or services. Please check the ingredient list for any potential allergens before consuming our products.
          </p>

          <div className="mt-12 p-6 bg-chocolate-800/30 rounded-xl border border-chocolate-700/50 text-center">
            <p className="text-cream-dark mb-4">Have questions about our terms?</p>
            <Link to="/contact" className="text-gold-500 font-semibold hover:underline">
              Contact our Support Team
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
