import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroBackground from "@/assets/cruvinel-hero-bg.jpg";

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const scrollToServices = () => {
    const element = document.getElementById("servicos");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden"
    >
      {/* Background with parallax-style depth */}
      <div className="absolute inset-0">
        <img
          src={heroBackground}
          alt="Cruvinel's Barbearia"
          className="w-full h-full object-cover scale-105"
        />
        {/* Multi-layer depth overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
      </div>

      {/* Floating ambient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-[300px] h-[300px] rounded-full opacity-[0.07]"
          style={{
            background: "radial-gradient(circle, hsl(38 92% 55%), transparent 70%)",
            top: "15%",
            left: "10%",
            animation: "float-orb 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{
            background: "radial-gradient(circle, hsl(38 92% 55%), transparent 70%)",
            bottom: "10%",
            right: "5%",
            animation: "float-orb 10s ease-in-out infinite reverse",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Eyebrow */}
          <div
            className="transition-all duration-700 ease-out"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(12px)",
              filter: isLoaded ? "blur(0)" : "blur(4px)",
              transitionDelay: "200ms",
            }}
          >
            <span className="inline-block text-xs tracking-[0.3em] uppercase text-primary/80 font-medium px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5">
              Barbearia Premium
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight transition-all duration-700 ease-out"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(16px)",
              filter: isLoaded ? "blur(0)" : "blur(4px)",
              transitionDelay: "400ms",
              lineHeight: "0.95",
            }}
          >
            <span className="block text-foreground">Cruvinel's</span>
            <span className="block text-gold mt-1">Barbearia</span>
          </h1>

          {/* Subline */}
          <p
            className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg mx-auto transition-all duration-700 ease-out"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(12px)",
              filter: isLoaded ? "blur(0)" : "blur(4px)",
              transitionDelay: "600ms",
              textWrap: "balance",
            }}
          >
            Um novo conceito, uma nova experiência. Agende online em poucos cliques.
          </p>

          {/* CTA */}
          <div
            className="pt-2 transition-all duration-700 ease-out"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? "translateY(0)" : "translateY(12px)",
              filter: isLoaded ? "blur(0)" : "blur(4px)",
              transitionDelay: "800ms",
            }}
          >
            <Button
              size="lg"
              onClick={scrollToServices}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base md:text-lg px-8 md:px-10 py-6 md:py-7 rounded-2xl font-bold btn-3d active:scale-[0.97]"
            >
              Agendar agora
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToServices}
        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors"
        aria-label="Rolar para serviços"
      >
        <ChevronDown className="w-6 h-6 animate-bounce" />
      </button>

      {/* Float orb keyframes */}
      <style>{`
        @keyframes float-orb {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -30px); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
