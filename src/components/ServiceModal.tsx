import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  onProceed: (name: string, service: any) => void;
}

const ServiceModal = ({ isOpen, onClose, service, onProceed }: ServiceModalProps) => {
  const [name, setName] = useState("");

  const handleProceed = () => {
    if (name.trim() && service) {
      onProceed(name, service);
      setName("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-2xl animate-scale-in">
        {service && (
          <>
            <DialogHeader>
              <DialogTitle className="text-3xl font-black">{service.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              <div className="aspect-video rounded-2xl overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <div className="text-metallic text-4xl font-black">
                  R$ {service.price.toFixed(2)}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Seu nome
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome"
                  className="bg-secondary border-border text-foreground"
                />
              </div>

              <Button
                onClick={handleProceed}
                disabled={!name.trim()}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-lg py-6 rounded-xl"
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
