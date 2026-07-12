import { Hero } from "@/components/hero";
import { SocialProof } from "@/components/social-proof";
import { Stats } from "@/components/stats";
import { Features } from "@/components/features";
import { HowItWorks } from "@/components/how-it-works";
import { WordOfTheDay } from "@/components/word-of-the-day";
import { Testimonial } from "@/components/testimonial";
import { Pricing } from "@/components/pricing";
import { Faq } from "@/components/faq";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Hero />
      <SocialProof />
      <Stats />
      <Features />
      <WordOfTheDay />
      <HowItWorks />
      <Testimonial />
      <Pricing />
      <Faq />
      <CtaSection />
      <Footer />
    </>
  );
}
