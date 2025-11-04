import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    title: string;
    description: string;
    price: number;
    image: string;
    slug: string;
  } | null;
  onProceed: (name: string, service: any, paymentMethod: string) => void;
}

const ServiceModal = ({ isOpen, onClose, service, onProceed }: ServiceModalProps) => {
  const [name, setName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("pix");

  const handleProceed = () => {
    if (name.trim() && service) {
      onProceed(name, service, paymentMethod);
      setName("");
      setPaymentMethod("pix");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border/50 max-w-2xl animate-scale-in shadow-2xl">
        {service && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl md:text-3xl font-black break-all">{service.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 md:space-y-6">
              <div className="aspect-video rounded-2xl overflow-hidden border border-border/50">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <p className="text-muted-foreground mb-3 md:mb-4 text-base md:text-lg break-all whitespace-normal">{service.description}</p>
                <div className="text-metallic text-3xl md:text-4xl font-black drop-shadow-[0_3px_15px_rgba(255,215,0,0.5)]">
                  R$ {service.price.toFixed(2)}
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                <Label htmlFor="name" className="text-foreground text-sm md:text-base">
                  Seu nome
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome"
                  className="bg-secondary border-border/50 text-foreground py-5 md:py-6 text-sm md:text-base focus:border-accent transition-colors"
                />
              </div>

              <div className="space-y-2 md:space-y-3">
                <Label className="text-foreground text-sm md:text-base">
                  Forma de pagamento
                </Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pix" id="pix" />
                    <Label htmlFor="pix" className="cursor-pointer text-sm md:text-base">PIX</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="cartao" id="cartao" />
                    <Label htmlFor="cartao" className="cursor-pointer text-sm md:text-base">Cartão</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button
                onClick={handleProceed}
                disabled={!name.trim()}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/95 font-bold text-base md:text-lg py-6 md:py-7 rounded-xl btn-3d disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Agendar este corte
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ServiceModal;
