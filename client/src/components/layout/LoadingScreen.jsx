import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-chocolate-900"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 25% 25%, #D4A574 1px, transparent 1px), radial-gradient(circle at 75% 75%, #D4A574 1px, transparent 1px)',
                backgroundSize: '60px 60px',
              }}
            />
          </div>

          {/* Animated brownie icon */}
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative mb-8"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-500/20 to-gold-400/10 flex items-center justify-center border border-gold-500/20">
              <span className="text-4xl">🍫</span>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-gold-500/10 blur-xl animate-pulse" />
          </motion.div>

          {/* Brand Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl font-heading font-bold gold-gradient-text mb-3"
          >
            Sharp SK Brownies
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-cream-dark/50 text-sm tracking-[0.3em] uppercase"
          >
            Premium Handcrafted
          </motion.p>

          {/* Loading bar */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '160px' }}
            transition={{ duration: 1.8, ease: 'easeInOut' }}
            className="h-0.5 bg-gradient-to-r from-gold-500 to-gold-400 rounded-full mt-8"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
