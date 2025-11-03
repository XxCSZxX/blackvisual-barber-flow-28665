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
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 w-16 h-16 rounded-full bg-accent text-accent-foreground hover:bg-accent/95 btn-3d hover:scale-110 transition-all"
        >
          <ShoppingCart className="w-7 h-7" />
          {items.length > 0 && (
            <Badge className="absolute -top-2 -right-2 w-7 h-7 flex items-center justify-center p-0 bg-destructive text-destructive-foreground font-bold animate-pulse">
              {items.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-lg bg-card border-border animate-slide-in-right overflow-y-auto flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-xl md:text-2xl font-black">Seu carrinho</SheetTitle>
        </SheetHeader>

        <div className="mt-6 md:mt-8 space-y-3 md:space-y-4 flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ShoppingCart className="w-12 md:w-16 h-12 md:h-16 mx-auto mb-4 opacity-50" />
              <p className="text-sm md:text-base">Seu carrinho está vazio</p>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 md:gap-4 p-3 md:p-4 bg-secondary rounded-2xl border border-border animate-scale-in"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 md:w-20 h-16 md:h-20 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 space-y-0.5 md:space-y-1 min-w-0">
                    <h4 className="font-bold text-foreground text-sm md:text-base truncate">{item.name}</h4>
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{item.customerName}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {format(item.date, "dd/MM/yyyy", { locale: ptBR })} às {item.time}
                    </p>
                    <p className="text-metallic font-bold text-sm md:text-base">R$ {item.price.toFixed(2)}</p>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onRemoveItem(item.id)}
                    className="hover:bg-destructive/20 hover:text-destructive flex-shrink-0 h-8 w-8 md:h-10 md:w-10"
                  >
                    <X className="w-3 h-3 md:w-4 md:h-4" />
                  </Button>
                </div>
              ))}
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border pt-4 space-y-3 md:space-y-4 mt-4 bg-card">
            <div className="flex justify-between items-center text-lg md:text-xl font-bold">
              <span className="text-sm md:text-base">Total:</span>
              <span className="text-metallic text-xl md:text-2xl">R$ {total.toFixed(2)}</span>
            </div>

            <Button
              onClick={handleFinish}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/95 font-bold text-base md:text-lg py-6 md:py-7 rounded-xl btn-3d"
            >
              Finalizar no WhatsApp
            </Button>

            <p className="text-xs text-center text-muted-foreground px-2">
              Você será redirecionado para o WhatsApp para confirmar seu agendamento
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
