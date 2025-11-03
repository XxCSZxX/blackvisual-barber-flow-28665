import { X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CartItem {
  id: string;
  name: string;
  customerName: string;
  price: number;
  date: Date;
  time: string;
  image: string;
}

interface CartProps {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
  onFinish: () => void;
}

const Cart = ({ items, onRemoveItem, onFinish }: CartProps) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  const formatWhatsAppMessage = () => {
    const itemsText = items
      .map((item) => {
        const dateFormatted = format(item.date, "dd/MM/yyyy", { locale: ptBR });
        return `📌 ${item.name}\n💰 R$ ${item.price.toFixed(2)}\n📅 ${dateFormatted} às ${item.time}\n👤 ${item.customerName}`;
      })
      .join("\n\n");

    return encodeURIComponent(
      `Olá Blackvisual! 💈\n\nQuero confirmar meu agendamento:\n\n${itemsText}\n\n💵 Total: R$ ${total.toFixed(2)}\n\nAguardo confirmação!`
    );
  };

  const handleFinish = () => {
    const message = formatWhatsAppMessage();
    window.open(`https://wa.me/5562998325960?text=${message}`, "_blank");
    onFinish();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 w-14 h-14 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-2xl animate-pulse-glow"
        >
          <ShoppingCart className="w-6 h-6" />
          {items.length > 0 && (
            <Badge className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center p-0 bg-destructive text-destructive-foreground">
              {items.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-lg bg-card border-border animate-slide-in-right overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-black">Seu carrinho</SheetTitle>
        </SheetHeader>

        <div className="mt-8 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Seu carrinho está vazio</p>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-secondary rounded-2xl border border-border animate-scale-in"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-cover"
                  />
                  <div className="flex-1 space-y-1">
                    <h4 className="font-bold text-foreground">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {format(item.date, "dd/MM/yyyy", { locale: ptBR })} às {item.time}
                    </p>
                    <p className="text-metallic font-bold">R$ {item.price.toFixed(2)}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onRemoveItem(item.id)}
                    className="hover:bg-destructive/20 hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <div className="border-t border-border pt-4 space-y-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-metallic text-2xl">R$ {total.toFixed(2)}</span>
                </div>

                <Button
                  onClick={handleFinish}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-lg py-6 rounded-xl"
                >
                  Finalizar no WhatsApp
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Você será redirecionado para o WhatsApp para confirmar seu agendamento
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
