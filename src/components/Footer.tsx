import { Instagram, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contato" className="relative bg-card border-t border-border py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* Info */}
          <div className="space-y-5">
            <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
              Cruvinel's
            </h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-sm">
              Barbearia premium em Goiânia&nbsp;–&nbsp;GO. Cortes modernos e atendimento de qualidade.
            </p>

            <div className="space-y-3 pt-2">
              <a
                href="https://instagram.com/cruvinelsbarbearia"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                <Instagram className="w-4 h-4" />
                @cruvinelsbarbearia
              </a>

              <a
                href="https://wa.me/5562991492590"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                +55 62 99149-2590
              </a>

              <div className="flex items-start gap-3 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Av. Firenze, Qd 4 - Lt 15 - Jardim Abaporu, Goiânia - GO, 74786-003</span>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Localização</h4>
            <div className="aspect-video rounded-2xl overflow-hidden border-depth">
              <iframe
                src="https://maps.google.com/maps?q=CRUVINEL'S+BARBEARIA+-+Av.+Firenze,+Qd+4+-+Lt+15+-+Jardim+Abaporu,+Goiânia+-+GO,+74786-003&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização Cruvinel's Barbearia"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center">
          <p className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} Cruvinel's Barbearia. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
