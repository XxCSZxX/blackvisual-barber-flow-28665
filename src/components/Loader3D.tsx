import { useEffect, useState } from "react";

const Loader3D = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="relative">
        <div className="animate-spin-slow">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 rounded-full border-t-4 border-accent opacity-80"></div>
            <div className="absolute inset-2 rounded-full border-r-4 border-accent opacity-60"></div>
            <div className="absolute inset-4 rounded-full border-b-4 border-accent opacity-40"></div>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-black text-foreground tracking-tighter">BV</span>
        </div>
      </div>
    </div>
  );
};

export default Loader3D;
