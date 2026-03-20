import { useEffect, useState } from "react";

const Loader3D = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2300);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-500 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative">
        {/* Glow effect */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        {/* Animated rings */}
        <div className="relative">
          <div className="animate-spin-slow">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 rounded-full border-t-[3px] border-accent opacity-90 shadow-lg shadow-accent/50"></div>
              <div className="absolute inset-3 rounded-full border-r-[3px] border-accent/70 opacity-70"></div>
              <div className="absolute inset-6 rounded-full border-b-[3px] border-accent/50 opacity-50"></div>
            </div>
          </div>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-2 animate-fade-in">
              <span className="block text-3xl font-black text-foreground tracking-tight">
                Cruvinel's
              </span>
              <div className="flex items-center justify-center gap-1">
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></div>
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" style={{ animationDelay: "150ms" }}></div>
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader3D;
