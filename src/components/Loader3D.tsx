import { useEffect, useState } from "react";

const Loader3D = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsFading(true), 1800);
    const hideTimer = setTimeout(() => setIsVisible(false), 2400);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-600 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center gap-6">
        {/* Logo mark */}
        <div className="relative w-16 h-16">
          <div
            className="absolute inset-0 rounded-2xl bg-primary/10 animate-ping"
            style={{ animationDuration: "1.5s" }}
          />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="text-2xl font-black text-primary-foreground">C</span>
          </div>
        </div>

        {/* Loading bar */}
        <div className="w-32 h-0.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{
              animation: "loader-fill 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes loader-fill {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default Loader3D;
