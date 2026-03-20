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

      <div className="p-4 md:p-6 space-y-3 md:space-y-4">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1 md:mb-2 group-hover:text-accent transition-colors duration-300 break-words">{title}</h3>
          <p className="text-muted-foreground text-xs md:text-sm line-clamp-2 break-words">{description}</p>
        </div>

        <div className="flex items-center justify-between pt-1 md:pt-2">
          <span className="text-foreground text-2xl md:text-3xl font-black drop-shadow-[0_3px_15px_rgba(255,255,255,0.3)]">
            R$ {price.toFixed(2)}
          </span>
          <Button
            onClick={() => onSelect(slug)}
            className="bg-accent text-accent-foreground hover:bg-accent/95 font-bold rounded-xl px-4 md:px-6 py-4 md:py-5 text-sm md:text-base btn-3d hover:scale-105 transition-all"
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
