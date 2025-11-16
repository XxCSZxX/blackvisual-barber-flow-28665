import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const WhatsAppButton = () => {
  const openWhatsApp = () => {
    window.open("https://wa.me/5562991492590", "_blank");
  };

  return (
    <Button
      onClick={openWhatsApp}
      size="icon"
      className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-40 w-14 h-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-2xl animate-pulse-glow"
      aria-label="Contato WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
    </Button>
  );
};

export default WhatsAppButton;
