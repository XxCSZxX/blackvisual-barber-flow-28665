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
        className="text-muted-foreground hover:text-foreground transition-colors text-sm tracking-wide"
      >
        Serviços
      </button>
      <button
        onClick={() => scrollToSection("sobre")}
        className="text-muted-foreground hover:text-foreground transition-colors text-sm tracking-wide"
      >
        Sobre
      </button>
      <button
        onClick={() => scrollToSection("contato")}
        className="text-muted-foreground hover:text-foreground transition-colors text-sm tracking-wide"
      >
        Contato
      </button>
    </>
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass">
      <div className="container mx-auto px-4 h-14 md:h-16 flex items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <h1 className="text-lg md:text-xl font-black text-foreground tracking-tight">
            Cruvinel's
          </h1>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <NavLinks />
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Admin"
          >
            <Settings className="w-4 h-4 md:w-5 md:h-5" />
          </Link>

          <a
            href="https://instagram.com/cruvinelsbarbearia"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="w-4 h-4 md:w-5 md:h-5" />
          </a>

          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
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
