import { Hero } from "@/components/landing/hero";
import { SocialProof } from "@/components/landing/social-proof";
import { BentoFeatures } from "@/components/landing/bento-grid";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Comparison } from "@/components/landing/comparison";
import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { Faq } from "@/components/landing/faq";
import { Cta } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <>
      <Hero />
      <SocialProof />
      <BentoFeatures />
      <HowItWorks />
      <Comparison />
      <Testimonials />
      <Pricing />
      <Faq />
      <Cta />
      <Footer />
    </>
  );
}
