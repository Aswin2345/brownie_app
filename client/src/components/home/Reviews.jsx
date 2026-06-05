import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Priya S.',
    rating: 5,
    text: "The best brownies I've ever had! Rich, fudgy, and absolutely divine.",
    initial: 'P',
    color: 'from-pink-500 to-rose-500',
  },
  {
    id: 2,
    name: 'Rahul M.',
    rating: 5,
    text: 'Ordered for a birthday party and everyone loved them. Will order again!',
    initial: 'R',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    id: 3,
    name: 'Ananya K.',
    rating: 5,
    text: 'The double chocolate brownie is to die for. Fresh and delivered on time.',
    initial: 'A',
    color: 'from-emerald-500 to-teal-500',
  },
  {
    id: 4,
    name: 'Vikram R.',
    rating: 5,
    text: 'Premium quality brownies at great prices. The chocolate brownie is amazing!',
    initial: 'V',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 5,
    name: 'Sneha P.',
    rating: 5,
    text: 'Best homemade brownies in town. The white chocolate brownie is my favorite!',
    initial: 'S',
    color: 'from-purple-500 to-violet-500',
  },
];

export default function Reviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const next = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 200 : -200, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? -200 : 200, opacity: 0, scale: 0.95 }),
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold-500/3 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-400/3 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gold-500 text-sm tracking-[0.3em] uppercase mb-3 font-medium"
          >
            Testimonials
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-cream mb-4"
          >
            What Our <span className="gold-gradient-text">Customers</span> Say
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-24 h-0.5 bg-gradient-to-r from-gold-500 to-gold-400 mx-auto"
          />
        </div>

        {/* Review Carousel */}
        <div className="relative min-h-[280px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <div className="glass-card p-8 sm:p-12 text-center">
                {/* Quote */}
                <div className="text-6xl text-gold-500/20 font-heading mb-4 leading-none">
                  &ldquo;
                </div>

                {/* Review text */}
                <p className="text-cream/80 text-lg sm:text-xl leading-relaxed mb-8 font-light italic max-w-2xl mx-auto">
                  {reviews[activeIndex].text}
                </p>

                {/* Stars */}
                <div className="flex items-center justify-center gap-1 mb-4">
                  {Array.from({ length: reviews[activeIndex].rating }).map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className="text-gold-300 fill-gold-300"
                    />
                  ))}
                </div>

                {/* Avatar and Name */}
                <div className="flex items-center justify-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${reviews[activeIndex].color} flex items-center justify-center text-white font-bold text-sm`}
                  >
                    {reviews[activeIndex].initial}
                  </div>
                  <span className="text-cream font-medium">
                    {reviews[activeIndex].name}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav Arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-14 w-10 h-10 rounded-full bg-chocolate-800/80 border border-chocolate-700/50 flex items-center justify-center text-cream/60 hover:text-gold-500 hover:border-gold-500/30 transition-all duration-300"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-14 w-10 h-10 rounded-full bg-chocolate-800/80 border border-chocolate-700/50 flex items-center justify-center text-cream/60 hover:text-gold-500 hover:border-gold-500/30 transition-all duration-300"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > activeIndex ? 1 : -1);
                setActiveIndex(i);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-8 bg-gold-500'
                  : 'w-2 bg-chocolate-700 hover:bg-cream-dark/30'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
