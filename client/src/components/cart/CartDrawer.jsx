import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md z-50 bg-chocolate-900 border-l border-chocolate-700/30 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-chocolate-700/30">
              <div className="flex items-center gap-3">
                <ShoppingBag size={22} className="text-gold-500" />
                <h2 className="text-xl font-heading font-bold text-cream">
                  Your Cart
                </h2>
                {totalItems > 0 && (
                  <span className="px-2.5 py-0.5 text-xs font-bold bg-gold-500/10 text-gold-500 rounded-full border border-gold-500/20">
                    {totalItems}
                  </span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-xl bg-chocolate-800/50 border border-chocolate-700/50 text-cream-dark hover:text-cream transition-colors"
              >
                <X size={18} />
              </motion.button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 rounded-2xl bg-chocolate-800/50 flex items-center justify-center mb-4">
                    <ShoppingBag size={36} className="text-cream-dark/20" />
                  </div>
                  <h3 className="text-cream font-heading font-semibold text-lg mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-cream-dark/40 text-sm mb-6">
                    Add some delicious brownies to get started!
                  </p>
                  <Link to="/menu" onClick={() => setIsCartOpen(false)}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-6 py-3 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-500 font-medium text-sm hover:bg-gold-500/20 transition-all"
                    >
                      Browse Menu
                    </motion.button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-4 p-4 rounded-xl bg-chocolate-800/40 border border-chocolate-700/30"
                      >
                        {/* Image */}
                        <div className="w-16 h-16 rounded-lg bg-chocolate-700/30 flex-shrink-0 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain p-1"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-cream font-medium text-sm truncate">
                            {item.name}
                          </h4>
                          <p className="text-gold-500 font-bold text-sm mt-0.5">
                            ₹{item.price * item.quantity}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1">
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                                className="w-7 h-7 rounded-lg bg-chocolate-700/50 border border-chocolate-700 flex items-center justify-center text-cream-dark hover:text-cream hover:border-gold-500/30 transition-all"
                              >
                                <Minus size={12} />
                              </motion.button>
                              <span className="w-8 text-center text-cream text-sm font-medium">
                                {item.quantity}
                              </span>
                              <motion.button
                                whileTap={{ scale: 0.85 }}
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity + 1)
                                }
                                className="w-7 h-7 rounded-lg bg-chocolate-700/50 border border-chocolate-700 flex items-center justify-center text-cream-dark hover:text-cream hover:border-gold-500/30 transition-all"
                              >
                                <Plus size={12} />
                              </motion.button>
                            </div>
                            <motion.button
                              whileTap={{ scale: 0.85 }}
                              onClick={() => removeFromCart(item.id)}
                              className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all"
                            >
                              <Trash2 size={14} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-chocolate-700/30 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-cream-dark/60 font-medium">Subtotal</span>
                  <span className="text-cream font-bold text-xl">
                    ₹{totalPrice}
                  </span>
                </div>
                <Link to="/checkout" onClick={() => setIsCartOpen(false)}>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-chocolate-900 font-bold text-base shadow-lg shadow-gold-500/20 hover:shadow-xl hover:shadow-gold-500/30 transition-all duration-300"
                  >
                    Proceed to Checkout
                  </motion.button>
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
