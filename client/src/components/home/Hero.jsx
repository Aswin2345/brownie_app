import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
  const headingText = 'Freshly Baked Brownies Made With Love';
  const words = headingText.split(' ');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-brownie.png"
          alt="Premium brownies"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-chocolate-900/85 via-chocolate-900/70 to-chocolate-900" />
        <div className="absolute inset-0 bg-gradient-to-r from-chocolate-900/60 to-transparent" />
      </div>

      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [-20, 20, -20], rotate: [0, 10, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 right-10 w-32 h-32 rounded-full bg-gold-500/5 blur-2xl hidden lg:block"
      />
      <motion.div
        animate={{ y: [20, -20, 20], rotate: [0, -10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/3 left-10 w-40 h-40 rounded-full bg-gold-400/5 blur-3xl hidden lg:block"
      />
      <motion.div
        animate={{ y: [15, -15, 15], x: [-10, 10, -10] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 left-1/4 w-24 h-24 rounded-full bg-gold-500/3 blur-xl hidden lg:block"
      />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold-500/10 border border-gold-500/20 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
          <span className="text-gold-500 text-sm font-medium tracking-wide">
            Handcrafted With Premium Ingredients
          </span>
        </motion.div>

        {/* Heading with staggered word animation */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight mb-6">
          {words.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.4 + index * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`inline-block mr-3 ${
                word === 'Brownies' || word === 'Love'
                  ? 'gold-gradient-text'
                  : 'text-cream'
              }`}
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-xl sm:text-2xl text-cream-dark/70 font-light tracking-wide mb-10 font-heading italic"
        >
          Rich. Fudgy. Homemade.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/order">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(212, 165, 116, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-chocolate-900 font-bold text-lg tracking-wide shadow-xl shadow-gold-500/20 transition-all duration-300"
            >
              Order Now
            </motion.button>
          </Link>
          <Link to="/menu">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="px-10 py-4 rounded-full border-2 border-gold-500/40 text-gold-500 font-semibold text-lg hover:bg-gold-500/10 transition-all duration-300"
            >
              View Menu
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll down indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="text-cream-dark/40 text-xs tracking-[0.3em] uppercase">
            Scroll
          </span>
          <ChevronDown size={20} className="text-gold-500/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
