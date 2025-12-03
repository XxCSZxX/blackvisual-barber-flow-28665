// @ts-nocheck
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogOut, Plus, Pencil, Trash2, Check } from "lucide-react";
import type { Service, TimeSlot, DiscountCoupon, Barber } from "@/types/database";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [coupons, setCoupons] = useState<DiscountCoupon[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedBarberForSlots, setSelectedBarberForSlots] = useState<string>("");
  const [barberTimeSlots, setBarberTimeSlots] = useState<string[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    slug: "",
    category: "corte-masculino",
  });
  const [newTimeSlot, setNewTimeSlot] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    max_uses: "",
    expires_at: "",
  });
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "consumivel",
  });
  const [togglingSlot, setTogglingSlot] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
    loadData();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleRow) {
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      toast.error("Você não tem permissão de administrador");
      navigate("/");
    } catch (error) {
      console.error("Erro na autenticação:", error);
      toast.error("Erro ao verificar autenticação");
      navigate("/");
    }
  };

  const loadData = async () => {
    const [servicesRes, timeSlotsRes, couponsRes, productsRes, barbersRes] = await Promise.all([
      supabase.from("services").select("*").order("created_at"),
      supabase.from("time_slots").select("*").order("display_order"),
      supabase.from("discount_coupons").select("*").order("created_at", { ascending: false }),
      supabase.from("products").select("*").eq("category", "consumivel").order("created_at"),
      supabase.from("barbers").select("*").order("name"),
    ]);

    if (servicesRes.data) setServices(servicesRes.data);
    if (timeSlotsRes.data) setTimeSlots(timeSlotsRes.data);
    if (couponsRes.data) setCoupons(couponsRes.data);
    if (productsRes.data) setProducts(productsRes.data);
    if (barbersRes.data) {
      setBarbers(barbersRes.data);
      if (barbersRes.data.length > 0 && !selectedBarberForSlots) {
        setSelectedBarberForSlots(barbersRes.data[0].id);
      }
    }
  };

  useEffect(() => {
    if (selectedBarberForSlots) {
      loadBarberTimeSlots();
    }
  }, [selectedBarberForSlots]);

  const loadBarberTimeSlots = async () => {
    if (!selectedBarberForSlots) return;
    
    const { data } = await supabase
      .from("barber_time_slots")
      .select("time_slot_id")
      .eq("barber_id", selectedBarberForSlots)
      .eq("active", true);
    
    if (data) {
      setBarberTimeSlots(data.map((item: any) => item.time_slot_id));
    }
  };

  const handleToggleBarberTimeSlot = async (timeSlotId: string) => {
    if (togglingSlot) return; // Prevent multiple clicks
    
    setTogglingSlot(timeSlotId);
    const isAssigned = barberTimeSlots.includes(timeSlotId);
    
    try {
      if (isAssigned) {
        // Remove the time slot from barber
        const { error } = await supabase
          .from("barber_time_slots")
          .delete()
          .eq("barber_id", selectedBarberForSlots)
          .eq("time_slot_id", timeSlotId);
        
        if (error) {
          toast.error("Erro ao remover horário");
          await loadBarberTimeSlots();
          return;
        }
        
        setBarberTimeSlots(prev => prev.filter(id => id !== timeSlotId));
        toast.success("Horário removido");
      } else {
        // Add the time slot to barber using upsert to avoid duplicates
        const { error } = await supabase
          .from("barber_time_slots")
          .upsert({
            barber_id: selectedBarberForSlots,
            time_slot_id: timeSlotId,
            active: true
          }, {
            onConflict: 'barber_id,time_slot_id'
          });
        
        if (error) {
          toast.error("Erro ao adicionar horário");
          await loadBarberTimeSlots();
          return;
        }
        
        setBarberTimeSlots(prev => [...prev, timeSlotId]);
        toast.success("Horário adicionado");
      }
    } finally {
      setTogglingSlot(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Por favor, selecione uma imagem");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('service-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('service-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error("Erro ao fazer upload da imagem");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleAddService = async () => {
    if (!newService.title || !newService.price) {
      toast.error("Preencha título e preço");
      return;
    }

    let imageUrl = newService.image;

    if (selectedFile) {
      const uploadedUrl = await uploadImage(selectedFile);
      if (!uploadedUrl) return;
      imageUrl = uploadedUrl;
    }

    const { error } = await supabase.from("services").insert({
      title: newService.title,
      description: newService.description,
      price: parseFloat(newService.price),
      image: imageUrl || "/placeholder.svg",
      slug: newService.slug || newService.title.toLowerCase().replace(/\s+/g, "-"),
      category: newService.category,
    });

    if (error) {
      toast.error("Erro ao adicionar corte");
      return;
    }

    toast.success("Corte adicionado!");
    setNewService({ title: "", description: "", price: "", image: "", slug: "", category: "corte-masculino" });
    setSelectedFile(null);
    loadData();
  };

  const handleUpdateService = async () => {
    if (!editingService) return;

    const { error } = await supabase
      .from("services")
      .update({
        title: editingService.title,
        description: editingService.description,
        price: editingService.price,
        image: editingService.image,
      })
      .eq("id", editingService.id);

    if (error) {
      toast.error("Erro ao atualizar");
      return;
    }

    toast.success("Corte atualizado!");
    setEditingService(null);
    loadData();
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    const { error } = await supabase.from("services").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao excluir");
      return;
    }

    toast.success("Corte excluído!");
    loadData();
  };

  const handleAddTimeSlot = async () => {
    if (!newTimeSlot) {
      toast.error("Digite um horário");
      return;
    }

    const maxOrder = Math.max(...timeSlots.map(t => t.display_order), 0);

    const { error } = await supabase.from("time_slots").insert({
      time: newTimeSlot,
      display_order: maxOrder + 1,
    });

    if (error) {
      toast.error("Erro ao adicionar horário");
      return;
    }

    toast.success("Horário adicionado!");
    setNewTimeSlot("");
    loadData();
  };

  const handleDeleteTimeSlot = async (id: string) => {
    if (!confirm("Tem certeza?")) return;

    const { error } = await supabase.from("time_slots").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao excluir");
      return;
    }

    toast.success("Horário excluído!");
    loadData();
  };

  const handleAddCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discount_value) {
      toast.error("Preencha código e valor do desconto");
      return;
    }

    const { error } = await supabase.from("discount_coupons").insert({
      code: newCoupon.code.toUpperCase(),
      discount_type: newCoupon.discount_type,
      discount_value: parseFloat(newCoupon.discount_value),
      max_uses: newCoupon.max_uses ? parseInt(newCoupon.max_uses) : null,
      expires_at: newCoupon.expires_at || null,
    });

    if (error) {
      toast.error("Erro ao adicionar cupom");
      return;
    }

    toast.success("Cupom criado!");
    setNewCoupon({ code: "", discount_type: "percentage", discount_value: "", max_uses: "", expires_at: "" });
    loadData();
  };

  const handleToggleCoupon = async (id: string, currentActive: boolean) => {
    const { error } = await supabase
      .from("discount_coupons")
      .update({ active: !currentActive })
      .eq("id", id);

    if (error) {
      toast.error("Erro ao atualizar");
      return;
    }

    toast.success(currentActive ? "Cupom desativado" : "Cupom ativado");
    loadData();
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    const { error } = await supabase.from("discount_coupons").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao excluir");
      return;
    }

    toast.success("Cupom excluído!");
    loadData();
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      toast.error("Preencha nome e preço");
      return;
    }

    let imageUrl = newProduct.image;

    if (selectedFile) {
      const uploadedUrl = await uploadImage(selectedFile);
      if (!uploadedUrl) return;
      imageUrl = uploadedUrl;
    }

    const { error } = await supabase.from("products").insert({
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      image: imageUrl || "/placeholder.svg",
      category: "consumivel",
      active: true,
    });

    if (error) {
      toast.error("Erro ao adicionar produto");
      console.error(error);
      return;
    }

    toast.success("Produto adicionado!");
    setNewProduct({ name: "", description: "", price: "", image: "", category: "consumivel" });
    setSelectedFile(null);
    loadData();
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    let imageUrl = editingProduct.image;

    if (selectedFile) {
      const uploadedUrl = await uploadImage(selectedFile);
      if (!uploadedUrl) return;
      imageUrl = uploadedUrl;
    }

    const { error } = await supabase
      .from("products")
      .update({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price,
        image: imageUrl,
      })
      .eq("id", editingProduct.id);

    if (error) {
      toast.error("Erro ao atualizar produto");
      console.error(error);
      return;
    }

    toast.success("Produto atualizado!");
    setEditingProduct(null);
    setSelectedFile(null);
    loadData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      toast.error("Erro ao excluir produto");
      console.error(error);
      return;
    }

    toast.success("Produto excluído!");
    loadData();
  };

  const handleToggleProduct = async (id: string, currentActive: boolean) => {
    const { error } = await supabase
      .from("products")
      .update({ active: !currentActive })
      .eq("id", id);

    if (error) {
      console.error("Erro ao atualizar produto:", error);
      toast.error("Erro ao atualizar produto");
      return;
    }

    toast.success(currentActive ? "Produto desativado" : "Produto ativado");
    loadData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-full max-w-md bg-card border border-border rounded-3xl p-6 text-center space-y-4">
          <h1 className="text-2xl font-black">Acesso negado</h1>
          <p className="text-muted-foreground">Você não tem permissão de administrador.</p>
          <Button variant="outline" className="w-full" onClick={() => navigate('/')}>Voltar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-black">Painel Admin</h1>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="services">Cortes</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="times">Horários</TabsTrigger>
            <TabsTrigger value="coupons">Cupons</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Novo Corte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Título</Label>
                    <Input
                      value={newService.title}
                      onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                      placeholder="Ex: Corte Premium"
                    />
                  </div>
                  <div>
                    <Label>Preço (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                      placeholder="60.00"
                    />
                  </div>
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    placeholder="Descrição do corte"
                  />
                </div>
                <div>
                  <Label>Categoria</Label>
                  <select
                    value={newService.category}
                    onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value="corte-masculino">Corte Masculino</option>
                    <option value="barba">Barba</option>
                    <option value="sombrancelha">Sombrancelha</option>
                    <option value="produtos-consumiveis">Produtos Consumíveis</option>
                  </select>
                </div>
                <div>
                  <Label>Imagem do Corte</Label>
                  <div className="space-y-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      disabled={uploading}
                      className="cursor-pointer"
                    />
                    {selectedFile && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>📷 {selectedFile.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedFile(null)}
                        >
                          ✕
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Label>Slug (URL amigável)</Label>
                  <Input
                    value={newService.slug}
                    onChange={(e) => setNewService({ ...newService, slug: e.target.value })}
                    placeholder="corte-premium"
                  />
                </div>
                <Button onClick={handleAddService} className="w-full btn-3d" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Fazendo upload...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Corte
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {services.map((service) => (
                <Card key={service.id}>
                  <CardContent className="p-4">
                    {editingService?.id === service.id ? (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Título</Label>
                            <Input
                              value={editingService.title}
                              onChange={(e) =>
                                setEditingService({ ...editingService, title: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label>Preço</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={editingService.price}
                              onChange={(e) =>
                                setEditingService({
                                  ...editingService,
                                  price: parseFloat(e.target.value),
                                })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Descrição</Label>
                          <Textarea
                            value={editingService.description}
                            onChange={(e) =>
                              setEditingService({ ...editingService, description: e.target.value })
                            }
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleUpdateService} className="btn-3d">
                            Salvar
                          </Button>
                          <Button onClick={() => setEditingService(null)} variant="outline">
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-lg">{service.title}</h3>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                          <p className="text-lg font-bold text-accent mt-1">
                            R$ {service.price.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingService(service)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteService(service.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Novo Produto Consumível</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome do Produto</Label>
                    <Input
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="Ex: Pomada Modeladora"
                    />
                  </div>
                  <div>
                    <Label>Preço (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="45.00"
                    />
                  </div>
                </div>
                <div>
                  <Label>Descrição</Label>
                  <Textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Descrição do produto"
                  />
                </div>
                <div>
                  <Label>Imagem do Produto</Label>
                  <div className="space-y-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      disabled={uploading}
                      className="cursor-pointer"
                    />
                    {selectedFile && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>📷 {selectedFile.name}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedFile(null)}
                        >
                          ✕
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <Button onClick={handleAddProduct} className="w-full btn-3d" disabled={uploading}>
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Fazendo upload...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Produto
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardContent className="p-4">
                    {editingProduct?.id === product.id ? (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label>Nome</Label>
                            <Input
                              value={editingProduct.name}
                              onChange={(e) =>
                                setEditingProduct({ ...editingProduct, name: e.target.value })
                              }
                            />
                          </div>
                          <div>
                            <Label>Preço</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={editingProduct.price}
                              onChange={(e) =>
                                setEditingProduct({
                                  ...editingProduct,
                                  price: parseFloat(e.target.value),
                                })
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Descrição</Label>
                          <Textarea
                            value={editingProduct.description}
                            onChange={(e) =>
                              setEditingProduct({ ...editingProduct, description: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label>Imagem</Label>
                          <div className="space-y-3">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleFileSelect}
                              disabled={uploading}
                              className="cursor-pointer"
                            />
                            {selectedFile && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <span>📷 {selectedFile.name}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setSelectedFile(null)}
                                >
                                  ✕
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleUpdateProduct} className="btn-3d" disabled={uploading}>
                            {uploading ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Fazendo upload...
                              </>
                            ) : (
                              "Salvar"
                            )}
                          </Button>
                          <Button variant="outline" onClick={() => {
                            setEditingProduct(null);
                            setSelectedFile(null);
                          }}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                          )}
                          <div>
                            <h3 className="font-bold">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.description}</p>
                            <p className="text-primary font-black mt-1">
                              R$ {product.price?.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleProduct(product.id, product.active)}
                          >
                            {product.active ? "Desativar" : "Ativar"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="times" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Horário</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Input
                    value={newTimeSlot}
                    onChange={(e) => setNewTimeSlot(e.target.value)}
                    placeholder="Ex: 20:00"
                  />
                  <Button onClick={handleAddTimeSlot} className="btn-3d">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Horários por Barbeiro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Selecione o Barbeiro</Label>
                  <select
                    value={selectedBarberForSlots}
                    onChange={(e) => setSelectedBarberForSlots(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                  >
                    {barbers.map((barber) => (
                      <option key={barber.id} value={barber.id}>
                        {barber.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Clique nos horários para ativar/desativar para este barbeiro
                  </p>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {timeSlots.map((slot) => {
                      const isAssigned = barberTimeSlots.includes(slot.id);
                      const isToggling = togglingSlot === slot.id;
                      return (
                        <Button
                          key={slot.id}
                          onClick={() => handleToggleBarberTimeSlot(slot.id)}
                          variant={isAssigned ? "default" : "outline"}
                          disabled={togglingSlot !== null}
                          className={`relative ${isAssigned ? "bg-accent text-accent-foreground" : ""}`}
                        >
                          {isToggling ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              {slot.time}
                              {isAssigned && (
                                <Check className="h-3 w-3 absolute top-1 right-1" />
                              )}
                            </>
                          )}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Todos os Horários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {timeSlots.map((slot) => (
                    <div key={slot.id} className="p-4 border rounded-lg flex justify-between items-center">
                      <span className="font-bold">{slot.time}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteTimeSlot(slot.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coupons" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Criar Cupom de Desconto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Código do Cupom</Label>
                    <Input
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                      placeholder="DESCONTO10"
                      className="uppercase"
                    />
                  </div>
                  <div>
                    <Label>Tipo de Desconto</Label>
                    <select
                      value={newCoupon.discount_type}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discount_type: e.target.value })}
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                    >
                      <option value="percentage">Porcentagem (%)</option>
                      <option value="fixed">Valor Fixo (R$)</option>
                    </select>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>Valor do Desconto</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={newCoupon.discount_value}
                      onChange={(e) => setNewCoupon({ ...newCoupon, discount_value: e.target.value })}
                      placeholder={newCoupon.discount_type === "percentage" ? "10" : "15.00"}
                    />
                  </div>
                  <div>
                    <Label>Usos Máximos (opcional)</Label>
                    <Input
                      type="number"
                      value={newCoupon.max_uses}
                      onChange={(e) => setNewCoupon({ ...newCoupon, max_uses: e.target.value })}
                      placeholder="100"
                    />
                  </div>
                  <div>
                    <Label>Data de Expiração (opcional)</Label>
                    <Input
                      type="datetime-local"
                      value={newCoupon.expires_at}
                      onChange={(e) => setNewCoupon({ ...newCoupon, expires_at: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleAddCoupon} className="w-full btn-3d">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Cupom
                </Button>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              {coupons.map((coupon) => (
                <Card key={coupon.id} className={!coupon.active ? "opacity-60" : ""}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-bold text-xl">{coupon.code}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${coupon.active ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-500"}`}>
                            {coupon.active ? "ATIVO" : "INATIVO"}
                          </span>
                        </div>
                        <p className="text-muted-foreground">
                          {coupon.discount_type === "percentage" 
                            ? `${coupon.discount_value}% de desconto`
                            : `R$ ${Number(coupon.discount_value).toFixed(2)} de desconto`
                          }
                        </p>
                        {coupon.max_uses && (
                          <p className="text-sm text-muted-foreground">
                            Usado {coupon.current_uses} de {coupon.max_uses} vezes
                          </p>
                        )}
                        {coupon.expires_at && (
                          <p className="text-sm text-muted-foreground">
                            Expira em: {new Date(coupon.expires_at).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleCoupon(coupon.id, coupon.active)}
                        >
                          {coupon.active ? "Desativar" : "Ativar"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteCoupon(coupon.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {coupons.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Nenhum cupom criado ainda</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
