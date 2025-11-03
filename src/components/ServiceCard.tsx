import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  title: string;
  description: string;
  price: number;
  image: string;
  slug: string;
  onSelect: (slug: string) => void;
}

const ServiceCard = ({ title, description, price, image, slug, onSelect }: ServiceCardProps) => {
  return (
    <div className="card-3d group relative bg-card rounded-3xl overflow-hidden border border-border/50 hover:border-accent/40 transition-all duration-500">
      <div className="aspect-square overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-115 group-hover:rotate-1"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-metallic text-3xl font-black drop-shadow-[0_3px_15px_rgba(255,215,0,0.5)]">
            R$ {price.toFixed(2)}
          </span>
          <Button
            onClick={() => onSelect(slug)}
            className="bg-accent text-accent-foreground hover:bg-accent/95 font-bold rounded-xl px-6 py-5 btn-3d hover:scale-105 transition-all"
          >
            Escolher
          </Button>
        </div>
      </div>

      {/* 3D depth glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
};

export default ServiceCard;
