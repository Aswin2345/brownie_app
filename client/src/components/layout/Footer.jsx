import React from 'react';
import { Link } from 'react-router-dom';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { HiOutlineMail } from 'react-icons/hi';
import { motion } from 'framer-motion';

const quickLinks = [
  { name: 'Home', path: '/' },
  { name: 'Our Menu', path: '/menu' },
  { name: 'About Us', path: '/about' },
  { name: 'Contact', path: '/contact' },
  { name: 'Order Online', path: '/order' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-chocolate-900 border-t border-chocolate-700/30">
      {/* Decorative gradient top edge */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <h3 className="text-2xl font-heading font-bold gold-gradient-text">
                Sharp SK Brownies
              </h3>
            </Link>
            <p className="text-cream-dark/70 text-sm leading-relaxed mb-6">
              Premium handcrafted brownies baked fresh daily with the finest ingredients. 
              Every bite is a moment of pure indulgence.
            </p>
            <div className="flex items-center gap-3">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://www.instagram.com/__.sharp__.sk/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-chocolate-800 border border-chocolate-700/50 flex items-center justify-center text-cream-dark hover:text-gold-500 hover:border-gold-500/30 transition-all duration-300"
              >
                <FaInstagram size={18} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="https://wa.me/916374923162"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-chocolate-800 border border-chocolate-700/50 flex items-center justify-center text-cream-dark hover:text-green-400 hover:border-green-400/30 transition-all duration-300"
              >
                <FaWhatsapp size={18} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="mailto:aswincse2@gmail.com"
                className="w-10 h-10 rounded-xl bg-chocolate-800 border border-chocolate-700/50 flex items-center justify-center text-cream-dark hover:text-gold-500 hover:border-gold-500/30 transition-all duration-300"
              >
                <HiOutlineMail size={18} />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-cream font-heading font-semibold text-lg mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-cream-dark/60 hover:text-gold-500 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500/30 group-hover:bg-gold-500 transition-colors duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-cream font-heading font-semibold text-lg mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-gold-500 mt-0.5">📞</span>
                <div>
                  <p className="text-cream/80 text-sm">Phone / WhatsApp</p>
                  <a
                    href="tel:+916374923162"
                    className="text-cream-dark/60 text-sm hover:text-gold-500 transition-colors"
                  >
                    +91 6374923162
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold-500 mt-0.5">✉️</span>
                <div>
                  <p className="text-cream/80 text-sm">Email</p>
                  <a
                    href="mailto:aswincse2@gmail.com"
                    className="text-cream-dark/60 text-sm hover:text-gold-500 transition-colors"
                  >
                    aswincse2@gmail.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold-500 mt-0.5">🕐</span>
                <div>
                  <p className="text-cream/80 text-sm">Working Hours</p>
                  <p className="text-cream-dark/60 text-sm mt-1">
                    Available only in Pondicherry. More places coming soon.
                  </p>
                  <p className="text-cream-dark/60 text-sm">10 AM – 9 PM, Every Day</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-cream font-heading font-semibold text-lg mb-6">
              Stay Updated
            </h4>
            <p className="text-cream-dark/60 text-sm mb-4">
              Get exclusive offers and new flavor announcements straight to your inbox.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col gap-3"
            >
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-3 rounded-xl bg-chocolate-800/50 border border-chocolate-700/50 text-cream placeholder:text-cream-dark/40 text-sm focus:border-gold-500/50 transition-all duration-300"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-chocolate-900 font-semibold text-sm hover:shadow-lg hover:shadow-gold-500/20 transition-all duration-300"
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-chocolate-700/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-cream-dark/40 text-sm">
              © {currentYear} Sharp SK Brownies. All rights reserved.
            </p>
            <div className="flex items-center gap-1 text-cream-dark/40 text-sm">
              <span>Made with</span>
              <span className="text-red-400">❤️</span>
              <span>and lots of chocolate</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
