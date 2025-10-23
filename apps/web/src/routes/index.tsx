import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/header";
import { Hero } from "@/components/page/hero";
import { Features } from "@/components/page/features";
import { Stats } from "@/components/page/stats";
import { Pricing } from "@/components/page/pricing";
import { CTA } from "@/components/page/cta";
import { Footer } from "@/components/page/footer";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <main>
        <Hero />
        <Stats />
        <Features />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
