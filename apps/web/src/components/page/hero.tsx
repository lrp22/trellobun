import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-7xl">
            Organize your work,{" "}
            <span className="text-primary">achieve your goals</span>
          </h1>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
            FlowBoard brings all your tasks, teammates, and tools together. Keep
            everything organized in one place with boards, lists, and cards.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto" asChild>
              <Link to="/login">
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-transparent"
              asChild
            >
              {/* fixed: use <a> for anchors */}
              <a href="#demo">Watch demo</a>
            </Button>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              <span>Unlimited boards</span>
            </div>
          </div>
        </div>
        <div className="mt-16 sm:mt-24">
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-transparent to-transparent" />
            <img
              src="/modern-project-management-dashboard-with-kanban-bo.jpg"
              alt="FlowBoard Dashboard"
              className="w-full rounded-xl border shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
