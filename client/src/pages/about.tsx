import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Users, Target, Lightbulb, Heart, Award, TrendingUp } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description:
        "We're committed to transforming recruitment through AI automation, making hiring faster, smarter, and more human-centered.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Continuously pushing boundaries with cutting-edge AI technology. We invest heavily in R&D to stay ahead of the curve.",
    },
    {
      icon: Users,
      title: "Customer Success",
      description:
        "Your success is our success. We provide dedicated support and continuously listen to feedback to improve our platform.",
    },
    {
      icon: Heart,
      title: "Integrity",
      description:
        "We believe in transparent, ethical business practices. Your data privacy and security are paramount to us.",
    },
    {
      icon: Award,
      title: "Excellence",
      description:
        "We strive for excellence in everything we do—from product quality to customer service to data security.",
    },
    {
      icon: TrendingUp,
      title: "Growth",
      description:
        "We empower both our customers and our team to grow, learn, and achieve their potential.",
    },
  ];

  const team = [
    {
      name: "Rajesh Kumar",
      role: "Founder & CEO",
      bio: "Former VP of Engineering at TechCorp. 15+ years in AI and recruitment tech. Stanford Computer Science grad.",
    },
    {
      name: "Priya Singh",
      role: "CTO",
      bio: "Deep learning expert with 10+ years at leading AI startups. Built ML systems for 100M+ users.",
    },
    {
      name: "Michael Chen",
      role: "Head of Product",
      bio: "Ex-Product Manager at LinkedIn Recruiting. Shipped products used by 500K+ recruiters worldwide.",
    },
    {
      name: "Sarah Johnson",
      role: "VP of Customer Success",
      bio: "20+ years in B2B SaaS. Former Head of Customer Operations at Salesforce.",
    },
  ];

  const milestones = [
    {
      year: "2022",
      title: "Founded",
      description: "Kaizen was founded with a vision to automate recruitment using AI voice agents.",
    },
    {
      year: "2023",
      title: "First 100 Customers",
      description: "Reached 100 paying customers across US, UK, and India markets.",
    },
    {
      year: "2023",
      title: "Series A Funding",
      description: "Raised $5M in Series A led by leading venture capital firms.",
    },
    {
      year: "2024",
      title: "1M+ Calls",
      description: "Completed 1 million AI-powered recruitment calls with 95% candidate satisfaction.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">About Kaizen</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're revolutionizing recruitment by empowering teams with AI-powered voice agents that screen candidates 24/7, intelligently, and at scale.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-16 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">Our Mission</h2>
              <p className="text-lg text-muted-foreground">
                To democratize AI-powered recruitment and help companies of all sizes build better teams faster.
              </p>
              <p className="text-muted-foreground">
                Recruitment teams waste countless hours on repetitive tasks like candidate screening and initial outreach. We believe that AI can handle these tedious tasks better than humans, freeing recruiters to focus on what they do best—building relationships and identifying top talent.
              </p>
              <p className="text-muted-foreground">
                "Kaizen" means continuous improvement in Japanese. We're committed to constantly evolving our platform to serve our customers better.
              </p>
            </div>
            <div className="bg-primary/10 rounded-lg p-8 text-center">
              <div className="space-y-4">
                <div>
                  <div className="text-4xl font-bold text-primary">1M+</div>
                  <div className="text-muted-foreground">AI-Powered Calls</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary">500+</div>
                  <div className="text-muted-foreground">Active Customers</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary">95%</div>
                  <div className="text-muted-foreground">Candidate Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index} data-testid={`card-value-${index}`}>
                  <CardHeader>
                    <Icon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle>{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="px-4 py-16 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-4" data-testid={`milestone-${index}`}>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    {milestone.year}
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-1 h-16 bg-primary/30 mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="text-lg font-semibold">{milestone.title}</h3>
                  <p className="text-muted-foreground">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Leadership Team</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} data-testid={`card-team-member-${index}`}>
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-primary/20 mb-4" />
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <p className="text-sm text-primary font-semibold">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Kaizen Section */}
      <section className="px-4 py-16 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Kaizen?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "AI-Powered, Human-Centered",
                description:
                  "Our AI handles the repetitive work while keeping humans in control of the final decisions.",
              },
              {
                title: "Proven Results",
                description:
                  "Our customers see 70% reduction in time-to-hire and 40% improvement in hiring quality.",
              },
              {
                title: "Enterprise Security",
                description:
                  "SOC 2 Type II certified, GDPR compliant, and trusted by Fortune 500 companies.",
              },
              {
                title: "24/7 Support",
                description:
                  "Dedicated support team available round-the-clock to help you succeed.",
              },
              {
                title: "Transparent Pricing",
                description:
                  "No hidden fees or surprise charges. Pay only for what you use.",
              },
              {
                title: "Continuous Innovation",
                description:
                  "Regular feature updates and improvements based on customer feedback.",
              },
            ].map((item, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Get in Touch</h2>
          <p className="text-lg text-muted-foreground">
            Have questions about Kaizen? Want to learn more about our platform or partnership opportunities?
          </p>
          <div className="flex gap-4 justify-center">
            <Button data-testid="button-about-contact">
              Contact Us
            </Button>
            <Link href="/pricing">
              <Button variant="outline" data-testid="button-about-pricing">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
