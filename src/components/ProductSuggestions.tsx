import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
}

interface ProductSuggestionsProps {
  open: boolean;
  onClose: () => void;
  onAddProducts: (products: Product[], quantities: Record<string, number>) => void;
}

const ProductSuggestions = ({ open, onClose, onAddProducts }: ProductSuggestionsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadProducts();
    }
  }, [open]);

  const loadProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("active", true)
      .eq("category", "consumivel");

    if (error) {
      toast.error("Erro ao carregar produtos");
      console.error(error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev => {
      const newSelected = { ...prev };
      if (newSelected[productId]) {
        delete newSelected[productId];
      } else {
        newSelected[productId] = 1;
      }
      return newSelected;
    });
  };

  const updateQuantity = (productId: string, change: number) => {
    setSelectedProducts(prev => {
      const newSelected = { ...prev };
      const newQuantity = (newSelected[productId] || 0) + change;
      if (newQuantity <= 0) {
        delete newSelected[productId];
      } else {
        newSelected[productId] = newQuantity;
      }
      return newSelected;
    });
  };

  const handleContinue = () => {
    const selectedProductsList = products.filter(p => selectedProducts[p.id]);
    onAddProducts(selectedProductsList, selectedProducts);
    setSelectedProducts({});
    onClose();
  };

  const handleSkip = () => {
    setSelectedProducts({});
    onClose();
  };

  const total = products.reduce((sum, product) => {
    const quantity = selectedProducts[product.id] || 0;
    return sum + (product.price * quantity);
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <ShoppingBag className="w-6 h-6" />
            Produtos Recomendados
          </DialogTitle>
          <DialogDescription>
            Aproveite e adicione produtos consumíveis ao seu agendamento
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center text-muted-foreground">Carregando produtos...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              {products.map((product) => {
                const quantity = selectedProducts[product.id] || 0;
                const isSelected = quantity > 0;

                return (
                  <div
                    key={product.id}
                    className={`border rounded-xl p-4 transition-all cursor-pointer ${
                      isSelected
                        ? "border-accent bg-accent/5 ring-2 ring-accent"
                        : "border-border hover:border-accent/50"
                    }`}
                    onClick={() => !isSelected && toggleProduct(product.id)}
                  >
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}
                    <h4 className="font-bold text-foreground mb-1">{product.name}</h4>
                    {product.description && (
                      <p className="text-xs text-muted-foreground mb-2">{product.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-metallic font-bold">R$ {product.price.toFixed(2)}</p>
                      
                      {isSelected ? (
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => updateQuantity(product.id, -1)}
                          >
                            -
                          </Button>
                          <span className="font-bold w-6 text-center">{quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => updateQuantity(product.id, 1)}
                          >
                            +
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline" className="gap-1">
                          <Plus className="w-4 h-4" />
                          Adicionar
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {Object.keys(selectedProducts).length > 0 && (
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium">Total em produtos:</span>
                  <span className="text-xl font-bold text-metallic">R$ {total.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                variant="outline"
                onClick={handleSkip}
                className="flex-1"
              >
                Pular
              </Button>
              <Button
                onClick={handleContinue}
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/95"
                disabled={Object.keys(selectedProducts).length === 0}
              >
                {Object.keys(selectedProducts).length > 0
                  ? `Adicionar (R$ ${total.toFixed(2)})`
                  : "Continuar"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductSuggestions;