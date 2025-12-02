import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check } from "lucide-react";

type Currency = "USD" | "GBP" | "INR";

interface PricingTier {
  name: string;
  description: string;
  price: {
    USD: number;
    GBP: number;
    INR: number;
  };
  billing: string;
  features: string[];
  highlighted?: boolean;
}

export default function PricingPage() {
  const [currency, setCurrency] = useState<Currency>("USD");

  const currencySymbols: Record<Currency, string> = {
    USD: "$",
    GBP: "£",
    INR: "₹",
  };

  const pricingTiers: PricingTier[] = [
    {
      name: "Starter",
      description: "Perfect for small teams just getting started",
      price: {
        USD: 299,
        GBP: 249,
        INR: 24900,
      },
      billing: "/month",
      features: [
        "Up to 500 candidate calls/month",
        "1 job opening",
        "Basic analytics dashboard",
        "Email support",
        "CSV import/export",
        "Mock mode for testing",
        "DNC list management",
        "7-day call history",
      ],
    },
    {
      name: "Professional",
      description: "Best for growing recruitment teams",
      price: {
        USD: 799,
        GBP: 649,
        INR: 66500,
      },
      billing: "/month",
      highlighted: true,
      features: [
        "Up to 5,000 candidate calls/month",
        "Unlimited job openings",
        "Advanced analytics & sentiment analysis",
        "Priority email & chat support",
        "CSV bulk upload",
        "Real-time campaign tracking",
        "GoHighLevel CRM integration",
        "30-day call history",
        "Multi-user accounts",
        "Custom call scripts",
        "A/B testing for campaigns",
      ],
    },
    {
      name: "Enterprise",
      description: "For large-scale recruitment operations",
      price: {
        USD: 1999,
        GBP: 1699,
        INR: 166500,
      },
      billing: "/month",
      features: [
        "Unlimited candidate calls",
        "Unlimited job openings",
        "Custom analytics & reporting",
        "24/7 dedicated support",
        "Advanced API access",
        "Custom integrations",
        "Multi-CRM support (Salesforce, HubSpot, GHL)",
        "90-day call history",
        "Team collaboration tools",
        "Custom AI voice models",
        "White-label options",
        "SLA guarantees",
        "Compliance & audit logs",
        "Custom training & onboarding",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Simple, Transparent Pricing</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your recruitment team. Scale up as you grow.
          </p>

          {/* Currency Selector */}
          <div className="flex justify-center pt-8">
            <div className="w-40">
              <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
                <SelectTrigger data-testid="select-currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">
                    USD - United States
                  </SelectItem>
                  <SelectItem value="GBP">
                    GBP - United Kingdom
                  </SelectItem>
                  <SelectItem value="INR">
                    INR - India
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <Card
                key={index}
                className={`relative flex flex-col ${
                  tier.highlighted ? "ring-2 ring-primary md:scale-105" : ""
                }`}
                data-testid={`card-pricing-${tier.name.toLowerCase()}`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <div className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-1 rounded-full">
                      MOST POPULAR
                    </div>
                  </div>
                )}

                <CardHeader>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>

                <CardContent className="flex-grow flex flex-col">
                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold">
                        {currencySymbols[currency]}
                        {tier.price[currency].toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">{tier.billing}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    variant={tier.highlighted ? "default" : "outline"}
                    className="w-full mb-6"
                    data-testid={`button-pricing-${tier.name.toLowerCase()}`}
                  >
                    Get Started
                  </Button>

                  {/* Features List */}
                  <div className="space-y-3 flex-grow">
                    <p className="text-sm font-semibold mb-4">What's included:</p>
                    {tier.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex gap-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="px-4 py-16 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Compare Plans</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4 font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold">Starter</th>
                  <th className="text-center py-4 px-4 font-semibold">Professional</th>
                  <th className="text-center py-4 px-4 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    feature: "Monthly Candidate Calls",
                    starter: "500",
                    professional: "5,000",
                    enterprise: "Unlimited",
                  },
                  {
                    feature: "Job Openings",
                    starter: "1",
                    professional: "Unlimited",
                    enterprise: "Unlimited",
                  },
                  {
                    feature: "Call History",
                    starter: "7 days",
                    professional: "30 days",
                    enterprise: "90 days",
                  },
                  {
                    feature: "Analytics",
                    starter: "Basic",
                    professional: "Advanced",
                    enterprise: "Custom",
                  },
                  {
                    feature: "CRM Integration",
                    starter: "Coming soon",
                    professional: "GoHighLevel",
                    enterprise: "Multiple",
                  },
                  {
                    feature: "Support",
                    starter: "Email",
                    professional: "Email & Chat",
                    enterprise: "24/7 Dedicated",
                  },
                  {
                    feature: "API Access",
                    starter: "No",
                    professional: "Standard",
                    enterprise: "Advanced",
                  },
                  {
                    feature: "Custom Branding",
                    starter: "No",
                    professional: "No",
                    enterprise: "Yes",
                  },
                ].map((row, index) => (
                  <tr key={index} className="border-b hover:bg-muted/50">
                    <td className="py-4 px-4 font-medium">{row.feature}</td>
                    <td className="text-center py-4 px-4">{row.starter}</td>
                    <td className="text-center py-4 px-4">{row.professional}</td>
                    <td className="text-center py-4 px-4">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-6">
            {[
              {
                q: "Can I change plans anytime?",
                a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
              },
              {
                q: "Is there a free trial?",
                a: "Absolutely! Start with our mock mode for free to test workflows before committing. No credit card required.",
              },
              {
                q: "What happens if I exceed my monthly calls?",
                a: "We'll notify you when you're approaching your limit. You can upgrade instantly or purchase additional call credits.",
              },
              {
                q: "Do you offer discounts for annual billing?",
                a: "Yes! Pay annually and get 2 months free. Contact our sales team for custom enterprise pricing.",
              },
              {
                q: "Is there a setup fee?",
                a: "No setup fees! You only pay for the plan you choose, billed monthly starting the day you subscribe.",
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 14-day money-back guarantee if you're not satisfied with our service.",
              },
            ].map((faq, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-primary text-primary-foreground">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
          <p className="text-lg opacity-90">
            Choose your plan and start automating recruitment today. Try mock mode for free first!
          </p>
          <Button
            size="lg"
            variant="secondary"
            data-testid="button-pricing-cta"
          >
            Start Free Trial
          </Button>
        </div>
      </section>
    </div>
  );
}
