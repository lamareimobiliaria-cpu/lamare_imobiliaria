import { useState, useEffect } from "react";
import { useSearch, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search as SearchIcon, X, Building2 } from "lucide-react";

export default function Search() {
  const searchStr = useSearch();
  const [, setLocation] = useLocation();
  const params = new URLSearchParams(searchStr);

  const [query, setQuery] = useState(params.get("q") ?? "");
  const [inputValue, setInputValue] = useState(params.get("q") ?? "");
  const [sortBy, setSortBy] = useState("date_desc");

  const { data, isLoading } = trpc.properties.search.useQuery(
    { q: query, sortBy: sortBy as any, limit: 24 },
    { enabled: query.length > 0 }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      setQuery(inputValue.trim());
      setLocation(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Search header */}
        <div className="bg-ocean-deep text-white py-10">
          <div className="container">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
              <SearchIcon className="w-4 h-4" /> Pesquisa Avançada
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-6">Encontre seu Imóvel Ideal</h1>
            <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Cidade, bairro, tipo de imóvel..."
                  className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30"
                />
                {inputValue && (
                  <button type="button" onClick={() => { setInputValue(""); setQuery(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <Button type="submit" className="h-12 px-6 bg-white text-primary hover:bg-white/90 font-semibold">
                Pesquisar
              </Button>
            </form>
          </div>
        </div>

        <div className="container py-8">
          {query ? (
            <>
              <div className="flex items-center justify-between mb-6 gap-4">
                <div className="text-sm text-muted-foreground">
                  {isLoading ? "Pesquisando..." : `${data?.length ?? 0} resultados para "${query}"`}
                </div>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date_desc">Mais recentes</SelectItem>
                    <SelectItem value="price_asc">Menor preço</SelectItem>
                    <SelectItem value="price_desc">Maior preço</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden border border-border">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                        <Skeleton className="h-6 w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : data?.length === 0 ? (
                <div className="text-center py-20">
                  <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-serif text-xl font-semibold mb-2">Nenhum resultado encontrado</h3>
                  <p className="text-muted-foreground mb-6">Tente pesquisar por outra cidade ou tipo de imóvel.</p>
                  <Button onClick={() => setLocation("/properties")} variant="outline">Ver todos os imóveis</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {data?.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <SearchIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-serif text-xl font-semibold mb-2">Digite algo para pesquisar</h3>
              <p className="text-muted-foreground">Pesquise por cidade, bairro, tipo de imóvel ou características.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
