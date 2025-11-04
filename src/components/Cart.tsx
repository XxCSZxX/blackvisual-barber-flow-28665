import { useState } from "react";
import { X, ShoppingCart, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  
  const discount = appliedCoupon 
    ? appliedCoupon.discount_type === "percentage"
      ? subtotal * (appliedCoupon.discount_value / 100)
      : Number(appliedCoupon.discount_value)
    : 0;

  const total = Math.max(subtotal - discount, 0);

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Digite um código de cupom");
      return;
    }

    setValidatingCoupon(true);

    const { data, error } = await supabase
      .from("discount_coupons")
      .select("*")
      .eq("code", couponCode.toUpperCase())
      .eq("active", true)
      .maybeSingle();

    setValidatingCoupon(false);

    if (error || !data) {
      toast.error("Cupom inválido ou expirado");
      return;
    }

    // Check if expired
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      toast.error("Este cupom expirou");
      return;
    }

    // Check max uses
    if (data.max_uses && data.current_uses >= data.max_uses) {
      toast.error("Este cupom atingiu o limite de usos");
      return;
    }

    setAppliedCoupon(data);
    toast.success("Cupom aplicado com sucesso! 🎉");
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.success("Cupom removido");
  };

  const formatWhatsAppMessage = () => {
    const itemsText = items
      .map((item) => {
        const dateFormatted = format(item.date, "dd/MM/yyyy", { locale: ptBR });
        return `📌 ${item.name}\n💰 R$ ${item.price.toFixed(2)}\n📅 ${dateFormatted} às ${item.time}\n👤 ${item.customerName}`;
      })
      .join("\n\n");

    let message = `Olá Blackvisual! 💈\n\nQuero confirmar meu agendamento:\n\n${itemsText}\n\n`;
    
    if (appliedCoupon) {
      message += `💰 Subtotal: R$ ${subtotal.toFixed(2)}\n`;
      message += `🎟️ Cupom ${appliedCoupon.code}: -R$ ${discount.toFixed(2)}\n`;
      message += `💵 Total: R$ ${total.toFixed(2)}\n\n`;
    } else {
      message += `💵 Total: R$ ${total.toFixed(2)}\n\n`;
    }
    
    message += `Aguardo confirmação!`;

    return encodeURIComponent(message);
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
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Cupom de desconto"
                    disabled={!!appliedCoupon || validatingCoupon}
                    className="pl-10 uppercase"
                  />
                </div>
                {appliedCoupon ? (
                  <Button onClick={removeCoupon} variant="outline" size="sm">
                    Remover
                  </Button>
                ) : (
                  <Button 
                    onClick={validateCoupon} 
                    disabled={validatingCoupon}
                    size="sm"
                    className="btn-3d"
                  >
                    {validatingCoupon ? "..." : "Aplicar"}
                  </Button>
                )}
              </div>

              {appliedCoupon && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-sm">
                  <div className="flex items-center gap-2 text-green-500 font-bold">
                    <Tag className="h-4 w-4" />
                    Cupom {appliedCoupon.code} aplicado!
                  </div>
                  <p className="text-muted-foreground mt-1">
                    {appliedCoupon.discount_type === "percentage"
                      ? `${appliedCoupon.discount_value}% de desconto`
                      : `R$ ${Number(appliedCoupon.discount_value).toFixed(2)} de desconto`
                    }
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {appliedCoupon && (
                <>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal:</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-500 font-bold">
                    <span>Desconto:</span>
                    <span>- R$ {discount.toFixed(2)}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center text-lg md:text-xl font-bold border-t pt-2">
                <span className="text-sm md:text-base">Total:</span>
                <span className="text-metallic text-xl md:text-2xl">R$ {total.toFixed(2)}</span>
              </div>
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
