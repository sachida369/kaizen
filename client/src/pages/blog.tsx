import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share2, MessageCircle, Facebook, Linkedin } from "lucide-react";
import { SiDiscord, SiWhatsapp } from "react-icons/si";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  image?: string;
}

export default function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "How AI is Transforming Recruitment: A Game-Changer for HR Teams",
      excerpt:
        "Discover how artificial intelligence is revolutionizing the recruitment process, from candidate screening to predictive analytics.",
      content: `Recruitment has always been a time-consuming process. HR teams spend countless hours reviewing resumes, conducting initial screenings, and scheduling interviews. But what if there was a better way?

Enter AI-powered recruitment platforms. These systems use advanced machine learning algorithms to automate repetitive tasks, analyze candidate fit more accurately, and help recruiters focus on what they do best—building relationships and identifying top talent.

In this article, we'll explore the key ways AI is transforming recruitment:

1. Automated Candidate Screening
Traditional resume screening can take weeks. AI algorithms can analyze thousands of resumes in minutes, identifying the best matches based on job requirements, skills, and experience.

2. Predictive Analytics
AI can predict candidate success by analyzing historical data from your organization. This helps identify candidates who are more likely to succeed in the role.

3. 24/7 Candidate Engagement
AI-powered voice agents can conduct initial interviews and screenings around the clock, providing a better candidate experience and speeding up the hiring process.

4. Bias Reduction
By focusing on skills and qualifications rather than demographic factors, AI can help reduce unconscious bias in hiring.

5. Better Decision Making
With comprehensive analytics and insights, recruiters can make more informed hiring decisions that lead to better long-term outcomes.

The future of recruitment is AI-powered, and organizations that adopt these technologies early will have a significant competitive advantage in the war for talent.`,
      date: "2024-12-01",
      author: "Rajesh Kumar",
      category: "AI & Technology",
      readTime: "5 min read",
    },
    {
      id: "2",
      title: "Reducing Time-to-Hire: Strategies That Actually Work",
      excerpt:
        "Learn proven strategies to reduce your time-to-hire and fill open positions faster without compromising quality.",
      content: `One of the biggest challenges in recruitment is reducing time-to-hire without sacrificing quality. On average, companies take 42 days to fill an open position. But what if you could cut that in half?

Here are the proven strategies that work:

1. Streamline Your Job Description
A clear, concise job description attracts better candidates and reduces screening time. Include specific requirements and highlight what makes your company unique.

2. Implement Pre-Screening Questions
Ask targeted questions upfront to filter out candidates who don't meet basic requirements. This saves time in the interview process.

3. Use AI-Powered Screening
Automated candidate screening can analyze hundreds of applications in minutes, identifying the top matches for your team to review.

4. Schedule Interviews Efficiently
Use scheduling tools and AI agents to coordinate interview times. This eliminates back-and-forth emails and speeds up the process.

5. Create a Candidate Pipeline
Don't wait until you have an open position to start recruiting. Build relationships with potential candidates before you need them.

6. Speed Up Decision-Making
Set clear evaluation criteria before interviews and make decisions quickly. Delays in offering can lead to candidates accepting other positions.

By implementing these strategies, companies can reduce their time-to-hire by up to 50%, allowing them to compete better for top talent.`,
      date: "2024-11-25",
      author: "Priya Singh",
      category: "Best Practices",
      readTime: "6 min read",
    },
    {
      id: "3",
      title: "The Future of Recruitment: What's Next After AI Voice Agents?",
      excerpt:
        "Explore the emerging technologies shaping the future of recruitment and how to prepare your team.",
      content: `AI voice agents are just the beginning. The recruitment landscape is evolving rapidly, with new technologies emerging every year. Let's look at what's on the horizon:

1. Advanced Predictive Analytics
Next-generation AI will predict not just candidate fit, but also long-term career growth and cultural alignment within your organization.

2. Virtual Reality Interviews
Immersive VR environments for interviews will provide a more realistic preview of the work environment and company culture.

3. Blockchain for Credential Verification
Blockchain technology will make it easy to verify credentials and work history, reducing hiring fraud and speeding up background checks.

4. Neuroscience-Based Assessments
Advanced cognitive and psychological assessments will provide deeper insights into candidate potential and team fit.

5. Autonomous Hiring Systems
Fully autonomous systems will handle the entire recruitment process, from job posting to offer generation, with minimal human intervention.

The future of recruitment is exciting and full of possibilities. Companies that embrace these technologies early will have a significant advantage in attracting and retaining top talent.`,
      date: "2024-11-18",
      author: "Michael Chen",
      category: "Industry Trends",
      readTime: "7 min read",
    },
    {
      id: "4",
      title: "Case Study: How TechCorp Reduced Hiring Time by 65%",
      excerpt:
        "See how a leading tech company used Kaizen to transform their recruitment process and achieve remarkable results.",
      content: `TechCorp, a 500-person software company, was struggling with a lengthy hiring process. On average, it took them 60 days to fill an open engineering position. This slow process was costing them top talent, as candidates accepted offers from competing companies.

The Challenge:
- 60-day average time-to-hire
- Low offer acceptance rate (only 40%)
- Recruiters spending 20+ hours per week on screening
- Manual scheduling leading to delays

The Solution:
TechCorp implemented Kaizen's AI-powered recruitment platform. Here's what they did:

1. Automated Initial Screening
Used AI agents to screen initial applications and conduct first-round interviews. This freed up recruiters to focus on qualified candidates.

2. 24/7 Candidate Engagement
Deployed voice agents to conduct interviews outside business hours, improving candidate experience and reducing scheduling delays.

3. Real-Time Analytics
Implemented real-time dashboards to track hiring metrics and identify bottlenecks in the process.

4. Integrated CRM
Connected Kaizen with their existing CRM system for seamless data flow and better candidate tracking.

The Results:
- Reduced time-to-hire from 60 to 21 days (65% improvement)
- Increased offer acceptance rate to 75%
- Saved 15+ hours per recruiter per week
- Improved candidate satisfaction scores by 40%

Key Takeaways:
The success of TechCorp's recruitment transformation wasn't just about technology. It was about reimagining the entire recruitment process and putting the candidate experience first.`,
      date: "2024-11-10",
      author: "Sarah Johnson",
      category: "Case Studies",
      readTime: "8 min read",
    },
  ];

  const sharePost = (post: BlogPost, platform: string) => {
    const url = `${window.location.origin}/blog/${post.id}`;
    const text = `Check out this article: ${post.title}`;
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    const shareLinks: Record<string, string> = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      discord: `https://discord.com/channels/@me?url=${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
    };

    if (shareLinks[platform]) {
      window.open(shareLinks[platform], "_blank", "width=600,height=400");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      {selectedPost ? (
        // Single Post View
        <article className="max-w-4xl mx-auto px-4 py-16">
          <Button
            variant="outline"
            onClick={() => setSelectedPost(null)}
            data-testid="button-blog-back"
            className="mb-8"
          >
            ← Back to Blog
          </Button>

          <div className="space-y-6">
            {/* Post Header */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span data-testid="text-blog-date">{selectedPost.date}</span>
                <span>•</span>
                <span data-testid="text-blog-category">{selectedPost.category}</span>
                <span>•</span>
                <span data-testid="text-blog-readtime">{selectedPost.readTime}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold">{selectedPost.title}</h1>

              <div className="flex items-center gap-2 text-muted-foreground">
                <span>By</span>
                <span className="font-semibold">{selectedPost.author}</span>
              </div>
            </div>

            {/* Share Buttons */}
            <div className="flex flex-wrap gap-2 py-6 border-y">
              <span className="flex items-center gap-2 text-sm font-semibold">
                <Share2 className="h-4 w-4" />
                Share:
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => sharePost(selectedPost, "linkedin")}
                data-testid="button-share-linkedin"
                className="gap-2"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => sharePost(selectedPost, "facebook")}
                data-testid="button-share-facebook"
                className="gap-2"
              >
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => sharePost(selectedPost, "discord")}
                data-testid="button-share-discord"
                className="gap-2"
              >
                <SiDiscord className="h-4 w-4" />
                Discord
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => sharePost(selectedPost, "whatsapp")}
                data-testid="button-share-whatsapp"
                className="gap-2"
              >
                <SiWhatsapp className="h-4 w-4" />
                WhatsApp
              </Button>
            </div>

            {/* Post Content */}
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {selectedPost.content.split("\n\n").map((paragraph, index) => (
                <p key={index} className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Related Posts CTA */}
            <div className="bg-primary/10 rounded-lg p-6 mt-12">
              <h3 className="font-semibold mb-2">Want to read more?</h3>
              <p className="text-muted-foreground mb-4">
                Explore other articles on recruitment, AI, and hiring best practices.
              </p>
              <Button
                variant="outline"
                onClick={() => setSelectedPost(null)}
                data-testid="button-blog-explore"
              >
                Back to All Articles
              </Button>
            </div>
          </div>
        </article>
      ) : (
        // Blog List View
        <div>
          {/* Hero Section */}
          <section className="px-4 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold">Kaizen Blog</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Insights, strategies, and stories about the future of recruitment and AI-powered hiring.
              </p>
            </div>
          </section>

          {/* Blog Posts Grid */}
          <section className="px-4 py-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {blogPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="flex flex-col hover-elevate cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                    data-testid={`card-blog-post-${post.id}`}
                  >
                    <CardHeader>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.category}</span>
                      </div>
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                      <CardDescription>{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{post.readTime}</span>
                        <span className="text-xs text-muted-foreground">By {post.author}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Newsletter CTA */}
          <section className="px-4 py-16 bg-primary text-primary-foreground">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl font-bold">Stay Updated</h2>
              <p className="text-lg opacity-90">
                Get the latest articles on recruitment, AI, and hiring trends delivered to your inbox.
              </p>
              <div className="flex gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  data-testid="input-blog-email"
                  className="flex-1 px-4 py-2 rounded text-foreground"
                />
                <Button
                  variant="secondary"
                  data-testid="button-blog-subscribe"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
