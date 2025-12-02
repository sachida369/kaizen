import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogOut, Settings } from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { useToast } from "@/hooks/use-toast";

export function Header() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    await logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between h-14 px-4 border-b bg-background">
      <div className="flex items-center gap-2">
        <Link href="/" data-testid="link-kaizen-home">
          <h1 className="text-lg font-semibold hover:text-primary cursor-pointer transition-colors" title="Go to home">
            Kaizen
          </h1>
        </Link>
        {user && <span className="text-xs text-muted-foreground">{user.email}</span>}
      </div>

      <div className="flex items-center gap-2">
        {user && (
          <>
            <Link href="/settings">
              <Button variant="ghost" size="icon" data-testid="button-settings">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
}
