import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function CTA() {
  return (
    <section className="py-20 sm:py-32">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 sm:px-16 sm:py-24">
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
              Ready to transform your workflow?
            </h2>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-primary-foreground/90">
              Join millions of teams worldwide who trust FlowBoard to organize
              their work and achieve their goals.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
                asChild
              >
                <Link to="/login">
                  Start for free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/10"
                asChild
              >
                {/* use plain <a> for in-page anchor */}
                <a href="#demo">Watch demo</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
