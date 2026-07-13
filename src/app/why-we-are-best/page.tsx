import { WhyBestHero } from "@/components/why-best/hero";
import { WhyBestProblem } from "@/components/why-best/problem";
import { WhyBestScience } from "@/components/why-best/science";
import { WhyBestComparison } from "@/components/why-best/comparison";
import { WhyBestEvidence } from "@/components/why-best/evidence";
import { WhyBestCta } from "@/components/why-best/cta";

export const metadata = {
  title: "Why Vocab Mania — The Science Behind Better Vocabulary Learning",
  description:
    "Every feature in Vocab Mania is grounded in 100+ peer-reviewed research papers from cognitive science, memory research, and behavioral psychology. Learn why evidence-based beats AI-based.",
};

export default function WhyWeAreBestPage() {
  return (
    <>
      <WhyBestHero />
      <WhyBestProblem />
      <WhyBestScience />
      <WhyBestComparison />
      <WhyBestEvidence />
      <WhyBestCta />
    </>
  );
}
