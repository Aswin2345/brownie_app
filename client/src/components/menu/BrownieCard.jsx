import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

export default function BrownieCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      className="group glass-card overflow-hidden hover:border-gold-500/20 hover:shadow-2xl hover:shadow-gold-500/5 transition-all duration-500"
    >
      {/* Image */}
      <div className="relative overflow-hidden p-6 pb-2">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <motion.img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-52 object-contain mx-auto drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
        />
        {/* Price badge */}
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/20">
          <span className="text-gold-500 text-sm font-bold">₹{product.price}</span>
        </div>
      </div>

      {/* Info */}
      <div className="px-6 pb-6 pt-2">
        <h3 className="text-lg font-heading font-semibold text-cream mb-2 group-hover:text-gold-500 transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-cream-dark/50 text-sm mb-5 leading-relaxed line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-gold-500 font-bold text-xl">₹{product.price}</span>
            <span className="text-cream-dark/40 text-xs ml-1">/piece</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-500 hover:bg-gold-500 hover:text-chocolate-900 text-sm font-medium transition-all duration-300"
          >
            <ShoppingCart size={16} />
            <span>Add to Cart</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
