import { useEffect, useState } from "react";
import { Globe, Zap, Lock } from "lucide-react";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500); // Reduced from 3000 to 1500ms

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary/95 via-primary/90 to-accent/90 pointer-events-none">
      {/* Animated background blur elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 pointer-events-none">
        {/* Inner content card for better structure */}
        <div className="flex flex-col items-center justify-center max-w-md space-y-6 sm:space-y-8">
          
          {/* Top Icon */}
          <div className="flex items-center justify-center">
            <div className="p-3 sm:p-4 bg-white/15 backdrop-blur-sm rounded-xl border border-white/25 hover:bg-white/20 transition-colors">
              <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center space-y-1 sm:space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              Kaizen
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white/90">
              Recruitment
            </p>
          </div>

          {/* Company Badge */}
          <div className="inline-flex items-center px-4 sm:px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full hover:bg-white/15 transition-colors">
            <p className="text-xs sm:text-sm font-semibold text-white tracking-wide">
              GLOBAL COMPANY
            </p>
          </div>

          {/* Main Tagline */}
          <div className="text-center space-y-3 sm:space-y-4">
            <p className="text-lg sm:text-xl font-light text-white/95 leading-relaxed">
              International • Fast • Safe
            </p>

            {/* Feature Icons Row */}
            <div className="flex items-center justify-center gap-6 sm:gap-8 pt-2">
              <div className="flex flex-col items-center gap-2">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Globe className="w-5 h-5 text-white/90" />
                </div>
                <span className="text-xs font-medium text-white/75">International</span>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Zap className="w-5 h-5 text-white/90" />
                </div>
                <span className="text-xs font-medium text-white/75">Fast</span>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Lock className="w-5 h-5 text-white/90" />
                </div>
                <span className="text-xs font-medium text-white/75">Safe</span>
              </div>
            </div>
          </div>

          {/* Loading Indicator */}
          <div className="pt-2 sm:pt-4">
            <div className="flex items-center justify-center gap-2">
              <div 
                className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              />
              <div 
                className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <div 
                className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>

          {/* Loading Text */}
          <p className="text-xs text-white/50 animate-pulse">
            Loading...
          </p>
        </div>
      </div>
    </div>
  );
}
