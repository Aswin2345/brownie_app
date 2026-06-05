import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/api';
import toast from 'react-hot-toast';

const fallbackProducts = [
  { _id: 'fb1', name: 'Chocolate Brownie', price: 40, priceHalfKg: 400, description: 'Rich dark chocolate brownie with intense cocoa flavor', image: '/images/chocolate-brownie.png' },
  { _id: 'fb2', name: 'Double Chocolate Brownie', price: 45, priceHalfKg: 450, description: 'Loaded with double the chocolate - extra fudgy and irresistibly rich', image: '/images/double-chocolate-brownie.png' },
  { _id: 'fb3', name: 'White Chocolate Brownie', price: 40, priceHalfKg: 400, description: 'Creamy white chocolate brownie with a buttery vanilla base', image: '/images/white-chocolate-brownie.png' },
];

export default function OrderOnline() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { items, addToCart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        const items = res.data?.data;
        setProducts(items && items.length > 0 ? items : fallbackProducts);
      } catch {
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product, variant = 'piece') => {
    addToCart(product, variant);
    const label = variant === 'halfKg' ? 'Half kg' : 'Piece';
    toast.success(`${product.name} (${label}) added!`);
  };

  const getItemQty = (productId, variant = 'piece') => {
    const item = items.find((i) => i.cartId === `${productId}:${variant}`);
    return item ? item.quantity : 0;
  };

  return (
    <main className="pt-24 pb-20 min-h-screen">
      {/* Header */}
      <div className="text-center px-4 mb-12">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gold-500 text-sm tracking-[0.3em] uppercase mb-3 font-medium"
        >
          Fresh & Delivered
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-heading font-bold text-cream mb-4"
        >
          Order <span className="gold-gradient-text">Online</span>
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-24 h-0.5 bg-gradient-to-r from-gold-500 to-gold-400 mx-auto"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-card p-5 animate-pulse">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-chocolate-700/30 rounded-xl flex-shrink-0" />
                      <div className="flex-1">
                        <div className="h-4 bg-chocolate-700/30 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-chocolate-700/20 rounded w-full mb-3" />
                        <div className="h-8 bg-chocolate-700/30 rounded-lg w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {products.map((product, index) => {
                  const productId = product._id || product.id;
                  const pieceQty = getItemQty(productId, 'piece');
                  const halfKgQty = getItemQty(productId, 'halfKg');
                  return (
                    <motion.div
                      key={product._id || product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="glass-card p-5 hover:border-gold-500/20 transition-all duration-300"
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-xl bg-chocolate-700/20 flex-shrink-0 overflow-hidden p-1">
                          <img
                            src={product.image}
                            alt={product.name}
                            loading="lazy"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-cream font-medium text-sm truncate">
                            {product.name}
                          </h3>
                          <p className="text-cream-dark/40 text-xs mt-0.5 line-clamp-1">
                            {product.description}
                          </p>
                          <p className="text-gold-500 font-bold mt-1">
                            ₹{product.price}
                            <span className="text-cream-dark/30 text-xs font-normal ml-1">/piece</span>
                          </p>
                          {product.priceHalfKg && (
                            <p className="text-cream-dark/60 text-xs mt-0.5">
                              Half kg: Rs.{product.priceHalfKg}
                            </p>
                          )}
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-cream-dark/70 text-xs">Piece</span>
                              {pieceQty === 0 ? (
                                <motion.button
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleAddToCart(product, 'piece')}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-500 text-xs font-medium hover:bg-gold-500 hover:text-chocolate-900 transition-all duration-300"
                                >
                                  <ShoppingCart size={12} />
                                  Add
                                </motion.button>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => updateQuantity(`${productId}:piece`, pieceQty - 1)} className="w-7 h-7 rounded-lg bg-chocolate-700/50 border border-chocolate-700 flex items-center justify-center text-cream-dark hover:border-gold-500/30 transition-all">
                                    <Minus size={12} />
                                  </motion.button>
                                  <span className="w-6 text-center text-cream text-sm font-medium">{pieceQty}</span>
                                  <motion.button whileTap={{ scale: 0.85 }} onClick={() => updateQuantity(`${productId}:piece`, pieceQty + 1)} className="w-7 h-7 rounded-lg bg-chocolate-700/50 border border-chocolate-700 flex items-center justify-center text-cream-dark hover:border-gold-500/30 transition-all">
                                    <Plus size={12} />
                                  </motion.button>
                                </div>
                              )}
                            </div>
                            {product.priceHalfKg && (
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-cream-dark/70 text-xs">Half kg</span>
                                {halfKgQty === 0 ? (
                                  <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleAddToCart(product, 'halfKg')}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-500 text-xs font-medium hover:bg-gold-500 hover:text-chocolate-900 transition-all duration-300"
                                  >
                                    <ShoppingCart size={12} />
                                    Add
                                  </motion.button>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => updateQuantity(`${productId}:halfKg`, halfKgQty - 1)} className="w-7 h-7 rounded-lg bg-chocolate-700/50 border border-chocolate-700 flex items-center justify-center text-cream-dark hover:border-gold-500/30 transition-all">
                                      <Minus size={12} />
                                    </motion.button>
                                    <span className="w-6 text-center text-cream text-sm font-medium">{halfKgQty}</span>
                                    <motion.button whileTap={{ scale: 0.85 }} onClick={() => updateQuantity(`${productId}:halfKg`, halfKgQty + 1)} className="w-7 h-7 rounded-lg bg-chocolate-700/50 border border-chocolate-700 flex items-center justify-center text-cream-dark hover:border-gold-500/30 transition-all">
                                      <Plus size={12} />
                                    </motion.button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart Summary Sidebar */}
          <div className="lg:w-96">
            <div className="lg:sticky lg:top-28">
              <div className="glass-card p-6">
                <div className="flex items-center gap-2 mb-6">
                  <ShoppingBag size={20} className="text-gold-500" />
                  <h2 className="text-lg font-heading font-bold text-cream">
                    Order Summary
                  </h2>
                  {totalItems > 0 && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-gold-500/10 text-gold-500 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </div>

                {items.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag size={40} className="text-cream-dark/15 mx-auto mb-3" />
                    <p className="text-cream-dark/40 text-sm">
                      Your cart is empty. Add brownies to get started!
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 max-h-64 overflow-y-auto mb-6 pr-1">
                      {items.map((item) => (
                        <div
                          key={item.cartId}
                          className="flex items-center gap-3 p-3 rounded-xl bg-chocolate-800/30 border border-chocolate-700/20"
                        >
                          <div className="w-10 h-10 rounded-lg bg-chocolate-700/20 flex-shrink-0 overflow-hidden p-0.5">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-cream text-xs font-medium truncate">{item.name}</p>
                            <p className="text-cream-dark/40 text-xs">
                              {item.unitLabel} x {item.quantity} x Rs.{item.price}
                            </p>
                          </div>
                          <p className="text-gold-500 text-sm font-bold flex-shrink-0">
                            Rs.{item.price * item.quantity}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.cartId)}
                            className="p-1 text-red-400/40 hover:text-red-400 transition-colors flex-shrink-0"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-chocolate-700/30 pt-4 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-cream-dark/60 font-medium">Total</span>
                        <span className="text-cream font-bold text-2xl">₹{totalPrice}</span>
                      </div>
                    </div>

                    {totalPrice <= 100 && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium text-center mb-3">
                        Minimum order must be more than Rs.100. Add Rs.{101 - totalPrice} more.
                      </div>
                    )}

                    <Link to={totalPrice > 100 ? "/checkout" : "#"} onClick={(e) => { if (totalPrice <= 100) e.preventDefault(); }}>
                      <motion.button
                        whileHover={totalPrice > 100 ? { scale: 1.02 } : {}}
                        whileTap={totalPrice > 100 ? { scale: 0.98 } : {}}
                        disabled={totalPrice <= 100}
                        className={`w-full py-3.5 rounded-xl font-bold shadow-lg transition-all duration-300 ${
                          totalPrice > 100
                            ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-chocolate-900 shadow-gold-500/20'
                            : 'bg-chocolate-700/50 text-cream/40 cursor-not-allowed shadow-none'
                        }`}
                      >
                        {totalPrice > 100 ? 'Proceed to Checkout' : 'Minimum above Rs.100'}
                      </motion.button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
