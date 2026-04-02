import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketIntelligence from "@/components/MarketIntelligence";
import { BarChart3 } from "lucide-react";

export default function Market() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-ocean-deep text-white py-10">
          <div className="container">
            <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
              <BarChart3 className="w-4 h-4" /> Análise
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold">Inteligência de Mercado</h1>
            <p className="text-white/70 mt-2">
              Análise em tempo real do mercado imobiliário litorâneo. Tendências, preços, demanda e oportunidades de investimento.
            </p>
          </div>
        </div>

        <div className="container py-10">
          <MarketIntelligence />
        </div>
      </div>
      <Footer />
    </div>
  );
}
