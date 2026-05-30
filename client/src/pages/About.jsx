import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Award, Heart, Users, Leaf, ChefHat, Timer, Package } from 'lucide-react';
import AnimatedSection from '../components/common/AnimatedSection';

const values = [
  {
    icon: Award,
    title: 'Quality',
    description:
      'We never compromise on quality. Every ingredient is carefully sourced and every brownie is baked to perfection.',
    gradient: 'from-amber-500/20 to-yellow-500/20',
  },
  {
    icon: Heart,
    title: 'Passion',
    description:
      'Our love for baking drives us to create extraordinary treats that bring joy to every bite.',
    gradient: 'from-rose-500/20 to-pink-500/20',
  },
  {
    icon: Users,
    title: 'Community',
    description:
      'We are proud to serve our local community with fresh, homemade brownies that create sweet memories.',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
];

const process = [
  {
    step: '01',
    icon: Leaf,
    title: 'Select Ingredients',
    description:
      'We handpick the finest Belgian chocolate, premium butter, farm-fresh eggs, and top-quality cocoa powder.',
  },
  {
    step: '02',
    icon: ChefHat,
    title: 'Mix with Love',
    description:
      'Our recipes are perfected over time. Every batch is hand-mixed with care to ensure the perfect consistency.',
  },
  {
    step: '03',
    icon: Timer,
    title: 'Bake to Perfection',
    description:
      'Precision baking at the perfect temperature creates that signature fudgy center and delicate crust.',
  },
  {
    step: '04',
    icon: Package,
    title: 'Deliver Fresh',
    description:
      'Carefully packaged and delivered to your doorstep while still fresh and aromatic.',
  },
];

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="pt-24 pb-20 min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-chocolate-800/20 to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold-400/3 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-gold-500 text-sm tracking-[0.3em] uppercase mb-3 font-medium"
          >
            Our Journey
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-cream mb-6"
          >
            Our <span className="gold-gradient-text">Story</span>
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-24 h-0.5 bg-gradient-to-r from-gold-500 to-gold-400 mx-auto mb-8"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-cream-dark/60 text-lg leading-relaxed max-w-3xl mx-auto"
          >
            Sharp SK Brownies was born from a simple passion — to create the most delicious, 
            fudgy brownies using only the finest ingredients. What started as a home kitchen 
            experiment has grown into a beloved brand that delivers premium handcrafted brownies 
            to chocolate lovers everywhere.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-cream-dark/60 text-lg leading-relaxed max-w-3xl mx-auto mt-4"
          >
            Every brownie we make is a labor of love — mixed by hand, baked in small batches, 
            and made fresh daily without preservatives or shortcuts. We believe that the best 
            things in life are simple, and there is nothing simpler or more satisfying than 
            a perfectly baked brownie.
          </motion.p>
        </div>
      </section>

      {/* Values Section */}
      <AnimatedSection>
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-gold-500 text-sm tracking-[0.3em] uppercase mb-3 font-medium">
                What Drives Us
              </p>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-cream mb-4">
                Our <span className="gold-gradient-text">Values</span>
              </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-gold-500 to-gold-400 mx-auto" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  whileHover={{ y: -8 }}
                  className="group glass-card p-8 text-center hover:border-gold-500/20 transition-all duration-500"
                >
                  <div className="relative inline-flex mb-6">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}
                    >
                      <value.icon size={28} className="text-gold-500" />
                    </div>
                  </div>
                  <h3 className="text-xl font-heading font-semibold text-cream mb-3 group-hover:text-gold-500 transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-cream-dark/50 leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Process Section */}
      <AnimatedSection>
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-chocolate-900 via-chocolate-800/20 to-chocolate-900" />
          <div className="max-w-6xl mx-auto relative">
            <div className="text-center mb-16">
              <p className="text-gold-500 text-sm tracking-[0.3em] uppercase mb-3 font-medium">
                From Kitchen to Doorstep
              </p>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-cream mb-4">
                Our <span className="gold-gradient-text">Process</span>
              </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-gold-500 to-gold-400 mx-auto" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {process.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="relative group"
                >
                  <div className="glass-card p-8 text-center hover:border-gold-500/20 transition-all duration-500">
                    {/* Step number */}
                    <div className="text-5xl font-heading font-bold text-gold-500/10 absolute top-4 right-6">
                      {step.step}
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-500">
                      <step.icon size={24} className="text-gold-500" />
                    </div>
                    <h3 className="text-lg font-heading font-semibold text-cream mb-3">
                      {step.title}
                    </h3>
                    <p className="text-cream-dark/50 text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {/* Connector line */}
                  {index < process.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-gold-500/30 to-transparent" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Image Gallery */}
      <AnimatedSection>
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-gold-500 text-sm tracking-[0.3em] uppercase mb-3 font-medium">
                Gallery
              </p>
              <h2 className="text-3xl sm:text-4xl font-heading font-bold text-cream mb-4">
                Our <span className="gold-gradient-text">Creations</span>
              </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-gold-500 to-gold-400 mx-auto" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                '/images/chocolate-brownie.png',
                '/images/nutella-brownie.png',
                '/images/choco-lava-brownie.png',
                '/images/white-chocolate-brownie.png',
                '/images/oreo-brownie.png',
                '/images/walnut-brownie.png',
              ].map((src, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  className="aspect-square rounded-2xl overflow-hidden bg-chocolate-800 group cursor-pointer"
                >
                  <img
                    src={src}
                    alt="Brownie creation"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>
    </main>
  );
}
