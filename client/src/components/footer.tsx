import { Link } from "wouter";
import { Mail, Linkedin, Twitter, Github } from "lucide-react";
import { useAuth } from "@/lib/useAuth";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-gradient-to-b from-background to-muted/50 border-t border-border/40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {/* Brand Section */}
          <div>
            <Link href="/" data-testid="link-kaizen-home-footer">
              <h2 className="text-sm font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2 hover:opacity-80 cursor-pointer transition-opacity" title="Go to home">
                Kaizen
              </h2>
            </Link>
            <div className="flex gap-2">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                data-testid="link-footer-linkedin"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-3 w-3" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                data-testid="link-footer-twitter"
                aria-label="Twitter"
              >
                <Twitter className="h-3 w-3" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                data-testid="link-footer-github"
                aria-label="GitHub"
              >
                <Github className="h-3 w-3" />
              </a>
              <a
                href="mailto:hello@kaizen.com"
                className="p-1 rounded bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                data-testid="link-footer-email"
                aria-label="Email"
              >
                <Mail className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Product</h3>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/features"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-footer-features"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-footer-pricing"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-footer-security"
                >
                  Security
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-footer-blog"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Company</h3>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/about"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-footer-about"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-footer-careers"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-footer-contact"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-footer-privacy"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Account Links */}
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wide">Resources</h3>
            <ul className="space-y-1.5">
              <li>
                <Link
                  href="/terms"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-footer-terms"
                >
                  Terms
                </Link>
              </li>
              {isAuthenticated && (
                <li>
                  <Link
                    href="/dashboard"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors font-semibold text-primary"
                    data-testid="link-footer-dashboard"
                  >
                    Dashboard
                  </Link>
                </li>
              )}
              {!isAuthenticated && (
                <>
                  <li>
                    <Link
                      href="/login"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                      data-testid="link-footer-login"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/signup"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors"
                      data-testid="link-footer-signup"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/40"></div>

        {/* Bottom Section */}
        <div className="py-3 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-muted-foreground">
          <div>
            <p>© {currentYear} Kaizen Recruitment. All rights reserved.</p>
          </div>
          <div className="flex gap-3 items-center text-xs">
            <span>v1.0.0</span>
            <span>•</span>
            <span>Status: <span className="text-green-500 font-medium">Operational</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
