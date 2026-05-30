import React from 'react';
import Hero from '../components/home/Hero';
import FeaturedBrownies from '../components/home/FeaturedBrownies';
import WhyChooseUs from '../components/home/WhyChooseUs';
import Reviews from '../components/home/Reviews';
import InstagramSection from '../components/home/InstagramSection';
import FAQ from '../components/home/FAQ';
import AnimatedSection from '../components/common/AnimatedSection';

export default function Home() {
  return (
    <main>
      <Hero />
      <AnimatedSection>
        <FeaturedBrownies />
      </AnimatedSection>
      <AnimatedSection>
        <WhyChooseUs />
      </AnimatedSection>
      <AnimatedSection>
        <Reviews />
      </AnimatedSection>
      <AnimatedSection>
        <InstagramSection />
      </AnimatedSection>
      <AnimatedSection>
        <FAQ />
      </AnimatedSection>
    </main>
  );
}
