import { useState, useEffect } from "react";

interface AuthUser {
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session on mount
    const checkAuth = () => {
      const storedSessionId = localStorage.getItem("sessionId");
      const storedUser = localStorage.getItem("user");

      if (storedSessionId && storedUser) {
        try {
          setSessionId(storedSessionId);
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user:", e);
          setSessionId(null);
          setUser(null);
        }
      } else {
        setSessionId(null);
        setUser(null);
      }
      setIsLoading(false);
    };

    checkAuth();
    
    // Listen for storage changes (for multi-tab sync)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (newSessionId: string, newUser: AuthUser) => {
    localStorage.setItem("sessionId", newSessionId);
    localStorage.setItem("user", JSON.stringify(newUser));
    setSessionId(newSessionId);
    setUser(newUser);
  };

  const logout = async () => {
    const sessionId = localStorage.getItem("sessionId");
    try {
      if (sessionId) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${sessionId}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("sessionId");
      localStorage.removeItem("user");
      setSessionId(null);
      setUser(null);
    }
  };

  return {
    user,
    sessionId,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
