import React from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppButton() {
  const handleClick = () => {
    window.open(
      'https://wa.me/916374923162?text=Hi%2C%20I%20want%20to%20order%20brownies.',
      '_blank'
    );
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2.5, type: 'spring', stiffness: 200 }}
      className="fixed bottom-6 right-6 z-40"
    >
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-[#25D366]/30 pulse-ring" />

      <motion.button
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="relative w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 transition-shadow duration-300"
        aria-label="Contact us on WhatsApp"
      >
        <FaWhatsapp size={28} className="text-white" />
      </motion.button>
    </motion.div>
  );
}
