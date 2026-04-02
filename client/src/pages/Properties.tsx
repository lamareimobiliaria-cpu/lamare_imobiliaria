import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SlidersHorizontal, X, Building2, ChevronDown, ChevronUp } from "lucide-react";

const TYPE_OPTIONS = [
  { value: "all", label: "Todos os tipos" },
  { value: "apartment", label: "Apartamento" },
  { value: "house", label: "Casa" },
  { value: "penthouse", label: "Cobertura" },
  { value: "land", label: "Terreno" },
  { value: "commercial", label: "Comercial" },
];

const SORT_OPTIONS = [
  { value: "date_desc", label: "Mais recentes" },
  { value: "price_asc", label: "Menor preço" },
  { value: "price_desc", label: "Maior preço" },
  { value: "area_desc", label: "Maior área" },
  { value: "area_asc", label: "Menor área" },
];

const FEATURES_OPTIONS = [
  "Piscina", "Academia", "Churrasqueira", "Varanda", "Vista para o mar",
  "Área gourmet", "Portaria 24h", "Elevador", "Jardim", "Sauna",
];

export default function Properties() {
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);

  const [city, setCity] = useState(params.get("city") ?? "");
  const [type, setType] = useState<string>(params.get("type") ?? "all");
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [minBedrooms, setMinBedrooms] = useState(0);
  const [sortBy, setSortBy] = useState<string>(params.get("sort") ?? "date_desc");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);
  const limit = 12;

  const { data: citiesData } = trpc.properties.getCities.useQuery();

  const queryInput = {
    city: city || undefined,
    type: type !== "all" ? (type as any) : undefined,
    minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
    maxPrice: priceRange[1] < 10000000 ? priceRange[1] : undefined,
    bedrooms: minBedrooms > 0 ? minBedrooms : undefined,
    sortBy: sortBy as any,
    limit,
    offset: page * limit,
  };

  const { data, isLoading } = trpc.properties.list.useQuery(queryInput);

  const activeFiltersCount = [
    city, type !== "all", priceRange[0] > 0, priceRange[1] < 10000000, minBedrooms > 0, selectedFeatures.length > 0
  ].filter(Boolean).length;

  const clearFilters = () => {
    setCity(""); setType("all"); setPriceRange([0, 10000000]); setMinBedrooms(0); setSelectedFeatures([]); setPage(0);
  };

  const toggleFeature = (f: string) => {
    setSelectedFeatures((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-ocean-deep text-white py-10">
          <div className="container">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
              <Building2 className="w-4 h-4" /> Imóveis Litorâneos
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold">Encontre seu Imóvel</h1>
            <p className="text-white/70 mt-2">
              {data ? `${data.items.length} propriedades encontradas` : "Carregando..."}
              {city && ` em ${city}`}
            </p>
          </div>
        </div>

        <div className="container py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:w-72 shrink-0">
              {/* Mobile filter toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full justify-between"
                >
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4" />
                    Filtros {activeFiltersCount > 0 && <Badge className="bg-accent text-white text-xs">{activeFiltersCount}</Badge>}
                  </span>
                  {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </div>

              <div className={`${showFilters ? "block" : "hidden"} lg:block bg-card rounded-2xl border border-border p-5 space-y-6 sticky top-20`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Filtros</h3>
                  {activeFiltersCount > 0 && (
                    <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1">
                      <X className="w-3 h-3" /> Limpar
                    </button>
                  )}
                </div>

                {/* City */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Cidade</Label>
                  <Select value={city || "all"} onValueChange={(v) => { setCity(v === "all" ? "" : v); setPage(0); }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Todas as cidades" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as cidades</SelectItem>
                      {citiesData?.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Tipo de Imóvel</Label>
                  <Select value={type} onValueChange={(v) => { setType(v); setPage(0); }}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TYPE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price range */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Preço: R$ {priceRange[0].toLocaleString("pt-BR")} — R$ {priceRange[1] >= 10000000 ? "10M+" : priceRange[1].toLocaleString("pt-BR")}
                  </Label>
                  <Slider
                    min={0} max={10000000} step={100000}
                    value={priceRange}
                    onValueChange={(v) => { setPriceRange(v); setPage(0); }}
                    className="w-full"
                  />
                </div>

                {/* Bedrooms */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Quartos mínimos</Label>
                  <div className="flex gap-2">
                    {[0, 1, 2, 3, 4].map((n) => (
                      <button
                        key={n}
                        onClick={() => { setMinBedrooms(n); setPage(0); }}
                        className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                          minBedrooms === n ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"
                        }`}
                      >
                        {n === 0 ? "Todos" : `${n}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Características</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {FEATURES_OPTIONS.map((f) => (
                      <button
                        key={f}
                        onClick={() => toggleFeature(f)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          selectedFeatures.includes(f) ? "bg-accent text-white border-accent" : "border-border hover:border-accent/50 text-muted-foreground"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Sort bar */}
              <div className="flex items-center justify-between mb-6 gap-4">
                <div className="text-sm text-muted-foreground">
                  {isLoading ? "Carregando..." : `${data?.items.length ?? 0} imóveis`}
                </div>
                <Select value={sortBy} onValueChange={(v) => { setSortBy(v); setPage(0); }}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Active filters */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {city && <Badge variant="secondary" className="gap-1">{city} <button onClick={() => setCity("")}><X className="w-3 h-3" /></button></Badge>}
                  {type !== "all" && <Badge variant="secondary" className="gap-1">{TYPE_OPTIONS.find(o => o.value === type)?.label} <button onClick={() => setType("all")}><X className="w-3 h-3" /></button></Badge>}
                  {minBedrooms > 0 && <Badge variant="secondary" className="gap-1">{minBedrooms}+ quartos <button onClick={() => setMinBedrooms(0)}><X className="w-3 h-3" /></button></Badge>}
                </div>
              )}

              {/* Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden border border-border">
                      <Skeleton className="h-52 w-full" />
                      <div className="p-4 space-y-3">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-6 w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : data?.items.length === 0 ? (
                <div className="text-center py-20">
                  <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Nenhum imóvel encontrado</h3>
                  <p className="text-muted-foreground mb-6">Tente ajustar os filtros para ver mais resultados.</p>
                  <Button onClick={clearFilters} variant="outline">Limpar filtros</Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {data?.items.map((property) => (
                      <PropertyCard key={property.id} property={property} />
                    ))}
                  </div>
                  {/* Pagination */}
                  <div className="flex justify-center gap-2 mt-10">
                    <Button variant="outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Anterior</Button>
                    <span className="flex items-center px-4 text-sm text-muted-foreground">Página {page + 1}</span>
                    <Button variant="outline" disabled={(data?.items.length ?? 0) < limit} onClick={() => setPage((p) => p + 1)}>Próxima</Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
