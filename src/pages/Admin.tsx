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
import { Loader2, LogOut, Plus, Pencil, Trash2 } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Service = Database["public"]["Tables"]["services"]["Row"];
type TimeSlot = Database["public"]["Tables"]["time_slots"]["Row"];

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    slug: "",
  });
  const [newTimeSlot, setNewTimeSlot] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    checkAuth();
    loadData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .eq("role", "admin")
      .single();

    if (!roles) {
      toast.error("Você não tem permissão de administrador");
      navigate("/");
      return;
    }

    setIsAdmin(true);
    setLoading(false);
  };

  const loadData = async () => {
    const [servicesRes, timeSlotsRes] = await Promise.all([
      supabase.from("services").select("*").order("created_at"),
      supabase.from("time_slots").select("*").order("display_order"),
    ]);

    if (servicesRes.data) setServices(servicesRes.data);
    if (timeSlotsRes.data) setTimeSlots(timeSlotsRes.data);
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
    });

    if (error) {
      toast.error("Erro ao adicionar corte");
      return;
    }

    toast.success("Corte adicionado!");
    setNewService({ title: "", description: "", price: "", image: "", slug: "" });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="services">Cortes</TabsTrigger>
            <TabsTrigger value="times">Horários</TabsTrigger>
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {timeSlots.map((slot) => (
                <Card key={slot.id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <span className="font-bold">{slot.time}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteTimeSlot(slot.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
