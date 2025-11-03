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
    <div className="card-3d group relative bg-card rounded-3xl overflow-hidden border border-border hover:border-accent/50 transition-all duration-500">
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-metallic text-3xl font-black">
            R$ {price.toFixed(2)}
          </span>
          <Button
            onClick={() => onSelect(slug)}
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-bold rounded-xl"
          >
            Escolher
          </Button>
        </div>
      </div>

      {/* 3D depth effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  );
};

export default ServiceCard;
