import Hero from '@/components/pages/Hero';
import TrustSection from '@/components/pages/TrustSection';
import FeaturesSection from '@/components/pages/Features';
import HowItWorksSection from '@/components/pages/HowItWorks';
import BenefitsSection from '@/components/pages/Benifite';
import PricingSection from '@/components/pages/PricingSection';
import TestimonialsSection from '@/components/pages/Testimonials';
import FAQSection from '@/components/pages/FAQ';
import ContactSection from '@/components/pages/ContactSection';
import CTASection from '@/components/pages/CTASection';

export const metadata = {
  title: 'Tourbin — Tour Management Software for Modern Travel Agencies',
  description: 'Manage Tours, Bookings, Customers and Payments from one dashboard. Built for tour operators who want to grow faster.',
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustSection />
      <FeaturesSection />
      <HowItWorksSection />
      <BenefitsSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <CTASection />
    </>
  );
}
