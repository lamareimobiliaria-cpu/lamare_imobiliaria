import { Link } from "wouter";
import { Heart, MapPin, BedDouble, Bath, Car, Waves, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

interface Property {
  id: number;
  title: string;
  price: string | number;
  area: string | number;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpots: number | null;
  city: string;
  state: string;
  neighborhood: string | null;
  type: string;
  beachDistance: number | null;
  coverImage: string | null;
  featured: boolean | null;
  status: string;
}

interface PropertyCardProps {
  property: Property;
  showFavoriteButton?: boolean;
}

const typeLabels: Record<string, string> = {
  apartment: "Apartamento",
  house: "Casa",
  penthouse: "Cobertura",
  land: "Terreno",
  commercial: "Comercial",
};

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&q=80",
];

export default function PropertyCard({ property, showFavoriteButton = true }: PropertyCardProps) {
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();

  const { data: isFav } = trpc.favorites.isFavorite.useQuery(
    { propertyId: property.id },
    { enabled: isAuthenticated }
  );

  const addFav = trpc.favorites.add.useMutation({
    onSuccess: () => { utils.favorites.isFavorite.invalidate({ propertyId: property.id }); toast.success("Adicionado aos favoritos"); },
  });
  const removeFav = trpc.favorites.remove.useMutation({
    onSuccess: () => { utils.favorites.isFavorite.invalidate({ propertyId: property.id }); toast.success("Removido dos favoritos"); },
  });

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    if (isFav) removeFav.mutate({ propertyId: property.id });
    else addFav.mutate({ propertyId: property.id });
  };

  const price = Number(property.price);
  const area = Number(property.area);
  const imgSrc = property.coverImage || PLACEHOLDER_IMAGES[property.id % PLACEHOLDER_IMAGES.length];

  return (
    <Link href={`/properties/${property.id}`}>
      <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-accent/40 hover:shadow-xl transition-all duration-300 cursor-pointer">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-muted">
          <img
            src={imgSrc}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGES[0]; }}
          />
          {/* Overlay badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <Badge className="bg-white/90 text-foreground text-xs font-medium shadow-sm">
              {typeLabels[property.type] ?? property.type}
            </Badge>
            {property.featured && (
              <Badge className="bg-gold text-white text-xs font-medium shadow-sm">
                <TrendingUp className="w-3 h-3 mr-1" /> Destaque
              </Badge>
            )}
          </div>
          {/* Favorite */}
          {showFavoriteButton && (
            <button
              onClick={handleFavorite}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm transition-all"
            >
              <Heart className={`w-4 h-4 transition-colors ${isFav ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
            </button>
          )}
          {/* Beach distance */}
          {property.beachDistance && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
              <Waves className="w-3 h-3" />
              <span>{property.beachDistance < 1000 ? `${property.beachDistance}m da praia` : `${(property.beachDistance / 1000).toFixed(1)}km da praia`}</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-serif font-semibold text-base text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
              {property.title}
            </h3>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground text-xs mb-3">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{property.neighborhood ? `${property.neighborhood}, ` : ""}{property.city}, {property.state}</span>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
            {property.bedrooms !== null && property.bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5" /> {property.bedrooms} {property.bedrooms === 1 ? "quarto" : "quartos"}
              </span>
            )}
            {property.bathrooms !== null && property.bathrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5" /> {property.bathrooms}
              </span>
            )}
            {property.parkingSpots !== null && property.parkingSpots > 0 && (
              <span className="flex items-center gap-1">
                <Car className="w-3.5 h-3.5" /> {property.parkingSpots}
              </span>
            )}
            <span className="ml-auto font-medium text-foreground">{area.toLocaleString("pt-BR")} m²</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Valor</div>
              <div className="font-serif font-bold text-lg text-primary">
                R$ {price.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground">m²</div>
              <div className="text-sm font-medium text-foreground">
                R$ {Math.round(price / area).toLocaleString("pt-BR")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
