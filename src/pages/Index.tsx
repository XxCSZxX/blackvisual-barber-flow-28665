import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  title: string;
  description: string;
  price: number;
  image: string;
  slug: string;
  category?: string;
}

interface CartItem {
  id: string;
  name: string;
  customerName: string;
  price: number;
  date: Date;
  time: string;
  image: string;
  paymentMethod: string;
}

const Index = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<{
    name: string;
    service: Service;
    paymentMethod: string;
  } | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("active", true)
      .order("category")
      .order("created_at");

    if (data) {
      setServices(
        data.map((s) => {
          // If image is from storage (contains supabase URL), use it directly
          // Otherwise, try fallback images for legacy services
          const imageUrl = s.image.includes('supabase') 
            ? s.image 
            : fallbackImages[s.image] || s.image;
          
          return {
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

  const handleProceedToCalendar = (name: string, service: Service, paymentMethod: string) => {
    setCurrentBooking({ name, service, paymentMethod });
    setShowModal(false);
    setShowCalendar(true);
  };

  const handleBookingComplete = (date: Date, time: string) => {
    if (currentBooking) {
      const newItem: CartItem = {
        id: `${Date.now()}`,
        name: currentBooking.service.title,
        customerName: currentBooking.name,
        price: currentBooking.service.price,
        date,
        time,
        image: currentBooking.service.image,
        paymentMethod: currentBooking.paymentMethod,
      };

      setCartItems([...cartItems, newItem]);
      setShowCalendar(false);
      setCurrentBooking(null);
    }
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
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

          <div className="space-y-16 max-w-7xl mx-auto">
            {/* Corte Masculino */}
            {services.filter(s => s.category === 'corte-masculino').length > 0 && (
              <div>
                <h3 className="text-2xl md:text-3xl font-black mb-6 text-center">Corte Masculino</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services.filter(s => s.category === 'corte-masculino').map((service, index) => (
                    <div
                      key={service.slug}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ServiceCard {...service} onSelect={handleSelectService} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Barba */}
            {services.filter(s => s.category === 'barba').length > 0 && (
              <div>
                <h3 className="text-2xl md:text-3xl font-black mb-6 text-center">Barba</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services.filter(s => s.category === 'barba').map((service, index) => (
                    <div
                      key={service.slug}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ServiceCard {...service} onSelect={handleSelectService} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sombrancelha */}
            {services.filter(s => s.category === 'sombrancelha').length > 0 && (
              <div>
                <h3 className="text-2xl md:text-3xl font-black mb-6 text-center">Sombrancelha</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services.filter(s => s.category === 'sombrancelha').map((service, index) => (
                    <div
                      key={service.slug}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ServiceCard {...service} onSelect={handleSelectService} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Produtos Consumíveis */}
            {services.filter(s => s.category === 'produtos-consumiveis').length > 0 && (
              <div>
                <h3 className="text-2xl md:text-3xl font-black mb-6 text-center">Produtos Consumíveis</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {services.filter(s => s.category === 'produtos-consumiveis').map((service, index) => (
                    <div
                      key={service.slug}
                      className="animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <ServiceCard {...service} onSelect={handleSelectService} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-20 bg-card">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6">Sobre a Blackvisual</h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-6 md:mb-8">
            Somos uma barbearia premium especializada em cortes masculinos modernos,
            oferecendo atendimento de qualidade e ambiente exclusivo para homens que
            buscam estilo e profissionalismo em Brasília/Goiânia.
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
            />
          </div>
        </div>
      )}

      <Cart items={cartItems} onRemoveItem={handleRemoveItem} onFinish={handleFinishBooking} />
      <WhatsAppButton />
      <SuccessCheck isVisible={showSuccess} onComplete={handleSuccessComplete} />
    </div>
  );
};

export default Index;
