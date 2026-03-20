import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import Loader3D from "@/components/Loader3D";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import ServiceModal from "@/components/ServiceModal";
import CalendarBooking from "@/components/CalendarBooking";
import Cart from "@/components/Cart";
import WhatsAppButton from "@/components/WhatsAppButton";
import SuccessCheck from "@/components/SuccessCheck";
import Footer from "@/components/Footer";
import { getServices } from "@/lib/supabase-helpers";

// Fallback images for legacy services
import corteModerno from "@/assets/corte-masculino.jpg";
import degradePerfeito from "@/assets/degrade-perfeito.jpg";
import barbaVip from "@/assets/barba-vip.jpg";

const fallbackImages: Record<string, string> = {
  "corte-masculino.jpg": corteModerno,
  "degrade-perfeito.jpg": degradePerfeito,
  "barba-vip.jpg": barbaVip,
};

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  slug: string;
  category?: string;
  durationSlots?: number;
}

interface Barber {
  id: string;
  name: string;
  whatsapp: string;
  photo: string;
}

interface CartItem {
  id: string;
  serviceId: string;
  name: string;
  customerName?: string;
  customerPhone?: string;
  price: number;
  date?: Date;
  time?: string;
  endTime?: string;
  image: string;
  paymentMethod?: string;
  barber?: Barber;
  durationSlots?: number;
  isProduct?: boolean;
  quantity?: number;
  products?: Array<{
    id: string;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    quantity?: number;
  }>;
}

const Index = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<{
    name: string;
    phone: string;
    service: Service;
    paymentMethod: string;
    barber: Barber;
  } | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("corte-masculino");

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const { data } = await getServices({ active: true });

    if (data) {
      setServices(
        data.map((s) => {
          // If image is from storage (contains supabase URL), use it directly
          // Otherwise, try fallback images for legacy services
          const imageUrl = s.image.includes('supabase') 
            ? s.image 
            : fallbackImages[s.image] || s.image;
          
          return {
            id: s.id,
            title: s.title,
            description: s.description,
            price: Number(s.price),
            image: imageUrl,
            slug: s.slug,
            category: s.category,
            durationSlots: s.duration_slots || 1,
          };
        })
      );
    }
  };

  const handleSelectService = (slug: string) => {
    const service = services.find((s) => s.slug === slug);
    if (service) {
      // Produtos consumíveis vão direto para o carrinho
      if (service.category === "produtos-consumiveis") {
        const newItem: CartItem = {
          id: `${Date.now()}`,
          serviceId: service.id,
          name: service.title,
          price: service.price,
          image: service.image,
          isProduct: true,
          quantity: 1,
        };
        setCartItems([...cartItems, newItem]);
        toast.success("Produto adicionado ao carrinho!");
        return;
      }
      
      // Serviços normais abrem o modal de agendamento
      setSelectedService(service);
      setShowModal(true);
    }
  };

  const handleProceedToCalendar = (name: string, phone: string, service: Service, paymentMethod: string, barber: Barber) => {
    setCurrentBooking({ name, phone, service, paymentMethod, barber });
    setShowModal(false);
    setShowCalendar(true);
  };

  // Helper to get consecutive time slots (matching database format without leading zeros)
  const getConsecutiveTimeSlots = (startTime: string, count: number): string[] => {
    const slots: string[] = [startTime];
    const [hours, minutes] = startTime.split(":").map(Number);
    
    for (let i = 1; i < count; i++) {
      const totalMinutes = hours * 60 + minutes + (i * 30);
      const slotHours = Math.floor(totalMinutes / 60);
      const slotMinutes = totalMinutes % 60;
      const formattedTime = `${slotHours}:${slotMinutes.toString().padStart(2, "0")}`;
      slots.push(formattedTime);
    }
    return slots;
  };

  const handleBookingComplete = async (date: Date, time: string, endTime?: string) => {
    if (currentBooking) {
      const durationSlots = currentBooking.service.durationSlots || 1;

      // Add to cart only - booking will be created when user clicks "Finalizar no WhatsApp"
      const newItem: CartItem = {
        id: `${Date.now()}`,
        serviceId: currentBooking.service.id,
        name: currentBooking.service.title,
        customerName: currentBooking.name,
        customerPhone: currentBooking.phone,
        price: currentBooking.service.price,
        date,
        time,
        endTime,
        image: currentBooking.service.image,
        paymentMethod: currentBooking.paymentMethod,
        barber: currentBooking.barber,
        durationSlots,
      };

      setCartItems([...cartItems, newItem]);
      setShowCalendar(false);
      setCurrentBooking(null);
      toast.success("Serviço adicionado ao carrinho!");
    }
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleAddProducts = (itemId: string, products: any[]) => {
    setCartItems(cartItems.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          products: [...(item.products || []), ...products]
        };
      }
      return item;
    }));
  };

  const handleFinishBooking = () => {
    setShowSuccess(true);
  };

  const handleSuccessComplete = () => {
    setShowSuccess(false);
    setCartItems([]);
  };

  return (
    <div className="min-h-screen bg-background pt-14 md:pt-16">
      <Loader3D />
      <Header />
      <Hero />

      {/* Services Section */}
      <section id="servicos" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 md:mb-14">
            <span className="text-xs tracking-[0.3em] uppercase text-primary/70 font-medium mb-3 block">
              Nossos serviços
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight" style={{ lineHeight: "1.1" }}>
              Escolha seu estilo
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10 md:mb-14 max-w-4xl mx-auto">
            {[
              { key: "corte-masculino", label: "Cortes" },
              { key: "barba", label: "Barba" },
              { key: "sombrancelha", label: "Sombrancelha" },
              { key: "depilacao", label: "Depilação" },
              { key: "produtos-consumiveis", label: "Produtos" },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-5 md:px-6 py-2.5 md:py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === cat.key
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Services Grid */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {services
                .filter((s) => s.category === selectedCategory)
                .map((service, index) => (
                  <div
                    key={service.slug}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <ServiceCard {...service} onSelect={handleSelectService} />
                  </div>
                ))}
            </div>
            {services.filter((s) => s.category === selectedCategory).length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">
                  Nenhum serviço disponível nesta categoria ainda.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-card" />
        <div className="relative container mx-auto px-4 text-center max-w-3xl">
          <span className="text-xs tracking-[0.3em] uppercase text-primary/70 font-medium mb-3 block">
            Sobre nós
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight mb-6" style={{ lineHeight: "1.1" }}>
            Cruvinel's Barbearia
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-10" style={{ textWrap: "balance" as any }}>
            Barbearia premium especializada em cortes masculinos modernos,
            oferecendo atendimento de qualidade e ambiente exclusivo em Goiânia&nbsp;–&nbsp;GO.
          </p>
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {[
              { value: "5+", label: "Anos" },
              { value: "1000+", label: "Clientes" },
              { value: "100%", label: "Qualidade" },
            ].map((stat) => (
              <div key={stat.label} className="bg-secondary/50 rounded-2xl py-6 px-3 border-depth">
                <div className="text-2xl md:text-4xl font-black text-primary tabular-nums">{stat.value}</div>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Modals and Components */}
      <ServiceModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        service={selectedService}
        onProceed={handleProceedToCalendar}
      />

      {showCalendar && currentBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-card rounded-3xl p-4 md:p-8 max-w-4xl w-full border border-border my-auto max-h-[95vh] overflow-y-auto">
            <h2 className="text-xl md:text-3xl font-black mb-4 md:mb-6 sticky top-0 bg-card pb-2 md:pb-4 border-b border-border/50">
              Agendar: {currentBooking.service.title}
            </h2>
            <CalendarBooking
              onBookingComplete={handleBookingComplete}
              onCancel={() => setShowCalendar(false)}
              barberId={currentBooking.barber.id}
              durationSlots={currentBooking.service.durationSlots || 1}
            />
          </div>
        </div>
      )}

      <Cart items={cartItems} onRemoveItem={handleRemoveItem} onFinish={handleFinishBooking} onAddProducts={handleAddProducts} />
      <WhatsAppButton />
      <SuccessCheck isVisible={showSuccess} onComplete={handleSuccessComplete} />
    </div>
  );
};

export default Index;
