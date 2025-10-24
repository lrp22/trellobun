import { createFileRoute } from "@tanstack/react-router";
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
    <div className="flex flex-col min-h-svh items-center">
      <main className="flex-1 flex flex-col">
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
