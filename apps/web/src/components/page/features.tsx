import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Kanban, Users, Zap, Lock, Calendar, BarChart3 } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Kanban,
      title: "Kanban Boards",
      description:
        "Visualize your workflow with intuitive drag-and-drop boards that adapt to your team's needs.",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description:
        "Work together seamlessly with real-time updates, comments, and @mentions.",
    },
    {
      icon: Zap,
      title: "Automation",
      description:
        "Automate repetitive tasks with powerful rules and custom workflows.",
    },
    {
      icon: Lock,
      title: "Enterprise Security",
      description:
        "Bank-level encryption and compliance with SOC 2, GDPR, and more.",
    },
    {
      icon: Calendar,
      title: "Timeline View",
      description:
        "Plan projects with calendar and timeline views to track deadlines.",
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description:
        "Get insights into team productivity and project progress with detailed reports.",
    },
  ];

  return (
    <section id="features" className="py-20 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            Everything you need to stay organized
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            Powerful features that help teams of all sizes collaborate and get
            work done.
          </p>
        </div>
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
