import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import BrownieCard from '../components/menu/BrownieCard';
import { getProducts } from '../services/api';

const fallbackProducts = [
  {
    _id: 'fb1',
    name: 'Chocolate Brownie',
    price: 40,
    priceHalfKg: 400,
    description: 'Rich dark chocolate brownie with intense cocoa flavor',
    image: '/images/chocolate-brownie.png',
  },
  {
    _id: 'fb2',
    name: 'Double Chocolate Brownie',
    price: 45,
    priceHalfKg: 450,
    description: 'Loaded with double the chocolate — extra fudgy and irresistibly rich',
    image: '/images/double-chocolate-brownie.png',
  },
  {
    _id: 'fb3',
    name: 'White Chocolate Brownie',
    price: 40,
    priceHalfKg: 400,
    description: 'Creamy white chocolate brownie with a buttery vanilla base',
    image: '/images/white-chocolate-brownie.png',
  },
];

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        const items = res.data?.data;
        if (items && items.length > 0) {
          setProducts(items);
        } else {
          setProducts(fallbackProducts);
        }
      } catch {
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Brownies' },
    { id: 'classic', label: 'Classic' },
    { id: 'chocolate', label: 'Chocolate' },
    { id: 'nut', label: 'Nut' },
    { id: 'premium', label: 'Premium' },
    { id: 'giftbox', label: 'Gift Boxes' },
  ];

  const filteredProducts = products.filter(product => {
    if (activeCategory === 'all') return true;
    return product.category === activeCategory;
  });

  return (
    <main className="pt-24 pb-20 min-h-screen">
      {/* Header */}
      <div className="text-center px-4 mb-10">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gold-500 text-sm tracking-[0.3em] uppercase mb-3 font-medium"
        >
          Explore Our Collection
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-cream mb-4"
        >
          Our <span className="gold-gradient-text">Menu</span>
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-24 h-0.5 bg-gradient-to-r from-gold-500 to-gold-400 mx-auto mb-4"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-cream-dark/50 max-w-lg mx-auto"
        >
          Each brownie is handcrafted with premium ingredients for a rich, indulgent experience
        </motion.p>
      </div>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex overflow-x-auto pb-4 hide-scrollbar justify-start sm:justify-center gap-2 sm:gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-gold-500 text-chocolate-900 shadow-lg shadow-gold-500/20'
                  : 'bg-chocolate-900/50 text-cream-dark/80 hover:bg-chocolate-800 hover:text-cream border border-chocolate-800'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="glass-card overflow-hidden animate-pulse"
              >
                <div className="p-6">
                  <div className="w-full h-52 bg-chocolate-700/30 rounded-xl" />
                </div>
                <div className="px-6 pb-6">
                  <div className="h-5 bg-chocolate-700/30 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-chocolate-700/20 rounded w-full mb-2" />
                  <div className="h-4 bg-chocolate-700/20 rounded w-2/3 mb-5" />
                  <div className="flex justify-between">
                    <div className="h-6 bg-chocolate-700/30 rounded w-16" />
                    <div className="h-10 bg-chocolate-700/30 rounded-xl w-28" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <BrownieCard key={product._id || product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-chocolate-900/30 rounded-3xl border border-chocolate-800/50">
            <p className="text-cream-dark/60 text-lg">No brownies found in this category.</p>
            <button 
              onClick={() => setActiveCategory('all')}
              className="mt-4 text-gold-500 hover:underline"
            >
              View all brownies
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
