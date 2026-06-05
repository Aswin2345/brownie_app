import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Truck, Clock } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Premium Ingredients',
    description:
      'We use only the finest Belgian chocolate, farm-fresh butter, and premium cocoa to create brownies that taste extraordinary.',
    gradient: 'from-amber-500/20 to-yellow-500/20',
  },
  {
    icon: Heart,
    title: 'Handcrafted With Love',
    description:
      'Every brownie is lovingly hand-mixed, hand-poured, and baked in small batches to ensure perfection in every bite.',
    gradient: 'from-rose-500/20 to-pink-500/20',
  },
  {
    icon: Truck,
    title: 'Pondicherry Delivery',
    description:
      'Fresh brownies delivered across Pondicherry now. We are preparing to reach more places soon.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    icon: Clock,
    title: 'Made Fresh Daily',
    description:
      'No preservatives, no shortcuts. Our brownies are baked fresh every day so you always get the best experience.',
    gradient: 'from-emerald-500/20 to-green-500/20',
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-chocolate-900 via-chocolate-800/30 to-chocolate-900" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold-500 text-sm tracking-[0.3em] uppercase mb-3 font-medium"
          >
            Why Us
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-cream mb-4"
          >
            Why Choose <span className="gold-gradient-text">Aswin</span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-24 h-0.5 bg-gradient-to-r from-gold-500 to-gold-400 mx-auto"
          />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -8 }}
              className="group glass-card p-8 text-center hover:border-gold-500/20 transition-all duration-500"
            >
              {/* Icon */}
              <div className="relative inline-flex mb-6">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}
                >
                  <feature.icon
                    size={28}
                    className="text-gold-500"
                  />
                </div>
                <div className="absolute inset-0 bg-gold-500/5 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Text */}
              <h3 className="text-lg font-heading font-semibold text-cream mb-3 group-hover:text-gold-500 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-cream-dark/50 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
