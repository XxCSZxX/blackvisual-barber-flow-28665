import { useState, useEffect } from "react";
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
  customerName: string;
  customerPhone: string;
  price: number;
  date: Date;
  time: string;
  image: string;
  paymentMethod: string;
  barber: Barber;
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
          };
        })
      );
    }
  };

  const handleSelectService = (slug: string) => {
    const service = services.find((s) => s.slug === slug);
    if (service) {
      setSelectedService(service);
      setShowModal(true);
    }
  };

  const handleProceedToCalendar = (name: string, phone: string, service: Service, paymentMethod: string, barber: Barber) => {
    setCurrentBooking({ name, phone, service, paymentMethod, barber });
    setShowModal(false);
    setShowCalendar(true);
  };

  const handleBookingComplete = (date: Date, time: string) => {
    if (currentBooking) {
      const newItem: CartItem = {
        id: `${Date.now()}`,
        serviceId: currentBooking.service.id,
        name: currentBooking.service.title,
        customerName: currentBooking.name,
        customerPhone: currentBooking.phone,
        price: currentBooking.service.price,
        date,
        time,
        image: currentBooking.service.image,
        paymentMethod: currentBooking.paymentMethod,
        barber: currentBooking.barber,
      };

      setCartItems([...cartItems, newItem]);
      setShowCalendar(false);
      setCurrentBooking(null);
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
      <section id="servicos" className="py-20 bg-gradient-to-b from-card to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 md:mb-4">Nossos Serviços</h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Escolha seu corte e agende online em poucos cliques
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8 md:mb-12 max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedCategory("corte-masculino")}
              className={`px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-sm md:text-base transition-all ${
                selectedCategory === "corte-masculino"
                  ? "bg-foreground text-background"
                  : "bg-card text-foreground hover:bg-muted"
              }`}
            >
              Corte Masculino
            </button>
            <button
              onClick={() => setSelectedCategory("barba")}
              className={`px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-sm md:text-base transition-all ${
                selectedCategory === "barba"
                  ? "bg-foreground text-background"
                  : "bg-card text-foreground hover:bg-muted"
              }`}
            >
              Barba
            </button>
            <button
              onClick={() => setSelectedCategory("sombrancelha")}
              className={`px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-sm md:text-base transition-all ${
                selectedCategory === "sombrancelha"
                  ? "bg-foreground text-background"
                  : "bg-card text-foreground hover:bg-muted"
              }`}
            >
              Sombrancelha
            </button>
            <button
              onClick={() => setSelectedCategory("depilacao")}
              className={`px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-sm md:text-base transition-all ${
                selectedCategory === "depilacao"
                  ? "bg-foreground text-background"
                  : "bg-card text-foreground hover:bg-muted"
              }`}
            >
              Depilação
            </button>
            <button
              onClick={() => setSelectedCategory("produtos-consumiveis")}
              className={`px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-sm md:text-base transition-all ${
                selectedCategory === "produtos-consumiveis"
                  ? "bg-foreground text-background"
                  : "bg-card text-foreground hover:bg-muted"
              }`}
            >
              Produtos Consumíveis
            </button>
          </div>

          {/* Services Grid */}
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services
                .filter((s) => s.category === selectedCategory)
                .map((service, index) => (
                  <div
                    key={service.slug}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ServiceCard {...service} onSelect={handleSelectService} />
                  </div>
                ))}
            </div>
            {services.filter((s) => s.category === selectedCategory).length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  Nenhum serviço disponível nesta categoria ainda.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-20 bg-card">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6">Sobre a Cruvinel's Barbearia</h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 md:mb-8">
            Somos uma barbearia premium especializada em cortes masculinos modernos,
            oferecendo atendimento de qualidade e ambiente exclusivo para homens que
            buscam estilo e profissionalismo em Goiás/Goiânia - GO.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-8 md:mt-12">
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-black text-foreground">5+</div>
              <p className="text-sm md:text-base text-muted-foreground">Anos de experiência</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-black text-foreground">1000+</div>
              <p className="text-sm md:text-base text-muted-foreground">Clientes satisfeitos</p>
            </div>
            <div className="space-y-2">
              <div className="text-3xl md:text-4xl font-black text-foreground">100%</div>
              <p className="text-sm md:text-base text-muted-foreground">Profissionalismo</p>
            </div>
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
