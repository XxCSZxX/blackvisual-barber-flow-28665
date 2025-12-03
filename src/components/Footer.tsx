import { Instagram, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contato" className="bg-card border-t border-border py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
          <div className="space-y-3 md:space-y-4">
            <h3 className="text-xl md:text-2xl font-black">Cruvinel's Barbearia</h3>
            <p className="text-muted-foreground text-sm md:text-base">
              Barbearia premium em Goiás/Goiânia - GO.<br />
              Cortes modernos e atendimento de qualidade.
            </p>

            <div className="space-y-2">
            <a
                href="https://instagram.com/cruvinelsbarbearia"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-foreground hover:text-accent transition-colors text-sm md:text-base"
              >
                <Instagram className="w-4 h-4 md:w-5 md:h-5" />
                <span>@cruvinelsbarbearia</span>
              </a>

              <a
                href="https://wa.me/5562991492590"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-foreground hover:text-accent transition-colors text-sm md:text-base"
              >
                <Phone className="w-4 h-4 md:w-5 md:h-5" />
                <span>+55 62 99149-2590</span>
              </a>

              <div className="flex items-start gap-2 text-muted-foreground text-sm md:text-base">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 mt-0.5 flex-shrink-0" />
                <span>Av. Firenze, Qd 4 - Lt 15 - Jardim Abaporu, Goiânia - GO, 74786-003</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 md:space-y-4">
            <h3 className="text-lg md:text-xl font-bold">Localização</h3>
            <div className="aspect-video rounded-2xl overflow-hidden border border-border">
              <iframe
                src="https://maps.google.com/maps?q=CRUVINEL'S+BARBEARIA+-+Av.+Firenze,+Qd+4+-+Lt+15+-+Jardim+Abaporu,+Goiânia+-+GO,+74786-003&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Cruvinel's Barbearia"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 md:pt-8 text-center text-muted-foreground text-xs md:text-sm">
          <p>&copy; {new Date().getFullYear()} Cruvinel's Barbearia. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
