import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Cruvinel's Barbearia — Corte com atitude";

  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  const scrollToServices = () => {
    const element = document.getElementById("servicos");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[calc(100vh-3.5rem)] md:min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroBackground} 
          alt="Cruvinel's Barbearia Premium Barbershop" 
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-48 md:w-64 h-48 md:h-64 bg-accent rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-accent rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
            <span className="inline-block min-h-[1.2em]">
              {displayText}
              <span className="inline-block w-0.5 md:w-1 h-[0.9em] bg-accent ml-1 animate-blink align-middle"></span>
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto px-4">
            Agende online. Atendimento premium. Visual 3D moderno.
          </p>

          <div className="pt-4 md:pt-6">
            <Button
              size="lg"
              onClick={scrollToServices}
              className="bg-accent text-accent-foreground hover:bg-accent/95 text-base md:text-lg px-8 md:px-10 py-6 md:py-7 rounded-2xl font-bold btn-3d transition-all hover:scale-105"
            >
              Agendar agora
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-5 md:w-6 h-8 md:h-10 border-2 border-accent rounded-full flex items-start justify-center p-1.5 md:p-2">
          <div className="w-0.5 md:w-1 h-2 md:h-3 bg-accent rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
