import { Instagram, Menu, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "react-router-dom";

const Header = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const NavLinks = () => (
    <>
      <button
        onClick={() => scrollToSection("servicos")}
        className="text-foreground hover:text-accent transition-colors"
      >
        Serviços
      </button>
      <button
        onClick={() => scrollToSection("sobre")}
        className="text-foreground hover:text-accent transition-colors"
      >
        Sobre
      </button>
      <button
        onClick={() => scrollToSection("contato")}
        className="text-foreground hover:text-accent transition-colors"
      >
        Contato
      </button>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border shadow-lg shadow-accent/5">
      <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between relative">
        {/* 3D depth line effect */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
        <div className="flex items-center gap-4 md:gap-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-foreground tracking-tighter">
            Blackvisual
          </h1>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 text-sm lg:text-base">
            <NavLinks />
          </nav>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          <Link
            to="/auth"
            className="text-muted-foreground hover:text-accent transition-colors"
            aria-label="Admin"
          >
            <Settings className="w-5 h-5 md:w-6 md:h-6" />
          </Link>
          
          <a
            href="https://instagram.com/Blackbaber"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-accent transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5 md:w-6 md:h-6" />
          </a>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-card border-border">
              <nav className="flex flex-col gap-6 mt-8 text-lg">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
