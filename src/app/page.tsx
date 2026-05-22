import { AiDemo } from "@/components/landing/ai-demo";
import { AuthorCard } from "@/components/landing/author-card";
import { Bento } from "@/components/landing/bento";
import { ClosingCta } from "@/components/landing/closing-cta";
import { Hero } from "@/components/landing/hero";
import { Stats } from "@/components/landing/stats";
import { Testimonials } from "@/components/landing/testimonials";

/**
 * Yilong Landing — independent-developer product page.
 * Order: Hero → Stats (proof) → Bento (features) → AI demo (interactive) →
 * Testimonials (social proof, marked fictional) → Author (the human) → CTA.
 */
export default function HomePage() {
  return (
    <div className="container space-y-20 sm:space-y-28">
      <Hero />
      <Stats />
      <Bento />
      <AiDemo />
      <Testimonials />
      <AuthorCard />
      <ClosingCta />
    </div>
  );
}
