import { Instagram, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contato" className="bg-card border-t border-border py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-xl md:text-2xl font-black">Blackvisual</h3>
            <p className="text-muted-foreground text-sm md:text-base">
              Barbearia premium em Brasília/Goiânia.<br />
              Cortes modernos e atendimento de qualidade.
            </p>

            <div className="space-y-2">
              <a
                href="https://instagram.com/Blackbaber"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-foreground hover:text-accent transition-colors text-sm md:text-base"
              >
                <Instagram className="w-4 h-4 md:w-5 md:h-5" />
                <span>@Blackbaber</span>
              </a>

              <a
                href="https://wa.me/5562998325960"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-foreground hover:text-accent transition-colors text-sm md:text-base"
              >
                <Phone className="w-4 h-4 md:w-5 md:h-5" />
                <span>+55 62 99832-5960</span>
              </a>

              <div className="flex items-center gap-2 text-muted-foreground text-sm md:text-base">
                <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                <span>Brasília/Goiânia - GO</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 md:space-y-4">
            <h3 className="text-lg md:text-xl font-bold">Localização</h3>
            <div className="aspect-video rounded-2xl overflow-hidden border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d245867.6238186357!2d-49.39397!3d-16.686892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935ef6bd58d80d69%3A0x6788cce3e2e5df73!2zR29pw6JuaWE!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Blackvisual"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 md:pt-8 text-center text-muted-foreground text-xs md:text-sm">
          <p>&copy; {new Date().getFullYear()} Blackvisual. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
