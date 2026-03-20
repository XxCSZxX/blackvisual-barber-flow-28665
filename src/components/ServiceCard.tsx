import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
    <div className="card-3d group relative bg-card rounded-2xl overflow-hidden border-depth">
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-card to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5 md:p-6 space-y-3 -mt-6 relative z-10">
        <div>
          <h3 className="text-lg md:text-xl font-bold text-foreground mb-1 leading-tight overflow-wrap-break-word">
            {title}
          </h3>
          <p className="text-muted-foreground text-xs md:text-sm line-clamp-2">{description}</p>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div>
            <span className="text-xs text-muted-foreground block">A partir de</span>
            <span className="text-primary text-2xl md:text-3xl font-black tabular-nums">
              R$ {price.toFixed(2)}
            </span>
          </div>
          <Button
            onClick={() => onSelect(slug)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl px-5 py-5 text-sm btn-3d group/btn active:scale-[0.96]"
          >
            Escolher
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
