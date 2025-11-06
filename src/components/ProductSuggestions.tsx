import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingBag } from "lucide-react";
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

  const handleAddToCart = () => {
    const selectedProductsList = products.filter(p => selectedProducts[p.id]);
    if (selectedProductsList.length > 0) {
      onAddProducts(selectedProductsList, selectedProducts);
      setSelectedProducts({});
    }
  };

  const total = products.reduce((sum, product) => {
    const quantity = selectedProducts[product.id] || 0;
    return sum + (product.price * quantity);
  }, 0);

  if (!open) return null;

  return (
    <div className="space-y-3 animate-fade-in">
      <div className="flex items-center gap-2 text-foreground mb-3">
        <ShoppingBag className="w-5 h-5" />
        <h3 className="font-bold text-lg">Produtos Recomendados</h3>
      </div>

      {loading ? (
        <div className="py-4 text-center text-muted-foreground text-sm">Carregando produtos...</div>
      ) : products.length === 0 ? (
        <div className="py-4 text-center text-muted-foreground text-sm">Nenhum produto disponível no momento</div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {products.map((product) => {
              const quantity = selectedProducts[product.id] || 0;
              const isSelected = quantity > 0;

              return (
                <div
                  key={product.id}
                  className={`border rounded-lg p-2 transition-all ${
                    isSelected
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-16 object-cover rounded mb-2"
                    />
                  )}
                  <h4 className="font-bold text-sm text-foreground mb-1 truncate">{product.name}</h4>
                  <p className="text-metallic font-bold text-sm mb-2">R$ {product.price.toFixed(2)}</p>
                  
                  {isSelected ? (
                    <div className="flex items-center gap-1 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                        onClick={() => updateQuantity(product.id, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="font-bold w-6 text-center text-sm">{quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0"
                        onClick={() => updateQuantity(product.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full text-xs"
                      onClick={() => toggleProduct(product.id)}
                    >
                      Adicionar
                    </Button>
                  )}
                </div>
              );
            })}
          </div>

          {Object.keys(selectedProducts).length > 0 && (
            <>
              <div className="flex justify-between items-center py-2 border-t">
                <span className="text-sm font-medium">Total em produtos:</span>
                <span className="text-lg font-bold text-metallic">R$ {total.toFixed(2)}</span>
              </div>
              <Button
                onClick={handleAddToCart}
                className="w-full bg-accent/80 text-accent-foreground hover:bg-accent text-sm"
                size="sm"
              >
                Adicionar ao carrinho
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductSuggestions;