import React from 'react';
import { motion } from 'framer-motion';
import { FaInstagram } from 'react-icons/fa';

const images = [
  { src: '/images/chocolate-brownie.png', alt: 'Chocolate Brownie' },
  { src: '/images/white-chocolate-brownie.png', alt: 'White Chocolate Brownie' },
  { src: '/images/nutella-brownie.png', alt: 'Nutella Brownie' },
  { src: '/images/oreo-brownie.png', alt: 'Oreo Brownie' },
  { src: '/images/choco-lava-brownie.png', alt: 'Choco Lava Brownie' },
  { src: '/images/walnut-brownie.png', alt: 'Walnut Brownie' },
];

export default function InstagramSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold-500 text-sm tracking-[0.3em] uppercase mb-3 font-medium"
          >
            @__.sharp__.sk
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-cream mb-4"
          >
            Follow Us on <span className="gold-gradient-text">Instagram</span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-24 h-0.5 bg-gradient-to-r from-gold-500 to-gold-400 mx-auto"
          />
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {images.map((image, index) => (
            <motion.a
              key={index}
              href="https://www.instagram.com/__.sharp__.sk/"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-chocolate-800"
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-chocolate-900/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="text-center">
                  <FaInstagram
                    size={32}
                    className="text-cream mx-auto mb-2"
                  />
                  <p className="text-cream text-sm font-medium">
                    View on Instagram
                  </p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Follow Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <a
            href="https://www.instagram.com/__.sharp__.sk/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full border border-gold-500/30 text-gold-500 font-medium hover:bg-gold-500/10 transition-all duration-300"
            >
              <FaInstagram size={20} />
              <span>Follow @__.sharp__.sk</span>
            </motion.button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
