import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Building2, LogIn } from "lucide-react";

export default function Favorites() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const { data: favorites, isLoading } = trpc.favorites.list.useQuery(undefined, { enabled: isAuthenticated });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 container py-12">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center max-w-md px-4">
            <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <Heart className="w-10 h-10 text-red-400" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-3">Faça login para ver seus favoritos</h2>
            <p className="text-muted-foreground mb-6">Guarde os imóveis que mais gostou e acesse-os a qualquer momento.</p>
            <Button onClick={() => window.location.href = getLoginUrl()} className="gap-2">
              <LogIn className="w-4 h-4" /> Entrar na plataforma
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="bg-ocean-deep text-white py-10">
          <div className="container">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
              <Heart className="w-4 h-4" /> Minha Conta
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold">Imóveis Favoritos</h1>
            <p className="text-white/70 mt-2">{favorites?.length ?? 0} imóveis guardados</p>
          </div>
        </div>

        <div className="container py-10">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
            </div>
          ) : !favorites || favorites.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-red-300" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-2">Nenhum favorito ainda</h3>
              <p className="text-muted-foreground mb-6">Explore os imóveis e guarde os que mais gostar.</p>
              <Button onClick={() => setLocation("/properties")} className="gap-2">
                <Building2 className="w-4 h-4" /> Explorar imóveis
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {favorites.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
