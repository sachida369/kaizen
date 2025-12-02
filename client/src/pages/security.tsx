import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Cloud,
  Users,
  AlertCircle,
  CheckCircle,
  Key,
  FileText,
  Server,
  Globe,
} from "lucide-react";

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description:
        "All data in transit is encrypted using TLS 1.3. Sensitive data at rest is encrypted with AES-256 encryption.",
    },
    {
      icon: Key,
      title: "API Key Management",
      description:
        "Secure API key generation, rotation, and revocation. Keys are hashed and never stored in plaintext.",
    },
    {
      icon: Database,
      title: "Database Security",
      description:
        "PostgreSQL databases with automated backups, point-in-time recovery, and role-based access controls.",
    },
    {
      icon: Users,
      title: "Multi-Factor Authentication",
      description:
        "MFA support via TOTP and SMS. OAuth 2.0 integration with Google, Facebook, and other providers.",
    },
    {
      icon: Eye,
      title: "Audit Logging",
      description:
        "Complete audit trails for all actions. Track who accessed what, when, and from where with immutable logs.",
    },
    {
      icon: Cloud,
      title: "DDoS Protection",
      description:
        "Enterprise-grade DDoS protection via Cloudflare. Automatic threat detection and mitigation.",
    },
    {
      icon: Server,
      title: "Infrastructure Security",
      description:
        "Hosted on AWS with security groups, WAF, and network isolation. Regular security updates and patches.",
    },
    {
      icon: Globe,
      title: "Global Privacy",
      description:
        "GDPR compliant. Data residency options for EU, US, and APAC regions. Privacy by design principles.",
    },
  ];

  const complianceStandards = [
    {
      standard: "GDPR",
      description: "General Data Protection Regulation compliant with user consent and data rights management.",
      status: "Certified",
    },
    {
      standard: "CCPA",
      description: "California Consumer Privacy Act compliant with data access and deletion rights.",
      status: "Certified",
    },
    {
      standard: "SOC 2 Type II",
      description: "Security, Availability, Processing Integrity, Confidentiality, and Privacy controls.",
      status: "Compliant",
    },
    {
      standard: "ISO 27001",
      description: "Information Security Management System certification.",
      status: "Certified",
    },
    {
      standard: "PCI DSS",
      description: "Payment Card Industry Data Security Standard compliant for payment processing.",
      status: "Certified",
    },
  ];

  const dataProtectionPolicies = [
    {
      title: "Data Minimization",
      description:
        "We collect only the data necessary for recruitment automation. No unnecessary personal information is stored.",
    },
    {
      title: "Retention Policies",
      description:
        "Call recordings and transcripts are retained for 90 days by default. Users can configure retention periods or delete data manually.",
    },
    {
      title: "Access Controls",
      description:
        "Role-based access control (RBAC) ensures users only access data they need. Admin approval required for sensitive operations.",
    },
    {
      title: "Data Deletion",
      description:
        "Users can request permanent deletion of their data. Deleted data is removed from all systems within 30 days.",
    },
    {
      title: "Third-Party Processors",
      description:
        "All third-party vendors (OpenAI, Vapi, Twilio) have signed Data Processing Agreements. Regular audits performed.",
    },
    {
      title: "DNC Compliance",
      description:
        "Do Not Call list management built-in. Automatic filtering prevents calls to opted-out numbers.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Hero Section */}
      <section className="px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Enterprise-Grade Security</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your data security is our top priority. Kaizen implements industry-leading security practices and maintains multiple compliance certifications.
          </p>
        </div>
      </section>

      {/* Security Features Grid */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Security Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} data-testid={`card-security-feature-${index}`}>
                  <CardHeader>
                    <Icon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Compliance Section */}
      <section className="px-4 py-16 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Compliance & Certifications</h2>

          <div className="space-y-4">
            {complianceStandards.map((compliance, index) => (
              <Card key={index} data-testid={`card-compliance-${index}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{compliance.standard}</h3>
                      <p className="text-muted-foreground">{compliance.description}</p>
                    </div>
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-semibold">{compliance.status}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Protection Policies */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Data Protection Policies</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {dataProtectionPolicies.map((policy, index) => (
              <Card key={index} data-testid={`card-policy-${index}`}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    {policy.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{policy.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Best Practices */}
      <section className="px-4 py-16 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Security Best Practices</h2>

          <div className="space-y-8">
            {[
              {
                title: "Regular Security Audits",
                description:
                  "We conduct quarterly security audits by independent third-party firms. All findings are addressed immediately.",
              },
              {
                title: "Vulnerability Management",
                description:
                  "Bug bounty program active with HackerOne. Security researchers can responsibly disclose vulnerabilities.",
              },
              {
                title: "Employee Training",
                description:
                  "All employees undergo annual security training. Background checks performed for team members with data access.",
              },
              {
                title: "Incident Response",
                description:
                  "24/7 incident response team. Major security issues are disclosed within 72 hours. Full transparency with affected users.",
              },
            ].map((practice, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  {practice.title}
                </h3>
                <p className="text-muted-foreground ml-7">{practice.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Contact */}
      <section className="px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Security Concerns?
              </CardTitle>
              <CardDescription>
                Have a security question or found a vulnerability? We take security seriously.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-semibold mb-2">Report Security Issues:</p>
                <p className="text-muted-foreground">
                  Please email <a href="mailto:security@kaizen.com" className="text-primary hover:underline">security@kaizen.com</a> with details about the vulnerability.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-2">Security Policy:</p>
                <p className="text-muted-foreground">
                  Review our full <a href="#" className="text-primary hover:underline">Security Policy</a> and{" "}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a> for more information.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Infrastructure Details */}
      <section className="px-4 py-16 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Infrastructure</h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-lg mb-4">Hosting & CDN</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  AWS US-East (Primary)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  AWS EU-West (Backup)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Cloudflare CDN
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  99.99% Uptime SLA
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Backup & Disaster Recovery</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Daily automated backups
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Geo-redundant storage
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Point-in-time recovery
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  RTO: 1 hour, RPO: 15 minutes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
