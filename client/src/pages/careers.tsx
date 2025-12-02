import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Briefcase, DollarSign, Heart, Users, TrendingUp } from "lucide-react";

export default function CareersPage() {
  const openPositions = [
    {
      id: "1",
      title: "Senior Full-Stack Engineer",
      department: "Engineering",
      location: "San Francisco, CA (Remote)",
      type: "Full-time",
      salary: "$150K - $200K",
      description:
        "Join our engineering team to build the future of AI-powered recruitment. We're looking for experienced engineers passionate about modern web technologies.",
    },
    {
      id: "2",
      title: "AI/ML Engineer",
      department: "Engineering",
      location: "Remote (Worldwide)",
      type: "Full-time",
      salary: "$160K - $220K",
      description:
        "Help us develop cutting-edge AI models for recruitment. Work with GPT, voice synthesis, and advanced NLP systems at scale.",
    },
    {
      id: "3",
      title: "Product Manager",
      department: "Product",
      location: "New York, NY (Remote)",
      type: "Full-time",
      salary: "$140K - $180K",
      description:
        "Drive product strategy and vision for our recruitment platform. Work cross-functionally with engineering, design, and customer teams.",
    },
    {
      id: "4",
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "London, UK (Hybrid)",
      type: "Full-time",
      salary: "£60K - £85K",
      description:
        "Support our enterprise customers in achieving their recruitment goals. Build strong relationships and drive customer expansion.",
    },
    {
      id: "5",
      title: "Sales Development Representative",
      department: "Sales",
      location: "Remote (EMEA)",
      type: "Full-time",
      salary: "€40K - €55K + Commission",
      description:
        "Build and qualify a strong pipeline of recruitment-focused companies. Collaborate with our sales team to close deals.",
    },
    {
      id: "6",
      title: "UI/UX Designer",
      department: "Design",
      location: "Remote (Worldwide)",
      type: "Full-time",
      salary: "$120K - $160K",
      description:
        "Design beautiful, intuitive interfaces for our recruitment platform. Shape the visual and user experience that thousands rely on daily.",
    },
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health insurance, mental health support, and fitness stipends.",
    },
    {
      icon: TrendingUp,
      title: "Growth & Development",
      description: "Professional development budget, learning opportunities, and mentorship.",
    },
    {
      icon: Users,
      title: "Collaborative Culture",
      description: "Work with talented teams in a supportive, inclusive environment.",
    },
    {
      icon: DollarSign,
      title: "Competitive Compensation",
      description: "Market-leading salaries with equity options for all employees.",
    },
  ];

  const culture = [
    {
      title: "Innovation First",
      description: "We encourage experimentation and creative problem-solving. Your ideas matter.",
    },
    {
      title: "Customer Obsessed",
      description: "Everything we do is guided by our customers' needs and feedback.",
    },
    {
      title: "Continuous Learning",
      description: "We invest in your growth. Learn new technologies and skills constantly.",
    },
    {
      title: "Work-Life Balance",
      description: "Flexible hours, remote work options, and generous PTO to recharge.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Join Our Team</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Help us transform recruitment with AI. We're building the future, and we want talented people like you to join us.
          </p>
        </div>
      </section>

      {/* Why Work Here */}
      <section className="px-4 py-16 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Join Kaizen?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} data-testid={`card-benefit-${index}`}>
                  <CardHeader>
                    <Icon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Culture */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Culture</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {culture.map((item, index) => (
              <div key={index}>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="px-4 py-16 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>

          {openPositions.length > 0 ? (
            <div className="space-y-4">
              {openPositions.map((position) => (
                <Card
                  key={position.id}
                  className="hover-elevate"
                  data-testid={`card-job-${position.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{position.title}</CardTitle>
                        <CardDescription>{position.department}</CardDescription>
                      </div>
                      <span className="text-xs font-semibold bg-primary/20 text-primary px-3 py-1 rounded">
                        {position.type}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{position.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {position.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        {position.salary}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      data-testid={`button-apply-${position.id}`}
                    >
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <p>No positions available at the moment. Check back soon!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Application Process */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Hiring Process</h2>

          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Application",
                description: "Submit your resume and tell us why you'd be a great fit for Kaizen.",
              },
              {
                step: 2,
                title: "Phone Screen",
                description: "Quick conversation with our recruiting team to learn about your background and interests.",
              },
              {
                step: 3,
                title: "Technical/Role Assessment",
                description: "Depending on the role, you may complete a take-home assignment or skills assessment.",
              },
              {
                step: 4,
                title: "Team Interview",
                description: "Meet with the team you'd be working with. We discuss how you can contribute.",
              },
              {
                step: 5,
                title: "Final Round",
                description: "Meet with leadership. Final discussion about role, expectations, and compensation.",
              },
              {
                step: 6,
                title: "Offer & Onboarding",
                description: "Receive your offer and we'll help you transition smoothly into your new role.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4" data-testid={`step-${item.step}`}>
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground font-semibold">
                    {item.step}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diversity & Inclusion */}
      <section className="px-4 py-16 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Diversity & Inclusion</h2>
          <p className="text-lg opacity-90">
            We're committed to building a diverse and inclusive workplace where everyone feels valued and empowered to contribute their best work. We welcome applications from people of all backgrounds, experiences, and perspectives.
          </p>
        </div>
      </section>

      {/* Contact */}
      <section className="px-4 py-16">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-3xl font-bold">Questions?</h2>
          <p className="text-lg text-muted-foreground">
            Didn't find the right position but interested in joining the team? We'd love to hear from you!
          </p>
          <div>
            <Button size="lg" data-testid="button-careers-contact">
              Contact Our Team
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Or email us at <a href="mailto:careers@kaizen.com" className="text-primary hover:underline">careers@kaizen.com</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
