import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getProducts } from '../../services/api';
import toast from 'react-hot-toast';

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

export default function FeaturedBrownies() {
  const [products, setProducts] = useState(fallbackProducts);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();
        const items = res.data?.data;
        if (items && items.length > 0) {
          setProducts(items.slice(0, 4));
        }
      } catch {
        // Use fallback data silently
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-16">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-gold-500 text-sm tracking-[0.3em] uppercase mb-3 font-medium"
        >
          Irresistible Selection
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-cream mb-4"
        >
          Our Signature <span className="gold-gradient-text">Brownies</span>
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-24 h-0.5 bg-gradient-to-r from-gold-500 to-gold-400 mx-auto"
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {products.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -8 }}
            className="group glass-card overflow-hidden hover:border-gold-500/20 transition-all duration-500 hover:shadow-2xl hover:shadow-gold-500/5"
          >
            {/* Image */}
            <div className="relative overflow-hidden p-6 pb-4">
              <div className="absolute inset-0 bg-gradient-to-b from-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <motion.img
                src={product.image}
                alt={product.name}
                loading="lazy"
                className="w-full h-48 object-contain mx-auto drop-shadow-2xl group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Info */}
            <div className="px-6 pb-6">
              <h3 className="text-lg font-heading font-semibold text-cream mb-1 group-hover:text-gold-500 transition-colors duration-300">
                {product.name}
              </h3>
              <p className="text-cream-dark/50 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-gold-500 font-bold text-xl">
                    ₹{product.price}
                    <span className="text-cream-dark/40 text-xs font-normal ml-1">
                      /piece
                    </span>
                  </span>
                  {product.priceHalfKg && (
                    <p className="text-cream-dark/60 text-xs mt-1">
                      Half kg: Rs.{product.priceHalfKg}
                    </p>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleAddToCart(product)}
                  className="p-2.5 rounded-xl bg-gold-500/10 border border-gold-500/20 text-gold-500 hover:bg-gold-500 hover:text-chocolate-900 transition-all duration-300"
                >
                  <ShoppingCart size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
