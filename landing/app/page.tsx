import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { Problem } from '@/components/sections/Problem';
import { Features } from '@/components/sections/Features';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Pricing } from '@/components/sections/Pricing';
import { Waitlist } from '@/components/sections/Waitlist';
import { ScrollProvider } from '@/components/effects/ScrollContext';

export default function Home() {
  return (
    <ScrollProvider threshold={0.4} rootMargin="0px">
      <main>
        <Header />
        <Hero />
        <Problem />
        <Features />
        <HowItWorks />
        <Pricing />
        <Waitlist />
        <Footer />
      </main>
    </ScrollProvider>
  );
}
