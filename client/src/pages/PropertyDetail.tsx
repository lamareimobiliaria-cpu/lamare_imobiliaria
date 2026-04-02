import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapView } from "@/components/Map";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Heart, MapPin, BedDouble, Bath, Car, Waves, ArrowLeft,
  TrendingUp, BarChart3, Building2, Calendar, Ruler, MessageCircle,
  ChevronLeft, ChevronRight, X, Home, DollarSign
} from "lucide-react";
import { Streamdown } from "streamdown";
import PropertyGallery from "@/components/PropertyGallery";

const PLACEHOLDER_IMAGES = [
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
  "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  "https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=800&q=80",
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
];

const typeLabels: Record<string, string> = {
  apartment: "Apartamento", house: "Casa", penthouse: "Cobertura", land: "Terreno", commercial: "Comercial",
};

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [activeImg, setActiveImg] = useState(0);
  const utils = trpc.useUtils();

  const propertyId = parseInt(id ?? "0");
  const { data: property, isLoading } = trpc.properties.getById.useQuery({ id: propertyId }, { enabled: !!propertyId });
  const { data: analysis, isLoading: analysisLoading } = trpc.properties.analyze.useQuery({ propertyId }, { enabled: !!propertyId });
  const { data: isFav } = trpc.favorites.isFavorite.useQuery({ propertyId }, { enabled: isAuthenticated && !!propertyId });

  const addFav = trpc.favorites.add.useMutation({
    onSuccess: () => { utils.favorites.isFavorite.invalidate({ propertyId }); toast.success("Adicionado aos favoritos"); },
  });
  const removeFav = trpc.favorites.remove.useMutation({
    onSuccess: () => { utils.favorites.isFavorite.invalidate({ propertyId }); toast.success("Removido dos favoritos"); },
  });

  const handleFavorite = () => {
    if (!isAuthenticated) { window.location.href = getLoginUrl(); return; }
    if (isFav) removeFav.mutate({ propertyId });
    else addFav.mutate({ propertyId });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 container py-8">
          <Skeleton className="h-96 w-full rounded-2xl mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-64 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <div className="text-center pt-16">
          <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-bold mb-2">Imóvel não encontrado</h2>
          <Button onClick={() => setLocation("/properties")} className="mt-4 gap-2"><ArrowLeft className="w-4 h-4" /> Ver imóveis</Button>
        </div>
      </div>
    );
  }

  const images = (property.images as string[] | null)?.length
    ? (property.images as string[])
    : property.coverImage
    ? [property.coverImage]
    : PLACEHOLDER_IMAGES;

  const price = Number(property.price);
  const area = Number(property.area);
  const features = (property.features as string[] | null) ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="container py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button onClick={() => setLocation("/")} className="hover:text-foreground transition-colors flex items-center gap-1"><Home className="w-3.5 h-3.5" /> Início</button>
            <span>/</span>
            <button onClick={() => setLocation("/properties")} className="hover:text-foreground transition-colors">Imóveis</button>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px]">{property.title}</span>
          </div>
        </div>

        <div className="container pb-12">
          {/* Gallery */}
          <div className="mb-8">
            <PropertyGallery images={images} title={property.title} />
            {property.featured && (
              <Badge className="mt-4 bg-gold text-white"><TrendingUp className="w-3 h-3 mr-1" /> Destaque</Badge>
            )}
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: details */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{typeLabels[property.type] ?? property.type}</Badge>
                      <Badge variant={property.status === "available" ? "default" : "secondary"} className={property.status === "available" ? "bg-green-100 text-green-700" : ""}>
                        {property.status === "available" ? "Disponível" : property.status === "sold" ? "Vendido" : "Reservado"}
                      </Badge>
                    </div>
                    <h1 className="font-serif text-2xl md:text-3xl font-bold text-foreground leading-tight">{property.title}</h1>
                    <div className="flex items-center gap-1.5 text-muted-foreground mt-2">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>{property.address || `${property.neighborhood ? property.neighborhood + ", " : ""}${property.city}, ${property.state}`}</span>
                    </div>
                  </div>
                  <button onClick={handleFavorite} className="shrink-0 w-10 h-10 rounded-full border border-border hover:border-red-300 flex items-center justify-center transition-all">
                    <Heart className={`w-5 h-5 ${isFav ? "fill-red-500 text-red-500" : "text-muted-foreground"}`} />
                  </button>
                </div>
              </div>

              {/* Specs grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { icon: Ruler, label: "Área", value: `${area.toLocaleString("pt-BR")} m²` },
                  { icon: BedDouble, label: "Quartos", value: property.bedrooms ?? "—" },
                  { icon: Bath, label: "Banheiros", value: property.bathrooms ?? "—" },
                  { icon: Car, label: "Vagas", value: property.parkingSpots ?? "—" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-muted/50 rounded-xl p-3 text-center">
                    <Icon className="w-5 h-5 text-accent mx-auto mb-1" />
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="font-semibold text-foreground">{value}</div>
                  </div>
                ))}
              </div>

              {/* Tabs */}
              <Tabs defaultValue="description">
                <TabsList className="w-full">
                  <TabsTrigger value="description" className="flex-1">Descrição</TabsTrigger>
                  <TabsTrigger value="analysis" className="flex-1">Análise Financeira</TabsTrigger>
                  <TabsTrigger value="map" className="flex-1">Localização</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="mt-4 space-y-4">
                  {property.description ? (
                    <div className="text-muted-foreground leading-relaxed">
                      <Streamdown>{property.description}</Streamdown>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Descrição não disponível.</p>
                  )}

                  {features.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Características</h4>
                      <div className="flex flex-wrap gap-2">
                        {features.map((f) => (
                          <Badge key={f} variant="secondary" className="text-xs">{f}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {property.yearBuilt && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 text-accent" /> Ano: {property.yearBuilt}
                      </div>
                    )}
                    {property.beachDistance && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Waves className="w-4 h-4 text-accent" /> {property.beachDistance < 1000 ? `${property.beachDistance}m da praia` : `${(property.beachDistance / 1000).toFixed(1)}km da praia`}
                      </div>
                    )}
                    {property.condoFee && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="w-4 h-4 text-accent" /> Condomínio: R$ {Number(property.condoFee).toLocaleString("pt-BR")}
                      </div>
                    )}
                    {property.iptu && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="w-4 h-4 text-accent" /> IPTU: R$ {Number(property.iptu).toLocaleString("pt-BR")}/ano
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="analysis" className="mt-4">
                  {analysisLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-xl" />)}
                    </div>
                  ) : analysis ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { label: "ROI Estimado", value: `${analysis.roi}%`, sub: "ao ano (líquido)", color: "text-green-600" },
                          { label: "Valorização", value: `${analysis.estimatedAppreciation}%`, sub: "projetada ao ano", color: "text-blue-600" },
                          { label: "Aluguel Estimado", value: `R$ ${analysis.estimatedMonthlyRent?.toLocaleString("pt-BR")}`, sub: "por mês", color: "text-accent" },
                          { label: "Preço/m²", value: `R$ ${analysis.pricePerSqm?.toLocaleString("pt-BR")}`, sub: analysis.marketComparison, color: "text-foreground" },
                          { label: "Valor em 5 anos", value: `R$ ${(analysis.projectedValueIn5Years / 1000000).toFixed(2)}M`, sub: "projeção estimada", color: "text-purple-600" },
                          { label: "Valor em 10 anos", value: `R$ ${(analysis.projectedValueIn10Years / 1000000).toFixed(2)}M`, sub: "projeção estimada", color: "text-purple-700" },
                        ].map(({ label, value, sub, color }) => (
                          <div key={label} className="bg-muted/50 rounded-xl p-3">
                            <div className="text-xs text-muted-foreground mb-1">{label}</div>
                            <div className={`font-serif font-bold text-lg ${color}`}>{value}</div>
                            <div className="text-xs text-muted-foreground">{sub}</div>
                          </div>
                        ))}
                      </div>

                      <div>
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-accent" /> Simulação de Financiamento (80% do valor)
                        </h4>
                        <div className="space-y-2">
                          {analysis.financingRates.map((rate: any) => (
                            <div key={rate.bank} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl text-sm">
                              <div>
                                <div className="font-medium text-foreground">{rate.bank}</div>
                                <div className="text-xs text-muted-foreground">{rate.rate}% a.a. · {rate.term} meses</div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-foreground">R$ {rate.monthlyPayment?.toLocaleString("pt-BR")}</div>
                                <div className="text-xs text-muted-foreground">por mês</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground italic">
                        * Valores estimados com base em dados de mercado. Consulte um especialista para análise personalizada.
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Análise não disponível.</p>
                  )}
                </TabsContent>

                <TabsContent value="map" className="mt-4">
                  {property.latitude && property.longitude ? (
                    <div className="h-80 rounded-xl overflow-hidden border border-border">
                      <MapView
                        onMapReady={(map) => {
                          const pos = { lat: property.latitude!, lng: property.longitude! };
                          new google.maps.Marker({ position: pos, map, title: property.title });
                          map.setCenter(pos);
                          map.setZoom(15);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-80 rounded-xl bg-muted flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <MapPin className="w-8 h-8 mx-auto mb-2" />
                        <p>{property.city}, {property.state}</p>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Right: price card */}
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-2xl p-6 sticky top-20">
                <div className="mb-4">
                  <div className="text-sm text-muted-foreground mb-1">Valor do Imóvel</div>
                  <div className="font-serif text-3xl font-bold text-primary">
                    R$ {price.toLocaleString("pt-BR", { minimumFractionDigits: 0 })}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    R$ {Math.round(price / area).toLocaleString("pt-BR")}/m²
                  </div>
                </div>

                <div className="space-y-2 mb-5">
                  <Button className="w-full gap-2 h-11" size="lg">
                    <MessageCircle className="w-4 h-4" /> Falar com Consultor
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2 h-11"
                    onClick={() => setLocation(`/chat?property=${property.id}`)}
                  >
                    <MessageCircle className="w-4 h-4" /> Perguntar à La Mare_IA
                  </Button>
                  <Button
                    variant={isFav ? "default" : "outline"}
                    className={`w-full gap-2 h-11 ${isFav ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100" : ""}`}
                    onClick={handleFavorite}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                    {isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                  </Button>
                </div>

                {/* Quick analysis */}
                {analysis && (
                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Análise Rápida</div>
                    {[
                      { label: "ROI Estimado", value: `${analysis.roi}%/ano`, color: "text-green-600" },
                      { label: "Valorização", value: `${analysis.estimatedAppreciation}%/ano`, color: "text-blue-600" },
                      { label: "Aluguel Est.", value: `R$ ${analysis.estimatedMonthlyRent?.toLocaleString("pt-BR")}/mês`, color: "text-accent" },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{label}</span>
                        <span className={`font-semibold ${color}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
