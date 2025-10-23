import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for individuals and small teams getting started",
      features: [
        "Up to 10 boards",
        "Unlimited cards",
        "Basic integrations",
        "Mobile apps",
        "2-factor authentication",
      ],
      cta: "Get started",
      highlighted: false,
    },
    {
      name: "Pro",
      price: "$12",
      description: "For teams that need advanced features and more control",
      features: [
        "Unlimited boards",
        "Advanced checklists",
        "Custom fields",
        "Admin and security features",
        "Priority support",
        "Advanced automation",
      ],
      cta: "Start free trial",
      highlighted: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For organizations with advanced security and admin needs",
      features: [
        "Everything in Pro",
        "Unlimited workspaces",
        "Organization-wide permissions",
        "SSO and SAML",
        "Dedicated success manager",
        "99.9% uptime SLA",
      ],
      cta: "Contact sales",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 sm:py-32 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
            Choose the plan that's right for your team. All plans include a
            14-day free trial.
          </p>
        </div>
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={plan.highlighted ? "border-primary shadow-lg" : ""}
            >
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription className="leading-relaxed">
                  {plan.description}
                </CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="h-5 w-5 shrink-0 text-accent" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
