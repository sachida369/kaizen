import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Phone,
  Users,
  Zap,
  BarChart3,
  Briefcase,
  Settings2,
  Shield,
  Layers,
  Clock,
  Headphones,
  Database,
  GitBranch,
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: Phone,
      title: "AI Voice Calls",
      description:
        "Automated AI-powered voice calls to screen candidates 24/7. Powered by Vapi.io for seamless integration.",
    },
    {
      icon: Users,
      title: "Candidate Management",
      description:
        "Organize and track candidates through the entire recruitment pipeline with detailed profiles and history.",
    },
    {
      icon: Zap,
      title: "Campaign Automation",
      description:
        "Launch recruiting campaigns targeting specific job openings with customizable call scripts and workflows.",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description:
        "Real-time dashboards showing call success rates, candidate sentiment, call duration, and conversion metrics.",
    },
    {
      icon: Briefcase,
      title: "Job Vacancy Management",
      description:
        "Create and manage job openings with detailed descriptions, requirements, and bulk CSV import capabilities.",
    },
    {
      icon: Database,
      title: "CRM Integration",
      description:
        "Seamless sync with GoHighLevel CRM to manage leads, contacts, and pipeline stages automatically.",
    },
    {
      icon: Headphones,
      title: "Call Transcription & Insights",
      description:
        "Automatic transcription of all calls with AI-generated summaries, sentiment analysis, and key takeaways.",
    },
    {
      icon: Shield,
      title: "DNC List Management",
      description:
        "Built-in Do Not Call list compliance to automatically filter and respect candidate communication preferences.",
    },
    {
      icon: Clock,
      title: "Real-Time Tracking",
      description:
        "Monitor campaign progress in real-time with live call status, completion rates, and success metrics.",
    },
    {
      icon: Settings2,
      title: "Multi-Channel Support",
      description:
        "Reach candidates via voice calls, SMS, and email with unified campaign management across all channels.",
    },
    {
      icon: Layers,
      title: "Call Analytics Dashboard",
      description:
        "Comprehensive call logs with filtering, search, and detailed analytics on candidate interactions.",
    },
    {
      icon: GitBranch,
      title: "Mock Mode for Testing",
      description:
        "Test entire workflows in mock mode without consuming API credits. Perfect for workflow validation.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Powerful Recruitment Automation</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kaizen uses AI voice agents to automate candidate screening, saving your team weeks of manual outreach.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/login">
              <Button size="lg" data-testid="button-features-login">
                Get Started
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="lg" data-testid="button-features-signup">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl md:text-4xl font-bold">Everything You Need</h2>
            <p className="text-muted-foreground">
              Complete AI-powered recruitment automation platform with enterprise features
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} data-testid={`card-feature-${index}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-16 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground font-semibold">
                  1
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Create Job Openings</h3>
                <p className="text-muted-foreground">
                  Define your job vacancies with requirements, qualifications, and desired candidate profiles.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground font-semibold">
                  2
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Upload or Import Candidates</h3>
                <p className="text-muted-foreground">
                  Add candidate lists via CSV upload, manual entry, or CRM integration. Bulk operations supported.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground font-semibold">
                  3
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Configure Campaign</h3>
                <p className="text-muted-foreground">
                  Set up your campaign with call scripts, timing preferences, qualification criteria, and follow-up actions.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground font-semibold">
                  4
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Launch Campaign</h3>
                <p className="text-muted-foreground">
                  Start AI calling immediately. Test in mock mode first, or go live with real Vapi.io calls.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground font-semibold">
                  5
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Monitor & Analyze</h3>
                <p className="text-muted-foreground">
                  Track call progress, view transcripts, analyze sentiment, and export results. Auto-sync to CRM.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-primary-foreground font-semibold">
                  6
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Take Action</h3>
                <p className="text-muted-foreground">
                  Follow up with interested candidates, schedule interviews, and move qualified leads through your pipeline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Kaizen</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="text-primary">✓</span> 90% Time Savings
              </h3>
              <p className="text-muted-foreground">
                Automate the entire screening process that typically takes weeks.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="text-primary">✓</span> Better Candidate Experience
              </h3>
              <p className="text-muted-foreground">
                Professional AI conversations that qualify candidates fairly and efficiently.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="text-primary">✓</span> Lower Cost Per Hire
              </h3>
              <p className="text-muted-foreground">
                Reduce recruitment costs while improving quality and speed of hiring.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="text-primary">✓</span> Enterprise Compliance
              </h3>
              <p className="text-muted-foreground">
                Built-in DNC list management, GDPR compliance, and audit logging.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="text-primary">✓</span> Seamless Integration
              </h3>
              <p className="text-muted-foreground">
                Works with your existing CRM, ATS, and communication tools.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="text-primary">✓</span> Real-Time Insights
              </h3>
              <p className="text-muted-foreground">
                Advanced analytics to measure campaign effectiveness and candidate fit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-primary text-primary-foreground">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Transform Your Recruitment?</h2>
          <p className="text-lg opacity-90">
            Start using Kaizen today. Test in mock mode first, no credit card required.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/signup">
              <Button
                size="lg"
                variant="secondary"
                data-testid="button-features-cta-signup"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground hover:bg-primary-foreground/10"
                data-testid="button-features-cta-login"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
