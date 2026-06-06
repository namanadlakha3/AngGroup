import Hero from '../components/home/Hero';
import FeaturedProperties from '../components/home/FeaturedProperties';
import WhyChooseUs from '../components/home/WhyChooseUs';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';
import FAQ from '../components/home/FAQ';
import CTA from '../components/home/CTA';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <WhyChooseUs />
      <FeaturedProperties />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTA />
    </div>
  );
}

