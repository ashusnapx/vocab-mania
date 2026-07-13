import { Hero } from "@/components/landing/hero";
import { SocialProof } from "@/components/landing/social-proof";
// import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
// import { Testimonials } from "@/components/landing/testimonials";
import { Pricing } from "@/components/landing/pricing";
import { Faq } from "@/components/landing/faq";
import { Cta } from "@/components/landing/cta";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <>
      <Hero />
      <SocialProof />
      {/* <Features /> */}
      <HowItWorks />
      {/* <Testimonials /> */}
      <Pricing />
      <Faq />
      <Cta />
      <Footer />
    </>
  );
}
